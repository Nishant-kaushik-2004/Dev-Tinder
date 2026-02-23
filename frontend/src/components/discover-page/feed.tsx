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
import { AxiosError } from "axios";
import StatsCardsSkeleton from "./StatsCardsSkeleton";
import DeveloperCardSkeleton from "./DeveloperCardSkeleton";
import NoDevelopersFallback from "./NoDevelopersFallback";
import StatsCard from "./StatCard";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import api from "../../utils/api";

//💡🚀 Pages may render early, but data fetching waits until authChecked === true and user !== null.
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
  const [isPrefetching, setIsPrefetching] = useState(false);
  const [hasMoreDevelopers, setHasMoreDevelopers] = useState(true);

  const { authChecked, user } = useSelector((state: RootState) => state.auth);

  const fetchDevelopers = async (append: boolean = false) => {
    setIsDevelopersLoading(true);
    try {
      const res = await api.get<IFetchDevelopersResponse>("/feed", {
        params: {
          page,
          limit: 10,
          ...appliedFilters,
        },
      });
      if (!res.data.developers) {
        throw new Error("No developers found");
      }

      // If append is true, we add to the existing list from page 2 fetched data. Otherwise, we replace it.
      if (append) {
        setDevelopers((prev) => [
          ...(prev || []),
          ...(res.data.developers || []),
        ]);
      } else {
        setDevelopers(res.data.developers || []);
      }

      setHasMoreDevelopers(res.data.pagination.hasMore);
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
    if (!authChecked || !user) return;

    fetchDevelopers();
  }, [authChecked, user, appliedFilters, page]);

  // Prefetch next page of developers when user is about to swipe the last 2 cards
  useEffect(() => {
    if (!developers) return;
    if (!hasMoreDevelopers) return; // 🔥 important
    // Do not prefetch if initial list has 2 or less
    if (developers.length <= 2) return;

    const remaining = developers.length - currentDeveloper - 1;

    // If 2 cards left and not already prefetching
    if (remaining === 2 && !isPrefetching) {
      setIsPrefetching(true);

      const nextPage = page + 1;

      api
        .get<IFetchDevelopersResponse>("/feed", {
          params: {
            page: nextPage,
            limit: 3,
            ...appliedFilters,
          },
        })
        .then((res) => {
          if (res.data.developers?.length) {
            setDevelopers((prev) => [...(prev || []), ...res.data.developers]);
          }
          setHasMoreDevelopers(res.data.pagination.hasMore);
          setPage(nextPage);
          console.log(res.data.developers);
        })
        .catch((err) => {
          console.error("Prefetch failed:", err);
        })
        .finally(() => {
          setIsPrefetching(false);
        });
    }
  }, [currentDeveloper]);

  // Fetch feed stats on component mount and when user changes
  useEffect(() => {
    if (!authChecked || !user) return;

    const fetchProfileStats = async () => {
      setIsStatLoading(true);
      try {
        const res = await api.get<IFetchFeedStatsResponse>("/feed/stats");

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
  }, [authChecked, user]);

  const handleApplyFilters = () => {
    setPage(1); // reset pagination
    setAppliedFilters(draftFilters);
  };

  const handleClearFilters = () => {
    setDraftFilters({});
    setAppliedFilters({});
    setPage(1);
  };

  // param direction - "left" for ignore, "right" for interested
  // returns Promise that resolves when the request is complete
  const handleLeftRightSwipe = async (
    direction: "left" | "right",
  ): Promise<void> => {
    if (!developers || developers.length === 0) {
      console.warn("No developers available to swipe");
      return;
    }

    const currentUser = developers[currentDeveloper];

    if (!currentUser || !currentUser._id) {
      console.error("Invalid developer data");
      return;
    }

    const toUserId = currentUser._id;
    const status = direction === "right" ? "interested" : "ignored";

    try {
      // Make POST request to backend
      const response = await api.post(`/requests/send/${toUserId}`, { status });

      console.log(
        `Successfully ${status} ${currentUser.firstName} ${currentUser.lastName}`,
        // response.data,
      );

      // Move to next developer
      setCurrentDeveloper((prev) => prev + 1);

      // TODO: Show success toast notification
      // toast.success(`${direction === "right" ? "Match request sent!" : "Profile ignored"}`);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error(
        "Swipe action failed:",
        axiosError.response?.data?.message || axiosError.message,
      );

      // TODO: Show error toast notification
      // toast.error(axiosError.response?.data?.message || "Failed to process swipe. Please try again.");
    }
  };

  const handleSwipe = (direction: "left" | "right"): void => {
    if (
      !developers ||
      developers.length === 0 ||
      currentDeveloper >= developers.length
    )
      return;
    // setCurrentDeveloper((prev) => (prev + 1) % developers.length || 0);
    handleLeftRightSwipe(direction);
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
            ) : developers &&
              developers.length > 0 &&
              currentDeveloper < developers.length ? (
              <>
                <DeveloperCard
                  developer={developers[currentDeveloper]}
                  onSwipe={handleSwipe}
                />
                {developers.length > currentDeveloper + 1 && (
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
              <NoDevelopersFallback
                onRefresh={() => {
                  setPage(1);
                  setCurrentDeveloper(0);
                  setHasMoreDevelopers(true);
                  fetchDevelopers();
                }}
              />
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
