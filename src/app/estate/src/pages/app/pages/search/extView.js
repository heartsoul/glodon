import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput
} from 'react-native';
import PropTypes from 'prop-types';

export default class ExtView extends TextInput {

    constructor(props) {
        super(props);
        this.state = {};
        if(this.props.setRef){
            this.props.setRef(this)
        }
    }
}

ExtView.propTypes = {
    setRef: PropTypes.func,
}
