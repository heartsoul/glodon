import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text as Label, View, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native'

export default class PaneViewItem extends Component {
    onClick = (event) => {
        if (!this.props.onClick) {
            return;
        }
        this.props.onClick();
    }
    renderHeader = () => {
        return (
            <View style={[styles.containerView]}>
                <View style={styles.contentView}>
                    <Image source={this.props.image} style={styles.headerImage} />
                    <Label style={[styles.content, this.props.color ? { color: this.props.color } : {}]}>{this.props.title}</Label>
                </View>
            </View>
        );
    }

    renderSection = () => {
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={(event) => {event.preventDefault();  this.onClick(event) }}>
                <View style={[styles.containerView]}>
                    <Image source={this.props.image} style={styles.infoMark} />
                    <View style={styles.titleView}>
                        <Label style={[styles.leftTitle, this.props.color ? { color: this.props.color } : {}]}>{this.props.title}</Label>
                    </View>
                    <Image source={this.props.rightImage} style={styles.rightMark} />
                </View>
            </TouchableOpacity>
        );
    }

    renderSectionSimple = () => {
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={(event) => {event.preventDefault();  this.onClick(event) }}>
                <View style={[styles.containerView]}>
                    <Image source={this.props.image} style={styles.infoMark} />
                    <View style={styles.titleView}>
                        <Label style={[styles.leftTitle, this.props.color ? { color: this.props.color } : {}]}>{this.props.title}</Label>
                    </View>
                    <View style={styles.imageEmpty} />
                </View>
            </TouchableOpacity>
        );
    }

    renderLine = () => {
        return (
            <View style={[styles.containerView, styles.lineView]}>
            </View>
        );
    }
    renderItem = () => {
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={(event) => {event.preventDefault();  this.onClick(event) }}>
                <View style={[styles.containerView]}>
                    <View style={styles.imageEmpty} />
                    <View style={styles.titleView}>
                        <Label style={[styles.leftTitle, this.props.color ? { color: this.props.color } : {}]}>{this.props.title}</Label>
                    </View>
                    <View style={styles.imageEmpty} />
                </View>
            </TouchableOpacity>
        );
    }
    render = () => {
        if (this.props.showType === 'header') {
            return this.renderHeader();
        }
        if (this.props.showType === 'section') {
            return this.renderSection();
        }
        if (this.props.showType === 'sectionSimple') {
            return this.renderSectionSimple();
        }
        if (this.props.showType === 'line') {
            return this.renderLine();
        }
        return this.renderItem();
    }
}
PaneViewItem.propTypes = {

    /**
     * 控件展现类型 default|header|section|sectionSimple|line
     */
    showType: PropTypes.string,
    /**
     * 点击响应
     */
    onClick: PropTypes.func,
    /**
     * 标题
     */
    title: PropTypes.string,

    /**
     * 文字颜色
     */
    color: PropTypes.string,
    /**
     * icon image
     */
    image: PropTypes.any,
    /**
     * icon right image
     */
    rightImage: PropTypes.any,
     /**
     * icon right image
     */
};


const styles = StyleSheet.create({

    containerView: {
        marginTop: 10,
        marginBottom: 5,
        marginLeft: 20,
        marginRight: 20,
        flexDirection: 'row',
    },
    content: {
        fontSize: 16,
        fontWeight: '100',
    },

    leftTitle: {
        fontSize: 16,
        width: 75,
        color: '#FDFDFD',
        fontWeight: '100',
        // fontFamily:"PingFangSC-Light",
    },
    titleView: {
        flexDirection: 'row',

    },
    contentView: {
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: "center",
        justifyContent: 'center',
        width: "100%",
    },
    infoMark: {
        width: 18,
        height: 18,
        marginRight: 10,
        resizeMode: 'contain',
    },
    imageEmpty: {
        width: 18,
        height: 18,
        marginRight: 10,
    },
    rightMark: {
        width: 14,
        height: 14,
        right: 0,
        position: 'absolute',
        resizeMode: 'contain',
    },
    headerImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        marginBottom: 5,
    },
    lineView: {
        marginTop: 10,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,

        height: 0.5,
        // width: '100%',
        backgroundColor: '#cccccc55'
    },
});
