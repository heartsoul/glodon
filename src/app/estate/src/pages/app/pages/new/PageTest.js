"use strict"

import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';

import PropTypes from 'prop-types';

class PageTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
        };
    }

    componentDidMount() {
        console.log('====================================');
        console.log(`componentDidMount ${this.props.title}`);
        console.log(this.props.navigation)
        console.log('====================================');
    }

    componentWillReceiveProps(nextProps) {
        console.log('====================================');
        console.log(`componentWillReceiveProps ${this.props.title}`);
        console.log('====================================');
    }

    render() {
        console.log('====================================');
        console.log(`render ${this.props.title}`);
        console.log('====================================');
        return (
            <View>
                <Text>page{this.props.title}</Text>

                <TouchableOpacity onPress={() => {
                    let c = this.state.count + 1;
                    this.setState({
                        count: c,
                    });
                }}>
                    <Text style={{ width: 120, height: 36, backgroundColor: "#cccccc" }}>click</Text>
                </TouchableOpacity>

                <Text>{this.state.count}</Text>
            </View>
        );
    }
}
PageTest.propTypes = {
    title: PropTypes.number,
}


export default PageTest;