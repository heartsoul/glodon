
import PropTypes from 'prop-types';
import React from 'react';
// import ReactNative from 'ReactNative'
var ReactNative = require('ReactNative');
import { requireNativeComponent, processColor,NativeModules,UIManager,View  } from 'react-native';
const REF_PHOTO = 'gldPhoto';
var PM = NativeModules.GLDPhotoManager;
export default class ImageChooserView extends React.Component {
    _onChange = (event) => {
        if (!this.props.onChange) {
            return;
        }
        console.log(event.nativeEvent);
        // console.log(NativeModules.GLDPhotoManager);
       // NativeModules.GLDPhotoManager.loadFile();
        // process raw event...
        this.props.onChange(event.nativeEvent);
        const timer = setTimeout(() => {
            clearTimeout(timer);
            PM.loadFile(
                this.getViewHandle(),[],this._onLoadFile
                );
        }, 1500);
       
    }
    _onLoadFile = (files) =>{
         console.log(files);
    }
    /**
   * Returns the native `WebView` node.
   */
  getViewHandle = () => {
    return ReactNative.findNodeHandle(this.refs[REF_PHOTO]);
  };
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
    fireOnChange:PropTypes.string
};

var GLDPhoto = requireNativeComponent('GLDPhoto', ImageChooserView);

// module.exports = ImageChooserView;