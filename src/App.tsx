import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Geolocation from "./components/Geolocation";
import SinglePost from "./components/SinglePost";
import UserCard from "./components/UserCard";
import ImageSearch from "./components/ImageSearch";
import ImageDetail from "./components/ImageDetail";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div className="min-h-screen">
          <Navbar />
          <div className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/search"
                element={
                  <section className=" backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-white/20 animate-fade-in">
                    <h2 className="text-3xl font-bold mb-6 text-white flex items-center space-x-2">
                      <span>🔍</span>
                      <span>Image Search</span>
                    </h2>
                    <ImageSearch />
                  </section>
                }
              />
              <Route
                path="/posts"
                element={
                  <section className="backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-white/20 animate-fade-in">
                    <h2 className="text-3xl font-bold mb-6 text-white flex items-center space-x-2">
                      <span>📝</span>
                      <span>Blog Posts</span>
                    </h2>
                    <SinglePost />
                  </section>
                }
              />
              <Route
                path="/location"
                element={
                  <section className=" backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-white/20 animate-fade-in">
                    <h2 className="text-3xl font-bold mb-6 text-white flex items-center space-x-2">
                      <span>📍</span>
                      <span>Your Location</span>
                    </h2>
                    <Geolocation />
                  </section>
                }
              />
              <Route
                path="/image/:id"
                element={
                  <section className="backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-white/20 animate-fade-in">
                    <ImageDetail />
                  </section>
                }
              />
              <Route
                path="/profile"
                element={
                  <section className="backdrop-blur-lg rounded-xl p-6 shadow-2xl border border-white/20 animate-fade-in">
                    <h2 className="text-3xl font-bold mb-6 text-white flex items-center space-x-2">
                      <span>👤</span>
                      <span>User Profile</span>
                    </h2>
                    <UserCard>
                      <p className="text-gray-200">
                        This is some user content.
                      </p>
                    </UserCard>
                  </section>
                }
              />
            </Routes>
          </div>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
