import React, { Component } from 'react';

import { View, Modal, ActivityIndicator, StatusBar } from 'react-native';
import ImageViewer from 'react-wx-images-viewer';

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
        const { params = {media:[],index:0} } = this.props.navigation.state;
        
        const media = params.media || [];
        const index = params.index || 0;
        let smallMedia = [];
        media.map((item, index) => {
            item.url = item.photo;
            delete item.photo;
            smallMedia.push(item.url);
        });
        // media.push({url:"http://img.zcool.cn/community/01c60259ac0f91a801211d25904e1f.jpg@1280w_1l_2o_100sh.jpg"});
        // media.push({url:"http://img.zcool.cn/community/01c53f5567f0930000016756edc878.jpg@1280w_1l_2o_100sh.png"});
        // media.push({url:"http://img.zcool.cn/community/01080755c1edaf32f87528a18e9840.jpg@900w_1l_2o_100sh.jpg"});
        // media.push({url:"http://img.zcool.cn/community/01c60259ac0f91a801211d25904e1f.jpg@1280w_1l_2o_100sh.jpg"});
        // media.push({url:"http://img.zcool.cn/community/01c53f5567f0930000016756edc878.jpg@1280w_1l_2o_100sh.png"});
        // media.push({url:"http://img.zcool.cn/community/01080755c1edaf32f87528a18e9840.jpg@900w_1l_2o_100sh.jpg"});
        // media.push({url:"http://img.zcool.cn/community/01c60259ac0f91a801211d25904e1f.jpg@1280w_1l_2o_100sh.jpg"});
        // media.push({url:"http://img.zcool.cn/community/01c53f5567f0930000016756edc878.jpg@1280w_1l_2o_100sh.png"});
        // media.push({url:"http://img.zcool.cn/community/01080755c1edaf32f87528a18e9840.jpg@900w_1l_2o_100sh.jpg"});
       
        this.state = {
            media: [...media],
            bigMedia: [],
            smallMedia: smallMedia,
            modalVisible: true,
        }


    }
    toUrls = (media) =>{
        let ret = [];
        media.map((item,index)=>{
            if(item.url){
                ret.push(item.url);
            }
        }
        );

        return ret;
    }
    componentWillMount = () => {
        let countAll = this.state.media.length;
        let media = this.state.media;
        this.state.media.map((item, index) => {
            if (item.objectId) {
                API.getBimFileUrl(item.objectId, (success, data) => {
                    countAll--;
                    if (success) {
                        media[index].url = data;
                    }
                    if (countAll < 1) {
                        this.setState(
                            {
                                bigMedia: this.toUrls(media)
                            }
                        );
                    }
                }).catch((err) => {
                    countAll--;
                    if (countAll < 1) {
                        this.setState(
                            {
                                bigMedia: this.toUrls(media)
                            }
                        );
                    }
                })
            } else {
                countAll--;
                if (countAll < 1) {
                    this.setState(
                        {
                            bigMedia: this.toUrls(media)
                        }
                    );
                }
            }

        });
    }
    _setModalVisible(visible) {
        this.setState({ modalVisible: visible });
        storage.pop(this.props.navigation, 1);
    }

    render() {
        //3.获取传入的图片等信息
        const { params = {index:0} } = this.props.navigation.state;
        const index = params.index || 0;
        if (this.state.bigMedia && this.state.bigMedia.length > 0) {
            return (
                <Modal
                    key={'big'} visible={this.state.modalVisible} transparent={true} onRequestClose={() => { this._setModalVisible(false) }}>
                    <ImageViewer key={'bigImageView'} index={index} urls={this.state.bigMedia} onClose={() => { // 图片单击事件
                        this.props.navigation.goBack();
                    }} />
                </Modal>
            );
        } 
       return <Modal
                    key={'big'} visible={this.state.modalVisible} transparent={true} onRequestClose={() => { this._setModalVisible(false) }}>
                    <ImageViewer key={'bigImageView'} index={index} urls={this.state.smallMedia} onClose={() => { // 图片单击事件
                        this.props.navigation.goBack();
                    }} />
                </Modal>

        // return (
        //     <View onClick={() => { // 图片单击事件
        //         this.props.navigation.goBack();
        //     }} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        //         <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
        //         <ActivityIndicator
        //             animating={true}
        //             style={[{ height: 80 }]}
        //             color='#00baf3'
        //             size="large"
        //         />
        //     </View>
        // );
    }
}


