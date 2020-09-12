import React, { Component } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Link as RouterLink
} from "react-router-dom";
import { Character } from "./character-classes/Character";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';

export default function App() {
  const classes = useStyles();
  const characterFileString = './rulebook-data/CharacterSheet.pdf';

  return (
    <BrowserRouter>
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
            >
              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="h6" noWrap>
              SCRPG Character Creator
          </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </div>
          </Toolbar>
        </AppBar>

        {/* <ul className="header">
            <li><NavLink to="/">Character</NavLink></li>
            <li><NavLink to="/backgrounds">Backgrounds</NavLink></li>
            <li><NavLink to="/powersources">Power Sources</NavLink></li>
            <li><NavLink to="/archetypes">Archetypes</NavLink></li>
          </ul> */}
        {/* <Navbar bg="light" expand="lg">
            <Navbar.Brand as={Link} to='/'>SCRPG Character Creator</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link as={NavLink} to="/backgrounds">Backgrounds</Nav.Link>
                <Nav.Link as={NavLink} to="/powersources">Power Sources</Nav.Link>
                <Nav.Link as={NavLink} to="/archetypes">Archetypes</Nav.Link>
                <Nav.Link as={NavLink} to="/personalities">Personalities</Nav.Link>
              </Nav>
              <Form inline>
                <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                <Button variant="outline-success">Search</Button>
              </Form>
            </Navbar.Collapse>
          </Navbar> */}

        <div className="content">

          <Routes>
            <Route path="//*" element={<Character />} >
            </Route>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
const useStyles = makeStyles((theme) => ({
  lists: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(1),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    width: 360,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));
