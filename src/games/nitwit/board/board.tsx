import * as React from 'react';

import { GameDarkSublayout } from '../../../App/Game/GameDarkSublayout';
import { IGameState } from '../game';
import { IGameCtx } from 'flamecoals-boardgame.io/core';
import { RespondPhase } from './respond-phase';
import { PhaseContainer } from '../components/phase-container';
import { VotePhase } from './vote-phase';

export interface IBoardProps {
  G: IGameState;
  ctx: IGameCtx;
  moves: any;
  playerID: string;
  isActive: boolean;
  isConnected: boolean;
}

interface IBoardState {
  dismissedSharing: boolean;
}

export class Board extends React.Component<IBoardProps, IBoardState> {
  render() {
    const ctx = this.props.ctx;
    if (ctx.gameover) {
      return (
        <PhaseContainer>
          <h1>
            {ctx.gameover.winner === this.props.playerID
              ? 'YOU WON'
              : 'YOU LOST'}
          </h1>
        </PhaseContainer>
      );
    }
    if (ctx.phase === 'respondPhase') {
      return (
        <PhaseContainer>
          <RespondPhase {...this.props} />
        </PhaseContainer>
      );
    } else if (ctx.phase === 'votePhase') {
      return (
        <PhaseContainer>
          <VotePhase {...this.props} />
        </PhaseContainer>
      );
    } else {
      return this.renderUnsupportedPhase(ctx.phase);
    }
  }

  private renderUnsupportedPhase = (phase: string): JSX.Element => {
    return <PhaseContainer><h1>Unsupported phase: {phase}</h1></PhaseContainer>;
  }
}
