/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter
} from 'react-native';
import _ from 'lodash';
import Kontakt from 'react-native-kontaktio';
const { connect, startScanning } = Kontakt;

const beacon_id = 'afc21e40-c7a1-11e7-abc4-cec278b6b50a';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const play = _.throttle(function() {
    fetch('http://xhub.ddns.net:5555/notifications?notification=play', {
        method: 'post'
    });
}, 20*1000);

export default class App extends Component<{}> {
  constructor() {
     super();
     this.state = {};
  }

  componentDidMount() {
    connect()
      .then(() => startScanning())
      .catch(error => console.log('error', error));

    DeviceEventEmitter.addListener(
      'beaconsDidUpdate',
      ({ beacons, region }) => {
          const beacon = _.filter(beacons, b => b.uuid === beacon_id)[0];
          if(beacon && beacon.proximity === 'NEAR' && this.state.proximity != 'NEAR') {
            this.setState({proximity: beacon.proximity});
            play();      
          }
      }
    );
  }

  render() {
	const proximity = this.state.proximity;
	const message = proximity === "NEAR"?
				<Text style={{color: '#30A9DE'}}>Playing Song</Text> :
				<Text style={{color: '#E53A40'}}>Couldn't detect beacon</Text>
							
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
			{ message }
		</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
