const API_ORIGIN = "http://127.0.0.1:8000";

export const getBillboardImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("storage/")) {
    return `${API_ORIGIN}/${image}`;
  }

  if (image.startsWith("billboards/")) {
    return `${API_ORIGIN}/storage/${image}`;
  }

  return `${API_ORIGIN}/images/billboards/${image}`;
};
