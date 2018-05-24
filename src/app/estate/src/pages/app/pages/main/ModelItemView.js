'use strict';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
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
        <Text >{this.props.title}</Text>
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
        // height:(width - 70) / 4 + 30,
        // justifyContent:'center',
        alignItems:'center',
    },
  });