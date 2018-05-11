import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Text, Image, StatusBar } from 'react-native';
export default class NoDataView extends React.Component {
    render = () => {
        const {text, image, onPress, type} = this.props;
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <Text style={[{ height: 80,color:'gray' }]} >{text}</Text>
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