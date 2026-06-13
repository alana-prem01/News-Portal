import React from 'react';
import { Link } from 'react-router-dom';

const NewsCard = ({ post }) => {
  return (
    <Link to={`/post/${post._id}`} className="group block h-full">
      <div className="flex flex-col h-full bg-white transition-all duration-300 hover:shadow-lg border border-gray-100 group-hover:border-gray-200">
        <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
          {post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          <div className="absolute top-0 left-0 bg-[var(--color-brand-red)] text-white text-xs font-bold px-2 py-1 uppercase tracking-wider">
            {post.category}
          </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-xl font-bold leading-tight mb-2 group-hover:text-[var(--color-brand-red)] transition-colors line-clamp-3">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
            {post.summary}
          </p>
          <div className="mt-auto text-xs text-gray-500 font-medium border-t border-gray-100 pt-3 flex items-center">
            {post.createdAt || post.publishedAt ? (
              <span>{new Date(post.publishedAt || post.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
