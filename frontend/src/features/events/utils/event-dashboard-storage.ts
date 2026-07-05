export function readStoredFavoriteIds(key: string) {
  try {
    const value = window.localStorage.getItem(key);

    if (!value) {
      return [] as string[];
    }

    const parsed = JSON.parse(value) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    return [];
  }
}

export function writeStoredFavoriteIds(key: string, ids: string[]) {
  window.localStorage.setItem(key, JSON.stringify(ids));
}
