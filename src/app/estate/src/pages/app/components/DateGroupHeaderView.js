import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet,View, Text } from 'react-native'

export default class DateGroupHeaderView extends Component {
  render() {
    const { text } = this.props
    return (
        <View style={styles.groupHeaderView}>
        <View style={styles.headerLine}></View>
        <Text style={styles.groupTitle}>{text}</Text>
        <View style={styles.headerLine}></View>
        
    </View>
    )
  }
}

DateGroupHeaderView.propTypes = {
  text: PropTypes.string.isRequired,
}

const styles = StyleSheet.create({
  
    groupHeaderView: {
        height: 40,
        marginLeft: 20,
        marginRight: 20,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent:"center",
        alignItems:"center",
    },
    headerLine: {
        backgroundColor: '#e6e6e6',
        height: 1,
        flex:1,
    },
    groupTitle: {
        color: '#999999',
        fontSize: 14,
        paddingLeft:10,
        paddingRight:10,
    }
})
