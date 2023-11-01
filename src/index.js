import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from './app/App';
import Login from './app/user-pages/Login';
import "./i18n";
import * as serviceWorker from './serviceWorker';
import { Context, ContextProvider } from "./auth/Context";
ReactDOM.render(
  <ContextProvider>
  <BrowserRouter basename="">
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={App} />
    </Switch>
  </BrowserRouter>
  </ContextProvider>
  ,
  document.getElementById('root')
);

serviceWorker.unregister();