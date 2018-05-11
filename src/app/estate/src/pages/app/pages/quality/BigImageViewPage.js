import React, { Component } from 'react';

import { View, Modal, ActivityIndicator,StatusBar} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
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
        media.map((item,index)=>{
            item.url = item.photo;
            delete item.photo;
        });
        this.state = {
            media:[...media],
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
                    media[index].url = data;
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
    render() {
        //3.获取传入的图片等信息
        const{ params } = this.props.navigation.state;
        const index = params.index || 0;
        if(this.state.bigMedia && this.state.bigMedia.length > 0) {
            return (
                <Modal key={'big'} visible={true} transparent={true}>
                <ImageViewer  key={'bigImageView'} enableImageZoom={true} index={index} imageUrls={this.state.bigMedia} onClick={() => { // 图片单击事件
                        this.props.navigation.goBack();
                    }}/>
            </Modal>
            );
        }
        return (
            <View style={{flex:1,alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
            <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
            <ActivityIndicator
                animating={true}
                style={[{ height: 80 }]}
                color='#00baf3'
                size="large"
            />
        </View>
        );
    }
}


