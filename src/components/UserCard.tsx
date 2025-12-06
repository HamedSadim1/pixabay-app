import React from "react";
import { FaUserPlus, FaUser } from "react-icons/fa";

interface BlockProps {
  children: React.ReactNode;
  name?: string;
  avatar?: string;
  role?: string;
  isOnline?: boolean;
}

const UserCard: React.FC<BlockProps> = ({
  children,
  name = "Alex Tancredi",
  avatar,
  role,
  isOnline = false,
}) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group">
      <div className="flex items-start space-x-4">
        <div className="relative shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={`${name} avatar`}
              className="w-16 h-16 rounded-full border-2 border-white/20 shadow-lg group-hover:border-purple-400 transition-colors duration-300"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center border-2 border-white/20 shadow-lg group-hover:border-purple-400 transition-colors duration-300">
              <FaUser className="text-white text-xl" />
            </div>
          )}
          {isOnline && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">
              {name}
            </h3>
            {role && (
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                {role}
              </span>
            )}
          </div>

          <div className="text-gray-300 leading-relaxed mb-4">{children}</div>

          <button className="flex items-center space-x-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25 font-medium group/btn">
            <FaUserPlus className="text-sm group-hover/btn:rotate-12 transition-transform duration-300" />
            <span>Add Friend</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
