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
  renderCheckBox = (onSelect, selected) => {
      <View style={{width:40, height:40, backgroundColor:'red'}} >
        {onSelect ? <DocCheckBoxView selected={selected} onSelect={onSelect} /> : null}
      </View>
    
  }
  render() {
    let {onPress, onSelect, selected, onMore} = this.props;
    onSelect = ()=>{};
    // onMore = ()=>{};
    return (
      <View style={{marginLeft: 20, flexDirection: 'row', alignItems: 'center',}}>
        {this.renderCheckBox(onSelect,selected)}
        <View style={{flex:1}}>
          {this.props.children}
        </View>
         {onMore ? <View style={{width:50, height:40}} ><DocMoreView onMore={onMore} /></View> : null} 
       </View>
    );
  }
};
