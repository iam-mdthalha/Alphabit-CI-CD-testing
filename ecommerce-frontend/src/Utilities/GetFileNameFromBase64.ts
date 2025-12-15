export function getFilenameFromBase64(
  base64String: string,
  prefix = "image"
): string {
  const mimeMatch = base64String.match(/^data:(image\/[a-zA-Z]+);base64,/);
  if (!mimeMatch) return `${prefix}.jpg`; // default fallback

  const mime = mimeMatch[1]; // e.g., 'image/png'
  const extension = mime.split("/")[1]; // 'png'
  return `${prefix}.${extension}`;
}
