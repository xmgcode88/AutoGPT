"use client";

import * as React from "react";
import { Sidebar } from "@/components/__legacy__/Sidebar";
import {
  IconDashboardLayout,
  IconIntegrations,
  IconProfile,
  IconSliders,
  IconCoin,
} from "@/components/__legacy__/ui/icons";
import { KeyIcon } from "lucide-react";
import { useGetFlag, Flag } from "@/services/feature-flags/use-get-flag";

export default function Layout({ children }: { children: React.ReactNode }) {
  const isPaymentEnabled = useGetFlag(Flag.ENABLE_PLATFORM_PAYMENT);

  const sidebarLinkGroups = [
    {
      links: [
        {
          text: "创建者仪表板",
          href: "/profile/dashboard",
          icon: <IconDashboardLayout className="h-6 w-6" />,
        },
        ...(isPaymentEnabled
          ? [
              {
                text: "账单",
                href: "/profile/credits",
                icon: <IconCoin className="h-6 w-6" />,
              },
            ]
          : []),
        {
          text: "集成",
          href: "/profile/integrations",
          icon: <IconIntegrations className="h-6 w-6" />,
        },
        {
          text: "API密钥",
          href: "/profile/api_keys",
          icon: <KeyIcon className="h-6 w-6" />,
        },
        {
          text: "个人资料",
          href: "/profile",
          icon: <IconProfile className="h-6 w-6" />,
        },
        {
          text: "设置",
          href: "/profile/settings",
          icon: <IconSliders className="h-6 w-6" />,
        },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen w-full max-w-[1360px] flex-col lg:flex-row">
      <Sidebar linkGroups={sidebarLinkGroups} />
      <div className="flex-1 pl-4">{children}</div>
    </div>
  );
}
