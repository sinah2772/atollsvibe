import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Flag, MoreVertical, Search } from 'lucide-react';

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  articleTitle: string;
  timestamp: string;
  likes: number;
  replies: number;
  reported: boolean;
}

const mockComments: Comment[] = [
  {
    id: '1',
    user: {
      name: 'Ahmed Hassan',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=32'
    },
    content: 'ވަރަށް ރަނގަޅު މަޢުލޫމާތު. ޝުކުރިއްޔާ!',
    articleTitle: 'ރާއްޖޭގެ ފަތުރުވެރިކަން އިތުރަށް ކުރިއަރަމުން',
    timestamp: '2 hours ago',
    likes: 5,
    replies: 2,
    reported: false
  },
  {
    id: '2',
    user: {
      name: 'Mariyam Shifza',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=32'
    },
    content: 'This is a very informative article. Looking forward to more content like this!',
    articleTitle: 'The Future of Technology in Maldives',
    timestamp: '5 hours ago',
    likes: 8,
    replies: 1,
    reported: true
  }
];

const Comments: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'reported'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredComments = mockComments.filter(comment => {
    const matchesFilter = filter === 'all' || (filter === 'reported' && comment.reported);
    const matchesSearch = comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.articleTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Comments</h1>
        <p className="text-gray-600 mt-1">Manage and moderate article comments</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search comments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Comments
          </button>
          <button
            onClick={() => setFilter('reported')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'reported'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Reported
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredComments.map(comment => (
          <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <img
                  src={comment.user.avatar}
                  alt={comment.user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900">{comment.user.name}</h3>
                    <span className="text-sm text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-gray-600 mt-1">{comment.content}</p>
                  <a href="#" className="text-sm text-gray-500 hover:text-gray-700 mt-2 block">
                    On: {comment.articleTitle}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {comment.reported && (
                  <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    Reported
                  </span>
                )}
                <button className="p-1 hover:bg-gray-100 rounded-full">
                  <MoreVertical size={20} className="text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-100">
              <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
                <ThumbsUp size={18} />
                <span className="text-sm">{comment.likes}</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
                <MessageSquare size={18} />
                <span className="text-sm">{comment.replies}</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-500 hover:text-red-600">
                <Flag size={18} />
                <span className="text-sm">Report</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;