import { Sidebar } from "@/components/__legacy__/Sidebar";
import { Users, DollarSign, UserSearch, FileText } from "lucide-react";

import { IconSliders } from "@/components/__legacy__/ui/icons";

const sidebarLinkGroups = [
  {
    links: [
      {
        text: "市场管理",
        href: "/admin/marketplace",
        icon: <Users className="h-6 w-6" />,
      },
      {
        text: "用户消费",
        href: "/admin/spending",
        icon: <DollarSign className="h-6 w-6" />,
      },
      {
        text: "用户模拟",
        href: "/admin/impersonation",
        icon: <UserSearch className="h-6 w-6" />,
      },
      {
        text: "执行分析",
        href: "/admin/execution-analytics",
        icon: <FileText className="h-6 w-6" />,
      },
      {
        text: "管理员用户管理",
        href: "/admin/settings",
        icon: <IconSliders className="h-6 w-6" />,
      },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      <Sidebar linkGroups={sidebarLinkGroups} />
      <div className="flex-1 pl-4">{children}</div>
    </div>
  );
}
