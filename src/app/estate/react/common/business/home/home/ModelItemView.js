'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
} from 'react-native';
import NavigationItem from '../../../../components/views/NavigationItem'
import { Label, Button } from 'teaset';

export default class extends React.Component {
    constructor() {
        super();
      };
    
    render() {
      return (
        <NavigationItem {...this.props}>
        <View style={styles.imageView}>
        <Image source={this.props.source} style={styles.image}/>
        <Label >{this.props.title}</Label>
        </View>
        </NavigationItem>
        
      );
    }
  };
  
  var styles = StyleSheet.create({
      image:{
          width:80,
          height:80
      },
      imageView:{
        width:80,
        height:120,
        // justifyContent:'center',
        alignItems:'center'
    },
  });