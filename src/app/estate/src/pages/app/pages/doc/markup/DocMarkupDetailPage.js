import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from 'react-native';
import { BarItems } from 'app-components';
import { Menu } from 'app-3rd/teaset';
import CommentInputView from './CommentInputView'
import SERVICE from 'app-api/service'
import { Toast } from 'antd-mobile';
import { connect } from 'react-redux';
import * as DocMarkupAction from '../../../actions/docMarkupAction';
import API from 'app-api';
import { ActionSheet } from 'app-3rd/teaset';

const screenshot = require("app-images/icon_default_image.png");
import * as UpdateDataAction from "../../../actions/updateDataAction";


class DocMarkupDetailPage extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        headerTitle: <BarItems.TitleBarItem text='批注' />,
        headerLeft: <BarItems />,
        headerRight: navigation.state.params && navigation.state.params.loadRightTitle ? navigation.state.params.loadRightTitle() : <View />
    })

    constructor(props) {
        super(props);
        let { markup = {}, modelVersionId, fileId } = this.props.navigation.state.params;
        this.state = {
            markup: markup,
            modelVersionId: modelVersionId,
            fileId: fileId,
            screenshot: markup.screenshot ? markup.screenshot : screenshot,
            commentText: '',
        };
        this.props.navigation.setParams({ loadRightTitle: this._loadRightTitle, })
    }


    componentWillMount() {
        if (!this.state.markup.screenshot) {
            SERVICE.getModelMarkupScreenUrl(this.props.modelVersionId, this.props.fileId, this.state.markup.id)
                .then(url => {
                    if (url && url.length > 0) {
                        this.state.markup.screenshot = { uri: url };
                        this.setState({
                            screenshot: { uri: url },
                        })
                    }
                }).catch(err => { })
        }
    }

    componentDidMount() {
        this.props.getModelMarkupComments(this.props.data, this.state.modelVersionId, this.state.fileId, this.state.markup.id, 0)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.sendStatus != nextProps.sendStatus && nextProps.sendStatus == 'success') {
            this._onRefresh();//发送成功后刷新列表
        }
        if (this.props.atUsers != nextProps.atUsers) {//@选人完成
            let content = this.state.commentText;
            if (nextProps.atUsers) {
                nextProps.atUsers.map(user => {
                    content += `@${user.name} `
                })
            }
            setTimeout(() => {
                if (storage.currentRouteName == 'DocMarkupDetailPage') {
                    this.state.commentText = content;
                    this._showCommentInputView(nextProps.cacheUserMap);
                }
            }, 200)
        }
    }


    _onCommentChangeText = (value) => {
        this.state.commentText = value
    }

    _loadRightTitle = () => {
        let menuBar = <BarItems navigation={this.props.navigation}>
            <BarItems.RightBarItem navigation={this.props.navigation} textStyle={{ fontSize: 22, height: 30, }} text="..." onPress={(navigation, event, barItem) => this._onMorePress(navigation, event, barItem)} />
        </BarItems>
        if (storage.loadUserInfo().accountInfo.gldAccountId == this.state.markup.creatorId) {
            return menuBar;
        } else {
            return <View />
        }
    }

    _deleteMenuItem = () => {
        let item = {
            icon: <View style={{ flexDirection: 'row', marginLeft: -10 }}>
                <Image style={{ width: 18, height: 18, resizeMode: 'contain', marginRight: 12, }} source={require('app-images/doc/icon_doc_markup_delete.png')} />
                <Text style={{ color: '#fff', fontSize: 14 }}>删除批注</Text>
            </View>, onPress: () => {
                this._deleteMarkup();
            }
        }
        return item;
    }

    _closeMenuItem = () => {
        if (this.state.markup.state == 1) {
            //关闭的批注
        }
        let item = {
            icon:
                <View style={{ flexDirection: 'row', marginLeft: -10 }}>
                    <Image style={{ width: 18, height: 18, resizeMode: 'contain', marginRight: 12, }} source={require('app-images/doc/icon_doc_reply_close.png')} />
                    <Text style={{ color: '#fff', fontSize: 14 }}>关闭批注</Text>
                </View>
            , onPress: () => {
                this._closeMarkup();
            }
        }
        return item;
    }

    _onMorePress = (navigation, event, barItem, ) => {
        // 菜单
        let fromView = barItem;
        fromView.measureInWindow((x, y, width, height) => {
            let showMenu = null;
            let items = [
                this._deleteMenuItem(),

            ];
            if (this.state.markup.state == 0) {
                items.push(this._closeMenuItem())
            }
            showMenu = Menu.show({ x, y, width, height }, items, {
                align: 'end', showArrow: true, shadow: Platform.OS === 'ios' ? true : false,
                popoverStyle: [{ paddingLeft: 10, paddingRight: 10 }], directionInsets: 0, alignInsets: -5, paddingCorner: 10
            });
        });
    }
    //删除批注
    _deleteMarkup = () => {
        let items = [
            {
                title: '删除', onPress: (event) => {
                    event && event.preventDefault();
                    SERVICE.deleteModelMarkup(this.state.modelVersionId, this.state.fileId, this.state.markup.id)
                        .then(data => {
                            if (data && data.success) {
                                Toast.info('批注已删除', 1)
                                this.props.updateData();
                                this.props.navigation.goBack();
                            } else {
                                Toast.info('删除批注失败', 1)
                            }
                        }).catch(err => {
                            Toast.info('删除批注失败', 1)
                        })
                }
            },
        ];
        let cancelItem = { title: '取消' };
        ActionSheet.show(items, cancelItem);


    }
    //关闭批注
    _closeMarkup = () => {
        SERVICE.closeModelMarkup(this.state.modelVersionId, this.state.fileId, this.state.markup.id)
            .then(data => {
                if (data && data.success) {
                    Toast.info('批注已关闭', 1)
                    this.state.markup.state = 1;
                    this.setState({
                        markup: this.state.markup.state,
                    })
                    this.props.updateData();
                } else {
                    Toast.info('关闭批注失败', 1)
                }
            }).catch(err => {
                Toast.info('关闭批注失败', 1)
            })
    }

    //添加评论
    _addModelMarkupComment = (content, receiverIds) => {
        this.props.addModelMarkupComment(this.state.modelVersionId, this.state.fileId, this.state.markup.id, content, storage.loadProject(), receiverIds)
    }
    //显示评论输入框
    _showCommentInputView = (cacheUserMap) => {
        CommentInputView.show(
            this._addModelMarkupComment,
            this._onCommentChangeText,
            { modelVersionId: this.state.modelVersionId, fileId: this.state.fileId, markupId: this.state.markup.id },
            this.state.commentText, cacheUserMap,
        );
    }

    _onRefresh = () => {
        if (this.props.isLoading) {
            return;
        }
        this.props.getModelMarkupComments(this.props.data, this.state.modelVersionId, this.state.fileId, this.state.markup.id, 0)
    }

    _onEndReached = () => {
        if (this.props.isLoading || this.props.hasMore == false) {
            return;
        }
        this.props.getModelMarkupComments(this.props.data, this.state.modelVersionId, this.state.fileId, this.state.markup.id, this.props.offset)
    }

    _renderHeader = () => {
        return (
            <View style={styles.containerView}>
                <View style={styles.infoContainer}>
                    <Image style={styles.userAvatar} source={require('app-images/icon_default_boy.png')} />
                    <View style={{ marginLeft: 10, flex: 1 }}>
                        <Text style={styles.textMain}>{this.state.markup.creatorName}</Text>
                        <Text style={styles.textTime}>{API.formatUnixtimestamp(this.state.markup.createTime)}</Text>
                    </View>
                </View>
                <Text style={[styles.textMain, styles.textContent]}>{this.state.markup.description}</Text>

                <TouchableOpacity onPress={(event) => { event.preventDefault(); }}>
                    <View style={styles.thumbnailContainer}>
                        <Image style={styles.thumbnail} source={this.state.screenshot} />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    _renderFooter = () => {
        return (
            <View style={styles.listFooter}></View>
        )
    }

    _renderCommentItem = (item, index) => {
        return (
            <View key={`comment-key${index}`}>
                <View style={styles.infoContainer}>
                    <Image style={styles.userAvatar} source={require('app-images/icon_default_boy.png')} />
                    <View style={{ marginLeft: 10, flex: 1 }}>
                        <Text style={styles.textMain}>{item.creatorName}</Text>
                        <Text style={styles.textTime}>{API.formatUnixtimestamp(item.createTime)}</Text>
                    </View>
                </View>
                <Text style={[styles.textMain, { margin: 24 }]}>{item.content}</Text>
            </View>
        )
    }

    _renderSeparator = () => {
        return (
            <View style={{ width: '100%', height: 0.5, backgroundColor: '#E9E9E9' }}></View>
        )
    }
    _keyExtractor = (item, index) => {
        return `comment-key${index}`
    };

    render() {
        return (
            <View style={{ backgroundColor: '#fff', width: '100%', height: '100%' }}>
                <FlatList
                    data={this.props.comments}
                    renderItem={({ item, index }) => { return this._renderCommentItem(item, index) }}
                    onRefresh={this._onRefresh}
                    refreshing={this.props.isLoading}
                    onEndReached={this._onEndReached}
                    onEndReachedThreshold={1}
                    ItemSeparatorComponent={this._renderSeparator}
                    ListHeaderComponent={this._renderHeader()}
                    ListFooterComponent={this._renderFooter()}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={this._keyExtractor}
                />
                {
                    this.state.markup.state == 1 ? (null) : (
                        <View style={styles.commentBar}>
                            <TouchableOpacity style={{ flex: 1 }} onPress={(event) => { event.preventDefault(); this._showCommentInputView(this.props.cacheUserMap) }}>
                                <View style={styles.commentInput} >
                                    <Text style={[styles.textLight, { marginLeft: 10, }]}>评论</Text>
                                </View>
                            </TouchableOpacity>
                            <Image style={styles.atIcon} source={require('app-images/doc/icon_doc_face.png')} />
                        </View>
                    )
                }


            </View>


        );
    }
}

const styles = StyleSheet.create({
    containerView: {
        paddingTop: 10,
        marginBottom: 15,
        paddingBottom: 10,
        backgroundColor: '#FFF',
        elevation: 0.5, // android 
        shadowColor: 'rgba(178,192,209,0.50)', // iOS
        shadowOffset: { width: 1.5, height: 11 }, // iOS
        shadowOpacity: 0.15, // iOS
        shadowRadius: 3, // iOS
    },
    itemShadow: {
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#FFF',
        elevation: 2.5, // android 
        shadowColor: "#333", // iOS
        shadowOffset: { width: 1.5, height: 5 }, // iOS
        shadowOpacity: 0.15, // iOS
        shadowRadius: 3, // iOS
    },
    listFooter: {
        marginBottom: 70,
        paddingBottom: 10,
        backgroundColor: '#FFF',
    },

    infoContainer: {
        marginTop: 10,
        marginLeft: 24,
        marginRight: 24,
        flexDirection: 'row',
        alignItems: "center"
    },
    userAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        resizeMode: 'cover'
    },
    atIcon: {
        width: 24,
        height: 24,
        resizeMode: 'cover',
        marginLeft: 10,
        marginRight: 15,
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
    textTime: {
        color: '#999',
        fontSize: 12
    },
    textContent: {
        marginLeft: 24,
        marginRight: 24,
        marginTop: 14,
        marginBottom: 14,
    },
    thumbnailContainer: {
        marginLeft: 24,
        marginRight: 24,
        marginBottom: 10,
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
        paddingLeft: 10,
        paddingRight: 10
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
    commentBar: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        height: 48,
        width: '100%',
        elevation: 2.5,
        backgroundColor: '#fafafa',
        alignItems: 'center',
        flexDirection: 'row'
    },
    commentBarText: {
        color: '#00baf3',
        fontSize: 14,
        paddingRight: 20
    },
    commentInput: {
        height: 34,
        width: '100%',
        marginLeft: 14,
        backgroundColor: '#fff',
        borderRadius: 4,
        justifyContent: 'center'
    },
})


export default connect(
    state => ({
        offset: state.docMarkup.comments.offset,
        isLoading: state.docMarkup.comments.isLoading,
        comments: state.docMarkup.comments.data,
        hasMore: state.docMarkup.comments.hasMore,
        sendStatus: state.docMarkup.sendComments.status,
        atUsers: state.docMarkup.atUsers,
        cacheUserMap: state.docMarkup.cacheUserMap,
    }),
    dispatch => ({
        getModelMarkupComments: (dataArray, modelVersionId, fileId, markupId, offset, limit) => {
            dispatch(DocMarkupAction.getModelMarkupComments(dataArray, modelVersionId, fileId, markupId, offset, limit));
        },
        addModelMarkupComment: (modelVersionId, fileId, markupId, content, deptId, receiverIds = []) => {
            dispatch(DocMarkupAction.addModelMarkupComment(modelVersionId, fileId, markupId, content, deptId, receiverIds));
        },
        updateData:()=>{
            dispatch(UpdateDataAction.updateData())
        }
    }),
)(DocMarkupDetailPage)
