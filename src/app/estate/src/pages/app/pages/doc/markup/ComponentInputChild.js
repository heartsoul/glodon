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
import HighlightTextInput from './HighlightTextInput';

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
            <View style={{ flexDirection: 'row', backgroundColor: '#fff', paddingTop: 10, paddingLeft: 12, paddingRight: 12, height: 140, }}>
                <View style={[styles.inputBox]}>
                    <View style={styles.borderBox} />
                    <HighlightTextInput
                        ref={(ref) => { this.refInput = ref }}
                        maxLength={255}
                        style={styles.highlightBox}
                        inputStyle={styles.commentInput}
                        underlineColorAndroid={"transparent"}
                        placeholder={'写评论'}
                        multiline={true}
                        autoFocus={true}
                        textAlign="left"
                        onChangeText={this._changeText}
                        defaultValue={this.props.content}
                    />

                    <TouchableWithoutFeedback onPress={(event) => {
                        // event.preventDefault()
                        // CommentInputView.close();
                        // storage.pushNext(null, 'DocMarkupChoosePage')
                        this.refInput.addKeywords([{ keyword: '陈文杰' }, { keyword: '小明' },])
                    }}>
                        <View style={styles.atBox}>
                            <Text style={styles.atText}>@</Text>
                        </View>
                    </TouchableWithoutFeedback>

                </View>
                <View style={styles.sendBox}>
                    <TouchableOpacity onPress={() => {
                        storage.pushNext(null, 'DocMarkupEditCommentPage', { modelInfo: this.props.modelInfo, content: this.state.content })
                        CommentInputView.close();
                    }}>
                        <Image style={styles.pinImage} source={require('app-images/doc/icon_doc_full.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={(event) => { event.preventDefault(), this._addModelMarkupComment() }}>
                        <Text style={this.state.content && this.state.content.length > 0 ? styles.textTheme : styles.textSend}>发送</Text>
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
        fontSize: 16
    },
    textSend: {
        color: '#999',
        fontSize: 16
    },
    pinImage: {
        width: 18,
        height: 18,
        resizeMode: 'contain'
    },
    inputBox: {
        flexDirection: 'row',
        flex: 1,
    },
    borderBox: {
        height: 93,
        borderColor: '#999',
        borderWidth: 1,
        marginRight: 1,
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 6,
    },
    highlightBox: {
        height: 89,
        position: 'absolute',
        left: 2,
        top: 2,
        right: 2,
    },
    atBox: {
        width: '100%',
        height: 35,
        position: 'absolute',
        justifyContent: 'center',
        bottom: 0,
    },
    atText: {
        fontSize: 24,
        color: '#9999'
    },
    commentInput: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 5,
        textAlignVertical: 'top',
        width: '100%',
        height: 89,
    },
    sendBox: {
        justifyContent: 'space-between',
        paddingBottom: 35,
        marginLeft: 10,
        backgroundColor: '#fff',

    },
})

export default ComponentInputChild;