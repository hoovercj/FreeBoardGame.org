import * as React from 'react';

export interface IChoice {
  choiceId: string;
  text: string;
}

interface IMultipleChoiceQuestionProps {
  questionId: string;
  questionText: string;
  choices: IChoice[];
  onAnswer: (choiceId: string) => void;
}

const containerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '800px',
  justifyContent: 'center',
};

const labelStyles: React.CSSProperties = {
  margin: '10px',
};

// TODO: extract 'reset button' styles
const choiceStyles: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'white',
  color: 'black',
  border: 0,
  padding: '10px',
  margin: '5px',
  WebkitAppearance: 'none',
};

export class MultipleChoiceQuestion extends React.Component<IMultipleChoiceQuestionProps, {}> {
  render() {
    return (
      <div style={containerStyles}>
        <label style={labelStyles}>{this.props.questionText}</label>
        {this.props.choices.map(({ choiceId, text }) =>
          <button
            key={choiceId}
            data-question-id={choiceId}
            onClick={this.onSubmitAnswer}
            style={choiceStyles}
          >
            {text}
          </button>)}
      </div>
    );
  }

  private onSubmitAnswer = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.stopPropagation();
    event.preventDefault();

    const choiceId = event.currentTarget.getAttribute('data-question-id');
    this.props.onAnswer(choiceId);
  }
}
