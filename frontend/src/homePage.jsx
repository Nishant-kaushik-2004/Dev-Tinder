import { useState } from "react";
import { Heart, MessageCircle, Users, Filter } from "lucide-react";
import { developers } from "./data/mockDevelopers";
import QuickActions from "./components/home-page/quickActions";
import DeveloperCard from "./components/home-page/developerCard";
import FiltersPanel from "./components/home-page/filtersPanel";
import SwipeControls from "./components/home-page/swipeControl";

// Main App Component
const DevTinderApp = () => {
  const [currentDeveloper, setCurrentDeveloper] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});

  const handleSwipe = (direction) => {
    console.log(
      `Swiped ${direction} on ${developers[currentDeveloper].firstName} ${developers[currentDeveloper].lastName}`
    );
    setCurrentDeveloper((prev) => (prev + 1) % developers.length);
  };

  return (
    <div className="min-h-screen bg-base-200 sm:pt-6">
      {/* <Navbar
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
      /> */}

      <FiltersPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        setFilters={setFilters}
      />

      {/* Main Content */}
      <div className="container mx-auto p-4 lg:p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="card-title text-base-content/60 text-sm font-medium">Total Matches</h2>
                  <p className="text-3xl font-bold text-primary">42</p>
                  <p className="text-sm text-success">↗︎ 8 new this week</p>
                </div>
                <div className="text-primary">
                  <Users className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="card-title text-base-content/60 text-sm font-medium">Messages</h2>
                  <p className="text-3xl font-bold text-secondary">15</p>
                  <p className="text-sm text-success">↗︎ 3 unread</p>
                </div>
                <div className="text-secondary">
                  <MessageCircle className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="card-title text-base-content/60 text-sm font-medium">Profile Views</h2>
                  <p className="text-3xl font-bold text-accent">128</p>
                  <p className="text-sm text-success">↗︎ 12 today</p>
                </div>
                <div className="text-accent">
                  <Heart className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="navbar bg-transparent px-0 mb-6">
          <div className="navbar-start">
            <h1 className="text-2xl font-bold text-base-content">Discover Developers</h1>
          </div>
          <div className="navbar-end">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setShowFilters(true)}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Card Stack */}
        <div className="hero min-h-[600px]">
          <div className="">
            <div className="relative">
              {developers.length > 0 && (
                <DeveloperCard
                  developer={developers[currentDeveloper]}
                  onSwipe={handleSwipe}
                />
              )}
              {/* Stack effect - show next card behind */}
              {developers.length > 1 && (
                <div className="absolute top-2 left-2 w-96 h-[550px] rounded-2xl bg-base-100 shadow-lg -z-10 opacity-0 overflow-hidden">
                  <figure className="h-full">
                    <img
                      src={developers[(currentDeveloper + 1) % developers.length].photoUrl}
                      alt="Next developer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-base-content/20"></div>
                  </figure>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Swipe Controls */}
        <SwipeControls onSwipe={handleSwipe} />

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </div>
  );
};

export default DevTinderApp;