import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Context } from "../../Context/Context";
import { TimeAgo } from "../../Utils/TimeAgo";
import DeletePost from "./DeletePost";
import HidePost from "./HidePost";
import { Pencil, Heart, MessageSquare } from "lucide-react";
import FilterPosts from "./FilterPost";
import LoadingScreen from "../Load";

const UserPosts = () => {
  const { user } = useContext(Context);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState("date");

  useEffect(() => {
    getAllPosts();
  }, [filterType]);

  const getAllPosts = async () => {
    setIsLoading(true);
    try {
      if (user.userid) {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/posts/${user.userid}`,
          {
            withCredentials: true,
          },
        );
        if (response.status === 200) {
          let sortedPosts = response.data.posts;
          if (filterType === "date") {
            sortedPosts = sortedPosts.sort(
              (a, b) => new Date(b.postedtime) - new Date(a.postedtime),
            );
          } else if (filterType === "popularity") {
            sortedPosts = sortedPosts.sort(
              (a, b) => b.likesCount - a.likesCount,
            );
          } else if (filterType === "comments") {
            sortedPosts = sortedPosts.sort(
              (a, b) => b.commentsCount - a.commentsCount,
            );
          }
          setPosts(sortedPosts);
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (posts.length === 0 && !isLoading) {
    return (
      <div className="text-center my-16">
        <h6 className="text-lg font-medium mb-4">
          You don't have any posts yet
        </h6>
        <Link to="/all/posts">
          <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
            Create a Post
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto mt-8 shadow-lg">
      <FilterPosts onFilterChange={(type) => setFilterType(type)} />
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 text-left">Author</th>
            <th className="py-2 px-4 text-left">Title</th>
            <th className="py-2 px-4 text-center">Images</th>
            <th className="py-2 px-4 text-center">Likes</th>
            <th className="py-2 px-4 text-center">Comments</th>
            <th className="py-2 px-4 text-center">Posted</th>
            <th className="py-2 px-4 text-center">Visibility</th>
            <th className="py-2 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr
              key={post.postid}
              className="hover:bg-gray-50 transition duration-200"
            >
              <td className="py-2 px-4 flex items-center">
                <img
                  src={post.profilepic}
                  alt={post.name}
                  className="w-10 h-10 rounded-full mr-2"
                />
                <span className="text-sm">{post.name}</span>
              </td>
              <td className="py-2 px-4">{post.title}</td>
              <td className="py-2 px-4 text-center">{post.images.length}</td>
              <td className="py-2 px-4 text-center">
                <div className="flex items-center justify-center">
                  <Heart className="mr-1" />
                  {post.likesCount}
                </div>
              </td>
              <td className="py-2 px-4 text-center">
                <div className="flex items-center justify-center">
                  <MessageSquare className="mr-1" />
                  {post.commentsCount}
                </div>
              </td>
              <td className="py-2 px-4 text-center">
                {TimeAgo(post.postedtime)}
              </td>
              <td className="py-2 px-4 text-center">
                <span
                  className={`inline-block py-1 px-3 rounded-full text-xs font-medium ${
                    post.showpost
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {post.showpost ? "Visible" : "Hidden"}
                </span>
              </td>
              <td className="py-2 px-4 flex text-center">
                <Link to={`/post/update/${post.postid}`} className="mr-2">
                  <button className="p-2 hover:bg-gray-200 rounded-full">
                    <Pencil />
                  </button>
                </Link>
                <DeletePost
                  postid={post.postid}
                  posts={posts}
                  setPosts={setPosts}
                />
                <HidePost
                  postid={post.postid}
                  hidestatus={post.showpost}
                  getAllPosts={getAllPosts}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserPosts;
