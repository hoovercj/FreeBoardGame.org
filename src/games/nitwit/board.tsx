import * as React from 'react';
import * as PropTypes from 'prop-types';

import GameBar from '../../App/Game/GameBar';
import { IGameState } from './game';
import { IGameCtx } from 'flamecoals-boardgame.io/core';

interface IBoardProps {
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
  static propTypes = {
    G: PropTypes.any.isRequired,
    ctx: PropTypes.any.isRequired,
    moves: PropTypes.any.isRequired,
    playerID: PropTypes.string,
    isActive: PropTypes.bool,
    isConnected: PropTypes.bool,
  };

  render() {
    const ctx = this.props.ctx;
    if (ctx.gameover) {
      return (
        <GameBar>
          <h1>
            {(ctx.gameover.winner === this.props.playerID) ?
              'YOU WON' : 'YOU LOST'
            }
          </h1>
        </GameBar>
      );
    }
    if (ctx.phase === 'respondPhase') {
      return this.renderRespondPhase();
    } else {
      return this.renderUnsupportedPhase(ctx.phase);
    }
  }

  private onSubmitAnswer = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      event.stopPropagation();
      event.preventDefault();

      const answer = event.currentTarget.value;
      const promptId = event.currentTarget.getAttribute('data-promptid');
      const playerId = this.props.playerID;
      this.props.moves.answerMove(promptId, playerId, answer);

      event.currentTarget.value = '';
    }
  }

  private renderRespondPhase = (): JSX.Element => {
    const prompt = this.props.G.rounds[this.props.G.roundIndex].find(
      p =>
        p.assignedPlayers.indexOf(this.props.playerID) >= 0 &&
        p.answers[this.props.playerID] === undefined,
    );

    if (prompt) {
      const promptInput = `player${this.props.playerID}_prompt${prompt.promptId}`;
      return (
        <GameBar>
          <div>
            <label htmlFor={promptInput}>{prompt.promptText}</label>
            <input
              type="text"
              data-promptid={prompt.promptId}
              onKeyPress={this.onSubmitAnswer}
              placeholder={'Answer here'}
            />{/* TODO: Make sure the screenreader works */}
          </div>
        </GameBar>
      );
    } else {
      return (
        <GameBar>
          <h1>Waiting for other players...</h1>
        </GameBar>
      );
    }
  }

  private renderUnsupportedPhase = (phase: string): JSX.Element => {
    return (
      <h1>Unsupported phase: {phase}</h1>
    );
  }
}
