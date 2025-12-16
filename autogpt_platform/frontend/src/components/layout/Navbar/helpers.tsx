import {
  IconBuilder,
  IconEdit,
  IconLibrary,
  IconLogOut,
  IconMarketplace,
  IconRefresh,
  IconSettings,
  IconSliders,
  IconType,
  IconUploadCloud,
} from "@/components/__legacy__/ui/icons";
import { ChatsIcon, StorefrontIcon } from "@phosphor-icons/react";

type Link = {
  name: string;
  href: string;
};

export const loggedInLinks: Link[] = [
  {
    name: "智能体市场",
    href: "/marketplace",
  },
  {
    name: "资源库",
    href: "/library",
  },
  {
    name: "构建",
    href: "/build",
  },
];

export const loggedOutLinks: Link[] = [
  {
    name: "智能体市场",
    href: "/marketplace",
  },
];

export type MenuItemGroup = {
  groupName?: string;
  items: {
    icon: IconType;
    text: string;
    href?: string;
    onClick?: () => void;
  }[];
};

export const accountMenuItems: MenuItemGroup[] = [
  {
    items: [
      {
        icon: IconType.Edit,
        text: "编辑资料",
        href: "/profile",
      },
    ],
  },
  {
    items: [
      {
        icon: IconType.LayoutDashboard,
        text: "创作者仪表板",
        href: "/profile/dashboard",
      },
      {
        icon: IconType.UploadCloud,
        text: "发布智能体",
      },
    ],
  },
  {
    items: [
      {
        icon: IconType.Settings,
        text: "设置",
        href: "/profile/settings",
      },
    ],
  },
  {
    items: [
      {
        icon: IconType.LogOut,
        text: "退出登录",
      },
    ],
  },
];

export function getAccountMenuItems(userRole?: string): MenuItemGroup[] {
  const baseMenuItems: MenuItemGroup[] = [
    {
      items: [
        {
          icon: IconType.Edit,
          text: "编辑资料",
          href: "/profile",
        },
      ],
    },
    {
      items: [
        {
          icon: IconType.LayoutDashboard,
          text: "创作者仪表板",
          href: "/profile/dashboard",
        },
        {
          icon: IconType.UploadCloud,
          text: "发布智能体",
        },
      ],
    },
  ];

  // Add admin menu item for admin users
  if (userRole === "admin") {
    baseMenuItems.push({
      items: [
        {
          icon: IconType.Sliders,
          text: "管理",
          href: "/admin/marketplace",
        },
      ],
    });
  }

  // Add settings and logout
  baseMenuItems.push(
    {
      items: [
        {
          icon: IconType.Settings,
          text: "设置",
          href: "/profile/settings",
        },
      ],
    },
    {
      items: [
        {
          icon: IconType.LogOut,
          text: "退出登录",
        },
      ],
    },
  );

  return baseMenuItems;
}

export function getAccountMenuOptionIcon(icon: IconType) {
  const iconClass = "size-4";
  switch (icon) {
    case IconType.LayoutDashboard:
      return <StorefrontIcon className={iconClass} />;
    case IconType.UploadCloud:
      return <IconUploadCloud className={iconClass} />;
    case IconType.Edit:
      return <IconEdit className={iconClass} />;
    case IconType.Settings:
      return <IconSettings className={iconClass} />;
    case IconType.LogOut:
      return <IconLogOut className={iconClass} />;
    case IconType.Marketplace:
      return <IconMarketplace className={iconClass} />;
    case IconType.Library:
      return <IconLibrary className={iconClass} />;
    case IconType.Builder:
      return <IconBuilder className={iconClass} />;
    case IconType.Sliders:
      return <IconSliders className={iconClass} />;
    case IconType.Chat:
      return <ChatsIcon className={iconClass} />;
    default:
      return <IconRefresh className={iconClass} />;
  }
}
