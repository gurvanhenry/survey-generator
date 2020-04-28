import React, { useState } from 'react';

import { BrowserRouter as Router, Switch, Route, Redirect, useHistory } from 'react-router-dom';

import Survey from './screens/Survey';
import Results from './screens/Results';
import { computeSurveyResponseToScores } from '../services/survey';

import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <div className="container">
          <AppWithRouter />
        </div>
      </div>
    </Router>
  );
}

function AppWithRouter() {
  const history = useHistory();
  const [scores, setScores] = useState([]);
  const handleSurveySubmit = (form, responses) => {
    const surveyScores = computeSurveyResponseToScores(form, responses);
    setScores(surveyScores);
    history.push('/results');
  };
  return (
    <Switch>
      <Route path="/survey/:surveyId">
        <Survey onSurveySubmit={handleSurveySubmit} />
      </Route>
      <Route path="/results">
        <Results scores={scores} />
      </Route>
      <Redirect to="/survey/1" />
    </Switch>
  );
}

export default App;
