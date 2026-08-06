const DB_NAME = "martify";
const STORE = "assistant-history";

function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function readChatHistory<T>(userId: string): Promise<T | null> {
  if (typeof indexedDB === "undefined") return null;
  const db = await database();
  return new Promise((resolve, reject) => { const request = db.transaction(STORE, "readonly").objectStore(STORE).get(userId); request.onsuccess = () => resolve(request.result || null); request.onerror = () => reject(request.error); });
}

export async function saveChatHistory<T>(userId: string, history: T): Promise<void> {
  if (typeof indexedDB === "undefined") return;
  const db = await database();
  await new Promise<void>((resolve, reject) => { const request = db.transaction(STORE, "readwrite").objectStore(STORE).put(history, userId); request.onsuccess = () => resolve(); request.onerror = () => reject(request.error); });
}
