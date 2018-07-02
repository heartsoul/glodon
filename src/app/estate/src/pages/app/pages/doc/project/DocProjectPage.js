/**
 * Created by Soul on 2018/03/16.
 */
'use strict';
import { TabView } from 'app-3rd/teaset';
import API from 'app-api';
import { BarItems } from "app-components";
import React, { Component } from "react";
import { SafeAreaView, View } from "react-native";
import DocProjectFavListView from './DocProjectFavListView';
import DocProjectFileListView from './DocProjectFileListView';
import DocProjectTransListView from './DocProjectTransListView';
import DocProjectTrashListView from './DocProjectTrashListView';

class Xxxx extends Component {
    render(){
        return <View></View>
    }
}

export default class DocProjectPage extends Component {
    
    constructor(props) {
        super(props);
    }
  render() {
    return (
    <SafeAreaView style={{height:'100%',backgroundColor:"#f5f8f9"}}>
    <TabView style={{ flex: 1,overflow:'visible'}} type='projector'>
      <TabView.Sheet
        title={'项目文档'}
        icon={require('app-images/home/icon_main_main_page.png')}
        activeIcon={require('app-images/home/icon_main_page_selected.png')}
      >
        <DocProjectFileListView navigation={this.props.navigation} />
      </TabView.Sheet>
      <TabView.Sheet
        title={'传输列表'}
        icon={require('app-images/home/icon_main_subscribe.png')}
        activeIcon={require('app-images/home/icon_main_subscribe_selected.png')}
      >
        <DocProjectTransListView navigation={this.props.navigation} />
      </TabView.Sheet>
     
      <TabView.Sheet
        title={'收藏列表'}
        icon={require('app-images/home/icon_main_message.png')}
        activeIcon={require('app-images/home/icon_main_message_selected.png')}
      >
        <DocProjectFavListView navigation={this.props.navigation} />
      </TabView.Sheet>
      <TabView.Sheet
        title={'回收站'}
        icon={require('app-images/home/icon_main_mine.png')}
        activeIcon={require('app-images/home/icon_main_mine_selected.png')}
      // badge={'new'}
      >
        <DocProjectTrashListView navigation={this.props.navigation} /> 
      </TabView.Sheet>
    </TabView>
    </SafeAreaView>);

  }
}
