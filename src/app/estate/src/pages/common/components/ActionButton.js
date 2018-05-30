import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, TouchableHighlight } from 'react-native'

export default class ActionButton extends Component {

  constructor(props) {
    super(props);
    /*用来指示是否显示Loading提示符号*/
    this.state = {
      pressed: false,
    };
  }

  render() {
    const { text, onPress, isDisabled} = this.props
    let onPressIn= onPress;
    if(isDisabled && isDisabled()) {
      onPressIn = null
    }
    return (
        <TouchableHighlight
        onPress={onPressIn}
        underlayColor="#0099f3"
        activeOpacity={1.0}
        style={[styles.style_action,isDisabled()
            ? styles.style_action_disabled : {},this.state.pressed
            ? styles.style_action_pressed:{}]
        }
        onHideUnderlay={() => {
          this.setState({ pressed: false });
        }}
        onShowUnderlay={() => {
          this.setState({ pressed: true });
        }}
      >
        <Text style={styles.style_actionText}>{text}</Text>
      </TouchableHighlight>
    )
  }
}

ActionButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  isDisabled: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  
    style_actionText: {
      overflow: "hidden",
      height: 20,
      marginTop: 10,
      marginLeft: 20,
      marginRight: 20,
      borderRadius: 20,
      alignItems: "center",
      textAlign: "center",
      fontSize: 16,
      color: "#fff"
    },
    style_action: {
      overflow: "hidden",
      height: 40,
      backgroundColor: "#00baf3",
      borderRadius: 20,
      marginTop: 40,
      marginLeft: 20,
      marginRight: 20,
    },
    style_action_pressed: {
      backgroundColor: "#33baf3",
      elevation: 2.5, // android 
        shadowColor: "#00baf3", // iOS
        shadowOffset: { width: 1.5, height: 5 }, // iOS
        shadowOpacity: 0.15, // iOS
        shadowRadius: 3, // iOS
    },
    style_action_disabled: {
      backgroundColor: "#C8C8C8",
      elevation: 2.5, // android 
        shadowColor: "#00baf3", // iOS
        shadowOffset: { width: 1.5, height: 5 }, // iOS
        shadowOpacity: 0.85, // iOS
        shadowRadius: 3, // iOS
    }
  });