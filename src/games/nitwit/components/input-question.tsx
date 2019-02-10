import * as React from 'react';

interface IInputQuestionProps {
  id: string;
  question: string;
  onAnswer: (id: string, answer: string) => void;
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
    const inputId = `prompt_input_${this.props.id}`;
    return (
      <div style={containerStyles}>
        <label htmlFor={inputId} style={labelStyles}>{this.props.question}</label>
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
      this.props.onAnswer(this.props.id, answer);
    }
  }
}
