import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text, Image, StatusBar } from 'react-native';
export const defaultImage = require('app-images/icon_no_data.png')
export default class NoDataView extends React.Component {
    static NoDataImage = defaultImage;
    render = () => {
        const {text, image, onPress, type} = this.props;
        return (
            <View style={{height:'100%',width:'100%', flex: 1, alignItems: 'center',backgroundColor:'#FFFFFF', justifyContent: 'center', flexDirection: 'column' }}>
                {image ? <Image style={{width:188,height:183}} source={image}/> : null}
                <View style={{height:40,width:'100%'}} />
                <Text style={[{fontSize:17,color:'#999999' }]} >{text}</Text>
                <View style={{height:280,width:'100%'}} />
            </View>
        )
    }
}

NoDataView.propTypes = {
    text: PropTypes.string,
    onPress: PropTypes.func,
    image: PropTypes.any,
    type: PropTypes.string, // NO_DATA, LOAD_ERROR, CONNECT_ERROR, NO_CONNECT
  }
  
  const styles = StyleSheet.create({
    
     
    });