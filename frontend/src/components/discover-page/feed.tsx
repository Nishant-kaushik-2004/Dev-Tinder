import { useEffect, useState } from "react";
import { Heart, MessageCircle, Users, Filter } from "lucide-react";
import QuickActions from "./quickActions";
import DeveloperCard from "./developerCard";
import FiltersPanel from "./filtersPanel";
import SwipeControls from "./swipeControl";
import {
  FeedStats,
  IFetchDevelopersResponse,
  IFetchFeedStatsResponse,
  IFilter,
  IUserInfo,
} from "../../utils/types";
import axios, { AxiosError } from "axios";
import StatsCardsSkeleton from "./StatsCardsSkeleton";
import DeveloperCardSkeleton from "./DeveloperCardSkeleton";
import NoDevelopersFallback from "./NoDevelopersFallback";
import StatsCard from "./StatCard";

// Main devTinder App Component
const Feed = () => {
  const [currentDeveloper, setCurrentDeveloper] = useState(0);
  const [developers, setDevelopers] = useState<IUserInfo[] | null>(null);
  const [stats, setStats] = useState<FeedStats | null>(null);
  const [isStatLoading, setIsStatLoading] = useState(true);
  const [isDevelopersLoading, setIsDevelopersLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [draftFilters, setDraftFilters] = useState<IFilter>({});
  const [appliedFilters, setAppliedFilters] = useState<IFilter>({});
  const [page, setPage] = useState(1);

  const fetchDevelopers = async () => {
    setIsDevelopersLoading(true);
    try {
      const res = await axios.get<IFetchDevelopersResponse>(
        `${import.meta.env.VITE_BACKEND_URL}/feed`,
        {
          withCredentials: true,
          params: {
            page,
            limit: 10,
            ...appliedFilters,
          },
        },
      );
      if (!res.data.developers) {
        throw new Error("No developers found");
      }

      setDevelopers(res.data.developers || []);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error(
        "Fetching developers failed:",
        axiosError.response?.data?.message || axiosError.message,
      );

      // toast / alert
      // toast.error("Something went wrong. Please try again.");
    } finally {
      setIsDevelopersLoading(false);
    }
  };

  // Fetch developers on component mount
  useEffect(() => {
    fetchDevelopers();
  }, [appliedFilters, page]);

  useEffect(() => {
    const fetchProfileStats = async () => {
      setIsStatLoading(true);
      try {
        const res = await axios.get<IFetchFeedStatsResponse>(
          `${import.meta.env.VITE_BACKEND_URL}/feed/stats`,
          { withCredentials: true },
        );

        setStats(res.data.stats);
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        console.error(
          "Fetching feed stats failed:",
          axiosError.response?.data?.message || axiosError.message,
        );

        // toast / alert
        // toast.error("Something went wrong. Please try again.");
      } finally {
        setIsStatLoading(false);
      }
    };

    fetchProfileStats();
  }, []);

  const handleApplyFilters = () => {
    setPage(1); // reset pagination
    setAppliedFilters(draftFilters);
  };

  const handleClearFilters = () => {
    setDraftFilters({});
    setAppliedFilters({});
    setPage(1);
  };

  const handleSwipe = (direction: "left" | "right"): void => {
    if (!developers || developers.length === 0) return;
    console.log(
      `Swiped ${direction} on ${developers[currentDeveloper].firstName} ${developers[currentDeveloper].lastName}`,
    );
    setCurrentDeveloper((prev) => (prev + 1) % developers.length || 0);
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
        draftFilters={draftFilters}
        setDraftFilters={setDraftFilters}
        appliedFilters={appliedFilters}
        handleApplyFilters={handleApplyFilters}
        handleClearFilters={handleClearFilters}
      />

      {/* Main Content */}
      <div className="container mx-auto p-4 lg:p-8">
        {/* Stats Cards */}
        {isStatLoading ? (
          <StatsCardsSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatsCard
              title="Total Matches"
              value={stats?.matches.totalMatches ?? 0}
              deltaText={`${
                stats?.matches.newMatchesThisWeek ?? 0
              } new this week`}
              accentClass="text-primary"
              icon={<Users className="w-8 h-8" />}
            />

            <StatsCard
              title="Messages"
              value={stats?.messages.totalMessages ?? 0}
              deltaText={`${
                stats?.messages.newMessagesThisWeek ?? 0
              } new this week`}
              accentClass="text-secondary"
              icon={<MessageCircle className="w-8 h-8" />}
            />

            <StatsCard
              title="Profile Views"
              value={stats?.views.totalViews ?? 0}
              deltaText={`${stats?.views.newViewsToday ?? 0} today`}
              accentClass="text-accent"
              icon={<Heart className="w-8 h-8" />}
            />
          </div>
        )}

        {/* Filter Controls */}
        <div className="navbar bg-transparent px-0 mb-6">
          <div className="navbar-start">
            <h1 className="text-2xl font-bold text-base-content">
              Discover Developers
            </h1>
          </div>
          <div className="navbar-end">
            <button
              id="filterBtn"
              className="btn btn-outline btn-sm"
              onClick={() => setShowFilters(true)}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Card Stack */}
        <div className="hero min-h-[500px]">
          <div className="relative">
            {isDevelopersLoading ? (
              <>
                <DeveloperCardSkeleton />
                {/* <DeveloperCardStackSkeleton /> */}
              </>
            ) : developers && developers.length > 0 ? (
              <>
                <DeveloperCard
                  developer={developers[currentDeveloper]}
                  onSwipe={handleSwipe}
                />
                {developers.length > 1 && (
                  <div className="absolute top-2 left-2 w-96 h-[550px] rounded-2xl bg-base-100 shadow-lg -z-10 opacity-0 overflow-hidden">
                    <figure className="h-full">
                      <img
                        src={
                          developers[(currentDeveloper + 1) % developers.length]
                            .photoUrl
                        }
                        alt="Next developer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-base-content/20"></div>
                    </figure>
                  </div>
                )}
              </>
            ) : (
              <NoDevelopersFallback onRefresh={() => fetchDevelopers()} />
            )}
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

export default Feed;
