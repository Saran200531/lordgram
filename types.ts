
export type Visibility = 'friends' | 'public';
export type Theme = 'light' | 'dark';
export type SettingsSubView = 'main' | 'account' | 'privacy' | 'notifications' | 'display' | 'sessions' | 'advanced';

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  backgroundImage?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
  isVerified?: boolean;
}

export interface Story {
  id: string;
  userId: string;
  user: User;
  contentUrl: string;
  isViewed: boolean;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  type: 'image' | 'video' | 'reel';
  contentUrl: string;
  caption: string;
  likes: number;
  comments: Comment[];
  visibility: Visibility;
  createdAt: string;
  isBookmarked?: boolean;
  hashtags?: string[];
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'meetup' | 'friend' | 'follow' | 'message';
  fromUser: string;
  postId?: string;
  text: string;
  createdAt: string;
  read: boolean;
}

export type View = 'feed' | 'reels' | 'discovery' | 'messages' | 'notifications' | 'profile' | 'settings' | 'auth';
