import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { KeyboardAwareScrollView } from 'app-3rd/index';
import { GLDActionSheet, } from 'app-components'

class CommentInputView extends Component {

    render() {
        return (
            <KeyboardAwareScrollView style={{ width: '100%' }} scrollEnabled={false}>
                <View style={styles.inputCard}>
                    <View style={styles.inputBox}>
                        <TextInput
                            maxLength={255}
                            style={styles.commentInput}
                            underlineColorAndroid={"transparent"}
                            placeholder={'写评论'}
                            multiline={true}
                            autoFocus={true}
                            textAlign="left"
                        />
                        <View style={styles.atBox}>
                            <Text style={styles.textLight}>@</Text>
                        </View>
                    </View>
                    <View style={styles.sendBox}>
                        <Image style={styles.pinImage} source={require('app-images/icon_setting_share.png')} />
                        <Text style={[styles.textLight]}>发送</Text>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        )
    }
    static show() {
        GLDActionSheet.show(<CommentInputView />)
    }
}

export default CommentInputView;

const styles = StyleSheet.create({

    textLight: {
        color: '#999',
        fontSize: 14
    },
    pinImage: {
        width: 15,
        height: 15,
        resizeMode: 'contain'
    },

    inputCard: {
        width: '100%',
        backgroundColor: "#fff",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        flexDirection: 'row',
    },
    inputBox: {
        flexDirection: 'row',
        flex: 1
    },
    atBox: {
        width: '100%',
        height: 35,
        position: 'absolute',
        borderTopColor: '#999',
        borderTopWidth: 1,
        paddingTop: 5,
        backgroundColor: '#fff',
        bottom: 0,
    },
    commentInput: {
        paddingLeft: 2,
        paddingRight: 2,
        paddingTop: 2,
        paddingBottom: 42,
        textAlignVertical: 'top',
        width: '100%',
        backgroundColor: '#ffffff',
        minHeight: 120,
        borderColor: '#999',
        borderWidth: 1,
    },
    sendBox: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingBottom: 35,
        marginLeft: 10,
    },
})
