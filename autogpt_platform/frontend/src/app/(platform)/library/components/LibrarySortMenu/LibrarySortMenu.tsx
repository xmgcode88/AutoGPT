"use client";
import { ArrowDownNarrowWideIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/__legacy__/ui/select";
import { LibraryAgentSort } from "@/app/api/__generated__/models/libraryAgentSort";
import { useLibrarySortMenu } from "./useLibrarySortMenu";

export default function LibrarySortMenu(): React.ReactNode {
  const { handleSortChange } = useLibrarySortMenu();
  return (
    <div className="flex items-center" data-testid="sort-by-dropdown">
      <span className="hidden whitespace-nowrap sm:inline">排序</span>
      <Select onValueChange={handleSortChange}>
        <SelectTrigger className="ml-1 w-fit space-x-1 border-none px-0 text-base underline underline-offset-4 shadow-none">
          <ArrowDownNarrowWideIcon className="h-4 w-4 sm:hidden" />
          <SelectValue placeholder="最近修改" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={LibraryAgentSort.createdAt}>创建时间</SelectItem>
            <SelectItem value={LibraryAgentSort.updatedAt}>最近修改</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
