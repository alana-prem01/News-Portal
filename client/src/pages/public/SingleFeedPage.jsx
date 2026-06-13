import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

const SingleFeedPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/public/posts/${id}`);
        setPost(data);
      } catch (err) {
        setError('Failed to fetch the article');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading article...</div>;
  if (error || !post) return <div className="text-center py-20 text-red-600">{error || 'Article not found'}</div>;

  return (
    <article className="max-w-3xl mx-auto bg-white p-6 md:p-10 border border-gray-200 shadow-sm mt-4">
      <header className="mb-8">
        <div className="text-[var(--color-brand-red)] font-bold tracking-wider uppercase text-sm mb-3">
          {post.category}
        </div>
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
          {post.title}
        </h1>
        <div className="flex items-center text-gray-500 text-sm border-y border-gray-100 py-3">
          <span className="font-semibold text-gray-800 mr-4">By {post.author?.name || 'BBC News'}</span>
          <span>{new Date(post.publishedAt || post.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </header>

      {post.imageUrl && (
        <figure className="mb-10">
          <img src={post.imageUrl} alt={post.title} className="w-full h-auto object-cover bg-gray-100" />
        </figure>
      )}

      <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
        {/* Render paragraphs properly */}
        {post.content.split('\n').map((paragraph, index) => (
          paragraph.trim() ? <p key={index} className="mb-6">{paragraph}</p> : null
        ))}
      </div>
    </article>
  );
};

export default SingleFeedPage;
