import * as React from 'react';

import { IBoardProps } from './board';
import { MultipleChoiceQuestion, IChoice } from '../components/multiple-choice-question';
import { Waiting } from '../components/waiting';

export class VotePhase extends React.Component<IBoardProps, {}> {
  render() {
    const prompt = this.props.G.votingPrompt;
    if (!prompt) {
      return <h1>Error! There is no prompt to vote on</h1>;
    }

    const isAssignedToCurrentPlayer = prompt.answeringPlayers.includes(this.props.playerID);
    const isAnsweredByCurrentPlayer = prompt.votes[this.props.playerID] !== undefined;

    if (isAssignedToCurrentPlayer || isAnsweredByCurrentPlayer) {
      return <Waiting />;
    } else {
      return this.renderGetResponse();
    }
  }

  private onSubmitAnswer = (choiceId: string): void => {
    const playerId = this.props.playerID;
    const promptId = this.props.G.votingPrompt.promptId;

    this.props.moves.voteMove(promptId, playerId, choiceId);
  }

  private renderGetResponse = (): JSX.Element => {
    const { promptId, promptText, answers } = this.props.G.votingPrompt;
    const choices: IChoice[] = Object.keys(answers).map(playerId => {
      return {
        choiceId: playerId,
        text: answers[playerId],
      };
    });
    return (
      <MultipleChoiceQuestion
        questionId={promptId}
        choices={choices}
        onAnswer={this.onSubmitAnswer}
        questionText={promptText}
      />
    );
  }

}
