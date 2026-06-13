import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'World',
    status: 'Draft',
    scheduledAt: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['World', 'Business', 'Technology', 'Science', 'Health', 'Sports', 'Entertainment'];
  const statuses = ['Draft', 'In-review', 'Published', 'Scheduled'];

  useEffect(() => {
    if (isEdit) {
      const fetchPost = async () => {
        try {
          const { data } = await api.get(`/admin/posts/${id}`);
          setFormData({
            title: data.title,
            summary: data.summary,
            content: data.content,
            category: data.category,
            status: data.status,
            scheduledAt: data.scheduledAt ? new Date(data.scheduledAt).toISOString().slice(0, 16) : ''
          });
          setCurrentImage(data.imageUrl);
        } catch (err) {
          setError('Failed to fetch post details');
        }
      };
      fetchPost();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      if (isEdit) {
        await api.put(`/admin/posts/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/admin/posts', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Post' : 'Create New Post'}</h2>
      
      {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--color-brand-red)] focus:border-[var(--color-brand-red)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
          <textarea
            name="summary"
            required
            rows="2"
            value={formData.summary}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--color-brand-red)] focus:border-[var(--color-brand-red)]"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            name="content"
            required
            rows="10"
            value={formData.content}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--color-brand-red)] focus:border-[var(--color-brand-red)]"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--color-brand-red)] focus:border-[var(--color-brand-red)]"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--color-brand-red)] focus:border-[var(--color-brand-red)]"
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {formData.status === 'Scheduled' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Time</label>
            <input
              type="datetime-local"
              name="scheduledAt"
              value={formData.scheduledAt}
              onChange={handleChange}
              required={formData.status === 'Scheduled'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--color-brand-red)] focus:border-[var(--color-brand-red)]"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
          {currentImage && (
            <div className="mb-2">
              <img src={currentImage} alt="Current cover" className="h-32 object-cover rounded" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
          />
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-brand-red)] hover:bg-red-800 focus:outline-none disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostEditor;
