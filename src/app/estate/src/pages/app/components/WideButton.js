import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    StyleSheet,
    Dimensions,

} from 'react-native';
import PropTypes from 'prop-types';
var { width, height } = Dimensions.get("window");


const LIGHT_BTN = "light";
const GRAY_BTN = "gray";
const WHITE_BTN = "white";
/**
 * 宽按钮，可以设置type为蓝色按钮（light）、灰色按钮（gray），
 * 新建页面中的保存、删除，设置页面的退出登录可以使用,
 * 在使用时可以重写style
 */
class WideButton extends Component {

    constructor(props) {
        super(props);

        this.state = {
            underlayColor: this.getUnderLayColor(),
        };
    }

    getUnderLayColor = () => {
        if (this.props.type && this.props.type === GRAY_BTN) {
            return "#cbcbcb";
        }else if(this.props.type && this.props.type === WHITE_BTN){
            return "#ffffff";
        }
        return "#0099f3";
    }


    getTouchableStyle = () => {
        let touchableStyle = {};
        if (this.props.type && this.props.type === GRAY_BTN) {
            touchableStyle = this.state.pressed ? styles.grayViewPressed : styles.grayViewNormal;
        } else if (this.props.type && this.props.type === WHITE_BTN) {
            touchableStyle = this.state.pressed ? styles.whiteViewPressed : styles.whiteViewNormal;
        }else{
            touchableStyle = this.state.pressed ? styles.lightViewPressed : styles.lightViewNormal;
        }
        let ret = [touchableStyle];
        //如果设置了style，覆盖控件的style
        if (this.props.style) {
            ret.push(this.props.style)
        }
        return ret;
    }

    getTextStyle = () => {
        if (this.props.type && this.props.type === GRAY_BTN) {
            return styles.grayViewText;
        }else if(this.props.type && this.props.type === WHITE_BTN){
            return styles.whiteViewText;
        }
        return styles.lightViewText;
    }


    render() {
        return (
            <TouchableHighlight
                onPress={() => { this.props.onClick ? this.props.onClick() : console.log('require onClick prop') }}
                underlayColor={this.state.underlayColor}
                activeOpacity={1.0}
                style={this.getTouchableStyle()}
                onHideUnderlay={() => { this.setState({ pressed: false }); }}
                onShowUnderlay={() => { this.setState({ pressed: true }); }}
            >
                <Text style={this.getTextStyle()}>{this.props.text} </Text>
            </TouchableHighlight>
        );
    }
}

WideButton.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    type: PropTypes.string,//灰色按钮（gray）、蓝色按钮(light),默认使用蓝色
}

var styles = StyleSheet.create({

    lightViewNormal: {
        overflow: "hidden",
        height: 40,
        backgroundColor: "#00baf3",
        borderRadius: 38,
        marginLeft: 38,
        marginRight: 38,
        elevation: 1.5, // android 
        shadowColor: "#00baf3", // iOS
        shadowOffset: { width: 1.5, height: 5 }, // iOS
        shadowOpacity: 0.15, // iOS
        shadowRadius: 3, // iOS
    },

    lightViewPressed: {
        overflow: "hidden",
        height: 40,
        backgroundColor: "#33baf3",
        borderRadius: 20,
        marginLeft: 38,
        marginRight: 38,
        elevation: 1.5, // android 
        shadowColor: "#00baf3", // iOS
        shadowOffset: { width: 1.5, height: 5 }, // iOS
        shadowOpacity: 0.15, // iOS
        shadowRadius: 3, // iOS
    },
    lightViewText: {
        overflow: "hidden",
        height: 20,
        marginTop: 10,
        marginLeft: 38,
        marginRight: 38,
        borderRadius: 20,
        alignItems: "center",
        textAlign: "center",
        fontSize: 16,
        color: "#fff"
    },

    grayViewNormal: {
        overflow: "hidden",
        height: 40,
        backgroundColor: "#cbcbcb",
        borderRadius: 38,
        marginLeft: 38,
        marginRight: 38
    },

    grayViewPressed: {
        overflow: "hidden",
        height: 40,
        backgroundColor: "#cbcbcb",
        borderRadius: 20,
        marginLeft: 38,
        marginRight: 38
    },
    grayViewText: {
        overflow: "hidden",
        height: 20,
        marginTop: 10,
        marginLeft: 38,
        marginRight: 38,
        borderRadius: 20,
        alignItems: "center",
        textAlign: "center",
        fontSize: 16,
        color: "#5b5b5b"
    },

    whiteViewNormal: {
        overflow: "hidden",
        height: 40,
        backgroundColor: "#ffffff",
        borderRadius: 38,
        marginLeft: 38,
        marginRight: 38,
        elevation: 1.5, // android 
        shadowColor: "#333", // iOS
        shadowOffset: { width: 1.5, height: 5 }, // iOS
        shadowOpacity: 0.15, // iOS
        shadowRadius: 3, // iOS
    },

    whiteViewPressed: {
        overflow: "hidden",
        height: 40,
        backgroundColor: "#ffffff",
        borderRadius: 20,
        marginLeft: 38,
        marginRight: 38,
        elevation: 1.5, // android 
        shadowColor: "#333", // iOS
        shadowOffset: { width: 1.5, height: 5 }, // iOS
        shadowOpacity: 0.15, // iOS
        shadowRadius: 3, // iOS
    },
    whiteViewText: {
        overflow: "hidden",
        height: 20,
        marginTop: 10,
        marginLeft: 38,
        marginRight: 38,
        borderRadius: 20,
        alignItems: "center",
        textAlign: "center",
        fontSize: 16,
        color: "#000000"
    },
});
export default WideButton;