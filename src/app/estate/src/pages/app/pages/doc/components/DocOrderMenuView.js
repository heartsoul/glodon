'use strict';
import React from 'react';
import {
    TouchableOpacity,
    Text,
    Image,
    StyleSheet,
    View,
} from 'react-native';
import PropTypes from 'prop-types';

// 排序类型
export const OrderTypeDefault = '';
export const OrderTypeTime = 'time';
export const OrderTypeName = 'name';

// 排序方向
export const OrderDirectionDefault = 'asc'; // 升序
export const OrderDirectionAsc = 'asc'; // 升序
export const OrderDirectionDesc = 'desc'; // 降序 

// const image_down_click = require('app-images/doc/icon_doc_order_down_click.png');
// const image_up_click = require('app-images/doc/icon_doc_order_up_click.png');
const image_down = require('app-images/doc/icon_doc_order_down.png');
const image_up = require('app-images/doc/icon_doc_order_up.png');

export default class extends React.Component {
    
    static propTypes = {
        orderType:PropTypes.oneOf([OrderTypeDefault,OrderTypeTime, OrderTypeName, null]), // OrderTypeTime | OrderTypeName | OrderTypeDefault default
        orderDirection:PropTypes.oneOf([OrderDirectionDefault,OrderDirectionAsc,OrderDirectionDesc, null]), // OrderDirectionAsc | OrderDirectionDesc | OrderDirectionDefault default
        onChangeOrderType: PropTypes.func, // changeOrderType(event,orderType) see orderType
    }

    constructor() {
        super();
    };
    render() {
        const { onChangeOrderType, orderType, orderDirection } = this.props;

        return (
            <View>
                <TouchableOpacity style={styles.style_button} onPress={(event) => {event.preventDefault(); onChangeOrderType(event,OrderTypeTime); }}>
                    <Text style={[styles.style_text, orderType === OrderTypeTime ? styles.style_text_selected : {}]}>文件时间</Text>
                    <Image
                        style={[styles.style_image, orderType === OrderTypeTime ? styles.style_image_selected : {}]}
                        source={image_down} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.style_button} onPress={(event) => { event.preventDefault(); onChangeOrderType(event,OrderTypeName);  }}>
                    <Text style={[styles.style_text, orderType === OrderTypeName ? styles.style_text_selected : {}]}>文件名称</Text>
                    <Image
                        style={[styles.style_image, orderType === OrderTypeName ? styles.style_image_selected : {}]}
                        source={image_up} />
                </TouchableOpacity>
            </View>
        );
    }
};
const styles = StyleSheet.create({
    style_button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    style_text: {
        lineHeight: 30,
        fontSize:15, 
        color: '#FFFFFF',
    },
    style_text_selected: {
        color: '#00baf3'
    },
    style_image: {
        paddingLeft:10,
        width: 14, 
        height: 14, 
        resizeMode: 'contain'
    },
    style_image_selected: {
        tintColor: '#00baf3'
    },
});

