import axios from "axios";
import type {
  QuizAnswer,
  PersonalityProfile,
  CountryCard,
  TravelPlan,
  RecommendRequest,
} from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
});

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
}): Promise<TravelPlan> => {
  const { data } = await api.post("/api/plan/", payload);
  return data;
};

export const getWeather = async (city: string) => {
  const { data } = await api.get(`/api/weather/${city}`);
  return data;
};
