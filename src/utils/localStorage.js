/**
 * localStorage.js
 * Utility functions for handling localStorage operations for the task list.
 */

const STORAGE_KEY = "taskPriorityManager";

/**
 * Saves the current list of tasks to localStorage
 * @param {Array} tasks - Array of task objects to be saved
 */
export const saveTasks = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);
    return false;
  }
};

/**
 * Retrieves the list of tasks from localStorage
 * @returns {Array} Array of task objects or empty array if none found
 */
export const getTasks = () => {
  try {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    return storedTasks ? JSON.parse(storedTasks) : [];
  } catch (error) {
    console.error("Error retrieving tasks from localStorage:", error);
    return [];
  }
};

/**
 * Checks if localStorage is available in the browser
 * @returns {Boolean} True if localStorage is available, false otherwise
 */
export const isLocalStorageAvailable = () => {
  try {
    const testKey = "__storage_test__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Clears all tasks from localStorage
 * @returns {Boolean} True if successful, false otherwise
 */
export const clearTasks = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing tasks from localStorage:", error);
    return false;
  }
};