import db from '../firebase/admin';

export const insertIfNotExists = async (
  collectionName: string,
  value: string | number
) => {
  if (!value) return;
  const normalizedValue = String(value).toLowerCase().trim();
  const docId = normalizedValue.replace(/\s+/g, '-');
  const docRef = db.collection(collectionName).doc(docId);
  const doc = await docRef.get();
  if (!doc.exists) {
    await docRef.set({ value: normalizedValue });
  }
};
