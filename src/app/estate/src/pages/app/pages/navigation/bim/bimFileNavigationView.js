'use strict'
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import PropTypes from 'prop-types'

var { width, height } = Dimensions.get("window");

export default class BimFileNavigationView extends Component {

    constructor(props) {
        super(props)
   
        this.state = {
            show: null,
        }
    }


    render() {
        return (
            <View style={[{ width: width, height: height, backgroundColor: "#00000033", position: "absolute", top: 248 }]}>
                <View style={{ width: width, height: 192, backgroundColor: "#ffffff" }}>
                    {
                        (this.props.dir) ? (
                            this.props.dir.map((item) => {
                                return <Text>{item.name}</Text>
                            })
                        ) : (null)
                    }
                </View>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => {
                }} />
            </View>

        )
    }
}

BimFileNavigationView.propTypes = {
    dir: PropTypes.array,
}