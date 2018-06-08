
import PropTypes from 'prop-types';
import React from 'react';
import { processColor, NativeModules, TouchableOpacity, UIManager, View, Image } from 'react-native';
import { ActionSheet } from 'app-3rd/teaset';
import { ActionModal } from 'app-components';
import { ImagePicker } from 'antd-mobile';
import { chooseImages } from './ImageManager';

const icon_add_picture = require('app-images/icon_add_picture.png')
const icon_login_password_delete = require('app-images/login/icon_login_password_delete.png')

export default class ImageChooserView extends React.Component {
    constructor(props) {
        super(props);
        let files = [];
        if(this.props.files){
            this.props.files.map((item)=>{
                files.push(item)
            })
        }
        this.state = {
            files:files
        }
    }
    _onChange = (event) => {
        if (!this.props.onChange) {
            return;
        }
    }
    _onLoadFile = (files) =>{
         console.log(files);
    }
    onBigImage = (index) => {
        this.bigImage(this.state.files,index);
    }
    bigImage = (images, index) => {
        let media = [];
        images.map((item, index) => {
            media.push({
                photo: item.url,
                objectId: item.objectId
            });
        });
        storage.pushNext(null, 'BigImageViewPage', { media: media, index: index })

    }
     /**
     * 启动拍照
     */
   static takePhoto=(retFun,maxLength = 3)=>{
        chooseImages(retFun,[],maxLength,false);
    }   

    /**
     * 启动相册选择 retFun([{url,name,length,...}],success)
     */
    static pickerImages=(retFun,maxLength = 3)=>{
        chooseImages(retFun,[],maxLength,true);
    }
    /**
     * 获取GLDPhoto中的选中的图片信息
     * @param {*} _onLoadFile 拿到文件信息后的回调方法
     */
    _loadFile(_onLoadFile){
        if(!_onLoadFile) {
            return;
        }
        let retFiles = [];

        this.state.files.map((item,index)=> {
           retFiles.push(item);
        });
        _onLoadFile(retFiles)
       
    }
    onDeleteImage = (index) => {
        ActionModal.alertConfirm('您确认删除此图片么？',null,{text:'删除',style:{color:'red',fontSize:18},onPress:()=>{
            this.state.files.splice(index,1);
            this.setState({files:this.state.files});
        }},{text:'取消'});
    }
    onAddImage = () => {
        let maxLength = this.props.maxSelectedCount || 3;
        let retFun = (files,success)=>{
            if(success) {
                this.setState({
                    files:files
                });
            }
        };
        let retFiles = this.state.files;
        let items = [];
            items.push({ 
                title: "拍照",
                onPress: () => {
                    chooseImages(retFun,retFiles,maxLength - this.state.files.length,false);
                    // storage.pushNext(null, "QualityDetailPage", { "item": item });
                }
            });
            items.push({
                title: "相册",
                onPress: () => {
                    chooseImages(retFun,retFiles,maxLength - this.state.files.length,true);
                    // storage.pushNext(null, "QualityDetailPage", { "item": item });
                }
            });
        let cancelItem = { title: '取消' };
        if (items.length > 0) {
            ActionSheet.show(items, cancelItem);
        }
    }
    renderAdd = () => {
        if(this.state.files && this.state.files.length < 3) {
            
            return <TouchableOpacity onPress={this.onAddImage}>
            <Image style={{marginTop:5,marginRight:5,width:80,height:80,backgroundColor:'white',resizeMode:'contain'}} source={icon_add_picture}/></TouchableOpacity>
        }
        return null;
    }
    renderImageItem = (url,index) => {
        return <View key={'img_item_'+index} style={{marginRight:5}}>
            <TouchableOpacity onPress={()=>this.onBigImage(index)}>
            <Image style={{marginTop:5,marginRight:5,width:80,height:80,resizeMode:'cover'}} source={{uri:url}}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>this.onDeleteImage(index)} style={{position:'absolute',top:0,right:0}}>
            <Image style={{width:20,height:20,backgroundColor:'transparent',resizeMode:'contain'}} source={icon_login_password_delete}/>
            </TouchableOpacity>
            </View>
    }
    renderImage = () => {
        return (
        this.state.files.map((item,index)=>{
            return this.renderImageItem(item.thumbUrl ? item.thumbUrl : item.url,index);
        })
        )
    }
    render = () =>{
        console.log('render1');
        return (
            <View
                {...this.props}
                style={[{flexDirection:'row',width:'100%',height:100,backgroundColor:this.props.backgroudColor},{...this.props.style}]}
            >
            {this.renderImage()}
            {this.renderAdd()}
            </View>
        );
    }
}
ImageChooserView.propTypes = {
   
    /**
     * 背景颜色
     */
    backgroudColor: PropTypes.string,

    /**
     * 最大选择图片数
     */
    maxSelectedCount: PropTypes.number,

    /**
     * 是否有拍照选择功能
     */
    isShowTakePhotoSheet: PropTypes.bool,
    onChange: PropTypes.func,
    ...View.propTypes
};