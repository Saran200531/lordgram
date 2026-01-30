
import { Post, User, Notification, Conversation, Message, Story } from '../types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Johnson',
  username: 'alex_j',
  avatar: 'https://picsum.photos/seed/alex/200',
  backgroundImage: 'https://picsum.photos/seed/bg/800/400',
  bio: 'Living life one frame at a time. Coffee enthusiast and tech geek. ☕️✨',
  followersCount: 1450,
  followingCount: 820,
};

export const MOCK_USERS: User[] = [
  { id: 'u2', name: 'Sarah Miller', username: 'sarah_m', avatar: 'https://picsum.photos/seed/sarah/200', followersCount: 1200, followingCount: 300, isVerified: true },
  { id: 'u3', name: 'Jordan Lee', username: 'jlee_official', avatar: 'https://picsum.photos/seed/jordan/200', followersCount: 5400, followingCount: 120, isVerified: true },
  { id: 'u4', name: 'Casey Wright', username: 'casey_codes', avatar: 'https://picsum.photos/seed/casey/200', followersCount: 890, followingCount: 450 },
  { id: 'u5', name: 'Liam Chen', username: 'liam_vision', avatar: 'https://picsum.photos/seed/liam/200', followersCount: 3200, followingCount: 900, isVerified: true },
  { id: 'u6', name: 'Emma Watson', username: 'emma_w', avatar: 'https://picsum.photos/seed/emma/200', followersCount: 10200, followingCount: 50 },
  { id: 'u7', name: 'Noah Brown', username: 'noah_b', avatar: 'https://picsum.photos/seed/noah/200', followersCount: 450, followingCount: 1200 },
  { id: 'u8', name: 'Ava Davis', username: 'ava_designs', avatar: 'https://picsum.photos/seed/ava/200', followersCount: 2100, followingCount: 400 },
  { id: 'u9', name: 'Oliver Smith', username: 'oliver_travels', avatar: 'https://picsum.photos/seed/oliver/200', followersCount: 8500, followingCount: 1100, isVerified: true },
  { id: 'u10', name: 'Sophia Wilson', username: 'sophia_fit', avatar: 'https://picsum.photos/seed/sophia/200', followersCount: 15000, followingCount: 200, isVerified: true },
  { id: 'u11', name: 'Lucas Garcia', username: 'lucas_art', avatar: 'https://picsum.photos/seed/lucas/200', followersCount: 3400, followingCount: 670 },
  { id: 'u12', name: 'Mia Martinez', username: 'mia_eats', avatar: 'https://picsum.photos/seed/mia/200', followersCount: 5600, followingCount: 300 },
  { id: 'u13', name: 'Ethan Robinson', username: 'ethan_tunes', avatar: 'https://picsum.photos/seed/ethan/200', followersCount: 1200, followingCount: 800 },
  { id: 'u14', name: 'Isabella Clark', username: 'bella_writes', avatar: 'https://picsum.photos/seed/isabella/200', followersCount: 4300, followingCount: 150 },
];

export const MOCK_STORIES: Story[] = [
  { id: 's1', userId: 'u2', user: MOCK_USERS[0], contentUrl: 'https://picsum.photos/seed/s1/400/700', isViewed: false },
  { id: 's2', userId: 'u3', user: MOCK_USERS[1], contentUrl: 'https://picsum.photos/seed/s2/400/700', isViewed: false },
  { id: 's3', userId: 'u4', user: MOCK_USERS[2], contentUrl: 'https://picsum.photos/seed/s3/400/700', isViewed: true },
  { id: 's4', userId: 'u5', user: MOCK_USERS[3], contentUrl: 'https://picsum.photos/seed/s4/400/700', isViewed: false },
  { id: 's5', userId: 'u6', user: MOCK_USERS[4], contentUrl: 'https://picsum.photos/seed/s5/400/700', isViewed: false },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'u2',
    user: MOCK_USERS[0],
    type: 'image',
    contentUrl: 'https://picsum.photos/seed/mountain/800/1000',
    caption: 'Hiking the ridge today! The view is absolutely insane. Anyone want to go next weekend? #adventure #outdoors',
    likes: [],
    likesCount: 124,
    comments: [
      { id: 'c1', userId: 'u3', username: 'jlee_official', text: 'I am so down for next weekend!', createdAt: '2023-10-25T10:00:00Z' }
    ],
    visibility: 'friends',
    createdAt: '2023-10-25T08:30:00Z',
    hashtags: ['adventure', 'outdoors', 'hiking']
  },
  {
    id: 'p2',
    userId: 'u3',
    user: MOCK_USERS[1],
    type: 'reel',
    contentUrl: 'https://picsum.photos/seed/city/800/1200',
    caption: 'Late night vibes in the city. 🌃 Exploring the neon streets. #neon #vibes',
    likes: [],
    likesCount: 2156,
    comments: [],
    visibility: 'public',
    createdAt: '2023-10-24T22:15:00Z',
    hashtags: ['neon', 'vibes', 'citylife']
  },
  {
    id: 'p3',
    userId: 'u4',
    user: MOCK_USERS[2],
    type: 'image',
    contentUrl: 'https://picsum.photos/seed/food/800/800',
    caption: 'Finally tried that pasta place! Best carbonara ever. 🍝 #foodie',
    likes: [],
    likesCount: 342,
    comments: [],
    visibility: 'friends',
    createdAt: '2023-10-24T19:00:00Z',
    hashtags: ['foodie', 'pasta', 'dinner']
  },
  {
    id: 'p4',
    userId: 'u5',
    user: MOCK_USERS[3],
    type: 'reel',
    contentUrl: 'https://picsum.photos/seed/ocean/800/1200',
    caption: 'The ocean is where I belong. 🌊 #surf #paradise',
    likes: [],
    likesCount: 890,
    comments: [],
    visibility: 'public',
    createdAt: '2023-10-23T15:00:00Z',
    hashtags: ['surf', 'paradise', 'ocean']
  },
  {
    id: 'p5',
    userId: 'u6',
    user: MOCK_USERS[4],
    type: 'image',
    contentUrl: 'https://picsum.photos/seed/art/800/1000',
    caption: 'Colors of my imagination. 🎨 #art #creative',
    likes: [],
    likesCount: 567,
    comments: [],
    visibility: 'public',
    createdAt: '2023-10-22T12:00:00Z',
    hashtags: ['art', 'creative', 'studio']
  },
  {
    id: 'p6',
    userId: 'u7',
    user: MOCK_USERS[5],
    type: 'image',
    contentUrl: 'https://picsum.photos/seed/tech/800/1000',
    caption: 'Setup check! Ready for a long night of coding. 💻 #setup #devlife',
    likes: [],
    likesCount: 432,
    comments: [],
    visibility: 'friends',
    createdAt: '2023-10-21T21:00:00Z',
    hashtags: ['setup', 'devlife', 'coding']
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'like', fromUser: 'Sarah Miller', postId: 'p3', text: 'liked your post.', createdAt: '2023-10-25T09:00:00Z', read: false },
  { id: 'n2', type: 'meetup', fromUser: 'Jordan Lee', text: 'invited you to "City Coffee Crawl".', createdAt: '2023-10-25T08:00:00Z', read: true },
  { id: 'n3', type: 'comment', fromUser: 'Casey Wright', postId: 'p1', text: 'commented: "So beautiful!"', createdAt: '2023-10-25T07:45:00Z', read: false },
  { id: 'n4', type: 'friend', fromUser: 'Liam Chen', text: 'started following you.', createdAt: '2023-10-24T20:00:00Z', read: true },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  { id: 'chat1', participant: MOCK_USERS[0], lastMessage: 'See you there at 6!', timestamp: '10:30 AM', unreadCount: 0 },
  { id: 'chat2', participant: MOCK_USERS[1], lastMessage: 'That reel was awesome!', timestamp: 'Yesterday', unreadCount: 2 },
  { id: 'chat3', participant: MOCK_USERS[2], lastMessage: 'Hey, did you see my latest post?', timestamp: 'Mon', unreadCount: 0 },
  { id: 'chat4', participant: MOCK_USERS[3], lastMessage: 'Great vision on that last shot!', timestamp: 'Tue', unreadCount: 0 },
  { id: 'chat5', participant: MOCK_USERS[4], lastMessage: 'Can you share the art link?', timestamp: 'Sun', unreadCount: 1 },
  { id: 'chat6', participant: MOCK_USERS[5], lastMessage: 'Let\'s collaborate on the next setup!', timestamp: '2:45 PM', unreadCount: 0 },
  { id: 'chat7', participant: MOCK_USERS[6], lastMessage: 'Working on a new design for you.', timestamp: '11:15 AM', unreadCount: 3 },
  { id: 'chat8', participant: MOCK_USERS[7], lastMessage: 'Where are you travelling next?', timestamp: '1h ago', unreadCount: 0 },
  { id: 'chat9', participant: MOCK_USERS[8], lastMessage: 'Training session tomorrow?', timestamp: 'Just now', unreadCount: 0 },
  { id: 'chat10', participant: MOCK_USERS[9], lastMessage: 'The colors in your post are fire!', timestamp: '4:20 PM', unreadCount: 1 },
  { id: 'chat11', participant: MOCK_USERS[10], lastMessage: 'I need that recipe ASAP!', timestamp: 'Wed', unreadCount: 0 },
  { id: 'chat12', participant: MOCK_USERS[11], lastMessage: 'New track drops tonight. Listen?', timestamp: 'Mon', unreadCount: 5 },
  { id: 'chat13', participant: MOCK_USERS[12], lastMessage: 'Finished reading your latest bio!', timestamp: '8:00 AM', unreadCount: 0 },
  { id: 'chat14', participant: MOCK_USERS[1], lastMessage: 'Are we still meeting up later?', timestamp: '10:00 AM', unreadCount: 0 },
];

export const MOCK_MESSAGES: Message[] = [
  { id: 'm1', senderId: 'u2', text: 'Hey Alex! Are we still on for the hike?', timestamp: '2023-10-25T09:00:00Z' },
  { id: 'm2', senderId: 'u1', text: 'Definitely! I just packed my gear.', timestamp: '2023-10-25T09:05:00Z' },
  { id: 'm3', senderId: 'u2', text: 'Sweet. See you there at 6!', timestamp: '2023-10-25T10:30:00Z' },
];
