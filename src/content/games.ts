import { ARCHITECT_ROUNDS, CONNECT_ROUNDS } from "../config";
import type { Accent, GameId } from "../types";

export interface GameInfo {
  id: GameId;
  number: number;
  title: string;
  tagline: string;
  duration: string;
  accent: Accent;
  /** Random questions (puzzles or challenges) per play session. */
  rounds: number;
  /** One line for the results screen. */
  learned: string;
}

export const GAMES: GameInfo[] = [
  {
    id: "architect",
    number: 1,
    title: "Architect the Agent",
    tagline: "Build the right AI harness for the job.",
    duration: "~5 min",
    accent: "violet",
    rounds: ARCHITECT_ROUNDS,
    learned:
      "A harness is everything around the model: tools, memory and checks. Match each part to what the job really needs.",
  },
  {
    id: "connect",
    number: 2,
    title: "Find the Connection",
    tagline: "Discover the hidden connections in Applied AI.",
    duration: "~20 min",
    accent: "teal",
    rounds: CONNECT_ROUNDS,
    learned:
      "Applied AI is full of ideas hiding in plain sight, from context windows to model routing. Now you can spot them.",
  },
];

export const roundsFor = (id: GameId) =>
  GAMES.find((g) => g.id === id)?.rounds ?? 3;
