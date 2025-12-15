import { Metadata } from "next";
import { Suspense } from "react";
import {
  prefetchGetV2ListStoreAgentsQuery,
  prefetchGetV2ListStoreCreatorsQuery,
} from "@/app/api/__generated__/endpoints/store/store";
import { getQueryClient } from "@/lib/react-query/queryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { MainMarkeplacePage } from "./components/MainMarketplacePage/MainMarketplacePage";
import { MainMarketplacePageLoading } from "./components/MainMarketplacePageLoading";

export const dynamic = "force-dynamic";

// FIX: Correct metadata
export const metadata: Metadata = {
  title: "智能体市场 - AutoGPT Platform",
  description: "发现并使用由社区创建的 AI 智能体",
  applicationName: "AutoGPT 智能体市场",
  authors: [{ name: "AutoGPT Team" }],
  keywords: [
    "智能体",
    "智能体市场",
    "自动化",
    "人工智能",
    "AI agents",
    "automation",
    "artificial intelligence",
    "AutoGPT",
    "marketplace",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "智能体市场 - AutoGPT Platform",
    description: "发现并使用由社区创建的 AI 智能体",
    type: "website",
    siteName: "AutoGPT 智能体市场",
    images: [
      {
        url: "/images/store-og.png",
        width: 1200,
        height: 630,
        alt: "AutoGPT 智能体市场",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "智能体市场 - AutoGPT Platform",
    description: "发现并使用由社区创建的 AI 智能体",
    images: ["/images/store-twitter.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default async function MarketplacePage(): Promise<React.ReactElement> {
  const queryClient = getQueryClient();

  // Prefetch all data on server with proper caching
  await Promise.all([
    prefetchGetV2ListStoreAgentsQuery(
      queryClient,
      { featured: true },
      {
        query: {
          staleTime: 60 * 1000, // 60 seconds
          gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
        },
      },
    ),
    prefetchGetV2ListStoreAgentsQuery(
      queryClient,
      { sorted_by: "runs", page_size: 1000 },
      {
        query: {
          staleTime: 60 * 1000, // 60 seconds
          gcTime: 5 * 60 * 1000, // 5 minutes
        },
      },
    ),
    prefetchGetV2ListStoreCreatorsQuery(
      queryClient,
      { featured: true, sorted_by: "num_agents" },
      {
        query: {
          staleTime: 60 * 1000, // 60 seconds
          gcTime: 5 * 60 * 1000, // 5 minutes
        },
      },
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<MainMarketplacePageLoading />}>
        <MainMarkeplacePage />
      </Suspense>
    </HydrationBoundary>
  );
}
