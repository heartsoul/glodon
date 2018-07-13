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
  
  static TaskItemView = DocFileItemView;
  static LogItemView = DocFileItemView;
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
      <View style={{marginLeft: 0, flexDirection: 'row', alignItems: 'center',justifyContent:'center', height:60, backgroundColor:'#FFFFFF'}}> 
        <View style={{flex:1}}>
          {this.props.children}
        </View>
         {onMore ?<Text style={{fontSize:12,color:'#00b1f1',paddingRight:5}} >下载中30%</Text> : null} 
         {onMore ? <View style={{width:28, height:28}} ><DocProcessView data={data} onMore={onMore} /></View> : null} 
       </View>
    );
  }
};
