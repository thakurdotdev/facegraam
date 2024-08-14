import React, { useEffect, useState } from "react";
import axios from "axios";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingScreen from "../Load";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const limit = 10;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/posts?page=${page}&limit=${limit}`,
        { withCredentials: true },
      );
      if (response.status === 200) {
        setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
        setTotalPosts(response.data.totalPosts);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && posts.length === 0) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="text-center mt-4">
        <h6 className="text-red-500">{`Error: ${error}`}</h6>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 my-5 mb-20 mx-auto w-[90%] sm:w-[75%] md:w-[60%] lg:w-[40%] xl:w-[25%]">
      <CreatePost posts={posts} setPosts={setPosts} />
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchPosts}
        hasMore={posts.length < totalPosts}
        loader={<div className="text-center my-3">Loading...</div>}
        endMessage={
          <p className="text-center my-3">
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <div className="flex flex-col">
          {posts.map((post) => (
            <PostCard key={post.postid} post={post} setPosts={setPosts} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default AllPosts;
