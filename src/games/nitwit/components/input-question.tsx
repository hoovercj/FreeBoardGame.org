import * as React from 'react';

interface IInputQuestionProps {
  questionId: string;
  questionText: string;
  onAnswer: (questionId: string, answerText: string) => void;
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

const inputStyles: React.CSSProperties = {
  margin: '10px',
};

export class InputQuestion extends React.Component<IInputQuestionProps, {}> {
  render() {
    const inputId = `prompt_input_${this.props.questionId}`;
    return (
      <div style={containerStyles}>
        <label htmlFor={inputId} style={labelStyles}>{this.props.questionText}</label>
        <input
          type="text"
          id={inputId}
          onKeyPress={this.onSubmitAnswer}
          placeholder={'Answer here'}
          style={inputStyles}
        />{/* TODO: Make sure the screenreader works */}
      </div>
    );
  }

  private onSubmitAnswer = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      event.stopPropagation();
      event.preventDefault();

      const answer = event.currentTarget.value;
      event.currentTarget.value = '';
      this.props.onAnswer(this.props.questionId, answer);
    }
  }
}
