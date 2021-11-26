import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  makeStyles,
  Drawer,
  MenuItem,
} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import auth from './../auth/auth-helper';
import { Link, withRouter } from 'react-router-dom';

{
  /* <Link to={"/user/" + auth.isAuthenticated().user._id}>
            <Button
              style={isActive(
                history,
                "/user/" + auth.isAuthenticated().user._id
              )}
            >
              My Profile
            </Button>
          </Link> */
}

const headersData = [
  {
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    label: 'Stations',
    href: '/clients',
  },
];

const useStyles = makeStyles(() => ({
  grow: {
    flexGrow: 1,
  },
  signout: {
    position: 'absolute',
    right: 0,
    marginRight: '20px',
  },
  growDesktop: {
    '&:last-child': {
      flexGrow: 1,
    },
  },
  drawerContainer: {
    padding: '20px 30px',
  },
}));

const isActive = (history, path) => {
  if (history.location.pathname == path) return { color: '#ff4081' };
  else return { color: '#ffffff' };
};

const Menu = withRouter(({ history }) => {
  const classes = useStyles();
  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });

  const { mobileView, drawerOpen } = state;

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 900
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();

    window.addEventListener('resize', () => setResponsiveness());

    return () => {
      window.removeEventListener('resize', () => setResponsiveness());
    };
  }, []);

  const displayDesktop = () => {
    return (
      <>
        {logo}
        {getMenuButtons()}
      </>
    );
  };

  const displayMobile = () => {
    const handleDrawerOpen = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: false }));

    return (
      <Toolbar className={classes.grow}>
        <IconButton
          {...{
            edge: 'start',
            color: 'inherit',
            'aria-label': 'menu',
            'aria-haspopup': 'true',
            onClick: handleDrawerOpen,
          }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer
          {...{
            anchor: 'left',
            open: drawerOpen,
            onClose: handleDrawerClose,
          }}
        >
          <div className={classes.drawerContainer}>{getDrawerChoices()}</div>
        </Drawer>

        <div>{logo}</div>
      </Toolbar>
    );
  };

  const getDrawerChoices = () => {
    return headersData.map(({ label, href }) => {
      return (
        <Link
          {...{
            to: href,
            color: 'inherit',
            style: { textDecoration: 'none' },
            key: label,
          }}
        >
          <MenuItem>{label}</MenuItem>
        </Link>
      );
    });
  };

  const logo = (
    <Link to='/'>
      <IconButton aria-label='Home' style={isActive(history, '/')}>
        <HomeIcon />
      </IconButton>
    </Link>
  );

  const getMenuButtons = () => {
    return headersData.map(({ label, href }) => {
      return (
        <span className={classes.growDesktop}>
          <Link to={href}>
            <Button key={label} style={isActive(history, href)}>
              {label}
            </Button>
          </Link>
        </span>
      );
    });
  };

  return (
    <AppBar position='static'>
      <Toolbar>
        {/* <Typography variant='h6' color='inherit'>
          EEP
        </Typography> */}
        {/* <Link to='/'>
          <IconButton aria-label='Home' style={isActive(history, '/')}>
            <HomeIcon />
          </IconButton>
        </Link> */}
        {!auth.isAuthenticated() && (
          <>
            <span className={classes.grow}>{logo}</span>
            <Link to='/signup'>
              <Button style={isActive(history, '/signup')}>Sign up</Button>
            </Link>
            <Link to='/signin'>
              <Button style={isActive(history, '/signin')}>Sign In</Button>
            </Link>
          </>
        )}
        {auth.isAuthenticated() && (
          <>
            {mobileView ? displayMobile() : displayDesktop()}
            <Button
              className={classes.signout}
              color='inherit'
              onClick={() => {
                auth.clearJWT(() => history.push('/'));
              }}
            >
              Sign out
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
});

export default Menu;
