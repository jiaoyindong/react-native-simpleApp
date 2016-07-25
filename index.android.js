/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import TabBar from './Classes/TabBar/TabBar';
class LoveHome extends Component {
  render() {
    return (

        <TabBar></TabBar>
    );
  }
}


AppRegistry.registerComponent('LoveHome', () => LoveHome);
