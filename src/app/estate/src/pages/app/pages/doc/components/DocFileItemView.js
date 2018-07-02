'use strict';
import React from 'react';
import {
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import DocImageView from "./DocImageView";

export default class extends React.Component {
    
    static propTypes = {
        content: PropTypes.any,
        fileId: PropTypes.any,
        onPress: PropTypes.func,
        ext:PropTypes.any,
        time:PropTypes.any,
    }

    constructor() {
        super();
    };

    render() {
        const {content,time, fileId, onPress, ext} = this.props;
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={(event) => { event.preventDefault(); onPress&&onPress(event); }}>
                <View style={styles.containerFileView}>
                    <DocImageView imageStyle={styles.image} ext={ext} />
                    <View style={styles.contentView}>
                        <Text numberOfLines={1} style={styles.content}>{content}</Text>
                        <Text numberOfLines={1} style={styles.time}>{time}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
};
const styles = StyleSheet.create({

    containerFileView: {
        // height: 60,
        flexDirection: 'row',
        alignItems: 'center'
    },

    contentView: {
        flex: 1,
        marginLeft: 12,
    },
    content: {
        textAlign: "left",
        fontSize: 15,
        color: 'black',
        // textOverflow:'ellipsis',
        // whiteSpace:'nowrap',
        overflow:'hidden',
        lineHeight:20
    },
    time: {
        textAlign: "left",
        fontSize: 10,
        color: '#cccccc',
        lineHeight:20
    },
    image: {
        width: 42,
        height: 42,
    },
});