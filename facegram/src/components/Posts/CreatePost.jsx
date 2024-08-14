import React, { useRef, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { Context } from "../../Context/Context";
import LoadingScreen from "../Load";

const MAX_FILE_SIZE = 3 * 1024 * 1024;

const CreatePost = ({ posts, setPosts }) => {
  const { user } = useContext(Context);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm();

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} is larger than 3MB`);
        return false;
      }
      return true;
    });

    setImages((prevImages) => [...prevImages, ...validFiles]);
    clearErrors("images");
  };

  const removeFile = (indexToRemove) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleFormSubmit = async (data) => {
    if (data.message.trim() === "" && images.length === 0) {
      setError("message", {
        type: "manual",
        message: "Please enter a message or upload an image",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", data.message);
    images.forEach((image) => {
      formData.append("images", image);
    });

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/create`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (response.status === 200) {
        response.data.post.likesCount = 0;
        response.data.post.commentsCount = 0;
        setLoading(false);
        toast.success("Post created successfully");
        setPosts([response.data.post, ...posts]);
        setImages([]);
        reset();
      }
    } catch (error) {
      setLoading(false);
      let errorMessage = "An error occurred while creating the post";
      if (error.response && error.response.status === 400) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="shadow-md rounded-lg p-4"
    >
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 mr-3 rounded-full bg-slate-300 overflow-hidden">
          <img
            src={user?.profilepic}
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-grow bg-slate-100 rounded-full shadow-sm overflow-hidden">
          <div className="flex items-center">
            <input
              {...register("message")}
              type="text"
              placeholder="What's on your mind?"
              className="flex-grow px-4 py-2 outline-none bg-slate-100"
            />
            <button
              title="Upload Image"
              type="button"
              className="p-2 text-green-500 hover:text-green-600"
              onClick={handleImageClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
              multiple
            />
          </div>
        </div>
      </div>
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {images.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={`Upload ${index + 1}`}
                className="w-full h-36 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      {errors.message && (
        <div className="text-red-500 mt-2">{errors.message.message}</div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 disabled:bg-blue-300"
      >
        {loading ? "Posting..." : "Post"}
      </button>
      <LoadingScreen isLoading={loading} />
    </form>
  );
};

export default CreatePost;
