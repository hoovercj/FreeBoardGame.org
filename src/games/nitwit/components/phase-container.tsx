import * as React from 'react';
import { randomIntFromInterval } from '../utils/random';
import { white } from 'material-ui/styles/colors';

const colors = [
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#009688',
  '#ff5722',
];

const containerStyles: React.CSSProperties = {
  width: '100%',
  height: '100%',
  padding: '20px',
  color: white,
  backgroundColor: colors[0],
};

export class PhaseContainer extends React.Component<{}, {}> {
  private backgroundColor: string;

  componentWillMount() {
    this.backgroundColor = colors[randomIntFromInterval(0, colors.length - 1)];
  }

  render() {
    return (
      <div style={{ ...containerStyles, backgroundColor: this.backgroundColor }}>
        {this.props.children}
      </div>
    );
  }
}
