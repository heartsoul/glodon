
import PropTypes from 'prop-types';
import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
const rightImage = require("app-images/icon_arrow_right_gray.png");


export default class EquipmentInfoItem extends React.Component {
    onClick = (event) => {
        if (!this.props.onClick) {
            return;
        }
        this.props.onClick();
    }
    renderInfo = () => {
        if (!this.props.onClick) {
            return (
                <View style={styles.containerView} >
                    <View style={styles.titleView}>
                        <Text style={styles.leftTitle}>{this.props.leftTitle}</Text>
                    </View>
                    <View style={styles.contentView}>
                        <Text style={styles.content}>{this.props.content}</Text>
                    </View>
                </View>
            );
        }
        return (
            <View style={styles.containerView} >
                <View style={styles.titleView}>
                <Text style={{backgroundColor:'#00b5f2',width:2,marginRight:5,height:16,fontSize:20,fontWeight:'bold'}}>{' '}</Text><Text style={styles.leftTitleHeader}>{this.props.leftTitle}</Text>
                </View>
                <View style={styles.contentView}>
                    <Text style={styles.content}>{this.props.content}</Text>
                </View>
                <TouchableOpacity style={styles.rightAction} activeOpacity={0.5} onPress={(event) => { this.onClick(event) }}>
                        <Image source={rightImage} style={styles.infoMark} />
                    </TouchableOpacity>
            </View>
        );
    }
    renderLink = () => {
        return (
            <View style={styles.containerView} >
                <View style={styles.titleView}>
                    <Text style={styles.leftTitle}>{this.props.leftTitle}</Text>
                </View>
                <View style={styles.contentView}>
                    <TouchableOpacity activeOpacity={0.5} onPress={(event) => { this.onClick(event) }}>
                        <Text style={[styles.content, styles.link]}>{this.props.content}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    renderLine = () => {
        return (
            <View style={[styles.containerView, styles.lineView]}>
            </View>
        );
    }
    bigImage = (images, index) => {
        let media = [];
        images.map((url, index) => {
            media.push({
                photo: url,
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
                    <Image source={{ uri: url }} style={styles.imageMax} />
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
                                <Image source={{ uri: url }} style={styles.imageNarmal} />
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
                    <Text style={styles.leftTitle}>{this.props.leftTitle}</Text>
                </View>
                <View style={styles.contentView}>
                    <Text style={styles.content}>{this.props.content}</Text>
                </View>
            </View>
        );
    }
    render = () => {
        if (this.props.showType === 'info') {
            return this.renderInfo();
        }
        if (this.props.showType === 'link') {
            return this.renderLink();
        }
        if (this.props.showType === 'line') {
            return this.renderLine();
        }
        if (this.props.showType === 'image') {
            return this.renderImage();
        }
        if (this.props.showType === 'images') {
            return this.renderImages();
        }
        return this.renderItem();
    }
}
EquipmentInfoItem.propTypes = {

    /**
     * 控件展现类型 default|info|link|line
     */
    showType: PropTypes.string,
    /**
     * 点击响应
     */
    onClick: PropTypes.func,
    /**
     * 左侧标题
     */
    leftTitle: PropTypes.any,

    /**
     * 内容
     */
    content: PropTypes.any,
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

};


const styles = StyleSheet.create({

    containerView: {
        marginTop: 15,
        marginBottom: 5,
        marginLeft: 20,
        marginRight: 20,
        flexDirection: 'row',
        
    },
    content: {
        fontSize: 14,
        fontWeight: '100',
    },
    link: {
        color: '#00b5f2',
        textDecorationLine: 'underline',
        fontSize: 14,
        marginRight: 75,
        fontWeight: '100',
    },
    leftTitle: {
        fontSize: 14,
        width: 75,
        color: '#666666',
        fontWeight: '100',
        // fontFamily:"PingFangSC-Light",
    },
    leftTitleHeader: {
        fontSize: 15,
        width: 175,
        color: '#666666',
        fontWeight: '200',
        // fontFamily:"PingFangSC-Light",
    },
    titleView: {
        flexDirection: 'row',
       
        alignItems: 'center',
    },
    contentView: {
        flexDirection: 'row',
        
        alignItems: 'center',
    },
    infoMark: {
        // marginLeft: 5,
        width: 17,
        height: 17,
        resizeMode:'contain'
    },
    rightAction: {
        right: 0,
        width: 20,
        flexDirection: 'row-reverse',
        position: 'absolute',
    },
    lineView: {
        height: 1,
        marginTop: 20,
        marginLeft: 20,
        width: '100%',
        backgroundColor: '#fafafa'
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