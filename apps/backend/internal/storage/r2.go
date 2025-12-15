package storage

import (
	"context"
	"fmt"
	"io"
	"mime"
	"path/filepath"
	"strings"
	"time"

	"myapp/internal/config"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
)

type R2Client struct {
	client     *s3.Client
	bucket     string
	publicURL  string
}

type StorageEntry struct {
	Key         string  `json:"key"`
	Name        string  `json:"name"`
	IsFolder    bool    `json:"is_folder"`
	Size        *int64  `json:"size,omitempty"`
	ContentType *string `json:"type,omitempty"`
	UpdatedAt   *string `json:"updated_at,omitempty"`
	PublicURL   *string `json:"public_url,omitempty"`
}

type ListResult struct {
	Prefix  string         `json:"prefix"`
	Folders []StorageEntry `json:"folders"`
	Files   []StorageEntry `json:"files"`
}

func NewR2Client(cfg *config.Config) (*R2Client, error) {
	r2Resolver := aws.EndpointResolverWithOptionsFunc(func(service, region string, options ...interface{}) (aws.Endpoint, error) {
		return aws.Endpoint{
			URL: cfg.R2Endpoint,
		}, nil
	})

	awsCfg, err := awsconfig.LoadDefaultConfig(context.TODO(),
		awsconfig.WithEndpointResolverWithOptions(r2Resolver),
		awsconfig.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(
			cfg.R2AccessKeyID,
			cfg.R2SecretAccessKey,
			"",
		)),
		awsconfig.WithRegion("auto"),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to load AWS config: %w", err)
	}

	client := s3.NewFromConfig(awsCfg)

	return &R2Client{
		client:    client,
		bucket:    cfg.R2Bucket,
		publicURL: cfg.R2PublicBase,
	}, nil
}


func (r *R2Client) List(ctx context.Context, prefix string) (*ListResult, error) {
	input := &s3.ListObjectsV2Input{
		Bucket:    aws.String(r.bucket),
		Prefix:    aws.String(prefix),
		Delimiter: aws.String("/"),
	}

	result, err := r.client.ListObjectsV2(ctx, input)
	if err != nil {
		return nil, fmt.Errorf("failed to list objects: %w", err)
	}

	folders := make([]StorageEntry, 0)
	files := make([]StorageEntry, 0)

	// Process common prefixes (folders)
	for _, cp := range result.CommonPrefixes {
		if cp.Prefix == nil {
			continue
		}
		folderKey := *cp.Prefix
		name := strings.TrimSuffix(strings.TrimPrefix(folderKey, prefix), "/")
		if name == "" {
			continue
		}
		folders = append(folders, StorageEntry{
			Key:      folderKey,
			Name:     name,
			IsFolder: true,
		})
	}

	// Process objects (files)
	for _, obj := range result.Contents {
		if obj.Key == nil {
			continue
		}
		key := *obj.Key
		name := strings.TrimPrefix(key, prefix)
		if name == "" || strings.HasSuffix(name, "/") {
			continue
		}

		var updatedAt *string
		if obj.LastModified != nil {
			t := obj.LastModified.Format(time.RFC3339)
			updatedAt = &t
		}

		var publicURL *string
		if r.publicURL != "" {
			url := fmt.Sprintf("%s/%s", strings.TrimSuffix(r.publicURL, "/"), key)
			publicURL = &url
		}

		files = append(files, StorageEntry{
			Key:       key,
			Name:      name,
			IsFolder:  false,
			Size:      obj.Size,
			UpdatedAt: updatedAt,
			PublicURL: publicURL,
		})
	}

	return &ListResult{
		Prefix:  prefix,
		Folders: folders,
		Files:   files,
	}, nil
}

func (r *R2Client) Upload(ctx context.Context, key string, body io.Reader, contentType string) (*StorageEntry, error) {
	if contentType == "" {
		contentType = mime.TypeByExtension(filepath.Ext(key))
		if contentType == "" {
			contentType = "application/octet-stream"
		}
	}

	input := &s3.PutObjectInput{
		Bucket:      aws.String(r.bucket),
		Key:         aws.String(key),
		Body:        body,
		ContentType: aws.String(contentType),
	}

	_, err := r.client.PutObject(ctx, input)
	if err != nil {
		return nil, fmt.Errorf("failed to upload object: %w", err)
	}

	var publicURL *string
	if r.publicURL != "" {
		url := fmt.Sprintf("%s/%s", strings.TrimSuffix(r.publicURL, "/"), key)
		publicURL = &url
	}

	name := filepath.Base(key)
	return &StorageEntry{
		Key:         key,
		Name:        name,
		IsFolder:    false,
		ContentType: &contentType,
		PublicURL:   publicURL,
	}, nil
}

func (r *R2Client) Delete(ctx context.Context, key string, recursive bool) error {
	if recursive && strings.HasSuffix(key, "/") {
		// Delete all objects with this prefix
		input := &s3.ListObjectsV2Input{
			Bucket: aws.String(r.bucket),
			Prefix: aws.String(key),
		}

		result, err := r.client.ListObjectsV2(ctx, input)
		if err != nil {
			return fmt.Errorf("failed to list objects for deletion: %w", err)
		}

		if len(result.Contents) == 0 {
			return nil
		}

		objects := make([]types.ObjectIdentifier, len(result.Contents))
		for i, obj := range result.Contents {
			objects[i] = types.ObjectIdentifier{Key: obj.Key}
		}

		deleteInput := &s3.DeleteObjectsInput{
			Bucket: aws.String(r.bucket),
			Delete: &types.Delete{Objects: objects},
		}

		_, err = r.client.DeleteObjects(ctx, deleteInput)
		if err != nil {
			return fmt.Errorf("failed to delete objects: %w", err)
		}
	} else {
		input := &s3.DeleteObjectInput{
			Bucket: aws.String(r.bucket),
			Key:    aws.String(key),
		}

		_, err := r.client.DeleteObject(ctx, input)
		if err != nil {
			return fmt.Errorf("failed to delete object: %w", err)
		}
	}

	return nil
}

func (r *R2Client) CreateFolder(ctx context.Context, prefix, name string) (*StorageEntry, error) {
	key := prefix + name + "/"

	input := &s3.PutObjectInput{
		Bucket: aws.String(r.bucket),
		Key:    aws.String(key),
		Body:   strings.NewReader(""),
	}

	_, err := r.client.PutObject(ctx, input)
	if err != nil {
		return nil, fmt.Errorf("failed to create folder: %w", err)
	}

	return &StorageEntry{
		Key:      key,
		Name:     name,
		IsFolder: true,
	}, nil
}

func (r *R2Client) GetPresignedURL(ctx context.Context, key string, ttl time.Duration) (string, error) {
	presignClient := s3.NewPresignClient(r.client)

	input := &s3.GetObjectInput{
		Bucket: aws.String(r.bucket),
		Key:    aws.String(key),
	}

	presignedReq, err := presignClient.PresignGetObject(ctx, input, s3.WithPresignExpires(ttl))
	if err != nil {
		return "", fmt.Errorf("failed to generate presigned URL: %w", err)
	}

	return presignedReq.URL, nil
}
