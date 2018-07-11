import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    PanResponder,
    Platform,
} from 'react-native';

let offsetTop = Platform.OS === 'ios' ? 44 + 20 : 56;
var itemHeightMap = new Map();//每个字母的y坐标

const ALL_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#']

class QuickSelectBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            letters: ALL_LETTERS,
        }
    }

    scrollTo = (index) => {
        if (this.props.scrollTo && index >= 0) {
            this.props.scrollTo(this.state.letters[index])
        }
    }

    _getScrollToIndex = (value) => {
        let index = -1;
        let len = this.state.letters.length;
        if (value < itemHeightMap.get(this.state.letters[0]).y) {
            return index;
        }
        for (let i = 0; i < len; i++) {
            if (value > itemHeightMap.get(this.state.letters[i]).y) {
                index = i;
            }
        }
        return index;
    }

    componentDidMount() {
    }

    _getOffsetTop = (callback) => {
        this.barRef.measureInWindow((x, y, width, height) => {
            offsetTop = y;
            if (callback) {
                callback();
            }
        });
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
                this._getOffsetTop(() => {
                    let value = gestureState.y0 - offsetTop + 1;
                    let index = this._getScrollToIndex(value);
                    this.scrollTo(index);
                })
            },
            onPanResponderMove: (evt, gestureState) => {
                // console.log('移动 最近一次移动时的屏幕坐标\n moveX:' + gestureState.moveX + ',moveY:' + gestureState.moveY);
                // console.log('移动 当响应器产生时的屏幕坐标\n x0:' + gestureState.x0 + ',y0:' + gestureState.y0);
                // console.log('移动 从触摸操作开始时的累计纵向路程\n dx:' + gestureState.dx + ',dy :' + gestureState.dy);
                let value = gestureState.moveY - offsetTop + 1;
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

    lettersLayout = (e) => {
        // console.log('lettersLayout 高度' + e.layout.height);
        // console.log('lettersLayout y坐标' + e.layout.y);
    }

    oneLetterLayout = (letter, index, e) => {
        // console.log('每个字母高度相对于父布局 y坐标' + e.layout.y);
        let itemHeightInfo = itemHeightMap.get(letter)
        if (!itemHeightInfo) {
            itemHeightInfo = { letter: letter }
            itemHeightMap.set(letter, itemHeightInfo)
        }
        itemHeightInfo.y = e.layout.y + 10;
    }

    renderLetter(letter, index) {
        return (
            <View
                key={index}
                onLayout={({ nativeEvent: e }) => this.oneLetterLayout(letter, index, e)}
                style={styles.letter}
            >
                <Text style={styles.letterText}>{letter}</Text>
            </View>
        )
    }

    render() {
        return (
            <View
                style={[this.props.style,]}
                {...this._panGesture.panHandlers}
                onLayout={({ nativeEvent: e }) => this.lettersLayout(e)}
            >
                <Text ref={ref => this.barRef = ref} style={{ height: 1, width: 30 }}></Text>
                <View style={styles.letters}>
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
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    letter: {
        flex: 1,
        width: 20,
        justifyContent: 'center',
    },
    letterText: {//右边list字母的样式
        textAlign: 'center',
        fontSize: 12,
        color: '#666',
    },
})

export default QuickSelectBar;