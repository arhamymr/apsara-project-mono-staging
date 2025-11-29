/**
 * Convert a file to base64 string
 * Note: This function uses browser APIs and should only be called in client components
 */
export const convertToBase64 = (file: File): Promise<string> => {
  // SSR safety check
  if (typeof window === 'undefined' || typeof FileReader === 'undefined') {
    return Promise.resolve('');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      resolve(result || '');
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
};

export const extractPublicPath = (url: string): string => {
  const match = url.match(/\/object\/public\/[^/]+\/(.+)/);
  return match ? match[1] : '';
};
