import React, { Component } from 'react';
import {
    View,
    Text,
    SectionList,
    Image,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback,
} from 'react-native';
import { connect } from 'react-redux';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'
import { BarItems, StatusActionButton } from 'app-components';
import QuickSelectBar from './QuickSelectBar';
import DocChooseUserItem from './DocChooseUserItem';
import DocChooseUserBar from './DocChooseUserBar';
import SERVICE from 'app-api/service'
import { CharacterUtil } from './CharacterUtil'
import * as DocMarkupAction from '../../../actions/docMarkupAction';

let SECTIONHEIGHT = 22;
let ROWHEIGHT = 64;
class DocMarkupChooseUserPage extends Component {

    /**
 * sections数据的格式
[
	{
		key: groupTime
		data: [
			{
				type: it-time
				data: item
			}
		]

	}
]
 */
    static navigationOptions = ({ navigation, screenProps }) => ({
        headerTitle: <BarItems.TitleBarItem text='选择用户' />,
        headerLeft: <BarItems />,
        headerRight: <View />,
    })


    constructor(props) {
        super(props);
        this.state = {
            users: [],
            sections: [],
            letters: [],
            selectedCount: 0,
        };
    }


    componentDidMount() {
        let { deptId = 0 } = this.props.navigation.state.params;
        SERVICE.getMembersList(deptId)
            .then(users => {
                this._sortData(users);
            })
    }

    _sortData = (users) => {
        let sections = [];
        let letters = [];
        let dataMap = new Map();
        users.map(item => {
            rowData = { data: item, }
            rowData.type = CharacterUtil.getFirstCharacter(item.name)
            let section = dataMap.get(rowData.type)
            if (!section) {
                section = {
                    key: rowData.type,
                    data: []
                };
                dataMap.set(rowData.type, section)
                sections.push(section)
                letters.push(rowData.type);
            }
            section.data.push(rowData);
        })
        sections.sort(this._sortSection)
        this.setState({
            users: users,
            sections: sections,
            letters: letters,
        });
    }

    _sortSection = (l, r) => {
        if (l.key === r.key) {
            return 0;
        } else if (l.key === '#') {
            return 1;
        } else if (r.key === '#') {
            return -1;
        } else if (l.key < r.key) {
            return -1;
        } else {
            return 1;
        }
    }

    _scrollTo = (letter) => {
        let index = this.state.letters.findIndex((value) => {
            return letter === value
        });
        if (index == -1) {
            return;
        }
        this._listView.scrollToLocation({
            animated: true,
            sectionIndex: index,
            itemIndex: -1
        })
    }

    _onSelectedChange = (item) => {
        if (item.selected) {
            this.state.selectedCount++;
        } else {
            this.state.selectedCount--;
        }
        this.refUserBar.selectAll(this.state.selectedCount === this.state.users.length);
    }

    _selectAll = () => {
        let selected = this.state.users.length === this.state.selectedCount;
        this.state.sections.map(section => {
            section.data.map(rowData => {
                rowData.selected = !selected;
            })
        })
        this.refUserBar.selectAll(!selected);
        this.setState({
            selectedCount: selected ? 0 : this.state.users.length,
        })
    }

    //设置行
    _renderItem = ({ item, index }) => {
        return (
            <DocChooseUserItem
                data={item}
                onSelectChange={this._onSelectedChange}
            />
        )
    }

    //设置组
    _renderSectionHeader = (info) => {
        return (
            <View key={`s-${info.section.key}`} style={{ height: SECTIONHEIGHT, justifyContent: 'center', paddingLeft: 11 }}>
                <Text style={{ color: '#666', fontSize: 16, }}>
                    {info.section.key}
                </Text>
            </View>
        )
    }

    _keyExtractor = (item, index) => {
        return `s-${item.type}-r-${index}`
    };

    _getItemLayout = sectionListGetItemLayout({
        // The height of the row with rowData at the given sectionIndex and rowIndex
        getItemHeight: (rowData, sectionIndex, rowIndex) => ROWHEIGHT,
        // These three properties are optional
        getSeparatorHeight: () => 0, // The height of your separators
        getSectionHeaderHeight: () => SECTIONHEIGHT, // The height of your section headers
        getSectionFooterHeight: () => 0, // The height of your section footers
    })

    /**
     * 确定选择
     */
    _complete = () => {
        let selectedUser = [];
        if (this.state.selectedCount == 0) {

        } else if (this.state.selectedCount == this.state.users.length) {
            selectedUser = selectedUser.concat(this.state.users);
        } else {
            this.state.sections.map(section => {
                section.data.map(rowData => {
                    if (rowData.selected) {
                        selectedUser.push(rowData.data)
                    }
                })
            })
        }

        this.props.addAtUser(selectedUser, this.props.cacheUserMap)
        storage.pop(this.props.navigation, 2);
    }

    render() {
        return (
            <View style={{ height: '100%', backgroundColor: '#fafafa' }}>
                <SectionList
                    ref={listView => this._listView = listView}
                    sections={this.state.sections}
                    renderItem={this._renderItem}
                    renderSectionHeader={this._renderSectionHeader}
                    stickySectionHeadersEnabled={false}
                    refreshing={false}
                    onEndReachedThreshold={1}
                    keyExtractor={this._keyExtractor}
                    onScrollToIndexFailed={() => { }}
                    getItemLayout={this._getItemLayout}
                />
                <QuickSelectBar
                    style={styles.quickSelectBar}
                    scrollTo={this._scrollTo}
                />
                <DocChooseUserBar
                    ref={(ref) => { this.refUserBar = ref }}
                    selectAll={this._selectAll}
                    complete={this._complete}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({

    rowdata: {//下划线的样式
        borderBottomColor: '#fafafa',
        borderBottomWidth: 0.5
    },
    quickSelectBar: {
        position: 'absolute',
        top: 30,
        bottom: 11,
        right: 0,
    },
    itemBox: {
        height: 50,
        marginRight: 30,
        marginLeft: 10,
        marginBottom: 4,
        marginTop: 10,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 4,
        elevation: 2.5, // android 
        shadowColor: 'rgba(178,192,209,0.50)', // iOS
        shadowOffset: { width: 2, height: 6 }, // iOS
        shadowOpacity: 0.15, // iOS
        shadowRadius: 3, // iOS
    },
    checkBox: {
        width: 16,
        height: 16,
        marginLeft: 14,
        marginRight: 13,
        resizeMode: 'contain'
    },
    userAvatar: {
        width: 30,
        height: 30,
        marginRight: 10,
        resizeMode: 'cover',
        borderRadius: 15,
    },
    nameText: {
        fontSize: 15,
        color: '#333'
    },
})

export default connect(
    state => ({
        cacheUserMap: state.docMarkup.cacheUserMap,
    }),
    dispatch => ({
        addAtUser: (users, cacheUserMap) => {
            dispatch(DocMarkupAction.addAtUser(users, cacheUserMap))
        }
    })
)(DocMarkupChooseUserPage);