/**
 * Firestore Service Layer
 * Generic CRUD operations for all collections
 */

import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    DocumentData,
    QueryConstraint,
    increment,
    arrayUnion,
    arrayRemove,
    Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

// Types
export interface QueryCondition {
    field: string;
    operator: '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in';
    value: any;
}

export interface SortConfig {
    field: string;
    direction?: 'asc' | 'desc';
}

/**
 * Create a new document in a collection
 * @param collectionName - Name of the Firestore collection
 * @param data - Document data to store
 * @param customId - Optional custom document ID
 * @returns Created document with ID
 */
export const createDocument = async <T extends DocumentData>(
    collectionName: string,
    data: T,
    customId?: string
): Promise<T & { id: string }> => {
    try {
        const docData = {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        if (customId) {
            await setDoc(doc(db, collectionName, customId), docData);
            return { id: customId, ...docData } as T & { id: string };
        } else {
            const docRef = await addDoc(collection(db, collectionName), docData);
            return { id: docRef.id, ...docData } as T & { id: string };
        }
    } catch (error) {
        console.error(`Error creating document in ${collectionName}:`, error);
        throw error;
    }
};

/**
 * Get a single document by ID
 * @param collectionName - Name of the Firestore collection
 * @param docId - Document ID
 * @returns Document data with ID or null if not found
 */
export const getDocument = async <T extends DocumentData>(
    collectionName: string,
    docId: string
): Promise<(T & { id: string }) | null> => {
    try {
        const docSnap = await getDoc(doc(db, collectionName, docId));
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as T & { id: string };
        }
        return null;
    } catch (error) {
        console.error(`Error getting document ${collectionName}/${docId}:`, error);
        throw error;
    }
};

/**
 * Get multiple documents with optional filtering, sorting, and limiting
 * @param collectionName - Name of the Firestore collection
 * @param conditions - Array of query conditions
 * @param sortBy - Sort configuration
 * @param limitCount - Maximum number of documents to return
 * @returns Array of documents with IDs
 */
export const getDocuments = async <T extends DocumentData>(
    collectionName: string,
    conditions: QueryCondition[] = [],
    sortBy?: SortConfig,
    limitCount?: number
): Promise<(T & { id: string })[]> => {
    try {
        const queryConstraints: QueryConstraint[] = [];

        // Add where clauses
        conditions.forEach(({ field, operator, value }) => {
            queryConstraints.push(where(field, operator, value));
        });

        // Add sorting
        if (sortBy) {
            queryConstraints.push(orderBy(sortBy.field, sortBy.direction || 'asc'));
        }

        // Add limit
        if (limitCount) {
            queryConstraints.push(limit(limitCount));
        }

        const q = query(collection(db, collectionName), ...queryConstraints);
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as (T & { id: string })[];
    } catch (error) {
        console.error(`Error getting documents from ${collectionName}:`, error);
        throw error;
    }
};

/**
 * Update an existing document
 * @param collectionName - Name of the Firestore collection
 * @param docId - Document ID
 * @param data - Partial data to update
 * @returns Updated document data
 */
export const updateDocument = async <T extends DocumentData>(
    collectionName: string,
    docId: string,
    data: Partial<T>
): Promise<Partial<T> & { id: string }> => {
    try {
        const docRef = doc(db, collectionName, docId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
        return { id: docId, ...data };
    } catch (error) {
        console.error(`Error updating document ${collectionName}/${docId}:`, error);
        throw error;
    }
};

/**
 * Delete a document
 * @param collectionName - Name of the Firestore collection
 * @param docId - Document ID
 * @returns true if successful
 */
export const deleteDocument = async (
    collectionName: string,
    docId: string
): Promise<boolean> => {
    try {
        await deleteDoc(doc(db, collectionName, docId));
        return true;
    } catch (error) {
        console.error(`Error deleting document ${collectionName}/${docId}:`, error);
        throw error;
    }
};

// Re-export useful Firestore utilities for use in other services
export {
    serverTimestamp,
    increment,
    arrayUnion,
    arrayRemove,
    Timestamp,
    doc,
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    getDoc
};
