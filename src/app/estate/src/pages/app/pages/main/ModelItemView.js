'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity
} from 'react-native';
import { Label } from 'app-3rd/teaset';

export default class extends React.Component {
    constructor() {
        super();
      };
    
    render() {
      return (
        <TouchableOpacity {...this.props}>
        <View style={styles.imageView}>
        <Image source={this.props.source} style={styles.image}/>
        <Label >{this.props.title}</Label>
        </View>
        </TouchableOpacity>
        
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