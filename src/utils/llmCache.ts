const llmCache = new Map<string, string>();

export function getLLMCache(key: string): string | undefined {
  return llmCache.get(key);
}
export function setLLMCache(key: string, value: string): void {
  llmCache.set(key, value);
}