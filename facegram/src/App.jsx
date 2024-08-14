import React, { lazy, Suspense, useContext } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Outlet,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import { Context, ContextProvider } from "./Context/Context";
import { CssBaseline } from "@mui/material";
import "./App.css";
import { toast } from "sonner";
import NotFoundPage from "./components/NotFound";
import NextTopLoader from "nextjs-toploader";
import Chat from "./components/Chat/Chat";
import LoadingScreen from "./components/Load";

// Lazy-loaded components
const Home = lazy(() => import("./components/Home"));
const Register = lazy(() => import("./components/Auth/Register"));
const VerifyUser = lazy(() => import("./components/Auth/VerifyUser"));
const Login = lazy(() => import("./components/Auth/Login"));
const Navbar = lazy(() => import("./components/Navbar"));
const Profile = lazy(() => import("./components/Auth/Profile"));
const UserPosts = lazy(() => import("./components/Posts/UserPosts"));
const AllPosts = lazy(() => import("./components/Posts/AllPosts"));
const PostDetail = lazy(() => import("./components/Posts/PostDetail"));
const SearchPost = lazy(() => import("./components/Posts/SearchPost"));
const UpdatePost = lazy(() => import("./components/Posts/UpdatePost"));
const SeeUserProfile = lazy(() => import("./components/Auth/SeeUserProfile"));

const PrivateRoutes = () => {
  const { user, loading } = useContext(Context);

  if (loading) {
    return <LoadingScreen />;
  }

  if (user?.verified === false) {
    toast.error("Please verify your email first");
    return <Navigate to="/verify" state={{ email: user?.email }} />;
  }

  return user?.email ? (
    <>
      <Navbar />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

function App() {
  return (
    <ContextProvider>
      <CssBaseline />
      <Router>
        <NextTopLoader showSpinner={false} />
        <Toaster position="top-right" />
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/user/profile/:userid"
                element={<SeeUserProfile />}
              />
              <Route path="/my/posts" element={<UserPosts />} />
              <Route path="/all/posts" element={<AllPosts />} />
              <Route path="/post/:postid" element={<PostDetail />} />
              <Route path="/post/search" element={<SearchPost />} />
              <Route path="/post/update/:postid" element={<UpdatePost />} />
              <Route path="/chat" element={<Chat />} />
            </Route>

            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<VerifyUser />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Router>
    </ContextProvider>
  );
}

export default App;
