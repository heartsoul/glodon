'use strict';
import React from 'react';
import {
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
const imgSelect = require('app-images/icon_downloading_selected.png');
const imgUnSelect = require('app-images/icon_downloading_unselected.png');
export default class extends React.Component {
    
    static propTypes = {
        selected: PropTypes.any,
        onSelect: PropTypes.func,
    }

    constructor() {
        super();
        this.state = {
            selected:this.props.selected || false
        }
    };
    _getSelectImageSource = (selected) => {
        let url = selected ? imgSelect : imgUnSelect;
        return url;
    }
    render = () => {
        const {onSelect} = this.props;
        return (
            <TouchableOpacity activeOpacity={0.5} 
            onPress={(event) => { event.preventDefault();this.setState({selected:!this.state.selected}); onSelect && onSelect(event,this.state.selected) }}>
                <Image style={styles.checkImage} source={this._getSelectImageSource(this.state.selected)} />
            </TouchableOpacity>
        );
    }
};
const styles = StyleSheet.create({
    checkImage: {
        padding: 7,
        width: 16,
        height: 16,
        resizeMode: "contain"
    },
});