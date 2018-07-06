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

var lettersItemheight = [];//每个字母的y坐标
let SECTIONHEIGHT = 40;
let ROWHEIGHT = 30;
let navigationBarHeight = Platform.OS === 'ios' ? 44 + 20 : 56;
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
            lettersItemheight.push({ letter: letter, y: 0 })
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
    scrollTo = (index) => {
        this._listView.scrollToLocation({
            animated: true,
            sectionIndex: index,
            itemIndex: -1
        })
    }

    _getScrollToIndex = (value) => {
        let index = 0;
        let len = lettersItemheight.length;
        if (value < lettersItemheight[0].y) {
            return index;
        }
        for (let i = 0; i < len; i++) {
            if (value > lettersItemheight[i].y) {
                index = i;
            }
        }
        return index;
    }

    componentWillMount() {
        this._panGesture = PanResponder.create({
            //要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderTerminationRequest: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                // console.log('触摸 当响应器产生时的屏幕坐标 \n x:' + gestureState.x0 + ',y:' + gestureState.y0);
                let value = gestureState.y0 - navigationBarHeight + 1;
                let index = this._getScrollToIndex(value);
                this.scrollTo(index);

            },
            onPanResponderMove: (evt, gestureState) => {
                // console.log('移动 最近一次移动时的屏幕坐标\n moveX:' + gestureState.moveX + ',moveY:' + gestureState.moveY);
                // console.log('移动 当响应器产生时的屏幕坐标\n x0:' + gestureState.x0 + ',y0:' + gestureState.y0);
                // console.log('移动 从触摸操作开始时的累计纵向路程\n dx:' + gestureState.dx + ',dy :' + gestureState.dy);
                let value = gestureState.moveY - navigationBarHeight + 1;
                let index = this._getScrollToIndex(value);
                this.scrollTo(index);
            },
            onResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                // console.log('抬手 x:' + gestureState.moveX + ',y:' + gestureState.moveY);
            },
            onPanResponderTerminate: (evt, gestureState) => {
                // console.log(`结束 = evt.identifier = ${evt.identifier} gestureState = ${gestureState}`);
            },
        });
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

    lettersLayout = (e) => {
        // console.log('lettersLayout 高度' + e.layout.height);
        // console.log('lettersLayout y坐标' + e.layout.y);
        // lettersHeight = height - searchHeight * 2 - searchHeightMargin * 2;
        // console.log('字母列表高度 = ' + lettersHeight);
        // console.log('height = ' + height);
    }

    oneLetterLayout = (letter, index, e) => {
        // console.log('每个字母高度相对于父布局 y坐标' + e.layout.y);
        console.log(`letter y ---------- ${e.layout.y}`)
        let letterHeight = lettersItemheight[index];
        letterHeight.y = e.layout.y;
        // if(lettersItemheight.length != this.state.letters.length) {
        //     // lettersItemheight.push({ letter: letter, y: e.layout.y });
        // }
    }

    renderLetter(letter, index) {
        return (
            <TouchableOpacity
                onLayout={({ nativeEvent: e }) => this.oneLetterLayout(letter, index, e)}
                key={index} activeOpacity={0.7}
                onPressIn={() => {
                    // this.scrollTo(index)
                    alert(letter)
                }}>
                <View
                    style={styles.letter}>
                    <Text style={styles.letterText}>{letter}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    _getItemLayout = sectionListGetItemLayout({
        // The height of the row with rowData at the given sectionIndex and rowIndex
        getItemHeight: (rowData, sectionIndex, rowIndex) =>  ROWHEIGHT,
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
                <View
                    ref="ref_letters"
                    style={[styles.letters,]}
                    {...this._panGesture.panHandlers}
                    onLayout={({ nativeEvent: e }) => this.lettersLayout(e)}
                >
                    {
                        this.state.letters.map((letter, index) => {
                            return this.renderLetter(letter, index)
                        })
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    letters: {
        flexDirection: 'column',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    letter: {
        height: 30,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    letterText: {//右边list字母的样式
        textAlign: 'center',
        fontSize: 14,
        color: 'black'
    },
    rowdata: {//下划线的样式
        borderBottomColor: '#fafafa',
        borderBottomWidth: 0.5
    },
})

export default DocMarkupChoosePage;