// Helper for storing and retrieving data with expiration from localStorage
interface StorageItem<T> {
  value: T;
  expiry: number; // Timestamp when this item should expire
}

/**
 * Set an item in localStorage with a TTL (time to live)
 * @param key The key to store the value under
 * @param value The value to store
 * @param ttl Time to live in milliseconds (default: 7 days)
 */
export const setWithExpiry = <T>(
  key: string, 
  value: T, 
  ttl: number = 7 * 24 * 60 * 60 * 1000
): void => {
  const item: StorageItem<T> = {
    value,
    expiry: Date.now() + ttl,
  };
  
  localStorage.setItem(key, JSON.stringify(item));
};

/**
 * Get an item from localStorage, but only if it hasn't expired
 * @param key The key to retrieve
 * @returns The value or null if expired or not found
 */
export const getWithExpiry = <T>(key: string): T | null => {
  const itemStr = localStorage.getItem(key);
  
  // Return null if item doesn't exist
  if (!itemStr) return null;
  
  try {
    const item = JSON.parse(itemStr) as StorageItem<T>;
    const now = Date.now();
    
    // Compare the expiry time of the item with the current time
    if (now > item.expiry) {
      // If the item is expired, remove it from storage and return null
      localStorage.removeItem(key);
      return null;
    }
    
    return item.value;
  } catch (e) {
    // If there was an error parsing (or it's not our format), just return the value
    console.warn(`Error parsing localStorage item with key ${key}:`, e);
    return null;
  }
};

/**
 * Clean up all expired items in localStorage
 */
export const cleanupExpiredItems = (): void => {
  const now = Date.now();
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    
    const itemStr = localStorage.getItem(key);
    if (!itemStr) continue;
    
    try {
      const item = JSON.parse(itemStr);
      if (item.expiry && now > item.expiry) {
        localStorage.removeItem(key);
        // Adjust the index since we removed an item
        i--;
      }
    } catch (e) {
      // This item is not in our format, skip it
    }
  }
};

/**
 * Check if a key exists in localStorage
 */
export const hasKey = (key: string): boolean => {
  return localStorage.getItem(key) !== null;
}; 