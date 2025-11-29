/* eslint-disable @typescript-eslint/no-explicit-any */

export type WebsiteApiResponse = {
  websites: any[];
};

export type WebsiteDetailResponse = {
  website: any;
};

export async function fetchWebsites(): Promise<WebsiteApiResponse> {
  const response = await fetch('/api/dashboard/websites', {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Unable to load websites.');
  }

  return (await response.json()) as WebsiteApiResponse;
}

export async function fetchWebsiteBySlug(
  slug: string,
): Promise<WebsiteDetailResponse> {
  const response = await fetch(
    `/api/dashboard/websites/${encodeURIComponent(slug)}`,
    {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error('Unable to load website.');
  }

  return (await response.json()) as WebsiteDetailResponse;
}
