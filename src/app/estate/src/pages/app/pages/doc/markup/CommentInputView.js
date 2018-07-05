import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    SafeAreaView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'app-3rd/index';
import { Overlay, } from 'app-3rd/teaset';
var { width, height } = Dimensions.get('window')
class CommentInputView extends Overlay {
    static overlayView;
    static show() {
        return super.show(
            <Overlay.View side='bottom' modal={false}
                style={styles.container}
                overlayOpacity={0.7}
                ref={v => this.overlayView = v}
            >
                <KeyboardAwareScrollView style={{ width: '100%' }} scrollEnabled={false}>
                    <TouchableOpacity onPress={() => {
                        CommentInputView.close();
                    }}>
                        <SafeAreaView style={styles.inputBg}>
                            <View style={{ flexDirection: 'row', backgroundColor: '#fff', paddingTop: 20, paddingLeft: 20, paddingRight: 20 }}>
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
                        </SafeAreaView>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>

            </Overlay.View>
        )
    }

    static close() {
        if (this.overlayView) {
            this.overlayView.close()
        }
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
    inputBg: {
        height: height,
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
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
        flex: 1,
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
        height: 120,
        borderColor: '#999',
        borderWidth: 1,
    },
    sendBox: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingBottom: 35,
        marginLeft: 10,
        backgroundColor: '#fff',

    },
})
