import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import {Modal} from "antd-mobile"

export default class ActionModal extends Component {
    static alertConfirm = (title, message, cancel, confirm) => {
        if(!cancel.style) {
            cancel.style = styles.style_cancel
        }
        if(!cancel.text) {
            cancel.text = "取消"
        }
        if(!confirm.style) {
            confirm.style = styles.style_confirm
        }
        if(!confirm.text) {
            confirm.text = "确定"
        }
        let titleElement = (<Text style={styles.style_title}>{title}</Text>);
        let messageElement = (<Text style={styles.style_message}>{message}</Text>);
        Modal.alert(titleElement, messageElement, [{ text: cancel.text,style: [styles.style_cancel, cancel.style]}
            ,{ text: confirm.text, style: [styles.style_confirm,confirm.style], onPress:confirm.onPress ? confirm.onPress:null}]);
    };
    static alertTip = (title, message, confirm) => {
        if(!confirm.style) {
            confirm.style = styles.style_confirm
        }
        if(!confirm.text) {
            confirm.text = "确定"
        }
        let titleElement = (<Text style={styles.style_title}>{title}</Text>);
        let messageElement = (<Text style={styles.style_message}>{message}</Text>);
        Modal.alert(titleElement, messageElement, [{ text: confirm.text, style: [styles.style_confirm,confirm.style], onPress:confirm.onPress ? confirm.onPress:null}]);
    };
    static alert = (title, message, actions) => {
        let titleElement = (<Text style={styles.style_title}>{title}</Text>);
        let messageElement = (<Text style={styles.style_message}>{message}</Text>);
        Modal.alert(titleElement, messageElement, actions);
    };

}

const styles = StyleSheet.create({
    style_title: {
        color: '#000000'
    },
    style_message: {
        color: '#000000'
    },
    style_cancel: {
        color: '#000000'
    },
    style_close: {
        color: '#00baf3'
    },
    style_confirm: {
        color: '#00baf3'
    },
    style_delete: {
        color: '#FF0000'
    },
});


