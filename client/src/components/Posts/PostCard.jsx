import React, { useState } from "react";
import { MessageCircle, Send, Heart, Smile, ChevronDown } from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import LazyImage from "../LazyImage";
import { handleLikeDislike } from "../../Utils/LikeDislike";
import { TimeAgo } from "../../Utils/TimeAgo";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const PostCard = ({ post, setPosts }) => {
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState("");
  const [commentPostId, setCommentPostId] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);

  const handleCommentPostId = (postid) => {
    if (commentPostId === postid) {
      setCommentPostId(null);
      return;
    }
    setCommentPostId(postid);
  };

  const handleLikeDislikePost = async (postid) => {
    try {
      setLikeAnimation(true);
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.postid === postid) {
            const updatedLikeStatus = !post.likedByCurrentUser;
            return {
              ...post,
              likesCount:
                Number(post.likesCount) + (post.likedByCurrentUser ? -1 : 1),
              likedByCurrentUser: updatedLikeStatus,
            };
          }
          return post;
        }),
      );
      await handleLikeDislike({ postid });
      setTimeout(() => setLikeAnimation(false), 300);
    } catch (error) {
      console.error("Error handling like/dislike:", error);
      toast.error("An error occurred while handling like/dislike.");
    }
  };

  const handleCommentSubmit = async (e, postid) => {
    e.preventDefault();
    try {
      toast.success("Comment Added");
      setCommentText("");
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.postid === postid
            ? { ...post, commentsCount: Number(post.commentsCount) + 1 }
            : post,
        ),
      );
      setCommentPostId(null);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/post/comment`,
        {
          comment: commentText,
          postid: postid,
        },
        {
          withCredentials: true,
        },
      );
    } catch (error) {
      console.error("Error Commenting post:", error);
      toast.error(
        error.response.data.error ||
          "An error occurred while commenting the post.",
      );
    }
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-lg">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Link to={`/user/profile/${post.createdby}`}>
              <img
                src={post.profilepic}
                alt={post.name}
                className="w-14 h-14 rounded-full transition-transform duration-300 ease-in-out hover:scale-110"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              />
            </Link>
            <div className="ml-4">
              <p
                className={`text-sm font-semibold transition duration-300 ease-in-out ${
                  isHovered ? "font-bold" : "font-medium"
                }`}
              >
                {post.name}
              </p>
              <p className="text-xs text-gray-500">
                {TimeAgo(post.postedtime)}
              </p>
            </div>
          </div>
          <button
            className="p-2 rounded-full hover:bg-gray-200 transition duration-200 ease-in-out"
            onClick={() => navigate(`/post/${post.postid}`)}
          >
            <ChevronDown />
          </button>
        </div>
        <p className="text-sm mb-4">{post.title}</p>
        {post.images.length > 0 && (
          <div className="my-4 grid grid-cols-1 gap-4">
            {post.images.map((image) => (
              <div key={image.id}>
                <LazyImage
                  src={image.image}
                  alt={image.image}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button
              className={`p-2 rounded-full transition-transform duration-200 ease-in-out ${
                likeAnimation ? "scale-125" : "scale-100"
              } ${post.likedByCurrentUser ? "text-red-500" : "text-gray-500"}`}
              onClick={() => handleLikeDislikePost(post.postid)}
            >
              {post.likedByCurrentUser ? <Heart fill="red" /> : <Heart />}
            </button>
            <span className="text-sm ml-2">{post.likesCount}</span>
          </div>
          <div className="flex items-center">
            <button
              className="p-2 rounded-full hover:bg-gray-200 transition duration-200 ease-in-out"
              onClick={() => handleCommentPostId(post.postid)}
            >
              <MessageCircle />
            </button>
            <span className="text-sm ml-2">{post.commentsCount}</span>
          </div>
        </div>
      </div>
      {commentPostId === post.postid && (
        <form
          onSubmit={(e) => handleCommentSubmit(e, post.postid)}
          className="p-4 bg-gray-100 border-t border-gray-200"
        >
          <div className="flex items-center relative">
            <input
              type="text"
              placeholder="Add a comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
              className="flex-grow mr-2 p-2 rounded-lg bg-gray-200 focus:bg-white transition duration-300 ease-in-out"
            />
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 rounded-full hover:bg-gray-200 transition duration-200 ease-in-out"
            >
              <Smile />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 z-10">
                <Picker
                  data={data}
                  onEmojiSelect={(emoji) =>
                    setCommentText(commentText + emoji.native)
                  }
                />
              </div>
            )}
            <button
              type="submit"
              className="p-2 ml-2 rounded-full hover:bg-blue-100 transition duration-200 ease-in-out"
            >
              <Send />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PostCard;
