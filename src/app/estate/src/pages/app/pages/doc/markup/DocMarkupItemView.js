import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
class DocMarkupItemView extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <TouchableOpacity>
                <View style={styles.containerView}>
                    <View style={styles.infoContainer}>
                        <Image style={styles.userAvatar} source={require('app-images/icon_default_boy.png')} />
                        <View style={{ marginLeft: 10, flex: 1 }}>
                            <Text style={styles.textMain}>name</Text>
                            <Text style={styles.textLight}>time</Text>
                        </View>
                        <Image style={styles.pinImage} source={require('app-images/icon_setting_share.png')} />
                    </View>
                    <Text style={[styles.textMain, styles.textContent]}>content</Text>
                    <View style={styles.thumbContainer}>
                        <Image style={styles.thumb} source={require('app-images/icon_blueprint_default.png')} />
                    </View>
                    <View style={styles.line}></View>
                    <View style={styles.commentContainer}>
                        <Image style={styles.commentImage} source={require('app-images/icon_setting_share.png')} />
                        <Text style={[styles.textMain, styles.textComment]}>评论</Text>
                        <Image style={styles.commentCountImage} source={require('app-images/icon_setting_share.png')} />
                        <Text style={styles.textMain}>1</Text>
                    </View>
                </View>
            </TouchableOpacity>

        );
    }
}

const styles = StyleSheet.create({
    containerView: {
       
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#FFF',
        elevation: 2.5, // android 
        shadowColor: "#333", // iOS
        shadowOffset: { width: 1.5, height: 5 }, // iOS
        shadowOpacity: 0.15, // iOS
        shadowRadius: 3, // iOS

    },
    infoContainer: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'row',
        alignItems: "center"
    },
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        resizeMode: 'cover'
    },
    userNameContainer: {
        marginLeft: 10,
        flex: 1
    },
    textMain: {
        color: '#333',
        fontSize: 14
    },
    textLight: {
        color: '#999',
        fontSize: 14
    },
    pinImage: {
        width: 15,
        height: 15,
        resizeMode: 'contain'
    },
    textContent: {
        margin: 10
    },
    thumbContainer: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
    },
    thumb: {
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
        paddingLeft: 10,
        paddingRight: 10
    },
    commentImage: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        marginRight: 5
    },
    textComment: {
        flex: 1,
    },
    commentCountImage: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        marginRight: 5
    },

})

export default DocMarkupItemView;