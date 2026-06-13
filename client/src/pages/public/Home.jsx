import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import NewsCard from '../../components/NewsCard';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomePosts = async () => {
      try {
        const { data } = await api.get('/public/posts/home');
        setPosts(data);
      } catch (err) {
        setError('Failed to fetch posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomePosts();
  }, []);

  if (loading) return <div className="text-center py-20">Loading news...</div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;

  const heroPost = posts[0];
  const generalPosts = posts.slice(1);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      {heroPost && (
        <section className="bg-white border border-gray-200">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/3">
              <div className="relative aspect-video bg-gray-100">
                {heroPost.imageUrl && (
                  <img src={heroPost.imageUrl} alt={heroPost.title} className="w-full h-full object-cover" />
                )}
                <div className="absolute top-0 left-0 bg-[var(--color-brand-red)] text-white text-sm font-bold px-3 py-1.5 uppercase tracking-wider">
                  Breaking: {heroPost.category}
                </div>
              </div>
            </div>
            <div className="md:w-1/3 p-6 md:p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-200">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4 hover:text-[var(--color-brand-red)] transition-colors cursor-pointer" onClick={() => window.location.href = `/post/${heroPost._id}`}>
                {heroPost.title}
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                {heroPost.summary}
              </p>
              <div className="text-sm text-gray-500 font-medium">
                {heroPost.createdAt || heroPost.publishedAt ? (
                  <span>{new Date(heroPost.publishedAt || heroPost.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* General Section Grid */}
      {generalPosts.length > 0 && (
        <section>
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold bg-[var(--color-brand-red)] text-white px-4 py-1 inline-block">Latest News</h2>
            <div className="h-0.5 bg-[var(--color-brand-red)] flex-grow"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {generalPosts.map(post => (
              <NewsCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
