import * as React from 'react';

import { GameDarkSublayout } from '../../../App/Game/GameDarkSublayout';
import { IGameState, IPromptState } from '../game';
import { IBoardProps } from './board';
import { IGameCtx } from 'flamecoals-boardgame.io/core';
import { InputQuestion } from '../components/input-question';

interface IRespondPhaseState {
  currentPrompt: IPromptState;
}

export class RespondPhase extends React.Component<IBoardProps, IRespondPhaseState> {
  constructor(props: IBoardProps) {
    super(props);

    this.state = {
      currentPrompt: this.getNextUnansweredPrompt(),
    };
  }

  render() {
    if (this.state.currentPrompt) {
      return this.renderGetResponse();
    } else {
      return this.renderWaiting();
    }
  }

  private onSubmitAnswer = (promptId: string, answer: string): void => {
    const playerId = this.props.playerID;
    this.props.moves.answerMove(promptId, playerId, answer);
  }

  private renderWaiting = (): JSX.Element => {
    return (
      <h1>Waiting for other players...</h1>
    );
  }

  private renderGetResponse = (): JSX.Element => {
    const { promptId, promptText } = this.state.currentPrompt;
    return (
      <InputQuestion
        id={promptId}
        onAnswer={this.onSubmitAnswer}
        question={promptText}
      />
    );
  }

  private getNextUnansweredPrompt = (): IPromptState => {
    return this.props.G.rounds[this.props.G.roundIndex].find(
      p =>
        p.assignedPlayers.indexOf(this.props.playerID) >= 0 &&
        p.answers[this.props.playerID] === undefined,
    );
  }
}
