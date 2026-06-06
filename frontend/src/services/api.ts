import axios from "axios";
import type {
  QuizAnswer,
  PersonalityProfile,
  CountryCard,
  TravelPlan,
  RecommendRequest,
} from "../types";

const TOKEN_KEY = "atlas_token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  timeout: 60000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export const submitQuiz = async (
  answers: QuizAnswer[]
): Promise<PersonalityProfile> => {
  const { data } = await api.post("/api/quiz/", { answers });
  return data;
};

export const getRecommendations = async (
  request: RecommendRequest
): Promise<{ recommendations: CountryCard[] }> => {
  const { data } = await api.post("/api/recommend/", request);
  return data;
};

export const generatePlan = async (payload: {
  profile: PersonalityProfile;
  country: string;
  city: string;
  travel_start: string;
  travel_end: string;
  budget_eur: number;
  customizations?: string[];
}): Promise<TravelPlan> => {
  const { data } = await api.post("/api/plan/", payload, { timeout: 90000 });
  return data;
};

export const getWeather = async (city: string) => {
  const { data } = await api.get(`/api/weather/${city}`);
  return data;
};

export const saveTrip = async (payload: {
  country: string;
  city: string;
  startDate: string;
  endDate: string;
  planJson: string;
  matchScore?: number;
  nationality?: string;
  customizations?: string[];
}) => {
  const { data } = await api.post("/api/trips/save", payload);
  return data;
};

export const getUserTrips = async () => {
  const { data } = await api.get("/api/trips/");
  return data;
};
