
import PropTypes from 'prop-types';
import React from 'react';
import { requireNativeComponent, processColor ,View} from 'react-native';

class DemoView extends React.Component {
    _onChange = (event) => {
        if (!this.props.onChange) {
            return;
        }

        // process raw event...
        this.props.onChange(event.nativeEvent);
    }
    render() {
        return (
            <GLDDemo
                {...this.props}
                onChange={(e) => { this._onChange(e); }} title={this.props.title ? { title: this.props.title, color: processColor(this.props.color) } : { title: "按钮" }}
                backgroudColor={processColor(this.props.backgroudColor)}
            />
        );
    }
}
DemoView.propTypes = {
    /**
     * 背景色
     */

    backgroudColor: PropTypes.string,
    /**
    * 标题相关属性
    */
    title: PropTypes.shape({
        /**
         * 标题
         */
        title: PropTypes.string.isRequired,
        /**
         * 标题颜色
         */
        color: PropTypes.string,
    }),
    /**
    * 响应事件
    */
    onChange: PropTypes.func,
    ...View.propTypes,
};

var GLDDemo = requireNativeComponent('GLDDemo', DemoView);

module.exports = DemoView;