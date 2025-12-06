import React, { useState } from "react";
import {
  FaHeart,
  FaComment,
  FaShare,
  FaBookmark,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function SinglePost() {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(42);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Blog Post</h1>
        <p className="text-gray-300">Read the full story</p>
      </div>

      {/* Main Post Card */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 mb-8">
        {/* Author Info */}
        <div className="flex items-center space-x-4 mb-6">
          <img
            src="https://picsum.photos/200/200?random=1"
            alt="Sarah"
            className="w-16 h-16 rounded-full border-2 border-white/30"
          />
          <div>
            <h2 className="text-xl font-bold text-white">Sarah</h2>
            <p className="text-gray-300">New member • Today at 14:30</p>
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">
            Hey, I'm new here! 👋
          </h3>
          <p className="text-gray-200 text-lg leading-relaxed mb-6">
            Just joined this amazing community and I'm so excited to be part of
            it! Looking forward to connecting with everyone and sharing some
            awesome content. This is my first post, so please be gentle! 😊
          </p>

          {/* Sample Image */}
          <div className="rounded-xl p-1 mb-6">
            <img
              src="https://picsum.photos/800/400?random=2"
              alt="Community"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Interaction Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-white/20">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isLiked
                  ? "bg-red-500/20 text-red-300"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              <FaHeart className={isLiked ? "text-red-400" : ""} />
              <span>{likesCount}</span>
            </button>

            <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300">
              <FaComment />
              <span>12</span>
            </button>

            <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300">
              <FaShare />
              <span>Share</span>
            </button>
          </div>

          <button
            onClick={handleBookmark}
            className={`p-3 rounded-lg transition-all duration-300 ${
              isBookmarked
                ? "bg-yellow-500/20 text-yellow-300"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            <FaBookmark className={isBookmarked ? "text-yellow-400" : ""} />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
        <h3 className="text-xl font-bold text-white mb-6">Comments (3)</h3>

        <div className="space-y-4">
          {/* Sample Comments */}
          <div className="flex space-x-4">
            <img
              src="https://picsum.photos/200/200?random=3"
              alt="John"
              className="w-10 h-10 rounded-full border border-white/20"
            />
            <div className="flex-1">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold text-white">John Doe</span>
                  <span className="text-sm text-gray-400">2 hours ago</span>
                </div>
                <p className="text-gray-200">
                  Welcome to the community, Sarah! Looking forward to your
                  posts! 🚀
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <img
              src="https://picsum.photos/200/200?random=4"
              alt="Jane"
              className="w-10 h-10 rounded-full border border-white/20"
            />
            <div className="flex-1">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold text-white">Jane Smith</span>
                  <span className="text-sm text-gray-400">1 hour ago</span>
                </div>
                <p className="text-gray-200">
                  So glad you're here! The community is amazing. 💫
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <img
              src="https://picsum.photos/200/200?random=5"
              alt="Mike"
              className="w-10 h-10 rounded-full border border-white/20"
            />
            <div className="flex-1">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold text-white">Mike Johnson</span>
                  <span className="text-sm text-gray-400">30 min ago</span>
                </div>
                <p className="text-gray-200">
                  Welcome aboard! Don't forget to check out the guidelines. 📚
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Comment */}
        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="flex space-x-4">
            <img
              src="https://picsum.photos/200/200?random=6"
              alt="You"
              className="w-10 h-10 rounded-full border border-white/20"
            />
            <div className="flex-1">
              <textarea
                placeholder="Write a comment..."
                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
              />
              <button className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors">
                Post Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePost;
