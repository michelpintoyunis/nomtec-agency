import React from 'react';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlight: boolean;
  cta: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
}

export interface GeneratedIdea {
  title: string;
  description: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface NavLink {
  name: string;
  href: string;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  category: string;
  status: 'scheduled' | 'first_half' | 'halftime' | 'second_half' | 'ended' | null;

  // Football specific
  home_team?: string;
  away_team?: string;
  home_team_abbr?: string;
  away_team_abbr?: string;
  home_team_logo?: string;
  away_team_logo?: string;
  home_score?: number;
  away_score?: number;
  match_start_timestamp?: number; // Epoch timestamp for calculating minutes
  sort_order?: number;
}