import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from 'react-native';
import { BarItems } from 'app-components';
import { Menu } from 'app-3rd/teaset';
import CommentInputView from './CommentInputView'

class DocMarkupDetailPage extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        headerTitle: <BarItems.TitleBarItem text='批注' />,
        headerLeft: <BarItems />,
        headerRight: navigation.state.params && navigation.state.params.loadRightTitle ? navigation.state.params.loadRightTitle() : <View />
    })
    overlayView = null;//输入框弹窗

    constructor(props) {
        super(props);
        let { markup = {} } = this.props.navigation.state.params;
        this.state = {
            markup: markup,
            showCommentInput: false,
            comments: [
                { name: 'aa', content: "aa" },
                { name: 'aa', content: "aa" },
                { name: 'aa', content: "aa" },
                { name: 'aa', content: "aa" },
                { name: 'aa', content: "aa" },
                { name: 'aa', content: "aa" },


            ],
        };
        this.props.navigation.setParams({ loadRightTitle: this._loadRightTitle, })
    }

    _loadRightTitle = () => {
        return (
            <BarItems navigation={this.props.navigation}>
                <BarItems.RightBarItem navigation={this.props.navigation} textStyle={{ fontSize: 22, height: 30, }} text="..." onPress={(navigation, event, barItem) => this._onMorePress(navigation, event, barItem)} />
            </BarItems>
        )

    }

    _onMorePress = (navigation, event, barItem) => {
        // 菜单
        let fromView = barItem;
        fromView.measureInWindow((x, y, width, height) => {
            let showMenu = null;
            let items = [
                { title: <Text>更多...</Text>, onPress: () => { } },
                {
                    title: <View><TouchableOpacity onPress={() => { Menu.hide(showMenu); this._changeOrderType('time'); }}>
                        <Text style={{ lineHeight: 30, color: this.state.orderType !== 'time' ? '#000000' : '#00baf3' }}>文件时间</Text>
                    </TouchableOpacity>
                        <TouchableOpacity onPress={() => { Menu.hide(showMenu); this._changeOrderType('name'); }} style={{}}>
                            <Text style={{ lineHeight: 30, color: this.state.orderType !== 'name' ? '#000000' : '#00baf3' }}>文件名称</Text>
                        </TouchableOpacity>
                    </View>
                }
            ];

            showMenu = Menu.show({ x, y, width, height }, items, {
                align: 'end', showArrow: true, shadow: Platform.OS === 'ios' ? true : false,
                popoverStyle: [{ paddingLeft: 10, paddingRight: 10 }], directionInsets: 0, alignInsets: -5, paddingCorner: 10
            });
        });
    }

    _renderHeader = () => {
        return (
            <View>
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

    _renderCommentItem = (item, index) => {
        return (
            <View key={`comment-key${index}`}>
                <View style={styles.infoContainer}>
                    <Image style={styles.userAvatar} source={require('app-images/icon_default_boy.png')} />
                    <Text style={[styles.textMain, { flex: 1, marginLeft: 10 }]}>{this.state.markup.creatorName}</Text>
                    <Text style={styles.textLight}>{this.state.markup.createTime}</Text>
                </View>
                <Text style={[styles.textMain, { margin: 15 }]}>王伟也注意一下@王伟</Text>
            </View>

        )
    }

    _showCommentInputView = () => {
        CommentInputView.show();
    }

    render() {
        return (
            <View style={{ backgroundColor: '#fff', width: '100%', height: '100%' }}>
                <ScrollView
                >
                    <View style={styles.containerView}>
                        {this._renderHeader()}
                        {
                            this.state.comments.map((item, index) => {
                                return this._renderCommentItem(item, index)
                            })
                        }
                    </View>
                </ScrollView>
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
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 70,
        marginLeft: 20,
        marginRight: 20,
        paddingBottom: 10,
        backgroundColor: '#FFF',
        elevation: 2.5, // android 
        shadowColor: "red", // iOS
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

export default DocMarkupDetailPage;