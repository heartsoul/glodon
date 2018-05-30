"use strict"

import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd-mobile';

const rightImage = require("app-images/icon_arrow_right_gray.png");
var { width, height } = Dimensions.get("window");
import * as API from "app-api";

class GLDDatePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        }
    }

    render() {
        return (
            <View>
                <TouchableOpacity activeOpacity={0.5} onPress={(event) => { this.setState({ visible: true }) }}>
                    <View style={[styles.containerView, this.props.style]}>
                        <View style={styles.titleView}>
                            <Text style={styles.title}>{this.props.title}</Text>
                        </View>
                        <Text style={styles.content}>{this.props.date ? API.formatUnixtimestampSimple(new Date(this.props.date).getTime()) : API.formatUnixtimestampSimple(new Date().getTime())}</Text>
                        <Image source={rightImage} style={styles.infoMark} />
                    </View>
                </TouchableOpacity>
                <DatePicker
                    mode="date"
                    title=" "
                    visible={this.state.visible}
                    onDismiss={() => this.setState({ visible: false })}
                    onOk={date => {
                        this.props.onDateChange(date);
                        this.setState({ visible: false })
                    }}
                    extra=" "
                    value={this.props.date ? new Date(this.props.date) : new Date()}
                >
                </DatePicker>
            </View>


        );
    }
}
GLDDatePicker.proptypes = {
    onDateChange: PropTypes.func,
}

export default GLDDatePicker;

const styles = StyleSheet.create({
    containerView: {
        marginBottom: 5,
        paddingLeft: 20,
        paddingRight: 20,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor:"#ffffff",
    },
    titleView: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 85,
    },
    title: {
        fontSize: 16,
        color: '#000000',
        fontWeight: '200',
    },

    infoMark: {
        marginRight: -1,
        width: 17,
        height: 17,
        resizeMode: 'contain'
    },
    content: {
        fontSize: 16,
        fontWeight: '100',
        flex: 1,
        alignContent: 'center',
        color: "#666666"
    },
})
