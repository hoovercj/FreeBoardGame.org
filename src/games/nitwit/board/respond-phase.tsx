import * as React from 'react';

import { IPromptState } from '../game';
import { IBoardProps } from './board';
import { InputQuestion } from '../components/input-question';
import { Waiting } from '../components/waiting';

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
      return <Waiting />;
    }
  }

  componentDidUpdate(prevProps: IBoardProps, prevState: IRespondPhaseState): void {
    const hasCurrentPromptFromState = !!this.state.currentPrompt;
    const currentPromptFromGameProps = hasCurrentPromptFromState && this.props.G.rounds[this.props.G.roundIndex]
      .find(prompt => prompt.promptId === this.state.currentPrompt.promptId);
    const hasCurrentPromptFromGameProps = !!currentPromptFromGameProps;

    const currentPromptIsAnswered = hasCurrentPromptFromGameProps
      && currentPromptFromGameProps.answers[this.props.playerID] !== undefined;

    if (currentPromptIsAnswered) {
      const nextPrompt = this.getNextUnansweredPrompt();
      if (!nextPrompt || nextPrompt.promptId !== currentPromptFromGameProps.promptId) {
        this.setState({ currentPrompt: nextPrompt });
      }
    }
  }

  private onSubmitAnswer = (promptId: string, answer: string): void => {
    const playerId = this.props.playerID;
    this.props.moves.answerMove(promptId, playerId, answer);
  }

  private renderGetResponse = (): JSX.Element => {
    const { promptId, promptText } = this.state.currentPrompt;
    return (
      <InputQuestion
        questionId={promptId}
        onAnswer={this.onSubmitAnswer}
        questionText={promptText}
      />
    );
  }

  private getNextUnansweredPrompt = (): IPromptState => {
    return this.props.G.rounds[this.props.G.roundIndex].find(
      p =>
        p.answeringPlayers.includes(this.props.playerID) &&
        p.answers[this.props.playerID] === undefined,
    );
  }
}
