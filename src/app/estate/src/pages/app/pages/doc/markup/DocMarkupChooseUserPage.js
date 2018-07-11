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
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'
import { BarItems, StatusActionButton } from 'app-components';
import QuickSelectBar from './QuickSelectBar';
import DocChooseUserItem from './DocChooseUserItem';
import DocChooseUserBar from './DocChooseUserBar';

let SECTIONHEIGHT = 22;
let ROWHEIGHT = 64;
let letters = ['A', 'B', 'D', 'E', 'G', '', 'J', 'K', 'W', 'X', 'Z', '#']
let count = 10;
class DocMarkupChooseUserPage extends Component {

    /**
 * sections数据的格式
[
	{
		key: groupTime
		data: [
			{
				key: it-time
				value: item
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
        let data = [];
        letters.map((letter, index) => {
            for (let i = 0; i < count; i++) {
                data.push({ name: `row-${letter}-${i}`, type: letter })
            }
        })
        let sections = this._sortData(data);
        this.state = {
            data: data,
            sections: sections,
            letters: letters,
            selectedCount: 0,
        };
    }

    _sortData = (data) => {
        let sections = [];
        let dataMap = new Map();
        data.map(item => {
            let section = dataMap.get(item.type)
            if (!section) {
                section = {
                    key: item.type,
                    data: []
                };
                dataMap.set(item.type, section)
                sections.push(section)
            }
            section.data.push(item);
        })
        return sections;
    }

    _scrollTo = (letter) => {
        let index = letters.findIndex((value) => {
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
        this.refUserBar.selectAll(this.state.selectedCount === this.state.data.length);
    }

    _selectAll = () => {
        let selected = this.state.data.length === this.state.selectedCount;
        this.state.data.map(item => {
            item.selected = !selected;
        })
        this.refUserBar.selectAll(!selected);
        this.setState({
            selectedCount: selected ? 0 : this.state.data.length,
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
                    letters={letters}
                    scrollTo={this._scrollTo}
                />
                <DocChooseUserBar
                    ref={(ref) => { this.refUserBar = ref }}
                    style={styles.bottomBar}
                    selectAll={this._selectAll}
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
    bottomBar: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        height: 50,
        width: '100%',
    },
})

export default DocMarkupChooseUserPage;