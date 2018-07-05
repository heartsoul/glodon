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

class DocMarkupDetailPage extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        headerTitle: <BarItems.TitleBarItem text='批注' />,
        headerLeft: <BarItems />,
        headerRight: navigation.state.params && navigation.state.params.loadRightTitle ? navigation.state.params.loadRightTitle() : <View />
    })
    overlayView = null;//输入框弹窗

    constructor(props) {
        super(props);
        let { markup = {}, modelVersionId, fileId } = this.props.navigation.state.params;
        this.state = {
            markup: markup,
            modelVersionId: modelVersionId,
            fileId: fileId,
        };
        this.props.navigation.setParams({ loadRightTitle: this._loadRightTitle, })
    }

    componentDidMount() {
        this.props.getModelMarkupComments(this.props.data, this.state.modelVersionId, this.state.fileId, this.state.markup.id, 0)
    }

    _loadRightTitle = () => {
        return (
            <BarItems navigation={this.props.navigation}>
                <BarItems.RightBarItem navigation={this.props.navigation} textStyle={{ fontSize: 22, height: 30, }} text="..." onPress={(navigation, event, barItem) => this._onMorePress(navigation, event, barItem)} />
            </BarItems>
        )

    }

    _onMorePress = (navigation, event, barItem,) => {
        // 菜单
        let fromView = barItem;
        fromView.measureInWindow((x, y, width, height) => {
            let showMenu = null;
            let items = [
                {
                    title: <Text style={{ color: '#fff', fontSize: 14 }}>删除批注</Text>, onPress: () => {
                        this._deleteMarkup();
                    }
                },
                {
                    title: <Text style={{ color: '#fff', fontSize: 14 }}>关闭批注</Text>, onPress: () => {
                        this._closeMarkup();
                    }
                },

            ];
            showMenu = Menu.show({ x, y, width, height }, items, {
                align: 'end', showArrow: true, shadow: Platform.OS === 'ios' ? true : false,
                popoverStyle: [{ paddingLeft: 10, paddingRight: 10 }], directionInsets: 0, alignInsets: -5, paddingCorner: 10
            });
        });
    }
    //删除批注
    _deleteMarkup = () => {
        SERVICE.deleteModelMarkup(this.state.modelVersionId, this.state.fileId, this.state.markupId.id)
            .then(data => {
                if (data && data.success) {
                    Toast.info('批注已删除', 1)
                    this.props.navigation.goBack();
                } else {
                    Toast.info('删除批注失败', 1)
                }
            }).catch(err => {
                Toast.info('删除批注失败', 1)
            })
    }
    //关闭批注
    _closeMarkup = () => {
        SERVICE.closeModelMarkup(this.state.modelVersionId, this.state.fileId, this.state.markupId.id)
            .then(data => {
                if (data && data.success) {
                    Toast.info('批注已关闭', 1)
                } else {
                    Toast.info('关闭批注失败', 1)
                }
            }).catch(err => {
                Toast.info('关闭批注失败', 1)
            })
    }

    //添加评论
    _addModelMarkupComment = (content, receiverIds) => {
        this.props.addModelMarkupComment(this.state.modelVersionId, this.state.fileId, this.state.markup.id, content, storate.loadProject(), receiverIds)
    }
    //显示评论输入框
    _showCommentInputView = () => {
        CommentInputView.show(this._addModelMarkupComment);
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
                        <Text style={styles.textLight}>{this.state.markup.createTime}</Text>
                    </View>
                    <Image style={styles.pinImage} source={require('app-images/icon_setting_share.png')} />
                </View>
                <Text style={[styles.textMain, styles.textContent]}>{this.state.markup.description}</Text>

                <TouchableOpacity onPress={(event) => { event.preventDefault(); }}>
                    <View style={styles.thumbnailContainer}>
                        <Image style={styles.thumbnail} source={require('app-images/icon_blueprint_default.png')} />
                    </View>
                </TouchableOpacity>

                <View style={styles.commentContainer}>
                    <Text style={[styles.textMain, styles.textComment]}>评论</Text>
                    <Image style={styles.commentCountImage} source={require('app-images/icon_setting_share.png')} />
                    <Text style={styles.textMain}>1</Text>
                </View>
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
                <View style={styles.itemShadow}>
                    <View style={styles.infoContainer}>
                        <Image style={styles.userAvatar} source={require('app-images/icon_default_boy.png')} />
                        <Text style={[styles.textMain, { flex: 1, marginLeft: 10 }]}>{this.state.markup.creatorName}</Text>
                        <Text style={styles.textLight}>{this.state.markup.createTime}</Text>
                    </View>
                    <Text style={[styles.textMain, { margin: 15 }]}>王伟也注意一下@王伟</Text>
                </View>
            </View>
        )
    }

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
                    ListHeaderComponent={this._renderHeader()}
                    ListFooterComponent={this._renderFooter()}
                    showsVerticalScrollIndicator={false}
                />

                <View style={styles.commentBar}>
                    <TouchableOpacity onPress={(event) => { event.preventDefault(), this._showCommentInputView() }}>
                        <Text style={styles.commentBarText}>评论</Text>
                    </TouchableOpacity>
                </View>

            </View>


        );
    }
}

const styles = StyleSheet.create({
    containerView: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
        paddingBottom: 10,
        backgroundColor: '#FFF',
        elevation: 2.5, // android 
        shadowColor: "#333", // iOS
        shadowOffset: { width: 1.5, height: 5 }, // iOS
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
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        marginBottom: 70,
        marginLeft: 20,
        marginRight: 20,
        paddingBottom: 10,
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
    thumbnailContainer: {
        marginLeft: 10,
        marginRight: 10,
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
        height: 60,
        width: '100%',
        elevation: 2.5,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    commentBarText: {
        color: '#00baf3',
        fontSize: 14,
        paddingRight: 20
    },
})


export default connect(
    state => ({
        offset: state.docMarkup.comments.offset,
        isLoading: state.docMarkup.comments.isLoading,
        comments: state.docMarkup.comments.data,
        hasMore: state.docMarkup.comments.hasMore,
    }),
    dispatch => ({
        getModelMarkupComments: (dataArray, modelVersionId, fileId, markupId, offset, limit) => {
            dispatch(DocMarkupAction.getModelMarkupComments(dataArray, modelVersionId, fileId, markupId, offset, limit));
        },
        addModelMarkupComment: (modelVersionId, fileId, markupId, content, deptId, receiverIds = []) => {
            dispatch(DocMarkupAction.addModelMarkupComment(modelVersionId, fileId, markupId, content, deptId, receiverIds));
        }
    }),
)(DocMarkupDetailPage)
