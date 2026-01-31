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


export interface Ithemes {
  value: string;
  label: string;
}

// All themes
export const themes: Ithemes[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "cupcake", label: "Cupcake" },
  { value: "bumblebee", label: "Bumblebee" },
  { value: "emerald", label: "Emerald" },
  { value: "corporate", label: "Corporate" },
  { value: "synthwave", label: "Synthwave" },
  { value: "retro", label: "Retro" },
  { value: "cyberpunk", label: "Cyberpunk" },
  { value: "valentine", label: "Valentine" },
  { value: "halloween", label: "Halloween" },
  { value: "garden", label: "Garden" },
  { value: "forest", label: "Forest" },
  { value: "aqua", label: "Aqua" },
  { value: "lofi", label: "Lofi" },
  { value: "pastel", label: "Pastel" },
  { value: "fantasy", label: "Fantasy" },
  { value: "wireframe", label: "Wireframe" },
  { value: "black", label: "Black" },
  { value: "luxury", label: "Luxury" },
  { value: "dracula", label: "Dracula" },
  { value: "cmyk", label: "Cmyk" },
  { value: "autumn", label: "Autumn" },
  { value: "business", label: "Business" },
  { value: "acid", label: "Acid" },
  { value: "lemonade", label: "Lemonade" },
  { value: "night", label: "Night" },
  { value: "coffee", label: "Coffee" },
  { value: "winter", label: "Winter" },
  { value: "dim", label: "Dim" },
  { value: "nord", label: "Nord" },
  { value: "sunset", label: "Sunset" },
  { value: "abyss", label: "Abyss" },
  { value: "caramellatte", label: "Caramellatte" },
  { value: "silk", label: "Silk" },
];


export const notificationsList = [
  { title: "New Match!", message: "You matched with Sarah Chen" },
  { title: "Message Received", message: "Alex sent you a message" },
  { title: "Profile View", message: "Emily viewed your profile" },
  { title: "Profile View", message: "Emily viewed your profile" },
  { title: "Profile View", message: "Emily viewed your profile" },
  { title: "Profile View", message: "Emily viewed your profile" },
  { title: "Profile View", message: "Emily viewed your profile" },
  { title: "Profile View", message: "Emily viewed your profile" },
  { title: "Profile View", message: "Emily viewed your profile" },
  { title: "Profile View", message: "Emily viewed your profile" },
  { title: "Profile View", message: "Emily viewed your profile" },
  { title: "Profile View", message: "Emily viewed your profile" },
  { title: "Profile View", message: "Emily viewed your profile" },
  { title: "Profile View", message: "Emily viewed your profile" },
  { title: "Profile View", message: "Emily viewed your profile" },
  { title: "Profile View", message: "Emily viewed your profile" },
  { title: "Profile View", message: "Emily viewed your profile" },
  { title: "Profile View", message: "Emily viewed your profile" },
];