import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../Context/Context";
import { Home, Send, NotebookPen, Search } from "lucide-react";

const Navbar = () => {
  const { user } = useContext(Context);
  const [value, setValue] = useState(0);

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 md:mb-2 w-full max-w-[500px]">
      <div className="bg-white rounded-[30px] shadow-lg">
        <nav className="flex justify-around p-3">
          <Link
            to="/all/posts"
            onClick={() => setValue(0)}
            className={`flex flex-col items-center ${
              value === 0 ? "text-blue-500" : "text-gray-600"
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </Link>

          <Link
            to="/my/posts"
            onClick={() => setValue(1)}
            className={`flex flex-col items-center ${
              value === 1 ? "text-blue-500" : "text-gray-600"
            }`}
          >
            <NotebookPen className="w-6 h-6" />
            <span className="text-xs">My Posts</span>
          </Link>

          <Link
            to="/post/search"
            onClick={() => setValue(2)}
            className={`flex flex-col items-center ${
              value === 2 ? "text-blue-500" : "text-gray-600"
            }`}
          >
            <Search className="w-6 h-6" />
            <span className="text-xs">Search</span>
          </Link>

          <Link
            to="/chat"
            onClick={() => setValue(3)}
            className={`flex flex-col items-center ${
              value === 3 ? "text-blue-500" : "text-gray-600"
            }`}
          >
            <Send className="w-6 h-6" />
            <span className="text-xs">Chat</span>
          </Link>

          <Link
            to="/profile"
            onClick={() => setValue(4)}
            className={`flex flex-col items-center ${
              value === 4 ? "text-blue-500" : "text-gray-600"
            }`}
          >
            <img
              src={user?.profilepic}
              alt="Profile"
              className="w-8 h-8 rounded-full border-2 border-white shadow-md"
            />
            <span className="text-xs">You</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
