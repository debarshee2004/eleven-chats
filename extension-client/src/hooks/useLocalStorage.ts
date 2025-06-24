/**
 * Custom hook for handling CRUD operations with localStorage
 * Provides type-safe functions for storing, retrieving, updating and deleting data
 */

// Type to define the return value of our hook
type UseLocalStorageReturn = {
  // Create - Store a value in localStorage
  setItem: <T>(key: string, value: T) => void;

  // Read - Get a value from localStorage
  getItem: <T>(key: string) => T | null;

  // Update - Update an existing value in localStorage
  updateItem: <T>(key: string, value: Partial<T>) => boolean;

  // Delete - Remove a value from localStorage
  removeItem: (key: string) => void;

  // Delete all data from localStorage
  clear: () => void;

  // Check if a key exists in localStorage
  hasKey: (key: string) => boolean;
};

/**
 * Hook for CRUD operations on localStorage
 * @returns Object with methods for interacting with localStorage
 */
export function useLocalStorage(): UseLocalStorageReturn {
  /**
   * Store a value in localStorage
   * @param key - The key to store the value under
   * @param value - The value to store
   */
  const setItem = <T>(key: string, value: T): void => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error storing item in localStorage: ${error}`);
    }
  };

  /**
   * Retrieve a value from localStorage
   * @param key - The key to retrieve
   * @returns The stored value or null if not found
   */
  const getItem = <T>(key: string): T | null => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Error retrieving item from localStorage: ${error}`);
      return null;
    }
  };

  /**
   * Update an existing value in localStorage
   * @param key - The key to update
   * @param value - The partial value to merge with existing data
   * @returns Boolean indicating success
   */
  const updateItem = <T>(key: string, value: Partial<T>): boolean => {
    try {
      const currentValue = getItem<T>(key);

      if (currentValue === null) {
        return false;
      }

      // If currentValue is an object, merge with new value
      if (typeof currentValue === "object" && currentValue !== null) {
        const updatedValue = { ...currentValue, ...value };
        setItem(key, updatedValue);
      } else {
        // For primitive types, simply replace with new value
        setItem(key, value as unknown as T);
      }

      return true;
    } catch (error) {
      console.error(`Error updating item in localStorage: ${error}`);
      return false;
    }
  };

  /**
   * Remove an item from localStorage
   * @param key - The key to remove
   */
  const removeItem = (key: string): void => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from localStorage: ${error}`);
    }
  };

  /**
   * Clear all data from localStorage
   */
  const clear = (): void => {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error(`Error clearing localStorage: ${error}`);
    }
  };

  /**
   * Check if a key exists in localStorage
   * @param key - The key to check
   * @returns Boolean indicating if the key exists
   */
  const hasKey = (key: string): boolean => {
    return window.localStorage.getItem(key) !== null;
  };

  return {
    setItem,
    getItem,
    updateItem,
    removeItem,
    clear,
    hasKey,
  };
}

export default useLocalStorage;
