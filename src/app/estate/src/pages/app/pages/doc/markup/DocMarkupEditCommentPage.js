import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { BarItems } from 'app-components';
import * as DocMarkupAction from '../../../actions/docMarkupAction';

class DocMarkupEditCommentPage extends Component {

    static navigationOptions = ({ navigation, screenProps }) => ({
        headerTitle: <BarItems.TitleBarItem text='写评论' />,
        headerLeft: navigation.state.params && navigation.state.params.loadLeftTitle ? navigation.state.params.loadLeftTitle() : <View />,
        headerRight: navigation.state.params && navigation.state.params.loadRightTitle ? navigation.state.params.loadRightTitle() : <View />,
    })

    constructor(props) {
        super(props);
        let { modelInfo = {}, content } = this.props.navigation.state.params;
        this.state = {
            modelVersionId: modelInfo.modelVersionId,
            fileId: modelInfo.fileId,
            markupId: modelInfo.markupId,
            content: content,
        };
        this.props.navigation.setParams({ loadLeftTitle: this._loadLeftTitle, loadRightTitle: this._loadRightTitle, })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.sendStatus != nextProps.sendStatus && nextProps.sendStatus == 'success') {
            //发送成功
            this.props.navigation.goBack();
        }
    }

    _loadLeftTitle = () => {
        return (
            <BarItems navigation={this.props.navigation}>
                <BarItems.RightBarItem navigation={this.props.navigation} text="取消" onPress={() => this._cancel()} />
            </BarItems>
        )

    }

    _loadRightTitle = () => {
        return (
            <BarItems navigation={this.props.navigation}>
                <BarItems.RightBarItem navigation={this.props.navigation} text="发送" onPress={() => this._send()} />
            </BarItems>
        )

    }
    _cancel = () => {
        this.props.navigation.goBack();
    }
    _send = () => {
        let receiverIds = [];
        this.props.addModelMarkupComment(this.state.modelVersionId, this.state.fileId, this.state.markupId, 'content', storage.loadProject(), receiverIds)
    }
    _changeText = () => {

    }
    render() {
        return (
            <View style={styles.container} >
                <TextInput
                    maxLength={255}
                    style={styles.commentInput}
                    underlineColorAndroid={"transparent"}
                    placeholder={'写评论'}
                    multiline={true}
                    autoFocus={true}
                    textAlign="left"
                    onChangeText={this._changeText}
                    defaultValue={this.state.content}
                />
                <View style={styles.atBox}>
                    <Text style={styles.textLight}>@</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff'
    },
    textLight: {
        color: '#999',
        fontSize: 14
    },
    commentInput: {
        paddingTop: 2,
        paddingBottom: 42,
        textAlignVertical: 'top',
        width: '100%',
        backgroundColor: '#ffffff',
        height: '100%',
    },
    atBox: {
        width: '100%',
        height: 35,
        paddingTop: 5,
        marginLeft: 20,
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#fff',
    },

})

export default connect(
    state => ({
        sendStatus: state.docMarkup.sendComments.status,
    }),
    dispatch => ({
        addModelMarkupComment: (modelVersionId, fileId, markupId, content, deptId, receiverIds = []) => {
            dispatch(DocMarkupAction.addModelMarkupComment(modelVersionId, fileId, markupId, content, deptId, receiverIds));
        }
    }),
)(DocMarkupEditCommentPage)
