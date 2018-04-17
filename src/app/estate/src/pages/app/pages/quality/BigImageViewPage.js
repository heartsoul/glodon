import PhotoBrowser from 'react-native-photo-browser';
import React, { Component } from 'react';

export default class BigImageViewPage extends Component {
    static navigationOptions = {
       //1.隐藏导航头部
         header: null,
        title: '大图预览',
        tabBarVisible: false,
        headerTintColor: "#FFF",
        headerStyle: { backgroundColor: "#00baf3" },
        gesturesEnabled: false,
    };
    _goBack = () => {
       //2.点击返回关闭页面
        this.props.navigation.goBack()
    }
    render() {
        //3.获取传入的图片等信息
        const { params } = this.props.navigation.state;
        const media = params.media
        const index = params.index || 0;
        return (
            <PhotoBrowser
                onBack={this._goBack}
                mediaList={media}
                initialIndex={index}
                displayActionButton={false}
                displayTopBar={true}
                displayNavArrows={true}
            />
        );
    }
}
