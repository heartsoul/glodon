import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';

class DocMarkupItemView extends Component {

    static propTypes = {
        markup: PropTypes.any,//批注信息
        onItemPress: PropTypes.func.isRequired,//点击整个item进详情
        onThumbnailPress: PropTypes.func.isRequired,//点击缩略图进模型
    }

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <TouchableOpacity onPress={(event) => { event.preventDefault(); this.props.onItemPress() }}>
                <View style={styles.containerView}>
                    <View style={styles.infoContainer}>
                        <Image style={styles.userAvatar} source={require('app-images/icon_default_boy.png')} />
                        <View style={{ marginLeft: 10, flex: 1 }}>
                            <Text style={styles.textMain}>{this.props.markup.creatorName}</Text>
                            <Text style={styles.textTime}>{this.props.markup.createTime}</Text>
                        </View>
                        <Image style={styles.pinImage} source={require('app-images/doc/icon_doc_markup_position.png')} />
                    </View>
                    <Text style={[styles.textMain, styles.textContent]}>{this.props.markup.description}</Text>

                    <TouchableOpacity onPress={(event) => { event.preventDefault(); this.props.onThumbnailPress() }}>
                        <View style={styles.thumbnailContainer}>
                            <Image style={styles.thumbnail} source={require('app-images/icon_blueprint_default.png')} />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.line}></View>
                    <View style={styles.commentContainer}>
                        <Image style={styles.commentImage} source={require('app-images/doc/icon_doc_reply.png')} />
                        <Text style={[styles.textMain, styles.textComment]}>回复</Text>
                        <Image style={styles.commentCountImage} source={require('app-images/doc/icon_doc_comment.png')} />
                        <Text style={styles.textMain}>评论</Text>
                    </View>
                </View>
            </TouchableOpacity>

        );
    }
}

const styles = StyleSheet.create({
    containerView: {
        borderRadius: 10,
        marginTop: 7,
        marginBottom: 7,
        marginLeft: 14,
        marginRight: 14,
        backgroundColor: '#FFF',
        elevation: 2.5, // android 
        shadowColor: "#333", // iOS
        shadowOffset: { width: 1.5, height: 5 }, // iOS
        shadowOpacity: 0.15, // iOS
        shadowRadius: 3, // iOS
    },
    infoContainer: {
        marginTop: 18,
        marginLeft: 14,
        marginRight: 14,
        flexDirection: 'row',
        alignItems: "center"
    },
    userAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        resizeMode: 'cover',
    },
    userNameContainer: {
        marginLeft: 10,
        flex: 1
    },
    textMain: {
        color: '#333',
        fontSize: 14
    },
    textTime: {
        color: '#999',
        fontSize: 12,
    },
    textLight: {
        color: '#999',
        fontSize: 14
    },
    pinImage: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        alignSelf: 'flex-start',
    },
    textContent: {
        margin:14,
    },
    thumbnailContainer: {
        marginLeft: 14,
        marginRight: 14,
        marginBottom: 14,
    },
    thumbnail: {
        width: '100%',
        height: 130,
        resizeMode: 'cover',
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: '#f7f7f7'
    },
    commentContainer: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 50,
        paddingRight: 50
    },
    commentImage: {
        width: 19,
        height: 19,
        resizeMode: 'contain',
        marginRight: 5
    },
    textComment: {
        flex: 1,
    },
    commentCountImage: {
        width: 19,
        height: 19,
        resizeMode: 'contain',
        marginRight: 5
    },

})

export default DocMarkupItemView;