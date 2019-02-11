/*
 * Copyright 2018 The flamecoals-boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import { Game, IGameCtx, TurnOrder } from 'flamecoals-boardgame.io/core';
import { randomIntFromInterval } from './utils/random';

export type Shuffler = <T>(array: T[]) => T[];

type PlayerId = string;
type PromptId = string;

export interface IGameState {
  rounds: RoundState[];
  roundIndex: number;
  votingPrompt?: IPromptState;
}

export type RoundState = IPromptState[];

export interface IPromptState {
  promptId: PromptId;
  promptText: PlayerId;
  answeringPlayers: string[];
  votingPlayers: string[];
  answers: { [playerId: string]: string };
  votes: { [voterId: string]: PlayerId };
}

const GAME_PROMPTS = [
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
    let answeringPlayers: PlayerId[];
    let votingPlayers: PlayerId[];

    switch (roundType) {
      case RoundType.Pair:
        for (let i = 0; i < inputPlayers.length; i++) {
          answeringPlayers = [shuffledPlayers[i], shuffledPlayers[(i + 1) % shuffledPlayers.length]];
          votingPlayers = shuffledPlayers.filter(player => !answeringPlayers.includes(player));
          roundState.push({
            promptId: String(promptIndex++),
            promptText: shuffledPrompts.pop(),
            answeringPlayers: answeringPlayers,
            votingPlayers: votingPlayers,
            answers: {},
            votes: {},
          });
        }

        break;
      default:
      case RoundType.All:
        answeringPlayers = shuffledPlayers;
        votingPlayers = shuffledPlayers;

        roundState.push({
          promptId: String(promptIndex++),
          promptText: shuffledPrompts.pop(),
          answeringPlayers: answeringPlayers,
          votingPlayers: votingPlayers,
          answers: {},
          votes: {},
        });
        break;
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

const getVotingPrompt = (G: IGameState, ctx: IGameCtx): IPromptState => {
  // If there is a prompt but not everyone has voted,
  // keep using this prompt
  if (G.votingPrompt && !everyoneVoted(G.votingPrompt)) {
    console.log(`getVotingPrompt: There is a prompt and not everyone has voted`); // tslint:disable-line
    return G.votingPrompt;
  }

  // If everyone has already voted or there is no voting prompt,
  // randomly choose a prompt from the set of unanswered prompts
  // so players cannot deduce whose prompts are whose based on the order of the
  // voting each round.
  const unvotedPrompts = G.rounds[G.roundIndex].filter(prompt => Object.keys(prompt.votes).length === 0);
  return unvotedPrompts[randomIntFromInterval(0, unvotedPrompts.length - 1)];
};

const everyoneVoted = ({ votes, votingPlayers }: IPromptState): boolean => {
  return !votingPlayers || !votingPlayers.some(playerId => votes[playerId] === undefined);
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
      rounds: generateRounds(GAME_PROMPTS, playerIds, [RoundType.Pair, RoundType.Pair, RoundType.All]),
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

      if (!prompt.answeringPlayers.includes(playerId)) {
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
      if (!G.votingPrompt) {
        return; // Cannot answer this prompt this round
      }

      if (!G.votingPrompt.votingPlayers.includes(voterId)) {
        return; // This player cannot vote for this prompt
      }

      if (voterId === votingForId) {
        return; // Player cannot vote for their own prompt
      }

      if (G.votingPrompt.votes[voterId] !== undefined) {
        return; // Player has already voted for this prompt
      }

      // TODO: I am duplicating the state in two places.
      // 1) In the "votingPrompt" field which holds the prompt
      // players are currently voting on
      // 2) In the master "rounds" object.
      // I can probably avoid doing this by either:
      // * Doing this only after the phase ends and all votes are in
      // * Using only an ID in the "votingPrompt" field and referencing
      // the master rounds object directly
      G.votingPrompt.votes[voterId] = votingForId;
      G.rounds[G.roundIndex].find(p => p.promptId === promptId).votes = G.votingPrompt.votes;
    },
  },
  flow: {
    startingPhase: 'respondPhase',
    phases: {
      respondPhase: {
        allowedMoves: ['answerMove'],
        turnOrder: TurnOrder.ANY,
        next: 'votePhase',
        onPhaseEnd: () => {
          console.log('OnPhaseEnd: respondPhase'); // tslint:disable-line
        },
        onPhaseBegin: () => {
          console.log('OnPhaseBegin: respondPhase'); // tslint:disable-line
        },
        endPhaseIf: (G: IGameState) => {
          const someUnanswered = G.rounds[G.roundIndex].some(promptState =>
            promptState.answeringPlayers.some(
              player => promptState.answers[player] === undefined,
            ),
          );

          return someUnanswered ? false : { next: 'votePhase' };
        },
      },
      votePhase: {
        allowedMoves: ['voteMove'],
        turnOrder: TurnOrder.ANY,
        next: 'respondPhase',
        onPhaseBegin: (G: IGameState, ctx: IGameCtx) => {
          console.log('OnPhaseBegin: votePhase'); // tslint:disable-line
          G.votingPrompt = getVotingPrompt(G, ctx);
          console.log(`OnPhaseBegin - VotingPrompt: ${G.votingPrompt && G.votingPrompt.promptId}`); // tslint:disable-line
        },
        onPhaseEnd: (G: IGameState, ctx: IGameCtx) => {
          console.log('OnPhaseEnd: votePhase'); // tslint:disable-line
          console.log(G.roundIndex); // tslint:disable-line
          G.roundIndex++;
          console.log(G.roundIndex); // tslint:disable-line
        },
        onMove: (G: IGameState, ctx: IGameCtx) => {
          // Update the prompt in case this vote was the last vote
          G.votingPrompt = getVotingPrompt(G, ctx);
          console.log(`OnMove - VotingPrompt: ${G.votingPrompt && G.votingPrompt.promptId}`); // tslint:disable-line
        },
        endPhaseIf: (G: IGameState, ctx: IGameCtx): boolean => {
          const someoneDidNotVote = G.rounds[G.roundIndex].some(promptState => {
            for (let i = 0; i < ctx.numPlayers; i++) {
              const isAssignedPlayer =
                promptState.answeringPlayers.includes(String(i));
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
