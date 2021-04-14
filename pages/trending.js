import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import _ from "lodash";
import Layout from "../components/layout";
import backend from "../lib/backend";
import AppContext from "../context/app-context";
import mixpanel from "mixpanel-browser";
import { GridTab, GridTabs } from "../components/GridTabs";
import CappedWidth from "../components/CappedWidth";
import TokenGridV4 from "../components/TokenGridV4";
import TrendingCreators from "../components/TrendingCreators";

// how many leaders to show on first load
const LEADERBOARD_LIMIT = 10;

export async function getServerSideProps() {
  return {
    props: {},
  };
}

const Leaderboard = () => {
  const context = useContext(AppContext);
  useEffect(() => {
    // Wait for identity to resolve before recording the view
    if (typeof context.user !== "undefined") {
      mixpanel.track("Leaderboard page view");
    }
  }, [typeof context.user]);

  const [leaderboardItems, setLeaderboardItems] = useState([]);
  const [leaderboardDays, setLeaderboardDays] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [showAllLeaderboardItems, setShowAllLeaderboardItems] = useState(false);

  useEffect(() => {
    const getFeatured = async () => {
      setIsLoading(true);
      setShowAllLeaderboardItems(false);
      const result = await backend.get(
        `/v1/leaderboard?days=${leaderboardDays}`
      );
      const data = result?.data?.data;
      setLeaderboardItems(data);
      setIsLoading(false);

      // Reset cache for next load
      backend.get(`/v1/leaderboard?days=${leaderboardDays}&recache=1`);
    };
    getFeatured();
  }, [leaderboardDays]);

  const shownLeaderboardItems = showAllLeaderboardItems
    ? leaderboardItems.slice(0, 20)
    : leaderboardItems.slice(0, LEADERBOARD_LIMIT);

  useEffect(() => {
    const getFeatured = async () => {
      setIsLoadingCards(true);

      const response_featured = await backend.get(
        `/v2/featured?limit=150&days=${leaderboardDays}`
      );
      const data_featured = response_featured.data.data;
      setFeaturedItems(data_featured);
      setIsLoadingCards(false);
    };
    getFeatured();
  }, [leaderboardDays]);

  return (
    <Layout>
      <Head>
        <title>Trending</title>
        <meta name="description" content="Trending creators & items" />
        <meta property="og:type" content="website" />
        <meta name="og:description" content="Trending art & creators" />
        <meta
          property="og:image"
          content="https://storage.googleapis.com/showtime-nft-thumbnails/trending_og_card.jpg"
        />
        <meta name="og:title" content="Showtime | Trending" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Showtime | Trending Art & Creators"
        />
        <meta name="twitter:description" content="Trending" />
        <meta
          name="twitter:image"
          content="https://storage.googleapis.com/showtime-nft-thumbnails/trending_twitter_card2.jpg"
        />
      </Head>

      <div className="py-12 sm:py-14 px-8 sm:px-10 text-left  bg-gradient-to-r from-green-400 to-blue-500">
        <CappedWidth>
          <div className="flex flex-row mx-3 text-white">
            <div className="flex-1">
              <div className="text-xl sm:text-2xl">Art & Creators</div>
              <div
                className="text-3xl sm:text-6xl"
                style={{ fontFamily: "Afronaut", textTransform: "capitalize" }}
              >
                Trending
              </div>
              <div className="text-3xl sm:text-6xl">On Showtime</div>
            </div>
          </div>
        </CappedWidth>
      </div>
      <CappedWidth>
        <div className="mt-12">
          <GridTabs title="">
            <GridTab
              label="24 Hours"
              isActive={leaderboardDays === 1}
              onClickTab={() => {
                setLeaderboardDays(1);
              }}
            />
            <GridTab
              label="7 Days"
              isActive={leaderboardDays === 7}
              onClickTab={() => {
                setLeaderboardDays(7);
              }}
            />
            <GridTab
              label="30 Days"
              isActive={leaderboardDays === 30}
              onClickTab={() => {
                setLeaderboardDays(30);
              }}
            />
          </GridTabs>
        </div>
        <div className="md:grid md:grid-cols-3 xl:grid-cols-4 ">
          {/* Mobile on top */}
          <div className="block sm:hidden">
            {leaderboardItems && (
              <TrendingCreators
                shownLeaderboardItems={shownLeaderboardItems}
                isLoading={isLoading}
                showAllLeaderboardItems={showAllLeaderboardItems}
                setShowAllLeaderboardItems={setShowAllLeaderboardItems}
              />
            )}
          </div>

          <div className="col-span-2 md:col-span-2 xl:col-span-3">
            <TokenGridV4 items={featuredItems} isLoading={isLoadingCards} />
          </div>
          {/* Desktop right column */}
          <div className="hidden sm:block sm:px-3">
            {leaderboardItems && (
              <TrendingCreators
                shownLeaderboardItems={shownLeaderboardItems}
                isLoading={isLoading}
                showAllLeaderboardItems={showAllLeaderboardItems}
                setShowAllLeaderboardItems={setShowAllLeaderboardItems}
              />
            )}
          </div>
        </div>
      </CappedWidth>
    </Layout>
  );
};

export default Leaderboard;
