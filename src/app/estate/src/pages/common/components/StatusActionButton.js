import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

export default class StatusActionButton extends Component {
    render = () => {
        const { text, onClick, color, borderColor,width,marginLeft,marginRight} = this.props;
       
        return (<TouchableOpacity
            style={[styles.button,width?{width:width}:{},borderColor ? {borderColor:borderColor} : {}
                , marginLeft ? { marginLeft: marginLeft } : {}, marginRight ? { marginRight: marginRight } : {}]}
            activeOpacity={0.5}
            onPress={onClick}>
            <Text style={[styles.buttonText, { color: color }]}>{text}</Text>
        </TouchableOpacity>
        )
    }
}

StatusActionButton.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    color: PropTypes.any.isRequired,
    borderColor: PropTypes.string,
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


