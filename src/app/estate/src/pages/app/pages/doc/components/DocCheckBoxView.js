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

    constructor(props) {
        super(props);
    };
    _getSelectImageSource = (selected) => {
        let url = selected ? imgSelect : imgUnSelect;
        return url;
    }
    render = () => {
        const {onSelect,selected} = this.props;
        return (
            <TouchableOpacity activeOpacity={0.5} 
            onPress={(event) => { event.preventDefault(); onSelect && onSelect(event,selected) }}>
                <Image style={styles.checkImage} source={this._getSelectImageSource(selected)} />
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