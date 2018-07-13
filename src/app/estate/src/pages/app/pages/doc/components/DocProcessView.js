'use strict';
import React from 'react';
import {
    TouchableOpacity,
    Text,
    Image,
    StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import {CircleProgressView} from 'app-components'
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
                <CircleProgressView raduis={14} progressWidth={2} baseProgressWidth={1} progressColor={'#00B0F1'} progressBaseColor={'#E6E6E6'} >
                <Image source={require('app-images/icon_download.png')} style={{width:34,height:34}}  />
                {/* <Text style={{color:'#666666',fontSize:9,textAlign:'center'}}>||</Text> */}
                </CircleProgressView>
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