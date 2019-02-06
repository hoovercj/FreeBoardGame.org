/*
 * Copyright 2018 The flamecoals-boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import { Game, IGameCtx, TurnOrder } from 'flamecoals-boardgame.io/core';

export type Shuffler = <T>(array: T[]) => T[];

type PlayerId = string;
type PromptId = string;

export interface IGameState {
  rounds: RoundState[];
  roundIndex: number;
}

export type RoundState = IPromptState[];

export interface IPromptState {
  promptId: PromptId;
  promptText: PlayerId;
  assignedPlayers: string[];
  answers: { [playerId: string]: string };
  votes: { [voterId: string]: PlayerId };
}

const prompts = [
  'Title of the HBO mini-series about Trump\'s Presidency',
  'The worst thing your partner could say to you in the bedroom',
  'The worst thing your partner could scream from the bathroom',
  'The worst thing to tell your kids when their pet dies',
  'The nickname of Snow White\'s 8th dwarf',
  'If a winning coach gets Gatorade dumped on his head, what should get dumped on the losing coach?',
  'You would never go on a roller coaster called "BLANK"',
  'What two words would passengers never want to hear a pilot say?',
  'Jesus\'s REAL last words',
  'What\'s Mona Lisa smiling about?',
  'Something you should never put on an open wound',
  'A college major you don\'t see at many universities',
  'The best thing about going to prison',
  'Invent a holiday that you think everyone would enjoy',
  'The worst thing you could stuff a bed mattress with',
  'Where do babies come from?',
  'One place a finger shouldn\'t go',
  'An alternate use for a banana',
];

enum RoundType {
  Pair,
  All,
}

const generateRounds = (
  inputPrompts: string[],
  inputPlayers: PlayerId[],
  roundTypes: RoundType[],
  shuffler: Shuffler = shuffle,
): RoundState[] => {

  const shuffledPrompts = shuffler(inputPrompts);
  const shuffledPlayers = shuffler(inputPlayers);

  let promptIndex = 0;

  return roundTypes.map((roundType: RoundType): RoundState => {
    const roundState: RoundState = [];
    for (let i = 0; i < inputPlayers.length; i++) {
      let assignedPlayers: PlayerId[];

      switch (roundType) {
        case RoundType.Pair:
          assignedPlayers = [shuffledPlayers[i], shuffledPlayers[(i + 1) % shuffledPlayers.length]];
          break;
        default:
        case RoundType.All:
          assignedPlayers = shuffledPlayers;
          break;
      }

      roundState.push({
        promptId: String(promptIndex++),
        promptText: shuffledPrompts.pop(),
        assignedPlayers: assignedPlayers,
        answers: {},
        votes: {},
      });
    }

    return roundState;
  });
};

const shuffle: Shuffler = <T>(array: T[]): T[] => {
  let j, x, i;
  for (i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = array[i];
    array[i] = array[j];
    array[j] = x;
  }
  return array;
};

export const NitwitGame = Game({
  name: 'nitwit',

  setup: (ctx: IGameCtx): IGameState => {
    const playerIds = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
      playerIds.push(String(i));
    }
    return {
      roundIndex: 0,
      rounds: generateRounds(prompts, playerIds, [RoundType.Pair, RoundType.Pair, RoundType.All]),
    };
  },

  moves: {
    // Use the 'mutable' version of the api -- https://boardgame.io/#/immutability
    answerMove: (G: IGameState, ctx: IGameCtx, promptId: PromptId, playerId: PlayerId, answer: string): void => {
      // Validate prompt
      const prompt = G.rounds[G.roundIndex].find(p => p.promptId === promptId);
      if (!prompt) {
        return; // Cannot answer this prompt this round
      }

      if (prompt.assignedPlayers.indexOf(playerId) < 0) {
        return; // Player cannot answer this prompt
      }

      prompt.answers[playerId] = answer;

      // TODO: Check if all prompts have been answered
    },
    voteMove: (
      G: IGameState,
      ctx: IGameCtx,
      promptId: PromptId,
      voterId: PlayerId,
      votingForId: PlayerId,
    ): void => {
      const prompt = G.rounds[G.roundIndex].find(p => p.promptId === promptId);
      if (!prompt) {
        return; // Cannot answer this prompt this round
      }

      if (prompt.assignedPlayers.indexOf(votingForId) < 0) {
        return; // Cannot vote for this player for this prompt
      }

      if (prompt.assignedPlayers.indexOf(voterId) >= 0) {
        return; // Player assigned to this prompt cannot vote on it
      }

      if (prompt.votes[voterId] !== undefined) {
        return; // Player has already voted for this prompt
      }

      prompt.votes[voterId] = votingForId;
    },
  },
  flow: {
    startingPhase: 'respondPhase',
    phases: {
      respondPhase: {
        allowedMoves: ['answerMove'],
        turnOrder: TurnOrder.ANY,
        next: 'votePhase',
        endPhaseIf: (G: IGameState): boolean => {
          const someUnanswered = G.rounds[G.roundIndex].some(promptState =>
            promptState.assignedPlayers.some(
              player => promptState.answers[player] === undefined,
            ),
          );

          return !someUnanswered;
        },
      },
      votePhase: {
        allowedMoves: ['voteMove'],
        turnOrder: TurnOrder.ANY,
        next: 'respondPhase',
        endPhaseIf: (G: IGameState, ctx: IGameCtx): boolean => {
          const someoneDidNotVote = G.rounds[G.roundIndex].some(promptState => {
            for (let i = 0; i < ctx.numPlayers; i++) {
              const isAssignedPlayer =
                promptState.assignedPlayers.indexOf(String(i)) >= 0;
              const voted = promptState.votes[String(i)] !== undefined;
              if (!isAssignedPlayer && !voted) {
                return true;
              }
            }
            return false;
          });

          return !someoneDidNotVote;
        },
      },
    },
  },
});
