'use strict';
import React from 'react';
import {
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import ThumbnailImage from "./../../navigation/bim/ThumbnailImage";
const folderImage = require("app-images/icon_blueprint_file.png");

export default class extends React.Component {
    
    static propTypes = {
        content: PropTypes.any,
        onPress: PropTypes.func,
        time:PropTypes.any,
    }
    
    constructor() {
        super();
    };

    render() {
        const {content,time, onPress} = this.props;
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={(event) => { event.preventDefault(); onPress(event); }}>
                <View style={styles.containerFolderView}>
                    <Image
                        source={folderImage}
                        style={styles.image} />
                    <View  style={styles.contentView}>
                        <Text numberOfLines={1} style={styles.content}>{content}</Text>
                        <Text numberOfLines={1} style={styles.time}>{time}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
};

const styles = StyleSheet.create({

    containerFolderView: {
        // height: 55,
        // marginTop:5,
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
        color: '#666666',
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
        height: 35,
    },
});