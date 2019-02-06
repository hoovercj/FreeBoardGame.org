import { Client } from 'flamecoals-boardgame.io/client';
import { NitwitGame, Shuffler, IGameState, IPromptState } from './game';
// import { VALID_SETUP_FIRST_PLAYER, VALID_SETUP_SECOND_PLAYER } from './mocks';

describe('Seabattle', () => {
  it('should set ships correctly', () => {
    const client = Client({
      game: NitwitGame,
      numPlayers: 5,
    });

    const store = client.store;
    const state = store.getState();

    expect(client.store.getState().ctx.phase).toEqual('respondPhase');
  });
});
