import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import { GameInfo } from './Game/GameInfo';
import { Game } from './Game/Game';
import Home from '../Home/Home';
import About from '../About/About';
import NotFound from './NotFound';
import * as ReactGA from 'react-ga';

ReactGA.initialize('UA-105391878-1');
if (typeof window !== 'undefined' &&
  typeof navigator !== 'undefined' &&
  navigator.serviceWorker) {
  navigator.serviceWorker.register('/sw.js').then((registration) => {
    registration.update();
  });
}

const withGA = (WrapperComponent: any) => {
  class GAWrapper extends React.Component<{}, {}> {
    render() {
      if (typeof window !== 'undefined') {
        ReactGA.set({ page: window.location.pathname });
        ReactGA.pageview(window.location.pathname);
      }
      return <WrapperComponent {...this.props} />;
    }
  }
  return GAWrapper;
};

class Main extends React.Component<{}, {}> {
  render() {
    return (
      <Switch>
        {/* These routes come from a DB / static */}
        <Route exact={true} path="/" component={withGA(Home)} />
        <Route exact={true} path="/about" component={withGA(About)} />
        <Route path="/g/:gameCode" exact={true} component={withGA(GameInfo)} />

        {/* These routes need hosted in an iframe */}
        {/* TODO: Create an iframe that takes a GameInfo and url to an iframe and builds the correct url to host it */}
        <Route path="/g/:gameCode/:mode" exact={true} component={withGA(Game)} />
        <Route path="/g/:gameCode/:mode/:matchCode/:playerID" exact={true} component={withGA(Game)} />
        <Route component={withGA(NotFound)} />
      </Switch>
    );
  }
}

export default Main;
