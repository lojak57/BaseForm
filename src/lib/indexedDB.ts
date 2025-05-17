import { openDB } from 'idb';

const DB_NAME = 'white-label-webshop-demo';
const IMAGES_STORE = 'images';
const DB_VERSION = 1;

// Initialize the database
export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create a store for images if it doesn't exist
      if (!db.objectStoreNames.contains(IMAGES_STORE)) {
        db.createObjectStore(IMAGES_STORE);
      }
    },
  });
};

// Store an image in IndexedDB
export const storeImage = async (file: File): Promise<string> => {
  const db = await initDB();
  const id = `${Date.now()}-${file.name}`;
  const arrayBuffer = await file.arrayBuffer();
  await db.put(IMAGES_STORE, arrayBuffer, id);
  return id;
};

// Get an image from IndexedDB by ID
export const getImage = async (id: string): Promise<string | null> => {
  try {
    const db = await initDB();
    const data = await db.get(IMAGES_STORE, id);
    
    if (!data) return null;
    
    // Convert ArrayBuffer to base64 for display
    const blob = new Blob([data]);
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error retrieving image from IndexedDB:', error);
    return null;
  }
};

// Delete an image from IndexedDB
export const deleteImage = async (id: string): Promise<void> => {
  const db = await initDB();
  await db.delete(IMAGES_STORE, id);
};

// Clean up unused images older than 7 days
export const cleanupOldImages = async (): Promise<void> => {
  const db = await initDB();
  const keys = await db.getAllKeys(IMAGES_STORE);
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  
  for (const key of keys) {
    const keyStr = key as string;
    const timestamp = parseInt(keyStr.split('-')[0], 10);
    
    if (timestamp < oneWeekAgo) {
      await db.delete(IMAGES_STORE, key);
    }
  }
};

// Get all stored images
export const getAllImages = async (): Promise<{id: string, url: string}[]> => {
  const db = await initDB();
  const keys = await db.getAllKeys(IMAGES_STORE);
  const images = [];
  
  for (const key of keys) {
    const data = await db.get(IMAGES_STORE, key);
    if (data) {
      const blob = new Blob([data]);
      const url = URL.createObjectURL(blob);
      images.push({ id: key as string, url });
    }
  }
  
  return images;
}; 