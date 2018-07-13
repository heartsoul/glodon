import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text, Image, StatusBar, Platform } from 'react-native';
export const defaultImage = require('app-images/icon_no_data.png')
export default class NoDataView extends React.Component {
    static NoDataImage = defaultImage;
    render = () => {
        const {text, image, onPress, type, style={}, imageStyle={}, textStyle={},paddingTopViewStyle={},paddingBottomViewStyle={}} = this.props;
        return (
            <View style={[{height:'100%',width:'100%', alignItems: 'center',backgroundColor:'#FFFFFF', justifyContent: 'center', flexDirection: 'column' },style]}>
                {image ? <Image style={[{width:188,height:183},imageStyle]} source={image}/> : null}
                <View style={[{height:40,width:'100%'},paddingTopViewStyle]} />
                <Text style={[{fontSize:17,color:'#999999' }, textStyle]} >{text}</Text>
                <View style={[{width:'100%'},Platform.OS === 'ios' ? {height:280} : {height:200},paddingBottomViewStyle]} />
            </View>
        )
    }
}

NoDataView.propTypes = {
    text: PropTypes.string,
    onPress: PropTypes.func,
    image: PropTypes.any,
    type: PropTypes.string, // NO_DATA, LOAD_ERROR, CONNECT_ERROR, NO_CONNECT
    imageStyle:Image.propTypes.style,
    textStyle:Text.propTypes.style,
    paddingTopViewStyle:View.propTypes.style,
    paddingBottomViewStyle:View.propTypes.style,
  }
  
  const styles = StyleSheet.create({
    
     
    });