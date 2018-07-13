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
import DocFolderItemView from './DocFolderItemView'
import DocCheckBoxView from './DocCheckBoxView'
import DocMoreView from './DocMoreView'

export default class extends React.Component {
  
  static DocFileItemView = DocFileItemView;
  static DocFolderItemView = DocFolderItemView;
  static DocCheckBoxView = DocCheckBoxView;
  static DocMoreView = DocMoreView;
  
  static propTypes = {
    onSelect: PropTypes.func,
    onPress: PropTypes.func,
    onMore: PropTypes.func,
    selected:PropTypes.any,
    userPrivilege:PropTypes.any,
}
static defaultProps = {
  selected:false,
  "userPrivilege": {  //没有时是null
    "enter": false,
    "view": true,
    "download": false,
    "create": false,
    "update": false,
    "delete": false,
    "grant": false
  },
}
  constructor() {
    super();
  };
  
  render() {
    let {onSelect, selected = false, onMore} = this.props;
    return (
      <View style={{marginLeft: 0, flexDirection: 'row', alignItems: 'center',justifyContent:'center', height:60}}>
      {onSelect ? <View style={{width:40, height:40,alignItems:'center',justifyContent:'center'}} >
      <DocCheckBoxView selected={selected} onSelect={onSelect} /></View>:<View style={{width:20, height:40,alignItems:'center',justifyContent:'center'}} ></View>}
        <View style={{flex:1}}>
          {this.props.children}
        </View>
         {onMore ? <View style={{width:50, height:40}} ><DocMoreView onMore={onMore} /></View> : null} 
       </View>
    );
  }
};
