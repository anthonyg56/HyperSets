import { NotificationsFormSchema } from "@/lib/schemas";
import { FieldPath } from "react-hook-form";

export type NotificationsFieldData = {
  name: FieldPath<NotificationsFormSchema>;
  label: string;
  description: string;
}

export type NotificationsFieldDataGroup = {
  [key: string]: NotificationsFieldData[];
}

export const notificationsFieldDataGroup: NotificationsFieldDataGroup = {
  general: [{
    name: "push",
    label: "Push Notifications",
    description: "Receive notifications about new interactions on presets, features, and more.",
  },
  {
    name: "email",
    label: "Email Notifications",
    description: "Receive notifications about new interactions on presets, features, and more via email.",
  }],
  interactions: [{
    name: "comments",
    label: "Comments",
    description: "Receive notifications about new interactions on presets, features, and more.",
  },
  {
    name: "downloads",
    label: "Downloads",
    description: "Receive notifications about new interactions on presets, features, and more.",
  },
  {
    name: "likes",
    label: "Likes",
    description: "Receive notifications about new interactions on presets, features, and more.",
  }],
  // {
  //   name: "pushNotifications",
  //   label: "Push Notifications",
  //   description: "Receive notifications about new interactions on presets, features, and more.",
  // },
}