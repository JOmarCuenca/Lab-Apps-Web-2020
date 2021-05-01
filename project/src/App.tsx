import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import SignIn from "./Components/SignIn";
import Dashboard from "./Components/Dashboard";
import SignUp from './Components/SignIn/SignUp';


function App() {
  return (
    <Router>
      <Switch>
        <Route path="/:id/signup">
          <SignUp />
        </Route>
        <Route path="/login">
          <SignIn />
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path='/'>
          <Redirect to='/dashboard' />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
