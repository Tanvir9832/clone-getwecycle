/**
 * Converts a given File object to a Base64 encoded string.
 *
 * @param file - The File object to be converted.
 * @returns A Promise that resolves to a Base64 encoded string representation of the file.
 *
 * @example
 * ```typescript
 * const file = new File(["content"], "example.txt");
 * fileToBase64(file).then(base64String => {
 *   console.log(base64String);
 * });
 * ```
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Converts a base64 encoded string to a File object.
 *
 * @param base64 - The base64 encoded string to convert.
 * @returns A File object created from the base64 string.
 */
export const base64ToFile = (base64: string): File => {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], "image.jpg", { type: mime });
};
