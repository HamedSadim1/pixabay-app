import React from "react";
import { Link } from "react-router-dom";
import BlogPost from "./BlogPost";
import UserCard from "./UserCard";
import Frame from "./Frame";
import SprocketStrip from "./SprocketStrip";
import Icon from "./Icon";
import { buttonClasses } from "../constants/buttonStyles";
import type { IconName } from "../constants/icons";
import { PATHS } from "../constants/routes";

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

  const features: {
    icon: IconName;
    title: string;
    description: string;
    to: string;
  }[] = [
    {
      icon: "pen",
      title: "Blog Posts",
      description: "Read and share stories from the community.",
      to: PATHS.posts,
    },
    {
      icon: "search",
      title: "Image Search",
      description: "Query the Pixabay archive by keyword and filter.",
      to: PATHS.search,
    },
    {
      icon: "location",
      title: "Location",
      description: "Find your position with the geolocation service.",
      to: PATHS.location,
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="animate-fade-in">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-2 w-2 bg-safelight" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-safelight">
            Darkroom / Contact Sheet
          </span>
        </div>
        <h1 className="max-w-3xl font-display text-4xl font-semibold uppercase leading-[1.05] tracking-[0.02em] text-paper md:text-6xl">
          Discover, share &amp; explore the{" "}
          <span className="text-safelight">Pixabay App</span>
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted">
          Search stunning images, read community posts, and explore your
          location — all inside one warm, low-light darkroom.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to={PATHS.search} className={buttonClasses("primary")}>
            <Icon name="search" /> Search Images
          </Link>
          <Link to={PATHS.posts} className={buttonClasses("default")}>
            <Icon name="pen" /> Explore Posts
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid gap-4 md:grid-cols-3">
        {features.map((feature, index) => (
          <Link key={feature.title} to={feature.to} className="group block">
            <Frame
              frame={`FRAME/0${index + 1}`}
              className="h-full transition-colors group-hover:border-gold"
            >
              <div className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center border border-line text-safelight transition-colors group-hover:border-gold group-hover:text-gold">
                  <Icon name={feature.icon} />
                </div>
                <h2 className="mb-1 font-display text-lg uppercase tracking-[0.03em] text-paper">
                  {feature.title}
                </h2>
                <p className="text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>
              </div>
            </Frame>
          </Link>
        ))}
      </section>

      {/* Featured Posts */}
      <section>
        <SprocketStrip label="Recent Activity" className="mb-6" />
        <div className="space-y-3">
          {featuredPosts.map((post, index) => (
            <BlogPost
              key={index}
              frame={`#${String(index + 1).padStart(3, "0")}`}
              name={post.name}
              image={post.image}
              text={post.text}
            />
          ))}
        </div>
        <div className="mt-5">
          <Link to={PATHS.posts} className={buttonClasses("default")}>
            View All Posts <Icon name="arrowRight" />
          </Link>
        </div>
      </section>

      {/* Community Members */}
      <section>
        <SprocketStrip label="Community Members" className="mb-6" />
        <div className="grid gap-4 md:grid-cols-2">
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
      </section>
    </div>
  );
};

export default Home;
