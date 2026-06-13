import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import NewsCard from '../../components/NewsCard';

const CategoryPage = () => {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/public/posts/category/${category}`);
        setPosts(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch posts for this category');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryPosts();
  }, [category]);

  if (loading) return <div className="text-center py-20">Loading category...</div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold bg-[var(--color-brand-red)] text-white px-4 py-2 inline-block capitalize">
          {category} News
        </h1>
        <div className="h-0.5 bg-[var(--color-brand-red)] flex-grow"></div>
      </div>
      
      {posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No posts found in this category.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map(post => (
            <NewsCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
