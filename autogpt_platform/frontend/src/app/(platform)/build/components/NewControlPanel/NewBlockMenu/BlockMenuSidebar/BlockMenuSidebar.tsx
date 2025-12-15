import React from "react";
import { MenuItem } from "../MenuItem";
import { useBlockMenuSidebar } from "./useBlockMenuSidebar";
import { Skeleton } from "@/components/__legacy__/ui/skeleton";
import { ErrorCard } from "@/components/molecules/ErrorCard/ErrorCard";
import { useBlockMenuStore } from "../../../../stores/blockMenuStore";
import { DefaultStateType } from "../types";
import { BUILDER_ERROR_CARD_I18N } from "@/app/(platform)/build/i18n";

export const BlockMenuSidebar = () => {
  const { data, setDefaultState, defaultState, isLoading, isError, error } =
    useBlockMenuSidebar();
  const { setIntegration } = useBlockMenuStore();
  if (isLoading) {
    return (
      <div className="w-fit space-y-2 px-4 pt-4">
        <Skeleton className="h-12 w-[12.875rem]" />
        <Skeleton className="h-12 w-[12.875rem]" />
        <Skeleton className="h-12 w-[12.875rem]" />
        <Skeleton className="h-12 w-[12.875rem]" />
        <Skeleton className="h-12 w-[12.875rem]" />
        <Skeleton className="h-12 w-[12.875rem]" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="w-fit space-y-2 px-4 pt-4">
        <ErrorCard
          className="w-[12.875rem]"
          isSuccess={false}
          responseError={error || undefined}
          i18n={BUILDER_ERROR_CARD_I18N}
          context="模块菜单"
          httpError={{
            status: data?.status,
            statusText: "服务器内部错误",
            message: (error?.detail as string) || "发生错误",
          }}
        />
      </div>
    );
  }

  const blockCounts = data?.blockCounts;

  const topLevelMenuItems = [
    {
      name: "推荐",
      type: "suggestion",
    },
    {
      name: "全部模块",
      type: "all_blocks",
      number: blockCounts?.all_blocks,
    },
  ];

  const subMenuItems = [
    {
      name: "输入模块",
      type: "input_blocks",
      number: blockCounts?.input_blocks,
    },
    {
      name: "动作模块",
      type: "action_blocks",
      number: blockCounts?.action_blocks,
    },
    {
      name: "输出模块",
      type: "output_blocks",
      number: blockCounts?.output_blocks,
    },
  ];

  const bottomMenuItems = [
    {
      name: "集成",
      type: "integrations",
      number: blockCounts?.integrations,
      onClick: () => {
        setDefaultState(DefaultStateType.INTEGRATIONS);
        setIntegration(undefined);
      },
    },
    {
      name: "市场智能体",
      type: "marketplace_agents",
      number: blockCounts?.marketplace_agents,
    },
    {
      name: "我的智能体",
      type: "my_agents",
      number: blockCounts?.my_agents,
    },
  ];

  return (
    <div className="w-fit space-y-2 px-4 pt-4">
      {topLevelMenuItems.map((item) => (
        <MenuItem
          key={item.type}
          name={item.name}
          number={item.number}
          selected={defaultState === item.type}
          onClick={() => setDefaultState(item.type as DefaultStateType)}
        />
      ))}
      <div className="ml-[0.5365rem] space-y-2 border-l border-black/10 pl-[0.75rem]">
        {subMenuItems.map((item) => (
          <MenuItem
            key={item.type}
            name={item.name}
            number={item.number}
            className="max-w-[11.5339rem]"
            selected={defaultState === item.type}
            onClick={() => setDefaultState(item.type as DefaultStateType)}
          />
        ))}
      </div>
      {bottomMenuItems.map((item) => (
        <MenuItem
          key={item.type}
          name={item.name}
          number={item.number}
          selected={defaultState === item.type}
          onClick={
            item.onClick ||
            (() => setDefaultState(item.type as DefaultStateType))
          }
        />
      ))}
    </div>
  );
};
