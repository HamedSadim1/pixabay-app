import React from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV_LINKS, NAV_ICONS } from "../constants/navLinks";

const Navbar: React.FC = () => {
  const location = useLocation();

  const getIcon = (iconName: string) => {
    return NAV_ICONS[iconName as keyof typeof NAV_ICONS];
  };
  return (
    <nav className="bg-black/20 backdrop-blur-md border-b border-white/30 sticky top-0 z-10 shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link
          to="/"
          className="text-2xl font-bold text-white hover:text-purple-300 transition-all duration-300 flex items-center space-x-2 drop-shadow-lg hover:scale-105 group"
        >
          <span className="group-hover:animate-bounce-subtle">✨</span>
          <span>Pixabay App</span>
        </Link>
        <ul className="flex space-x-8">
          {NAV_LINKS.map((link) => {
            const IconComponent = getIcon(link.icon);
            const isActive =
              location.pathname === link.to ||
              (link.to === "/search" &&
                location.pathname.startsWith("/image/"));

            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`px-3 py-2 rounded-lg font-medium flex items-center space-x-2 drop-shadow-lg transition-all duration-300 hover:scale-105 ${
                    isActive
                      ? "bg-linear-to-r from-purple-600/80 to-pink-600/80 text-white shadow-lg border border-white/20 backdrop-blur-sm"
                      : "text-white hover:text-purple-300 hover:bg-white/10 hover:shadow-md"
                  }`}
                >
                  <IconComponent />
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
