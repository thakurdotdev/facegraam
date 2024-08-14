import {
  Box,
  Avatar,
  Typography,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import { blue } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import getFollowList from "../../Utils/getFollowList";
import PostCard from "../Posts/PostCard";
import { toast } from "sonner";
import { useContext } from "react";
import { Context } from "../../Context/Context";
import LoadingScreen from "../Load";

const SeeUserProfile = () => {
  const { user: CurrUser } = useContext(Context);
  const { userid } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFollowersDialog, setShowFollowersDialog] = useState(false);
  const [showFollowingDialog, setShowFollowingDialog] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postLoading, setPostLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState();

  useEffect(() => {
    fetchUser();
    getAllPosts();
    getFollowList(userid).then((response) => {
      setFollowers(response.followers);
      setFollowing(response.following);
      if (
        response.followers.some((follower) => follower.userid === user?.userid)
      ) {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    });
  }, [userid]);

  const getAllPosts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/posts/${userid}`,
        {
          withCredentials: true,
        },
      );
      if (response.status === 200) {
        setPostLoading(false);
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/profile/${userid}`,
        {
          withCredentials: true,
        },
      );
      if (response.status === 200) {
        setUser(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  // Follow User
  const handleFollow = async (followid) => {
    try {
      setIsFollowing((prev) => !prev);
      setFollowers((prev) => {
        if (isFollowing) {
          return prev.filter((follower) => follower.userid !== followid);
        } else {
          return [...prev, { follower: { userid: followid } }];
        }
      });
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/follow/${followid}`,
        {
          withCredentials: true,
        },
      );
      if (response.status == 200) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleFollowersDialog = () => setShowFollowersDialog((prev) => !prev);
  const handleFollowingDialog = () => setShowFollowingDialog((prev) => !prev);

  if (loading) return <LoadingScreen isLoading={loading || postLoading} />;

  return (
    <Grid
      display="flex"
      justifyContent="center"
      sx={{
        mx: "auto",
        mb: 10,
      }}
    >
      <Box
        bgcolor="#f0f0f0"
        p={2}
        borderRadius={2}
        sx={{
          maxWidth: "450px",
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} sm={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar
                src={user?.profilepic}
                alt="userimage"
                sx={{
                  width: "100px",
                  height: "100px",
                  mx: "auto",
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: blue[700],
                display: "flex",
                alignItems: "center",
              }}
              gutterBottom
            >
              {user?.name}
              {user?.verified && (
                <VerifiedIcon
                  sx={{ color: blue[500], fontSize: "1.5rem", ml: 1 }}
                />
              )}
            </Typography>
            <Typography variant="body1" sx={{ color: "gray" }} gutterBottom>
              @{user?.username}
            </Typography>
            <Typography variant="body1" my={3} gutterBottom>
              {user?.bio}
            </Typography>
            <Divider sx={{ my: 2 }} />
          </Grid>
          <Box
            sx={{
              my: 2,
              display: "flex",
              gap: 1,
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {CurrUser?.userid != userid ? (
              <Button
                variant="outlined"
                onClick={() => handleFollow(userid)}
                sx={{ borderRadius: "20px", width: "30%", fontWeight: "bold" }}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            ) : null}
            <Chip
              sx={{
                width: "30%",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
              onClick={following.length > 0 ? handleFollowingDialog : undefined}
              label={`${following.length} following`}
            />
            <Chip
              sx={{
                width: "30%",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
              onClick={followers.length > 0 ? handleFollowersDialog : undefined}
              label={`${followers.length} followers`}
            />
          </Box>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          sx={{
            mt: 2,
            maxWidth: "450px",
          }}
        >
          {posts.length === 0 ? (
            <Typography variant="h6">No posts yet</Typography>
          ) : (
            posts.map((post) => (
              <PostCard key={post.postid} post={post} setPosts={setPosts} />
            ))
          )}
        </Box>
      </Box>

      <Dialog
        open={showFollowersDialog}
        onClose={handleFollowersDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Followers</DialogTitle>
        <DialogContent>
          <List>
            {followers.map((follow) => (
              <ListItem
                key={follow.id}
                component={Link}
                to={`/user/profile/${follow.follower.userid}`}
                onClick={handleFollowersDialog}
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={follow?.follower.profilepic}
                    alt={follow?.follower?.name}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={follow?.follower?.name}
                  secondary={`@${follow?.follower?.username}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFollowersDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showFollowingDialog}
        onClose={handleFollowingDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Following</DialogTitle>
        <DialogContent>
          <List>
            {following?.map((follow) => (
              <ListItem
                key={follow.id}
                component={Link}
                to={`/user/profile/${follow.following.userid}`}
                onClick={handleFollowingDialog}
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={follow?.following.profilepic}
                    alt={follow?.following?.name}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={follow?.following?.name}
                  secondary={`@${follow?.following?.username}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFollowingDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default SeeUserProfile;
