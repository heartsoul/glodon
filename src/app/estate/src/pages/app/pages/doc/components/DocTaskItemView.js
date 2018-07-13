'use strict';
import React from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import DocFileItemView from './DocFileItemView'
import DocProcessView from './DocProcessView'

export default class extends React.Component {
  
  static DocFileItemView = DocFileItemView;
  static DocProcessView = DocProcessView;
  
  static propTypes = {
    onPress: PropTypes.func,
    onMore: PropTypes.func,
}
  constructor() {
    super();
  };
  
  render() {
    let {onMore, data={}} = this.props;
    return (
      <View style={{marginLeft: 0, flexDirection: 'row', alignItems: 'center',justifyContent:'center', height:60}}> 
        <View style={{flex:1}}>
          {this.props.children}
        </View>
         {onMore ? <View style={{width:50, height:40}} ><DocProcessView data={data} onMore={onMore} /></View> : null} 
       </View>
    );
  }
};
