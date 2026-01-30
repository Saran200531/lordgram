/**
 * Post Service
 * Handles all post-related operations including CRUD, likes, and feed
 */

import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    Timestamp,
    DocumentData
} from 'firebase/firestore';
import { db } from './firebase';
import { arrayUnion, arrayRemove, increment } from './firestoreService';

// Post interface matching Firestore schema
export interface Post {
    id?: string;
    userId: string;
    type: 'image' | 'video' | 'reel';
    contentUrl: string;
    caption: string;
    visibility: 'friends' | 'public';
    likes: string[];
    likesCount: number;
    commentsCount: number;
    hashtags: string[];
    createdAt?: any;
    updatedAt?: any;
}

// Comment interface
export interface Comment {
    id?: string;
    postId: string;
    userId: string;
    username: string;
    text: string;
    createdAt?: any;
}

/**
 * Create a new post
 * @param userId - Creator's UID
 * @param postData - Post data
 * @returns Created post with ID
 */
export const createPost = async (userId: string, postData: Omit<Post, 'id' | 'userId' | 'likes' | 'likesCount' | 'commentsCount' | 'createdAt' | 'updatedAt'>): Promise<Post & { id: string }> => {
    try {
        const post = {
            userId,
            type: postData.type,
            contentUrl: postData.contentUrl,
            caption: postData.caption,
            visibility: postData.visibility,
            hashtags: postData.hashtags || [],
            likes: [],
            likesCount: 0,
            commentsCount: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, 'posts'), post);
        return { id: docRef.id, ...post };
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};

/**
 * Get a single post by ID
 * @param postId - Post ID
 * @returns Post with ID or null
 */
export const getPost = async (postId: string): Promise<(Post & { id: string }) | null> => {
    try {
        const docSnap = await getDoc(doc(db, 'posts', postId));
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Post & { id: string };
        }
        return null;
    } catch (error) {
        console.error('Error getting post:', error);
        throw error;
    }
};

/**
 * Get feed posts for a user (from followed users + own posts)
 * @param userId - Current user's UID
 * @param followingIds - Array of following user IDs
 * @param limitCount - Maximum posts to return
 * @returns Array of posts
 */
export const getFeedPosts = async (userId: string, followingIds: string[], limitCount: number = 20): Promise<(Post & { id: string })[]> => {
    try {
        // Include own posts and posts from followed users
        const allUserIds = [userId, ...followingIds];

        // Firestore 'in' query limited to 30 items, so we may need to batch
        if (allUserIds.length === 0) {
            return [];
        }

        // For large following lists, limit to first 30 (Firestore constraint)
        const queryUserIds = allUserIds.slice(0, 30);

        const postsQuery = query(
            collection(db, 'posts'),
            where('userId', 'in', queryUserIds),
            where('visibility', '==', 'friends'),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );

        const snapshot = await getDocs(postsQuery);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as (Post & { id: string })[];
    } catch (error) {
        console.error('Error getting feed posts:', error);
        throw error;
    }
};

/**
 * Get public posts for discovery
 * @param limitCount - Maximum posts to return
 * @returns Array of public posts
 */
export const getPublicPosts = async (limitCount: number = 20): Promise<(Post & { id: string })[]> => {
    try {
        const postsQuery = query(
            collection(db, 'posts'),
            where('visibility', '==', 'public'),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );

        const snapshot = await getDocs(postsQuery);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as (Post & { id: string })[];
    } catch (error) {
        console.error('Error getting public posts:', error);
        throw error;
    }
};

/**
 * Get all posts by a specific user
 * @param userId - User's UID
 * @param limitCount - Maximum posts to return
 * @returns Array of user's posts
 */
export const getUserPosts = async (userId: string, limitCount: number = 50): Promise<(Post & { id: string })[]> => {
    try {
        const postsQuery = query(
            collection(db, 'posts'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );

        const snapshot = await getDocs(postsQuery);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as (Post & { id: string })[];
    } catch (error) {
        console.error('Error getting user posts:', error);
        throw error;
    }
};

/**
 * Delete a post (only owner can delete)
 * @param postId - Post ID
 * @param userId - User requesting deletion
 */
export const deletePost = async (postId: string, userId: string): Promise<void> => {
    try {
        const post = await getPost(postId);
        if (!post) {
            throw new Error('Post not found');
        }
        if (post.userId !== userId) {
            throw new Error('Unauthorized: Only post owner can delete');
        }

        await deleteDoc(doc(db, 'posts', postId));
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
};

/**
 * Like a post
 * @param postId - Post ID
 * @param userId - User liking the post
 */
export const likePost = async (postId: string, userId: string): Promise<void> => {
    try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
            likes: arrayUnion(userId),
            likesCount: increment(1),
        });
    } catch (error) {
        console.error('Error liking post:', error);
        throw error;
    }
};

/**
 * Unlike a post
 * @param postId - Post ID
 * @param userId - User unliking the post
 */
export const unlikePost = async (postId: string, userId: string): Promise<void> => {
    try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
            likes: arrayRemove(userId),
            likesCount: increment(-1),
        });
    } catch (error) {
        console.error('Error unliking post:', error);
        throw error;
    }
};

/**
 * Check if user has liked a post
 * @param postId - Post ID
 * @param userId - User ID
 * @returns Boolean
 */
export const hasLikedPost = async (postId: string, userId: string): Promise<boolean> => {
    try {
        const post = await getPost(postId);
        if (!post) return false;
        return post.likes.includes(userId);
    } catch (error) {
        console.error('Error checking like status:', error);
        return false;
    }
};

/**
 * Add a comment to a post
 * @param postId - Post ID
 * @param userId - Commenter's UID
 * @param username - Commenter's username
 * @param text - Comment text
 * @returns Created comment
 */
export const addComment = async (postId: string, userId: string, username: string, text: string): Promise<Comment & { id: string }> => {
    try {
        const comment = {
            postId,
            userId,
            username,
            text,
            createdAt: serverTimestamp(),
        };

        // Add comment to subcollection
        const docRef = await addDoc(collection(db, 'posts', postId, 'comments'), comment);

        // Increment comment count on post
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
            commentsCount: increment(1),
        });

        return { id: docRef.id, ...comment };
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
};

/**
 * Get comments for a post
 * @param postId - Post ID
 * @param limitCount - Maximum comments to return
 * @returns Array of comments
 */
export const getComments = async (postId: string, limitCount: number = 50): Promise<(Comment & { id: string })[]> => {
    try {
        const commentsQuery = query(
            collection(db, 'posts', postId, 'comments'),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );

        const snapshot = await getDocs(commentsQuery);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as (Comment & { id: string })[];
    } catch (error) {
        console.error('Error getting comments:', error);
        throw error;
    }
};

/**
 * Get reels (posts with type 'reel')
 * @param limitCount - Maximum to return
 * @returns Array of reel posts
 */
export const getReels = async (limitCount: number = 20): Promise<(Post & { id: string })[]> => {
    try {
        const reelsQuery = query(
            collection(db, 'posts'),
            where('type', '==', 'reel'),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );

        const snapshot = await getDocs(reelsQuery);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as (Post & { id: string })[];
    } catch (error) {
        console.error('Error getting reels:', error);
        throw error;
    }
};
