export function capitalizeWords(text: string) {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function capitalizeArray(arr: string[]) {
  return arr.map(capitalizeWords);
}
