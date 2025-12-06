import React from "react";
import { Link } from "react-router-dom";
import BlogPost from "./BlogPost";
import UserCard from "./UserCard";

const Home: React.FC = () => {
  const featuredPosts = [
    {
      name: "Sarah",
      image: "https://picsum.photos/200/200?random=1",
      text: "Just joined this amazing community! So excited to connect with everyone and share some awesome content. Looking forward to your posts! 🚀",
    },
    {
      name: "Mike Johnson",
      image: "https://picsum.photos/200/200?random=7",
      text: "Great to see such an active community here. The discussions are always interesting and the people are so welcoming. Keep up the good work everyone!",
    },
    {
      name: "Emma Davis",
      image: "https://picsum.photos/200/200?random=8",
      text: "Love the new features! The interface is so smooth and the content quality is outstanding. This platform keeps getting better and better.",
    },
  ];

  return (
    <div className="space-y-8">
      <section className=" backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-white/20 text-center animate-fade-in max-w-4xl mx-auto">
        <h2 className="text-5xl font-bold mb-6 text-white leading-tight">
          Welcome to <span className="text-purple-300">Pixabay App</span>
        </h2>
        <p className="text-xl text-gray-200 mb-8  mx-auto">
          Discover amazing posts, search stunning images, and explore your
          location in a beautiful, modern interface.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <div className="text-4xl mb-2">📝</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Blog Posts
            </h3>
            <p className="text-gray-300 text-sm">
              Read and share interesting blog posts from our community.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <div className="text-4xl mb-2">🔍</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Image Search
            </h3>
            <p className="text-gray-300 text-sm">
              Search and discover beautiful images using Pixabay API.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <div className="text-4xl mb-2">📍</div>
            <h3 className="text-lg font-semibold text-white mb-2">Location</h3>
            <p className="text-gray-300 text-sm">
              Find your current location and explore nearby places.
            </p>
          </div>
        </div>
        <div className="flex justify-center space-x-4">
          <Link
            to="/posts"
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/30 hover:scale-105 font-medium"
          >
            Explore Posts
          </Link>
          <Link
            to="/search"
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/30 hover:scale-105 font-medium"
          >
            Search Images
          </Link>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-white/20 animate-fade-in max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-white mb-2">Recent Posts</h3>
          <p className="text-gray-300">
            Check out what our community is sharing
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {featuredPosts.map((post, index) => (
            <BlogPost
              key={index}
              name={post.name}
              image={post.image}
              text={post.text}
            />
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/posts"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 font-medium inline-flex items-center space-x-2"
          >
            <span>View All Posts</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Community Members Section */}
      <section className="backdrop-blur-lg rounded-xl p-8 shadow-2xl border border-white/20 animate-slide-in-left max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-white mb-2">
            Community Members
          </h3>
          <p className="text-gray-300">
            Connect with amazing people in our community
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <UserCard
            name="Alex Tancredi"
            avatar="https://picsum.photos/200/200?random=10"
            role="Community Manager"
            isOnline={true}
          >
            Passionate about creating amazing digital experiences and connecting
            people through technology. Always excited to help others learn and
            grow! 🚀
          </UserCard>

          <UserCard
            name="Sarah Chen"
            avatar="https://picsum.photos/200/200?random=11"
            role="Content Creator"
            isOnline={false}
          >
            Love sharing creative ideas and inspiring others. Photography,
            design, and storytelling are my passions. Let's create something
            beautiful together! 📸
          </UserCard>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/posts"
            className="bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 font-medium inline-flex items-center space-x-2 shadow-lg hover:shadow-purple-500/25"
          >
            <span>Join the Community</span>
            <span>👥</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
