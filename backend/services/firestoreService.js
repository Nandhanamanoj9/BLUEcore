import crypto from 'crypto';
import { getFirestore, isFirebaseMockMode, getMockDatabase } from '../config/firebase.js';

/**
 * Generic Firestore Data Access Layer
 */
export async function addDocument(collectionName, data) {
  const db = getFirestore();
  const now = new Date().toISOString();

  if (db && !isFirebaseMockMode()) {
    const docRef = db.collection(collectionName).doc();
    const payload = {
      ...data,
      id: docRef.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await docRef.set(payload);
    return { ...payload, id: docRef.id };
  }

  // Fallback in-memory mode
  const mockDb = getMockDatabase();
  const id = crypto.randomUUID();
  const doc = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now
  };
  if (!mockDb[collectionName]) {
    mockDb[collectionName] = new Map();
  }
  mockDb[collectionName].set(id, doc);
  return doc;
}

export async function getDocument(collectionName, id) {
  const db = getFirestore();

  if (db && !isFirebaseMockMode()) {
    const docSnap = await db.collection(collectionName).doc(id).get();
    if (!docSnap.exists) return null;
    return { id: docSnap.id, ...docSnap.data() };
  }

  const mockDb = getMockDatabase();
  return mockDb[collectionName]?.get(id) || null;
}

export async function updateDocument(collectionName, id, updates) {
  const db = getFirestore();
  const now = new Date().toISOString();

  if (db && !isFirebaseMockMode()) {
    const docRef = db.collection(collectionName).doc(id);
    const payload = {
      ...updates,
      updatedAt: new Date()
    };
    await docRef.update(payload);
    const updated = await docRef.get();
    return { id: updated.id, ...updated.data() };
  }

  const mockDb = getMockDatabase();
  const existing = mockDb[collectionName]?.get(id);
  if (!existing) return null;

  const merged = {
    ...existing,
    ...updates,
    updatedAt: now
  };
  mockDb[collectionName].set(id, merged);
  return merged;
}

export async function deleteDocument(collectionName, id) {
  const db = getFirestore();

  if (db && !isFirebaseMockMode()) {
    const docRef = db.collection(collectionName).doc(id);
    const existing = await docRef.get();
    if (!existing.exists) return false;
    await docRef.delete();
    return true;
  }

  const mockDb = getMockDatabase();
  if (!mockDb[collectionName]?.has(id)) return false;
  return mockDb[collectionName].delete(id);
}

export async function queryDocuments(collectionName, {
  filters = {},
  search = '',
  searchFields = ['fullName', 'email', 'phone', 'serviceRequired', 'title', 'name'],
  orderBy = 'createdAt',
  orderDirection = 'desc',
  page = 1,
  limit = 20
} = {}) {
  const db = getFirestore();

  if (db && !isFirebaseMockMode()) {
    let query = db.collection(collectionName);

    // Apply exact match filters (e.g. status, category, active)
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query = query.where(key, '==', val);
      }
    });

    // Firestore ordering
    try {
      query = query.orderBy(orderBy, orderDirection);
    } catch (e) {
      // Index might be missing during initial dev; fallback to un-indexed
    }

    const snapshot = await query.get();
    let items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Apply text search filtering if provided
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      items = items.filter((item) =>
        searchFields.some((field) => item[field] && String(item[field]).toLowerCase().includes(q))
      );
    }

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;
    const paginatedItems = items.slice(offset, offset + limit);

    return {
      items: paginatedItems,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages
      }
    };
  }

  // Fallback in-memory
  const mockDb = getMockDatabase();
  let items = Array.from(mockDb[collectionName]?.values() || []);

  // Filter
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      items = items.filter((item) => item[key] === val);
    }
  });

  // Search
  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    items = items.filter((item) =>
      searchFields.some((field) => item[field] && String(item[field]).toLowerCase().includes(q))
    );
  }

  // Sort
  items.sort((a, b) => {
    const aVal = a[orderBy] || 0;
    const bVal = b[orderBy] || 0;
    if (orderDirection === 'desc') {
      return aVal > bVal ? -1 : 1;
    }
    return aVal > bVal ? 1 : -1;
  });

  const total = items.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const offset = (page - 1) * limit;
  const paginatedItems = items.slice(offset, offset + limit);

  return {
    items: paginatedItems,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages
    }
  };
}

export default {
  addDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  queryDocuments
};
