import { openDB } from 'idb';

const DB_NAME = 'satujogja-db';
const DB_VERSION = 1;
const STORE_NAME = 'report-queue';

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

export const addReportToQueue = async (reportData) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.add({ ...reportData, timestamp: Date.now() });
  await tx.done;
};

export const getQueuedReports = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const removeReportFromQueue = async (id) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.delete(id);
  await tx.done;
};
