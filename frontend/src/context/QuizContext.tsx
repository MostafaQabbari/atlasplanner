import React, { createContext, useContext, useState } from "react";
import type { PersonalityProfile, CountryCard, TravelPlan } from "../types";

export type Screen = "welcome" | "quiz" | "recommendations" | "plan";

interface TravelDates {
  start: string;
  end: string;
}

interface SelectedCountry {
  country: string;
  city: string;
}

interface QuizContextType {
  screen: Screen;
  setScreen: (s: Screen) => void;
  profile: PersonalityProfile | null;
  setProfile: (p: PersonalityProfile) => void;
  travelDates: TravelDates;
  setTravelDates: (d: TravelDates) => void;
  budget: number;
  setBudget: (b: number) => void;
  recommendations: CountryCard[] | null;
  setRecommendations: (r: CountryCard[] | null) => void;
  selectedCountry: SelectedCountry | null;
  setSelectedCountry: (c: SelectedCountry) => void;
  plan: TravelPlan | null;
  setPlan: (p: TravelPlan | null) => void;
  resetAll: () => void;
}

const QuizContext = createContext<QuizContextType | null>(null);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screen, setScreen]                       = useState<Screen>("welcome");
  const [profile, setProfile]                     = useState<PersonalityProfile | null>(null);
  const [travelDates, setTravelDates]             = useState<TravelDates>({ start: "", end: "" });
  const [budget, setBudget]                       = useState(2000);
  const [recommendations, setRecommendations]     = useState<CountryCard[] | null>(null);
  const [selectedCountry, setSelectedCountry]     = useState<SelectedCountry | null>(null);
  const [plan, setPlan]                           = useState<TravelPlan | null>(null);

  const resetAll = () => {
    setScreen("welcome");
    setProfile(null);
    setTravelDates({ start: "", end: "" });
    setBudget(2000);
    setRecommendations(null);
    setSelectedCountry(null);
    setPlan(null);
  };

  return (
    <QuizContext.Provider
      value={{
        screen, setScreen,
        profile, setProfile,
        travelDates, setTravelDates,
        budget, setBudget,
        recommendations, setRecommendations,
        selectedCountry, setSelectedCountry,
        plan, setPlan,
        resetAll,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = (): QuizContextType => {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used inside QuizProvider");
  return ctx;
};
