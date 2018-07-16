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

import DocTaskRunningItemView from './DocTaskRunningItemView'
import DocTaskLoggingItemView from './DocTaskLoggingItemView'
import DocTaskStateView from './DocTaskStateView'

export default class extends React.Component {
  
  static DocTaskRunningItemView = DocTaskRunningItemView;
  static DocTaskLoggingItemView = DocTaskLoggingItemView;
  
  static propTypes = {
    onPress: PropTypes.func,
    onMore: PropTypes.func,
}
  constructor() {
    super();
  };
  renderTaskStateView() {
    let {onMore, data={}} = this.props;
      //  {/* {onMore ?<Text style={{fontSize:12,color:'#00b1f1',paddingRight:5}} >下载中30%</Text> : null}  */}
      //    {/* {onMore ? <View style={{width:28, height:28}} ><DocProcessView data={data} onMore={onMore} /></View> : null}  */}
      
    if(!onMore) { 
      return null;
    }
    return (<DocTaskStateView data = {data} onPress={onMore} />);

  }
  render() {
    return (
      <View style={{marginLeft: 0, flexDirection: 'row', alignItems: 'center',justifyContent:'center', height:60, backgroundColor:'#FFFFFF'}}> 
        <View style={{flex:1,justifyContent:'center',height:'100%'}}>
          {this.props.children}
        </View>
        {this.renderTaskStateView()}
       </View>
    );
  }
};
