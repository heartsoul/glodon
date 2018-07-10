'use strict';
import React from 'react';
import {
    TouchableOpacity,
    Text,
    Image,
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
            <TouchableOpacity style={{height:'100%',justifyContent:'center'}} activeOpacity={0.5} onPress={(event) => { event.preventDefault(); onMore && onMore(event) }}>
                <Image style={styles.moreView} source={require("app-images/doc/icon_doc_more.png")}/>
            </TouchableOpacity>
        );
    }
};
const styles = StyleSheet.create({
    moreView: {
        width:20,
        height:20,
        resizeMode: "contain",
    },
});