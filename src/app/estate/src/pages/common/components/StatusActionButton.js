import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, TouchableOpacity,View } from 'react-native'

export default class StatusActionButton extends Component {
    render = () => {
        const { text, onClick, style, disabled, color,textStyle={} } = this.props;
        let styleIn = [];
        let textColor = "#fff";
        if (style) {
            styleIn = [
                style.height ? { borderRadius: style.height / 2 } : { borderRadius: 15 },
                style.backgroundColor ? { shadowColor: style.backgroundColor } : {},
                style.borderColor ? { borderWidth: 1 } : {},
                style,
            ];
        }
        if (onClick) {
            return (<TouchableOpacity ref='buttonItem'
                style={[styles.button, ...styleIn]}
                activeOpacity={0.5}
                disabled={disabled ? true : false}
                onPress={onClick}>
                <Text style={[styles.buttonText,textStyle, { color: color }]}>{text}</Text>
            </TouchableOpacity>
            )
        }
        return (<TouchableOpacity ref='buttonItem'
            style={[styles.button, ...styleIn,]}
            activeOpacity={1}>
            <Text style={[styles.buttonText, { color: color }]}>{text}</Text>
        </TouchableOpacity>
        )
    }
    setNativeProps = (props) => {
        this.refs.buttonItem.setNativeProps(props);
    }
}

StatusActionButton.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    color: PropTypes.any.isRequired,
    disabled: PropTypes.bool,
    textStyle:Text.propTypes.style,
    style:View.propTypes.style
}

const styles = StyleSheet.create({

    buttonText: {
        textAlign: "center",
        marginLeft: 10,
        marginRight: 10,
        color: '#00baf3'
    },
    button: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        backgroundColor: '#FFFFFF',
        height: 30,
        elevation: 2.5, // android 
        shadowColor: "#fff", // iOS
        shadowOffset: { width: 1.5, height: 5 }, // iOS
        shadowOpacity: 0.15, // iOS
        shadowRadius: 3, // iOS
    },
});


