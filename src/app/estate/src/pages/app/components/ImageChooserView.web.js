
import PropTypes from 'prop-types';
import React from 'react';
import { processColor,NativeModules,TouchableOpacity,UIManager,View , Image } from 'react-native';
import {ActionSheet} from 'app-3rd/teaset';
import {ActionModal} from 'app-components';

import { ImagePicker } from 'antd-mobile';

const REF_PHOTO = 'gldPhoto';
const icon_add_picture = require('app-images/icon_add_picture.png')
const icon_login_password_delete = require('app-images/login/icon_login_password_delete.png')

function compressImg(imgData, maxHeight, onCompress) {

    if (!imgData) return;

    onCompress = onCompress || function () { };
    maxHeight = maxHeight || 200;//默认最大高度200px
    var canvas = document.createElement('canvas');
    var img =  document.createElement('img');

    img.onload = function () {
        if (img.height > maxHeight) {//按最大高度等比缩放
            img.width *= maxHeight / img.height;
            img.height = maxHeight;
        } else if (img.width > maxHeight) {//按最大宽度等比缩放
            img.height *= maxHeight / img.width;
            img.width = maxHeight;
        } else {
            onCompress(imgData,null);
            return;
        }
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height); // canvas清屏
        //重置canvans宽高 
        canvas.width = img.width; 
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height); // 将图像绘制到canvas上 
        onCompress(canvas.toDataURL("image/png"),null);//必须等压缩完才读取canvas值，否则canvas内容是黑帆布

    };
    // 记住必须先绑定事件，才能设置src属性，否则img没内容可以画到canvas
    img.src = imgData;
}

/**
 * 启动相册选择 retFun([{url,name,length,...}],success)
 * multiple 是否多选 PS：如果设置了这个属性为true，那么capture属性就无效了，等同于选择所有文件/相册/拍照 
 * capture camera,audio,video
 */
function chooseImages(retFun,retFiles = [],maxLength = 3,multiple=false,capture='camera'){
    // ActionModal.alertTip('敬请期待',null,{text:'知道了'});
    let input = document.createElement('input');
    input.hidden = true;
    input.type = 'file';
    input.multiple = multiple;
    if(!multiple) {
        input.capture = capture;
    }
    input.accept = 'image/*';

    input.onchange=(ev)=>{
        let itemCount = ev.target.files.length;
        if(itemCount > maxLength) {
            ActionModal.alertTip('数量超过限制',null,{text:'知道了'});
            retFun(retFiles,false);
            return;
        }
        retFiles = retFiles||[];
        for(let i = 0; i < itemCount; i++) {
            let file = ev.target.files[i];
            if(!/image\/\w+/.test(file.type)){
                ActionModal.alertTip('请确保文件为图像类型',null,{text:'知道了'});
                retFun(retFiles,false);
                return;
            }//判断是否图片，在移动端由于浏览器对调用file类型处理不同，虽然加了accept = 'image/*'，但是还要再次判断
            
            let reader = new FileReader();
             reader.readAsDataURL(file);
             reader.onload = function(e){
                reader = null;
                compressImg(e.target.result,1136,(url,blob)=>{
                    file.url = url;
                    compressImg(url,160,(thumbUrl,thumbBlob)=>{
                        itemCount--;
                        file.thumbUrl = thumbUrl;
                        retFiles.push({url:url,thumbUrl:thumbUrl,name:file.name||'image',type:'h5',length:file.size||0,lastModified:file.lastModified,file:file})
                        if(itemCount <= 0) {
                            retFun(retFiles,true);
                        }
                    })
                })
             };
        };
       
    }
    input.click();
    // PM.pickerImages(
//     (data,bSuccess) => {
//     //   console.log(data);
//       retFun(data,bSuccess)
//     }
//   );
}

export default class ImageChooserView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files:this.props.files || []
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
    //    ActionModal.alertTip('敬请期待',null,{text:'知道了'});
    chooseImages(retFun,[],maxLength,false);
       
    // PM.takePhoto(
    //     (data,bSuccess) => {
    //     //   console.log(data);
    //       retFun(data,bSuccess)
    //     }
    //   );
}

 /**
 * 启动相册选择 retFun([{url,name,length,...}],success)
 */
    static pickerImages=(retFun,maxLength = 3)=>{
    chooseImages(retFun,[],maxLength,true);
    
    // PM.pickerImages(
//     (data,bSuccess) => {
//     //   console.log(data);
//       retFun(data,bSuccess)
//     }
//   );
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
                    chooseImages(retFun,retFiles,3 - this.state.files.length,false);
                    // storage.pushNext(null, "QualityDetailPage", { "item": item });
                }
            });
            items.push({
                title: "相册",
                onPress: () => {
                    chooseImages(retFun,retFiles,3 - this.state.files.length,true);
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
            <Image style={{marginRight:5,width:80,height:80,backgroundColor:'white',resizeMode:'contain'}} source={icon_add_picture}/></TouchableOpacity>
        }
        return null;
    }
    renderImageItem = (url,index) => {
        return <View key={'img_item_'+index} style={{marginRight:5}}>
            <TouchableOpacity onPress={()=>this.onBigImage(index)}>
            <Image style={{marginRight:5,width:80,height:80,resizeMode:'contain'}} source={{uri:url}}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>this.onDeleteImage(index)} style={{position:'absolute',top:0,right:0}}>
            <Image style={{width:20,height:20,backgroundColor:'white',resizeMode:'contain'}} source={icon_login_password_delete}/>
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
        return (
            <View
                {...this.props}
                ref ={REF_PHOTO}
                style={[{flexDirection:'row',width:'100%',height:100,backgroundColor:this.props.backgroudColor},{...this.props.style}]}
            >
            {this.renderImage()}
            {this.renderAdd()}
            </View>
        );
    }
}
ImageChooserView.propTypes = {
    // /**
    //  * 背景色
    //  */

    // backgroudColor: PropTypes.oneOfType(PropTypes.number, PropTypes.string),
    // /**
    // * 标题相关属性
    // */
    // title: PropTypes.shape({
    //     /**
    //      * 标题
    //      */
    //     title: PropTypes.string.isRequired,
    //     /**
    //      * 标题颜色
    //      */
    //     color: PropTypes.number | PropTypes.string,
    // }),
    /**
    * 响应事件
    */
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
    ...View.propTypes,
    fireOnChange:PropTypes.string
};

var GLDPhoto = {
    
}
// requireNativeComponent('GLDPhoto', ImageChooserView);

// module.exports = ImageChooserView;