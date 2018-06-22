'use strict';
import React from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
export default class extends React.Component {
  constructor() {
    super();
  };

  render() {
    let { width } = Dimensions.get("window");
    return (
      <TouchableOpacity {...this.props}>
        <View style={{width: (width - 70) / 4,
    alignItems: 'center',}}>
          <Image source={this.props.source} style={{
    width: (width - 70) / 4,
    height: (width - 70) / 4
  }} />
          <Text >{this.props.title}</Text>
        </View>
      </TouchableOpacity>

    );
  }
};