import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import SinglePost from "./components/SinglePost";
import UserCard from "./components/UserCard";
import ImageSearch from "./components/ImageSearch";
import ImageDetail from "./components/ImageDetail";
import ErrorBoundary from "./components/ErrorBoundary";
import SprocketStrip from "./components/SprocketStrip";

// Load the map (Leaflet) only when the location route is visited.
const Geolocation = lazy(() => import("./components/Geolocation"));

interface PageHeaderProps {
  index: string;
  title: string;
  subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ index, title, subtitle }) => (
  <header className="mb-8">
    <div className="flex items-baseline gap-3">
      <h2 className="font-display text-3xl uppercase tracking-[0.03em] text-paper md:text-4xl">
        {title}
      </h2>
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold">
        {index}
      </span>
    </div>
    {subtitle && (
      <p className="mt-2 font-mono text-xs uppercase tracking-[0.15em] text-muted">
        {subtitle}
      </p>
    )}
    <SprocketStrip className="mt-4" />
  </header>
);

function App() {
  return (
    <BrowserRouter>
      <NuqsAdapter>
        <ErrorBoundary>
          <div className="min-h-screen bg-dark">
            <Navbar />
            <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/search"
                  element={
                    <section className="animate-fade-in">
                      <PageHeader
                        index="EXH. 02"
                        title="Image Search"
                        subtitle="Query the Pixabay archive"
                      />
                      <ImageSearch />
                    </section>
                  }
                />
                <Route
                  path="/posts"
                  element={
                    <section className="animate-fade-in">
                      <PageHeader
                        index="EXH. 03"
                        title="Blog Posts"
                        subtitle="Community contact sheet"
                      />
                      <SinglePost />
                    </section>
                  }
                />
                <Route
                  path="/location"
                  element={
                    <section className="animate-fade-in">
                      <PageHeader
                        index="EXH. 04"
                        title="Location"
                        subtitle="Geolocation darkroom"
                      />
                      <Suspense
                        fallback={
                          <div className="flex justify-center py-16">
                            <div className="h-10 w-10 animate-spin rounded-full border-2 border-line border-t-safelight" />
                          </div>
                        }
                      >
                        <Geolocation />
                      </Suspense>
                    </section>
                  }
                />
                <Route
                  path="/image/:id"
                  element={
                    <section className="animate-fade-in">
                      <ImageDetail />
                    </section>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <section className="animate-fade-in">
                      <PageHeader
                        index="EXH. 05"
                        title="Profile"
                        subtitle="Member record"
                      />
                      <UserCard>
                        <p className="text-sm leading-relaxed text-muted">
                          This is some user content.
                        </p>
                      </UserCard>
                    </section>
                  }
                />
              </Routes>
            </main>
          </div>
        </ErrorBoundary>
      </NuqsAdapter>
    </BrowserRouter>
  );
}

export default App;
