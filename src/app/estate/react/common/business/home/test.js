'use strict';
import React, {Component} from 'react';
import {
  Text,
  Button,
  View
} from 'react-native';


export default class extends React.Component {
  constructor() {
      super();
    };
  render() {
    return (
      <View>
      <Text style={styles.skipBtnText}>跳过</Text>
      </View>  
    );
  }
};