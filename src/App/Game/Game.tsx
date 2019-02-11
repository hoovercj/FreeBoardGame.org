import * as React from 'react';
import { Client, IClientArgs } from 'flamecoals-boardgame.io/react';
import { IGameDef, GAMES_MAP } from '../../games';
import { gameBoardWrapper } from './GameBoardWrapper';
import { GameMode } from './GameModePicker';

interface IGameProps {
  match?: any;
  history?: { push: (url: string) => void };
}

export class Game extends React.Component<IGameProps, {}> {
  render() {
    const gameCode = this.props.match.params.gameCode;
    const mode = this.props.match.params.mode as GameMode;
    const matchCode = this.props.match.params.matchCode;
    const playerID = this.props.match.params.playerID;
    const gameDef: IGameDef = GAMES_MAP[gameCode];
    const clientConfig: IClientArgs = {
      game: gameDef.bgioGame,
      board: gameBoardWrapper({
        gameCode,
        mode,
        matchCode,
        playerID,
      }),
      debug: true,
    };
    if (gameDef.enhancer) {
      clientConfig.enhancer = gameDef.enhancer;
    }
    if (mode === GameMode.OnlineFriend) {
      clientConfig.multiplayer = true;
      clientConfig.numPlayers = gameDef.minPlayers;
    }
    console.log('numPlayers:' + clientConfig.numPlayers); // tslint:disable-line
    const App = Client(clientConfig) as any;
    return (
      <div>
        <App gameID={matchCode} playerID={playerID || '0'} />
      </div>
    );
  }
}
