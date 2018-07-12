import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { BarItems } from 'app-components';
import * as DocMarkupAction from '../../../actions/docMarkupAction';
import HighlightTextInput from './HighlightTextInput';

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
            commentText: content,
            keywords: this._getKeywords(this.props.cacheUserMap),
        };
        this.props.navigation.setParams({ loadLeftTitle: this._loadLeftTitle, loadRightTitle: this._loadRightTitle, })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.sendStatus != nextProps.sendStatus && nextProps.sendStatus == 'success') {
            //发送成功
            this.props.navigation.goBack();
        }

        if (this.props.atUsers != nextProps.atUsers) {//@选人完成
            let keyStr = '';
            if (nextProps.atUsers) {
                nextProps.atUsers.map(user => {
                    keyStr += `@${user.name} `
                })
            }
            let keywords = this._getKeywords(nextProps.cacheUserMap);
            this.refInput.addKeywords(keyStr, keywords)
        }
    }

    _getKeywords = (cacheUserMap) => {
        let keywords = [];
        if (cacheUserMap) {
            for (let value of cacheUserMap.values()) {
                keywords.push(value.name);
            }
        }
        return keywords;
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
        if (this.state.commentText && this.state.commentText.length > 0) {
            let gldAccountIds = this.getAtGldAccountIds();
            this.props.addModelMarkupComment(this.state.modelVersionId, this.state.fileId, this.state.markupId,
                this.state.commentText, storage.loadProject(), gldAccountIds)
        }
    }

    getAtGldAccountIds = () => {
        let keywords = this.refInput.matchRealKeyword();//已选择的@name列表
        let gldAccountIds = [];
        keywords.map((keyword) => {
            let user = this.props.cacheUserMap.get(keyword);
            if (user) {
                gldAccountIds.push(user.gldAccountId);
            }
        })
        return gldAccountIds;
    }

    _changeText = (value) => {
        this.state.commentText = value;
    }
    render() {
        return (
            <KeyboardAvoidingView style={styles.container} >
                <View style={{ width: '100%', height: '100%' }}>
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
                        content={this.state.commentText}
                        keywords={this.state.keywords}
                    />
                    <TouchableOpacity
                        style={styles.atBox}
                        onPress={(event) => {
                            event.preventDefault()
                            storage.pushNext(null, 'DocMarkupChooseDeptPage')
                        }}>
                        <Text style={styles.atText}>@</Text>
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff'
    },
    textLight: {
        color: '#999',
        fontSize: 14
    },
    atText: {
        fontSize: 24,
        color: '#9999'
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
        height: 37,
        paddingLeft: 11,
        position: 'absolute',
        borderTopWidth: 0.5,
        borderTopColor: '#d9d9d9',
        justifyContent: 'center',
        bottom: 0,
        backgroundColor: '#f9f9f9',
    },
    highlightBox: {
        height: '100%',
        marginBottom: 40,
    },
    commentInput: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 5,
        textAlignVertical: 'top',
        width: '100%',
        height: '100%',
    },
})

export default connect(
    state => ({
        sendStatus: state.docMarkup.sendComments.status,
        atUsers: state.docMarkup.atUsers,
        cacheUserMap: state.docMarkup.cacheUserMap,
    }),
    dispatch => ({
        addModelMarkupComment: (modelVersionId, fileId, markupId, content, deptId, receiverIds = []) => {
            dispatch(DocMarkupAction.addModelMarkupComment(modelVersionId, fileId, markupId, content, deptId, receiverIds));
        }
    }),
)(DocMarkupEditCommentPage)
