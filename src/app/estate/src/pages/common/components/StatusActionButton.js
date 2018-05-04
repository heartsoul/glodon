import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

export default class StatusActionButton extends Component {
    render = () => {
        const { text, onClick, color, borderColor,width,height,marginLeft,marginRight,style,backgroundColor} = this.props;
        let styleIn = style;
        if(!styleIn) {
            styleIn = [width?{width:width}:{},borderColor ? {borderColor:borderColor} : {}
            , marginLeft ? { marginLeft: marginLeft } : {}, marginRight ? { marginRight: marginRight } : {}
            ,backgroundColor?{backgroundColor:backgroundColor}:{}
            ,height?{height:height,borderRadius:height/2}:{}];
        }
        if(onClick) {
        return (<TouchableOpacity
            style={[styles.button,...styleIn]}
            activeOpacity={0.5}
            onPress={onClick}>
            <Text style={[styles.buttonText, { color: color }]}>{text}</Text>
        </TouchableOpacity>
        )
    }
        return (<TouchableOpacity
            style={[styles.button,...styleIn]}
            activeOpacity={1}>
            <Text style={[styles.buttonText, { color: color }]}>{text}</Text>
        </TouchableOpacity>
        )
    }
}

StatusActionButton.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    color: PropTypes.any.isRequired,
    borderColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    width: PropTypes.any,
    marginLeft: PropTypes.any,
    marginRight: PropTypes.any,
}

const styles = StyleSheet.create({

    buttonText: {
        textAlign: "center",
        marginLeft: 10,
        marginRight: 10,
        color: '#00baf3'
    },
    button: {
        flexDirection:'row',
        justifyContent:"center",
        alignItems: "center",
        alignContent: "center",
        backgroundColor: '#FFFFFF',
        height: 30,
        borderRadius: 15,
        borderColor: '#eeeeee',
        borderWidth: 1,
    },
});


