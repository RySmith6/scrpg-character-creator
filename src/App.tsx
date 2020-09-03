import React, { Component } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink
} from "react-router-dom";
import { Character } from "./character-classes/Character";
import './App.css';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <h1>SCRPG Character Creator</h1>
          <ul className="header">
            <li><NavLink to="/">Character</NavLink></li>
            <li><NavLink to="/backgrounds">Backgrounds</NavLink></li>
            <li><NavLink to="/powersources">Power Sources</NavLink></li>
            <li><NavLink to="/archetypes">Power Sources</NavLink></li>
          </ul>

          <div className="content">
            <Container fluid>
              <Routes>
                <Route path="//*" element={<Character />} >
                </Route>
              </Routes>
            </Container>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
