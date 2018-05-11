
import PropTypes from 'prop-types';
import React from 'react';
import { View, StyleSheet, Text as Label, Image, TouchableOpacity } from 'react-native';
import { StatusActionButton } from "app-components"
import * as API from "app-api"
import { push } from 'connected-react-router';

const benchmarkImage = require("app-images/icon_benchmark.png");
const userImage = require("app-images/icon_mine_default_header.png");


export default class QualityInfoCellItem extends React.Component {
    onClick = (event) => {
        if (!this.props.onClick) {
            return;
        }
        this.props.onClick();
    }

    renderUser = () => {
        return (
            <View style={[styles.containerView, styles.containerUserView]} >
                <View style={styles.titleView}>
                    <Image source={this.props.userImage ? { uri: this.props.userImage } : userImage} style={styles.userImage} />
                </View>
                <View style={styles.userContentView}>
                    <Label style={styles.userName}>{this.props.userName}</Label>
                    <Label style={styles.actionDate}>{this.props.actionDate}</Label>
                </View>
                {
                    this.props.onAction ?
                        <View style={styles.actionButtion}>
                            <StatusActionButton color={this.props.actionColor} style={{borderColor:this.props.actionColor}} text={this.props.actionText} />
                        </View>
                        : null
                }
            </View>
        );
    }
    renderDescription = () => {
        if (!this.props.descriptionDate) {
            return this.renderDescriptionSimple();
        }
        if (!this.props.description) {
            return this.renderDateSimple();
        }
        return (
            <View style={[styles.containerView, styles.containerDescriptionView]} >
                <View style={styles.descriptionView}>
                    <Label style={styles.description}>{this.props.description}</Label>
                </View>
                <View style={styles.dateView}>
                    <Label style={styles.date}>{this.props.descriptionDate}</Label>
                </View>

            </View>
        );
    }
    renderDescriptionSimple = () => {
        return (
            <View style={[styles.containerView, styles.containerDescriptionView]} >
                <View style={styles.descriptionView}>
                    <Label style={styles.description}>{this.props.description}</Label>
                </View>
            </View>
        );
    }
    renderDateSimple = () => {
        return (
            <View style={[styles.containerView, styles.containerDescriptionView]} >
                <View style={styles.dateView}>
                    <Label style={styles.date}>{this.props.descriptionDate}</Label>
                </View>
            </View>
        );
    }
    bigImage = (images, index) => {
        let media = [];
        images.map((item, index) => {
            media.push({
                photo: item.url,
                objectId:item.objectId
            });
        });
        
        storage.pushNext(null, 'BigImageViewPage', { media: media, index: index })

    }
    renderImage = () => {
        const { url } = this.props;
        return (
            <View style={styles.containerView} >
                <TouchableOpacity activeOpacity={0.5} onPress={(event) => {
                    this.bigImage([url], 0);
                }}>
                    <Image source={{ uri: url.url }} style={styles.imageMax} />
                </TouchableOpacity>
            </View>
        );
    }
    renderImages = () => {
        return (
            <View style={styles.containerView} >
                {
                    this.props.urls.map((url, index) => {
                        return (
                            <TouchableOpacity key={'xxx' + index} activeOpacity={0.5} onPress={(event) => { this.bigImage(this.props.urls, index); }}>
                                <Image source={{ uri: url.url }} style={styles.imageNarmal} />
                            </TouchableOpacity>
                        );
                    })
                }

            </View>
        );
    }

    renderItem = () => {
        return (
            <View style={styles.containerView} >
                <View style={styles.titleView}>
                    <Label style={styles.leftTitle}>{this.props.leftTitle}</Label>
                </View>
                <View style={styles.contentView}>
                    <Label style={styles.content}>{this.props.content}</Label>
                </View>
            </View>
        );
    }
    render = () => {
        if (this.props.showType === 'image') {
            return this.renderImage();
        }
        if (this.props.showType === 'images') {
            return this.renderImages();
        }
        if (this.props.showType === 'user') {
            return this.renderUser();
        }
        if (this.props.showType === 'description') {
            return this.renderDescription();
        }
        return this.renderItem();
    }
}
QualityInfoCellItem.propTypes = {

    /**
     * 控件展现类型 user|image|images|description
     */
    showType: PropTypes.string.isRequired,

    // user 类型需要的数据
    /**
     * 操作事件
     */
    onAction: PropTypes.func,
    /**
     * 用户名
     */
    userName: PropTypes.string,
    /**
     * 时间
     */
    actionDate: PropTypes.string,
    /**
     * 操作文字
     */
    actionText: PropTypes.string,
    /**
     * 颜色
     */
    actionColor: PropTypes.string,

    // image 类型需要的数据
    /**
    * 图片链接
    */
    url: PropTypes.string,
    // images 类型需要的数据
    /**
    * 图片链接
    */
    urls: PropTypes.array,

    /**
     * description类型需要的数据
     */
    description: PropTypes.string,
    descriptionDate: PropTypes.string,
};


const styles = StyleSheet.create({

    containerView: {
        marginTop: 10,
        marginBottom: 0,
        marginLeft: 20,
        marginRight: 20,
        flexDirection: 'row',
    },
    containerUserView: {
        marginBottom: 10,
    },
    containerDescriptionView: {
        flexDirection: 'column',
    },

    titleView: {
        flexDirection: 'row',

    },
    contentView: {
        flexDirection: 'row',
        marginRight: 75,
        alignItems: 'center'
    },

    actionButtion: {
        right: 0,
        top: 0,
        position: 'absolute',
    },
    userImage: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
    },
    userContentView: {
        marginLeft: 12,
    },
    userName: {
        color: '#313131',
        fontSize: 15,
        fontWeight: "bold",
    },
    actionDate: {
        marginTop: 5,
        color: '#919191',
        fontSize: 12,
    },
    descriptionView: {
    },
    dateView: {
        marginTop: 5,
    },
    description: {
        color: '#2c2c2c',
        fontSize: 16,
    },
    date: {
        // marginTop:5,
        color: '#2c2c2c',
        fontSize: 12,
        fontWeight: "100",
    },
    imageNarmal: {
        marginRight: 10,
        width: 106,
        height: 106,
        resizeMode: 'cover'
    },
    imageMax: {
        width: 230,
        height: 230,
        resizeMode: 'contain'
    },

});