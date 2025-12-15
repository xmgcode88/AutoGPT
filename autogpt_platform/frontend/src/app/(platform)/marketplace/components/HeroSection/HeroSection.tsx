"use client";

import { FilterChips } from "../FilterChips/FilterChips";
import { SearchBar } from "../SearchBar/SearchBar";
import { useHeroSection } from "./useHeroSection";

export const HeroSection = () => {
  const { onFilterChange, searchTerms } = useHeroSection();
  return (
    <div className="mb-2 mt-8 flex flex-col items-center justify-center px-4 sm:mb-4 sm:mt-12 sm:px-6 md:mb-6 md:mt-16 lg:my-24 lg:px-8 xl:my-16">
      <div className="w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl">
        <div className="mb-4 text-center md:mb-8">
          <h1 className="text-center">
            <span className="font-poppins text-[48px] font-semibold leading-[54px] text-neutral-950 dark:text-neutral-50">
              探索为{" "}
            </span>
            <span className="font-poppins text-[48px] font-semibold leading-[54px] text-violet-600">
              你
            </span>
            <span className="font-poppins text-[48px] font-semibold leading-[54px] text-neutral-950 dark:text-neutral-50">
              打造的 AI 智能体
            </span>
            <br />
            <span className="font-poppins text-[48px] font-semibold leading-[54px] text-neutral-950 dark:text-neutral-50">
              来自{" "}
            </span>
            <span className="font-poppins text-[48px] font-semibold leading-[54px] text-blue-500">
              社区
            </span>
          </h1>
        </div>
        <h3 className="mb:text-2xl mb-6 text-center font-sans text-xl font-normal leading-loose text-neutral-700 dark:text-neutral-300 md:mb-12">
          汇聚来自世界各地创作者的灵感，为你带来精心设计的 AI 智能体
        </h3>
        <div className="mb-4 flex justify-center sm:mb-5">
          <SearchBar height="h-[74px]" />
        </div>
        <div>
          <div className="flex justify-center">
            <FilterChips
              badges={searchTerms}
              onFilterChange={onFilterChange}
              multiSelect={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
