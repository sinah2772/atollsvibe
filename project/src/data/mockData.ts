import { Article, Author, ChartData, Metric, Notification } from '../types';

export const currentAuthor: Author = {
  id: '1',
  name: 'Sarah Johnson',
  bio: 'Award-winning author and journalist specializing in technology and culture.',
  avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150',
  followers: 2847,
  following: 192,
  articles: 47,
  joined: 'Jan 2022'
};

export const metrics: Metric[] = [
  {
    name: 'Total Views',
    value: 124753,
    change: 12.4,
    timeframe: 'vs last month'
  },
  {
    name: 'Engagement Rate',
    value: 4.7,
    change: 0.8,
    timeframe: 'vs last month'
  },
  {
    name: 'New Followers',
    value: 283,
    change: -2.1,
    timeframe: 'vs last month'
  },
  {
    name: 'Article Saves',
    value: 1289,
    change: 34.5,
    timeframe: 'vs last month'
  }
];

export const recentArticles: Article[] = [
  {
    id: '1',
    title: 'The Future of AI in Content Creation',
    excerpt: 'How artificial intelligence is revolutionizing the way we create and consume content.',
    status: 'published',
    publishDate: '2023-06-15',
    category: 'Technology',
    readTime: 8,
    views: 12453,
    likes: 842,
    comments: 56,
    coverImage: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=650'
  },
  {
    id: '2',
    title: 'Sustainable Living in Modern Cities',
    excerpt: 'Practical strategies for reducing your carbon footprint while living in urban environments.',
    status: 'published',
    publishDate: '2023-05-22',
    category: 'Lifestyle',
    readTime: 6,
    views: 8731,
    likes: 612,
    comments: 41,
    coverImage: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=650'
  },
  {
    id: '3',
    title: 'The Rise of Remote Work Culture',
    excerpt: 'Examining how the shift to remote work is changing company cultures globally.',
    status: 'scheduled',
    publishDate: '2023-07-08',
    category: 'Work',
    readTime: 7,
    views: 0,
    likes: 0,
    comments: 0,
    coverImage: 'https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=650'
  },
  {
    id: '4',
    title: 'Essential Digital Privacy Tools in 2023',
    excerpt: 'Protecting your data in an increasingly connected world with these essential tools.',
    status: 'draft',
    category: 'Technology',
    readTime: 5,
    views: 0,
    likes: 0,
    comments: 0
  }
];

export const notifications: Notification[] = [
  {
    id: '1',
    type: 'comment',
    message: 'Alex Garcia commented on your article "The Future of AI in Content Creation"',
    time: '2 hours ago',
    read: false,
    link: '/article/1'
  },
  {
    id: '2',
    type: 'like',
    message: 'Your article "Sustainable Living in Modern Cities" reached 500 likes!',
    time: '1 day ago',
    read: true,
    link: '/article/2'
  },
  {
    id: '3',
    type: 'system',
    message: 'Your monthly analytics report is ready to view',
    time: '2 days ago',
    read: false,
    link: '/analytics'
  },
  {
    id: '4',
    type: 'mention',
    message: 'Maria Chen mentioned you in a comment',
    time: '3 days ago',
    read: true,
    link: '/article/1#comments'
  }
];

export const performanceData: ChartData[] = [
  { name: 'Jan', views: 4000, likes: 240 },
  { name: 'Feb', views: 3000, likes: 198 },
  { name: 'Mar', views: 2000, likes: 120 },
  { name: 'Apr', views: 2780, likes: 167 },
  { name: 'May', views: 1890, likes: 113 },
  { name: 'Jun', views: 2390, likes: 143 },
  { name: 'Jul', views: 3490, likes: 209 }
];

export const articlesByStatus = [
  { name: 'Published', value: 25 },
  { name: 'Drafts', value: 12 },
  { name: 'Scheduled', value: 10 }
];

export const topCategories = [
  { name: 'Technology', value: 15 },
  { name: 'Lifestyle', value: 10 },
  { name: 'Work', value: 8 },
  { name: 'Travel', value: 7 },
  { name: 'Health', value: 7 }
];