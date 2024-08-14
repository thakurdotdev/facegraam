"use client";

import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../Context/Context";
import { toast } from "sonner";
import axios from "axios";
import getFollowList from "../../Utils/getFollowList";
import { CheckCircle } from "lucide-react";
import LazyImage from "../LazyImage";
import { Dialog, DialogContent, TriggerButton } from "../ui/Dialog";

const Profile = () => {
  const { user, setUser } = useContext(Context);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    getFollowList(user.userid).then((response) => {
      setFollowers(response.followers);
      setFollowing(response.following);
    });
  }, [user.userid]);

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/logout`,
        { withCredentials: true },
      );
      if (response.status === 200) {
        setUser(null);
        toast.success("Logout successful");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error logging out");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl">
        <div className="flex flex-col md:flex-row">
          <LazyImage
            src={user?.profilepic}
            alt={user?.name}
            height="100%"
            width={144}
            className="w-36 h-36 border-4 border-gray-200"
          />
          <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start max-md:mt-5">
              <h1 className="text-2xl font-semibold text-blue-700">
                {user?.name}
              </h1>
              {user.verified && <CheckCircle className="text-blue-500 ml-2" />}
            </div>
            <p className="text-gray-600">@{user?.username}</p>
            <div className="mt-2 flex justify-center md:justify-start gap-2">
              <Dialog>
                <TriggerButton>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-full">
                    {followers.length} Followers
                  </button>
                </TriggerButton>
                <DialogContent>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Followers</h2>
                  </div>
                  <div>
                    {followers.map((follow) => (
                      <div
                        key={follow.id}
                        className="flex items-center p-2 hover:bg-gray-200 cursor-pointer"
                      >
                        <LazyImage
                          height={40}
                          width={40}
                          src={follow?.follower.profilepic}
                          alt={follow?.follower?.name}
                        />
                        <div className="ml-4">
                          <Link
                            to={`/user/profile/${follow.follower.userid}`}
                            className="text-sm font-medium"
                          >
                            {follow?.follower?.name}
                          </Link>
                          <p className="text-sm text-neutral-500">
                            @{follow?.follower?.username}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <TriggerButton>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-full">
                    {following.length} Following
                  </button>
                </TriggerButton>
                <DialogContent>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Following</h2>
                  </div>
                  <div>
                    {following.map((follow) => (
                      <div
                        key={follow.id}
                        className="flex items-center p-2 hover:bg-gray-200 cursor-pointer"
                      >
                        <LazyImage
                          height={40}
                          width={40}
                          src={follow?.following.profilepic}
                          alt={follow?.following?.name}
                        />
                        <div className="ml-4">
                          <Link
                            to={`/user/profile/${follow.following.userid}`}
                            className="text-sm font-medium"
                          >
                            {follow?.following?.name}
                          </Link>
                          <p className="text-sm text-neutral-500">
                            @{follow?.following?.username}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="mt-4">
              <p className="text-gray-700">{user?.email}</p>
              <p className="text-gray-700 mt-2">{user?.bio}</p>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
