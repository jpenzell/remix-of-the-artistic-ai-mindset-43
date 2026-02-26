// Mode-aware screen wrappers for presentation
// This file provides components that render different content based on Wine vs Educator mode

import { usePresentationMode } from "@/contexts/PresentationModeContext";

// Wine screens
import { DemoBuyerPrepScreen } from "@/components/screens/DemoBuyerPrepScreen";
import { DemoPromoVelocityScreen } from "@/components/screens/DemoPromoVelocityScreen";
import { DemoConsumerInsightsScreen } from "@/components/screens/DemoConsumerInsightsScreen";
import { DemoScenarioPlanningScreen } from "@/components/screens/DemoScenarioPlanningScreen";
import { DemoCompetitiveStrategyScreen } from "@/components/screens/DemoCompetitiveStrategyScreen";
import { WineRetailUseCasesScreen } from "@/components/screens/WineRetailUseCasesScreen";
import { WineCaseStudiesScreen } from "@/components/screens/WineCaseStudiesScreen";

// Educator screens
import {
  EducatorDemoBuyerPrepScreen,
  EducatorDemoPromoVelocityScreen,
  EducatorDemoConsumerInsightsScreen,
  EducatorDemoScenarioPlanningScreen,
  EducatorDemoCompetitiveStrategyScreen,
} from "@/components/screens/educator/EducatorDemoScreens";
import { EducatorUseCasesScreen } from "@/components/screens/educator/EducatorUseCasesScreen";
import { EducatorCaseStudiesScreen } from "@/components/screens/educator/EducatorCaseStudiesScreen";
import { EducatorCaseStudies2Screen } from "@/components/screens/educator/EducatorCaseStudies2Screen";

// Mode-aware wrapper components
export const ModeAwareDemoBuyerPrep = () => {
  const { mode } = usePresentationMode();
  return mode === "educator" ? <EducatorDemoBuyerPrepScreen /> : <DemoBuyerPrepScreen />;
};

export const ModeAwareDemoPromoVelocity = () => {
  const { mode } = usePresentationMode();
  return mode === "educator" ? <EducatorDemoPromoVelocityScreen /> : <DemoPromoVelocityScreen />;
};

export const ModeAwareDemoConsumerInsights = () => {
  const { mode } = usePresentationMode();
  return mode === "educator" ? <EducatorDemoConsumerInsightsScreen /> : <DemoConsumerInsightsScreen />;
};

export const ModeAwareDemoScenarioPlanning = () => {
  const { mode } = usePresentationMode();
  return mode === "educator" ? <EducatorDemoScenarioPlanningScreen /> : <DemoScenarioPlanningScreen />;
};

export const ModeAwareDemoCompetitiveStrategy = () => {
  const { mode } = usePresentationMode();
  return mode === "educator" ? <EducatorDemoCompetitiveStrategyScreen /> : <DemoCompetitiveStrategyScreen />;
};

export const ModeAwareUseCases = () => {
  const { mode } = usePresentationMode();
  return mode === "educator" ? <EducatorUseCasesScreen /> : <WineRetailUseCasesScreen />;
};

export const ModeAwareCaseStudies = () => {
  const { mode } = usePresentationMode();
  return mode === "educator" ? <EducatorCaseStudiesScreen /> : <WineCaseStudiesScreen />;
};

export const ModeAwareCaseStudies2 = () => {
  const { mode } = usePresentationMode();
  // Second case studies page is educator-only for now
  return mode === "educator" ? <EducatorCaseStudies2Screen /> : null;
};
