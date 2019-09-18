import 'react-app-polyfill/ie9';

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import JSONComparePage from '~/pages/diff/json-compare';

ReactDOM.render(
  <Router>
    <div>
      <Switch>
        <Route exact path={`/`} component={JSONComparePage} />
        <Route
          render={() => (
            <Redirect
              to={{
                pathname: `/`
              }}
            />
          )}
        />
      </Switch>
    </div>
  </Router>,
  document.getElementById('root')
);

console.warn(process.env.GIT_COMMIT);
