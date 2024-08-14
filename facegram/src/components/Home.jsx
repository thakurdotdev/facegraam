import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, MessageCircle, Share2, Zap } from "lucide-react";
import LazyImage from "./LazyImage";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="flex flex-col h-full shadow-lg"
  >
    <div className="p-6">
      <Icon className="w-12 h-12 text-blue-500 mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </motion.div>
);

const Home = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowAlert(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pt-8">
      <div className="max-w-screen-lg mx-auto px-6">
        <div className="flex justify-between items-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center shadow-lg rounded-full"
          >
            <LazyImage src="/facegram.png" alt="FaceGram Logo" width={80} />
          </motion.div>
          <div>
            <button
              className="mr-4 text-blue-500"
              onClick={() => navigate("/login")}
            >
              Log In
            </button>
            <button
              className="border border-blue-500 text-blue-500 px-4 py-2 rounded-lg"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>
          </div>
        </div>

        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 text-blue-700">
              <h4 className="font-bold">New Chat Feature!</h4>
              <p>
                We've just upgraded our real-time chat with read receipts and
                typing indicators. Try it now!
              </p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-5xl font-bold mb-8">
              Share Moments, <br />
              <span className="text-blue-500">Chat</span> in Real-Time
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Capture life's precious moments and instantly connect with friends
              through our lightning-fast real-time chat. Experience social
              networking reimagined.
            </p>
            <button
              className="border border-blue-500 text-blue-500 px-8 py-4 rounded-lg"
              onClick={() => navigate("/register")}
            >
              Join Now
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <LazyImage
              src="/facegram.png"
              alt="FaceGram App Interface"
              width="300px"
            />
          </motion.div>
        </div>

        <h3 className="text-4xl text-center mb-24">Why FaceGram Stands Out</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-32">
          <FeatureCard
            icon={MessageCircle}
            title="Real-Time Chat"
            description="Connect instantly with friends through our lightning-fast messaging system. Share text, emojis, and media in real-time."
          />
          <FeatureCard
            icon={Camera}
            title="Capture Moments"
            description="Take and share stunning photos with our advanced camera features and filters."
          />
          <FeatureCard
            icon={Share2}
            title="Easy Sharing"
            description="Share your posts across multiple platforms with just one click. Reach all your friends, wherever they are."
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="shadow-lg mb-32 p-6">
            <div className="flex items-center mb-4">
              <Zap className="w-6 h-6 text-yellow-500 mr-2" />
              <h3 className="text-2xl font-semibold">
                Lightning-Fast Real-Time Chat
              </h3>
            </div>
            <p className="text-lg mb-6">
              Experience the future of social networking with our unparalleled
              real-time chat feature. Stay connected with friends and family
              like never before:
            </p>
            <ul className="list-disc pl-8">
              <li>Instant message delivery</li>
              <li>Seamless syncing across all your devices</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
