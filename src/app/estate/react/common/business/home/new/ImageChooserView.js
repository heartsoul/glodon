
import PropTypes from 'prop-types';
import React from 'react';
import { requireNativeComponent, processColor } from 'react-native';

class ImageChooserView extends React.Component {
    _onChange = (event) => {
        if (!this.props.onChange) {
            return;
        }

        // process raw event...
        this.props.onChange(event.nativeEvent);
    }
    render() {
        return (
            <GLDPhoto
                {...this.props}
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
};

var GLDPhoto = requireNativeComponent('GLDPhoto', ImageChooserView);

module.exports = ImageChooserView;