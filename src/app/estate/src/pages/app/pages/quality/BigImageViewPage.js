import PhotoBrowser from 'react-native-photo-browser';
import React, { Component } from 'react';
import * as API from 'app-api';

export default class BigImageViewPage extends Component {
    static navigationOptions = {
       //1.隐藏导航头部
         header: null,
        title: '大图预览',
        gesturesEnabled: false,
    };
    constructor(props) {
        super(props)
        //3.获取传入的图片等信息
        const { params } = this.props.navigation.state;
        const media = params.media
        const index = params.index || 0;
        this.state = {
            media:media,
            bigMedia:[]
        }
        
    }
    componentWillMount (){
        let countAll = this.state.media.length;
        this.state.media.map((item, index) => {
          if(item.objectId) {
            API.getBimFileUrl(item.objectId,(success,data)=>{
                countAll --;
                let media = this.state.media;
                if(success) {
                    media[index].photo = data;
                }
                if(countAll < 1) {
                    this.setState(
                        {
                            bigMedia:[...media]
                        }
                    );
                }
            })
          }
            
        });
    }
    _goBack = () => {
       //2.点击返回关闭页面
        this.props.navigation.goBack()
    }
    render() {
        //3.获取传入的图片等信息
        const{ params } = this.props.navigation.state;
        const index = params.index || 0;
        if(this.state.bigMedia && this.state.bigMedia.length > 0) {
            return (
                <PhotoBrowser
                    onBack={this._goBack}
                    mediaList={this.state.bigMedia}
                    initialIndex={index}
                    displayActionButton={false}
                    displayTopBar={true}
                    displayNavArrows={true}
                />
            );
        }
        return (
            <PhotoBrowser
                onBack={this._goBack}
                mediaList={this.state.media}
                initialIndex={index}
                displayActionButton={false}
                displayTopBar={true}
                displayNavArrows={true}
            />
        );
    }
}
