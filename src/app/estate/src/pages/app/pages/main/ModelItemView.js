'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { Label } from 'app-3rd/teaset';
var { width, height } = Dimensions.get("window");
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
          width: (width - 70) / 4,
          height:(width - 70) / 4
      },
      imageView:{
        width:(width - 70) / 4,
        height:(width - 70) / 4 + 40,
        // justifyContent:'center',
        alignItems:'center'
    },
  });