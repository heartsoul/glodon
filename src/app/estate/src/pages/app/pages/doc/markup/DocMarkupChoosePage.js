import React, { Component } from 'react';
import {
    View,
    Text,
    SectionList,
    TouchableOpacity,
    StyleSheet,
    Platform,
    PanResponder,
} from 'react-native';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout'

import QuickSelectBar from './QuickSelectBar';

let SECTIONHEIGHT = 40;
let ROWHEIGHT = 30;
let letters = ['A', 'B', 'C', 'D', 'E', 'F']
let count = 10;
class DocMarkupChoosePage extends Component {

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
            sections: sections,
            letters: letters,
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

    _scrollTo = (letter, index) => {
        this._listView.scrollToLocation({
            animated: true,
            sectionIndex: index,
            itemIndex: -1
        })
    }

    //设置行
    _renderItem = ({ item, index }) => {
        return (
            <View
                key={`s-${item.type}-r-${index}`}
                style={{ height: ROWHEIGHT, justifyContent: 'center', paddingLeft: 20, paddingRight: 30 }}
            >
                <View style={styles.rowdata}>
                    <Text style={styles.rowdatatext}>{item.name}</Text>
                </View>
            </View>

        )
    }

    //设置组
    _renderSectionHeader = (info) => {
        return (
            <View key={`s-${info.section.key}`} style={{ height: SECTIONHEIGHT, justifyContent: 'center', paddingLeft: 5, backgroundColor: '#e0e0e0' }}>
                <Text style={{ color: 'black', fontWeight: 'bold', marginLeft: 10 }}>
                    <Text>section-{info.section.key}</Text>
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
            <View style={{ height: '100%' }}>
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
})

export default DocMarkupChoosePage;