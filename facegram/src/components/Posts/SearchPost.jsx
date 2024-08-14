import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { TimeAgo } from "../../Utils/TimeAgo";
import { Search } from "lucide-react";
import LazyImage from "../LazyImage";

const SearchPost = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim() !== "") {
        setLoading(true);
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/posts/search?q=${searchQuery}`,
            { withCredentials: true },
          );
          setPosts(response.data);
        } catch (error) {
          console.error("Error fetching filtered posts:", error);
        }
        setLoading(false);
      } else {
        setPosts([]);
      }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div className="container mx-auto max-w-xl p-4">
      <div className="flex flex-col items-center gap-4 py-4 mb-6">
        <h2 className="text-2xl font-bold">Search Posts</h2>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute inset-y-0 right-2 flex items-center pl-3">
            <Search className="text-gray-500" />
          </div>
        </div>

        {loading && (
          <div className="flex justify-center my-4">
            <svg
              className="animate-spin h-5 w-5 text-blue-500"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v2a6 6 0 100 12v2a8 8 0 01-8-8z"
              />
            </svg>
          </div>
        )}

        {!loading && posts.length === 0 && searchQuery.trim() !== "" && (
          <p className="text-gray-600">No posts found.</p>
        )}

        <div className="w-full space-y-4">
          {posts.map((post) => (
            <Link
              to={`/post/${post.postid}`}
              key={post.postid}
              className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-center">
                <LazyImage
                  height={48}
                  width={48}
                  src={post.user.profilepic}
                  alt=""
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div className="ml-2">
                  <h3 className="text-lg">{post.user.name}</h3>
                  <p className="text-sm text-gray-500">
                    {TimeAgo(post.postedtime)}
                  </p>
                </div>
              </div>
              <h3 className="mt-2 text-xl font-medium">{post.title}</h3>
              {post.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 relative">
                  {post.images.slice(0, 3).map((image, index) => (
                    <img
                      key={image.id}
                      src={image.image}
                      alt=""
                      className={`rounded-lg ${
                        index === 0
                          ? "w-full h-48 object-cover"
                          : "w-1/2 h-32 object-cover"
                      }`}
                    />
                  ))}
                  {post.images.length > 3 && (
                    <div className="absolute bottom-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
                      +{post.images.length - 3} more
                    </div>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPost;
