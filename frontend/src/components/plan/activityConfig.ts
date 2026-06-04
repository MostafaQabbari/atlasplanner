export type ActivityType = "food" | "culture" | "nature" | "event" | "hidden_gem";

export interface ActivityTypeConfig {
  color: string;
  label: string;
  iconName: string;
}

export const activityConfig: Record<ActivityType, ActivityTypeConfig> = {
  food:       { color: "#f97316", label: "Food & Dining", iconName: "Utensils"  },
  culture:    { color: "#a78bfa", label: "Culture",       iconName: "Landmark"  },
  nature:     { color: "#5bc4a0", label: "Nature",        iconName: "Leaf"      },
  event:      { color: "#60a5fa", label: "Events",        iconName: "Calendar"  },
  hidden_gem: { color: "#f59e0b", label: "Hidden Gem",    iconName: "Gem"       },
};
