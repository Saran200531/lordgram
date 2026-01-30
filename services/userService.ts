/**
 * User Service
 * Handles user-related operations including follow/unfollow
 */

import { doc, updateDoc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { arrayUnion, arrayRemove, increment } from './firestoreService';

// User interface matching Firestore schema
export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    username: string;
    avatar: string;
    backgroundImage?: string;
    bio?: string;
    followers: string[];
    following: string[];
    followersCount: number;
    followingCount: number;
    isVerified?: boolean;
    createdAt?: any;
    updatedAt?: any;
}

/**
 * Follow a user
 * @param currentUid - Current user's UID
 * @param targetUid - Target user's UID to follow
 */
export const followUser = async (currentUid: string, targetUid: string): Promise<void> => {
    if (currentUid === targetUid) {
        throw new Error("You can't follow yourself");
    }

    try {
        const currentUserRef = doc(db, 'users', currentUid);
        const targetUserRef = doc(db, 'users', targetUid);

        // Add targetUid to current user's following
        await updateDoc(currentUserRef, {
            following: arrayUnion(targetUid),
            followingCount: increment(1),
        });

        // Add currentUid to target user's followers
        await updateDoc(targetUserRef, {
            followers: arrayUnion(currentUid),
            followersCount: increment(1),
        });
    } catch (error) {
        console.error('Error following user:', error);
        throw error;
    }
};

/**
 * Unfollow a user
 * @param currentUid - Current user's UID
 * @param targetUid - Target user's UID to unfollow
 */
export const unfollowUser = async (currentUid: string, targetUid: string): Promise<void> => {
    if (currentUid === targetUid) {
        throw new Error("You can't unfollow yourself");
    }

    try {
        const currentUserRef = doc(db, 'users', currentUid);
        const targetUserRef = doc(db, 'users', targetUid);

        // Remove targetUid from current user's following
        await updateDoc(currentUserRef, {
            following: arrayRemove(targetUid),
            followingCount: increment(-1),
        });

        // Remove currentUid from target user's followers
        await updateDoc(targetUserRef, {
            followers: arrayRemove(currentUid),
            followersCount: increment(-1),
        });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        throw error;
    }
};

/**
 * Check if current user is following target user
 * @param currentUid - Current user's UID
 * @param targetUid - Target user's UID
 * @returns boolean indicating follow status
 */
export const isFollowing = async (currentUid: string, targetUid: string): Promise<boolean> => {
    try {
        const currentUserDoc = await getDoc(doc(db, 'users', currentUid));
        if (currentUserDoc.exists()) {
            const following = currentUserDoc.data().following || [];
            return following.includes(targetUid);
        }
        return false;
    } catch (error) {
        console.error('Error checking follow status:', error);
        return false;
    }
};

/**
 * Get followers of a user
 * @param uid - User's UID
 * @returns Array of follower user profiles
 */
export const getFollowers = async (uid: string): Promise<UserProfile[]> => {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (!userDoc.exists()) return [];

        const followerIds = userDoc.data().followers || [];
        if (followerIds.length === 0) return [];

        // Fetch all follower profiles
        const followers: UserProfile[] = [];
        for (const followerId of followerIds) {
            const followerDoc = await getDoc(doc(db, 'users', followerId));
            if (followerDoc.exists()) {
                followers.push({ id: followerDoc.id, ...followerDoc.data() } as unknown as UserProfile);
            }
        }
        return followers;
    } catch (error) {
        console.error('Error getting followers:', error);
        throw error;
    }
};

/**
 * Get users that a user is following
 * @param uid - User's UID
 * @returns Array of following user profiles
 */
export const getFollowing = async (uid: string): Promise<UserProfile[]> => {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (!userDoc.exists()) return [];

        const followingIds = userDoc.data().following || [];
        if (followingIds.length === 0) return [];

        // Fetch all following profiles
        const following: UserProfile[] = [];
        for (const followingId of followingIds) {
            const followingDoc = await getDoc(doc(db, 'users', followingId));
            if (followingDoc.exists()) {
                following.push({ id: followingDoc.id, ...followingDoc.data() } as unknown as UserProfile);
            }
        }
        return following;
    } catch (error) {
        console.error('Error getting following:', error);
        throw error;
    }
};

/**
 * Get user profile by UID
 * @param uid - User's UID
 * @returns User profile or null
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
            return { id: userDoc.id, ...userDoc.data() } as unknown as UserProfile;
        }
        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
};

/**
 * Search users by username
 * @param searchTerm - Username search term
 * @param limit - Maximum results
 * @returns Array of matching user profiles
 */
export const searchUsers = async (searchTerm: string, limitCount: number = 10): Promise<UserProfile[]> => {
    try {
        // Firestore doesn't support native full-text search, so we do prefix matching
        const usersRef = collection(db, 'users');
        const q = query(
            usersRef,
            where('username', '>=', searchTerm.toLowerCase()),
            where('username', '<=', searchTerm.toLowerCase() + '\uf8ff')
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.slice(0, limitCount).map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as unknown as UserProfile[];
    } catch (error) {
        console.error('Error searching users:', error);
        throw error;
    }
};

/**
 * Update user profile
 * @param uid - User's UID
 * @param updates - Partial profile updates
 */
export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>): Promise<void> => {
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            ...updates,
            updatedAt: new Date(),
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

/**
 * Get mutual friends (users who follow each other)
 * @param uid - User's UID
 * @returns Array of mutual friend UIDs
 */
export const getMutualFriends = async (uid: string): Promise<string[]> => {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (!userDoc.exists()) return [];

        const followers = userDoc.data().followers || [];
        const following = userDoc.data().following || [];

        // Mutual friends are users in both arrays
        return followers.filter((id: string) => following.includes(id));
    } catch (error) {
        console.error('Error getting mutual friends:', error);
        throw error;
    }
};
