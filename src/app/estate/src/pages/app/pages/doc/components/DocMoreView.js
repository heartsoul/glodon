'use strict';
import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

export default class extends React.Component {
    
    static propTypes = {
        onMore: PropTypes.func,
    }

    constructor() {
        super();
    };
    render() {
        const {onMore} = this.props;
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={(event) => { event.preventDefault(); onMore && onMore(event) }}>
                <Text style={styles.moreView}>...</Text>
            </TouchableOpacity>
        );
    }
};
const styles = StyleSheet.create({
    moreView: {
        padding: 7,
    },
});