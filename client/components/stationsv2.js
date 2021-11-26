import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { EvStation, SettingsInputSvideo } from '@material-ui/icons';
import Button from './controls/Button';
import auth from '../auth/auth-helper';
import { LinearProgress } from '@material-ui/core';

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  connector: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  status: {
    alignSelf: 'flex-start',
    marginBottom: '30px',
  },
  iconEv: {
    transform: 'scale(2)',
    marginBottom: '10px',
  },
  kwh: {
    marginBottom: '15px',
  },
  progress: {
    width: '50%',
    height: '10px',
    marginBottom: '30px',
    borderRadius: '20px',
    background: 'lightgreen',
    opacity: 0.6,
    '& > .MuiLinearProgress-bar':{
      background: 'green'
    }
  },
  cost: {
    marginBottom: '20px',
  },
}));

export default function ScrollableTabsButtonForce(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const { stations } = props;

  const getValue = (value) => {
    return value;
  };

  const toogleConnector = (id, connector) => {
    const jwt = auth.isAuthenticated();
    const t = jwt.token;
    const data = {
      id: id,
      connector: connector.connectorId,
      //transactionId: connector.transactionId
    };

    stations.forEach((station) => {
      if (station.id === id) {
        station.connectors.forEach((conn) => {
          if (conn.connectorId == data.connector) {
            console.log(conn.value);
          }
        });
      }
    });

    fetch('/ocpp/chargerPoints/start/' + jwt.user._id, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authentication: 'Bearer ' + t,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.info(data);
      });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position='static' color='default'>
        <Tabs
          value={value}
          onChange={handleChange}
          variant='scrollable'
          scrollButtons='on'
          indicatorColor='primary'
          textColor='primary'
          aria-label='scrollable force tabs example'
        >
          {props.stations.length > 0 &&
            props.stations[0].connectors.map((station, idx) => {
              return (
                <Tab
                  key={idx}
                  label={'Conector ' + idx}
                  icon={<SettingsInputSvideo />}
                  {...a11yProps(idx)}
                />
              );
            })}
        </Tabs>
      </AppBar>
      {props.stations.length > 0 &&
        props.stations[0].connectors.map((station, idx) => {
          return (
            <TabPanel value={value} index={idx}>
              <div className={classes.connector}>
                <div className={classes.status}>{station.status}</div>
                <EvStation
                  className={classes.iconEv}
                  style={{
                    color: `${
                      station.status !== 'Available' ? '#7ab342' : '#f04d3a'
                    }`,
                  }}
                />
                {station.status !== 'Available' ? <LinearProgress className={classes.progress}/> : <div className={classes.progress}/>}
                <span className={classes.kwh}>
                  {station.value ? `${getValue(station.value)} kwh` : 0}
                </span>
                <span className={classes.cost}>
                  {station.value ? formatter.format(station.value * 600) : 0}
                </span>
                <Button
                  onClick={() => toogleConnector(props.stations[0].id, station)}
                  variant='contained'
                  style={{
                    backgroundColor: `${
                      station.status == 'Available' ? '#7ab342' : '#f04d3a'
                    }`,
                  }}
                >
                  Start
                </Button>
              </div>
            </TabPanel>
          );
        })}
    </div>
  );
}
