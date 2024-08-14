import React, { useState, useEffect, useRef } from "react";
import { LucideSearch, LucideX } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const SearchUser = ({
  users,
  loading,
  setLoading,
  setCurrentChat,
  getAllExistingChats,
}) => {
  const initialLoad = useRef(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [newUsers, setNewUsers] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim() !== "") {
        setLoading(true);
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_API_URL
            }/api/user/search?name=${searchQuery}`,
            { withCredentials: true },
          );
          setNewUsers(response.data.users);
        } catch (error) {
          console.error("Error fetching filtered user:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setNewUsers([]);
      }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const createChat = async (userid) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/create/chat`,
        {
          recieverid: userid,
        },
        {
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        setCurrentChat(response.data.chat);
        await getAllExistingChats();
        setNewUsers([]);
        setSearchQuery("");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setNewUsers([]);
  };

  return (
    <div className="flex bg-slate-50 flex-col h-[85svh] p-5 gap-4">
      <h2 className="text-lg text-center font-semibold">Search Users</h2>
      <div className="flex items-center relative">
        <input
          placeholder="Search for a user..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 bg-white rounded-full shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
        <div className="absolute right-2">
          {searchQuery && (
            <button onClick={clearSearch}>
              <LucideX className="text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center mt-2">
          <div className="h-8 w-8 border-4 border-t-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      <div className="flex-grow overflow-y-auto p-2">
        {newUsers.length > 0 ? (
          <>
            <h3 className="text-lg font-semibold">Searched Users</h3>
            <div className="grid gap-2">
              {newUsers.map((user) => (
                <div
                  key={user.userid}
                  onClick={() => createChat(user.userid)}
                  className="flex items-center p-3 bg-slate-100 rounded-lg hover:bg-slate-200 cursor-pointer"
                >
                  <img
                    src={user.profilepic}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="ml-4 text-sm font-medium">{user.name}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {users.length <= 0 && !loading ? (
              <p>No users found.</p>
            ) : (
              <div className="grid gap-2 mb-5">
                {users.map((user) => (
                  <div
                    key={user.otherUser.userid || user.otherUser.chatid}
                    onClick={() => {
                      setActiveTab(user.otherUser.userid);
                      setCurrentChat(user);
                    }}
                    className={`flex items-center p-3 rounded-md cursor-pointer ${
                      activeTab === user.otherUser.userid
                        ? "bg-slate-200"
                        : "bg-slate-100"
                    } hover:bg-gray-200`}
                  >
                    <img
                      src={user.otherUser.profilepic}
                      alt={user.otherUser.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex flex-col ml-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">
                          {user.otherUser.name}
                        </span>
                        {user.isOnline && (
                          <span className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                        )}
                        {user.isTyping && (
                          <span className="text-xs text-gray-500">
                            typing...
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {user?.lastmessage}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchUser;
