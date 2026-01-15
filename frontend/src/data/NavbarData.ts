import {
  Code,
  LucideGitPullRequestDraft,
  MessageCircle,
  Users,
} from "lucide-react";

export interface MenuRoute {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const menuRoutes: MenuRoute[] = [
  {
    path: "/",
    label: "Discover",
    icon: Code,
  },
  {
    path: "/matches",
    label: "Matches",
    icon: Users,
  },
  {
    path: "/requests",
    label: "Requests",
    icon: LucideGitPullRequestDraft,
  },
  {
    path: "/messages",
    label: "Messages",
    icon: MessageCircle,
  },
];
