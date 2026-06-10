export interface QuizAnswer {
  question_id: string;
  answer: string;
}

export interface PersonalityProfile {
  traveler_type: string;
  pace: string;
  social: string;
  interests: string[];
  avoid: string[];
  budget_style: string;
  nationality: string;
  duration?: string;
  accommodation?: string;
  language_comfort?: string;
  scenery?: string;
  safety_priority?: string;
  raw_answers: QuizAnswer[];
}

export interface CountryCard {
  country: string;
  why_it_fits: string;
  weather_summary: string;
  budget_fit: "perfect" | "tight" | "comfortable";
  visa_info: string;
  currency: string;
  best_cities: string[];
  wildcard_fact: string;
  image_url?: string;
  match_score: number;
}

export interface DayActivity {
  time: string;
  title: string;
  description: string;
  location: string;
  type: "food" | "culture" | "nature" | "event" | "hidden_gem";
  estimated_cost_eur?: number;
  google_maps_query?: string;
  opening_hours?: string;
  opening_warning?: string;
}

export interface DayPlan {
  date: string;
  theme: string;
  weather?: string;
  photo_url?: string;
  activities: DayActivity[];
  events?: string[];
  typical_weather?: string;
}

export interface TravelPlan {
  country: string;
  city: string;
  days: DayPlan[];
  total_estimated_cost_eur?: number;
  tips: string[];
}

export interface RecommendRequest {
  profile: PersonalityProfile;
  travel_start: string;
  travel_end: string;
  budget_eur: number;
  excluded_countries?: string[];
  nationality?: string;
  origin_city?: string;
  preferred_countries?: string[];
}
