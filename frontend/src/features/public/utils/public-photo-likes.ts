const STORAGE_PREFIX = 'memora-public-liked';

function buildStorageKey(slug: string) {
  return `${STORAGE_PREFIX}:${slug}`;
}

export function getLikedPhotoIds(slug: string) {
  if (typeof window === 'undefined') {
    return [] as string[];
  }

  try {
    const rawValue = window.localStorage.getItem(buildStorageKey(slug));
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export function setLikedPhotoIds(slug: string, photoIds: string[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(buildStorageKey(slug), JSON.stringify(Array.from(new Set(photoIds))));
}
