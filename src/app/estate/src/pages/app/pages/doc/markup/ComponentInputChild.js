import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
} from 'react-native';
import CommentInputView from './CommentInputView';

class ComponentInputChild extends Component {

    constructor(props) {
        super(props)
        this.state = {
            content: '',
        }
    }

    _changeText = (value) => {
        this.props.onChangeText(value)
        this.state.content = value;
    }

    _addModelMarkupComment = () => {
        if (this.state.content && this.state.content.length > 0) {
            this.props.addModelMarkupComment(this.state.content);
        }
    }

    render() {
        return (
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
                        onChangeText={this._changeText}
                        defaultValue={this.props.content}
                    />
                    <TouchableWithoutFeedback onPress={(event) => {
                        event.preventDefault()
                        CommentInputView.close();
                        storage.pushNext(null, 'DocMarkupChoosePage')
                    }}>
                        <View style={styles.atBox}>
                            <Text style={styles.textLight}>@</Text>
                        </View>
                    </TouchableWithoutFeedback>

                </View>
                <View style={styles.sendBox}>
                    <TouchableOpacity onPress={() => {
                        storage.pushNext(null, 'DocMarkupEditCommentPage', { modelInfo: this.props.modelInfo, content: this.state.content })
                        CommentInputView.close();
                    }}>
                        <Image style={styles.pinImage} source={require('app-images/icon_setting_share.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={(event) => { event.preventDefault(), this._addModelMarkupComment() }}>
                        <Text style={this.state.content && this.state.content.length > 0 ? styles.textTheme : styles.textLight}>发送</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

}
const styles = StyleSheet.create({
    textLight: {
        color: '#999',
        fontSize: 14
    },
    textTheme: {
        color: '#00baf3',
        fontSize: 14
    },
    pinImage: {
        width: 15,
        height: 15,
        resizeMode: 'contain'
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

export default ComponentInputChild;