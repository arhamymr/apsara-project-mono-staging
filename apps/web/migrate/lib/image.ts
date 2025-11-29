export const convertToBase64 = (file: File) => {
  let result = '';
  const reader = new FileReader();
  reader.onload = async (e) => {
    const r = e.target?.result as string;
    result = await r;
  };
  reader.readAsDataURL(file);
  return result;
};

export const extractPublicPath = (url: string): string => {
  const match = url.match(/\/object\/public\/[^/]+\/(.+)/);
  return match ? match[1] : '';
};
