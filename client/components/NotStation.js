import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { PowerOff } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    height: '100vh',
  },
  icon: {
    width: '100% */',
    position: 'absolute',
    top: '40%',
    transform: 'scale(4)',
    color: 'red',
  },
}));

export default function NotStation() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <PowerOff className={classes.icon} />
    </div>
  );
}
