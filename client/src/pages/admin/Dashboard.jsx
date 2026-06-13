import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Edit, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Draft', 'Scheduled', 'In-review', 'Published'];

  const fetchPosts = async () => {
    try {
      const url = activeTab === 'All' ? '/admin/posts' : `/admin/posts?status=${activeTab}`;
      const { data } = await api.get(url);
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchPosts();
  }, [activeTab]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/admin/posts/${id}`);
        fetchPosts(); 
      } catch (error) {
        console.error("Failed to delete", error);
      }
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/posts/${id}`, { status: 'Published' });
      fetchPosts();
    } catch (error) {
      console.error("Failed to approve", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'In-review': return 'bg-yellow-100 text-yellow-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="border-b border-gray-200 px-6 py-4">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'border-[var(--color-brand-red)] text-[var(--color-brand-red)]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No posts found for this status.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map(post => (
                  <tr key={post._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{post.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{post.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {post.status === 'In-review' && (
                        <button onClick={() => handleApprove(post._id)} className="text-green-600 hover:text-green-900 mr-4 inline-block font-semibold">
                          Approve
                        </button>
                      )}
                      <Link to={`/admin/post/${post._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4 inline-block">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(post._id)} className="text-red-600 hover:text-red-900 inline-block">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
