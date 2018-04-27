
import PropTypes from 'prop-types';
import React from 'react';
// import ReactNative from 'ReactNative'
var ReactNative = require('ReactNative');
import { requireNativeComponent, processColor,NativeModules,UIManager,View  } from 'react-native';
const REF_PHOTO = 'gldPhoto';
var PM = NativeModules.GLDPhotoManager;
export default class ImageChooserView extends React.Component {
    _onChange = (event) => {
        
        PM.loadFile({"handleId":this.getViewHandle()},this._onLoadFile);

        if (!this.props.onChange) {
            return;
        }
        this.props.onChange();
        
    }
    _onLoadFile = (files) =>{
        //  console.log(files);
    }
    /**
     * 获取GLDPhoto中的选中的图片信息
     * @param {*} _onLoadFile 拿到文件信息后的回调方法
     */
    _loadFile(_onLoadFile){
        PM.loadFile({"handleId":this.getViewHandle()},(param)=>{
            _onLoadFile(param)
        });
    }
     /**
     * 启动拍照
     */
   static takePhoto=(retFun)=>{
        PM.takePhoto(
            (data,bSuccess) => {
            //   console.log(data);
              retFun(data,bSuccess)
            }
          );
    }
    
     /**
     * 启动相册选择
     */
   static pickerImages=(retFun)=>{
    PM.pickerImages(
        (data,bSuccess) => {
        //   console.log(data);
          retFun(data,bSuccess)
        }
      );
    }
    
    /**
   * Returns the native `WebView` node.
   */
  getViewHandle = () => {
    return ReactNative.findNodeHandle(this.refs[REF_PHOTO]);
  };
  componentDidMount () {
    //   if(this.props.needTakePhoto) {
    //     this.takePhoto();
    //     return;
    //   }
    //   if(this.props.needPickerImages) {
    //     this.pickerImages();
    //     return;
    //   }
  }
    render() {
        return (
            <GLDPhoto
                {...this.props}
                ref ={REF_PHOTO}
                onChange={(e) => { this._onChange(e); }} title={this.props.title ? { title: this.props.title.title, color: processColor(this.props.color) } : { title: "按钮" }}
                backgroudColor={processColor(this.props.backgroudColor)}
            />
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
    /**
     * 已有文件
     */
    files:PropTypes.array,
    /**
     * 是否要弹出拍照
     */
    needTakePhoto:PropTypes.bool,
    /**
     * 是否要弹出相册，与needTakePhoto
     */
    needPickerImages:PropTypes.bool,
};

var GLDPhoto = requireNativeComponent('GLDPhoto', ImageChooserView);

// module.exports = ImageChooserView;