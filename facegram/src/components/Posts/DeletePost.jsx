import axios from "axios";
import { toast } from "sonner";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";

const DeletePost = ({ postid, posts, setPosts }) => {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Post",
      text: "Are you sure you want to delete this post? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete Anyway",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/post/delete/${postid}`,
          {
            withCredentials: true,
          },
        );
        if (response.status === 200) {
          toast.success("Post Deleted Successfully");
          setPosts(posts.filter((post) => post.postid !== postid));
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error("An error occurred while deleting the post.");
      }
    }
  };

  return (
    <Tooltip title="Delete Post">
      <IconButton color="error" onClick={handleDelete}>
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  );
};

export default DeletePost;
