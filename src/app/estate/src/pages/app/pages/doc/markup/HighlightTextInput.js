import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
} from 'react-native';

class HighlightTextInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inputText: this.props.content ? this.props.content : '',
            formattedText: [],
            keywords: this.props.keywords ? this.props.keywords : [],
        };
    }
    componentDidMount() {
        if (this.state.inputText && this.state.inputText.length > 0) {
            this.handleChangeText(this.state.inputText)
        }
    }

    matchRealKeyword = () => {
        let realKeywords = [];
        this.state.keywords.map((item) => {
            let checkStr = this.state.inputText + ' ';
            let keyword = `@${item} `;
            if (checkStr.indexOf(keyword) >= 0) {
                realKeywords.push(item);
            }
        })
        return realKeywords;
    }
    /**
     * 添加新的@人员
     */
    addKeywords = (keyStr, keywords) => {

        // let keyStr = this._generageKeyStr(keywords);

        let inputText = this._insertToInput(keyStr);
        this.state.keywords = keywords;
        this.handleChangeText(inputText);
    }
    /**
     * 新插入的@人员
     */
    _generageKeyStr = (keywords) => {
        let keyStr = '';
        keywords.map(keyword => {
            let text = `@${keyword} `;
            keyStr += text;
        })
        return keyStr;
    }

    /**
      * 是否在@人员列表
      */
    _isInKeywordList = (keyword) => {
        let index = this.state.keywords.findIndex(function (value, index, arr) {
            return keyword === `@${value} `;
        })
        return !(index === -1);
    }

    /**
     * 在输入框中插入字符串
     */
    _insertToInput = (value) => {
        let len = this.state.inputText.length;
        let inputText = '';
        let newCursor = 0;
        if (len == 0) {
            inputText = value;
            newCursor = inputText.length;
        } else {
            let selection = this.refInput._lastNativeSelection;
            let cursor = len - 1;
            if (selection) {
                cursor = selection.end;
            }
            inputText = this.state.inputText.substring(0, cursor, ) + value + this.state.inputText.substring(cursor, )
            newCursor = cursor + value.length;
        }
        let newSection = { start: newCursor, end: newCursor }
        setTimeout(() => {
            this.refInput.setNativeProps({
                selection: newSection,
            })
        }, 100)

        return inputText;
    }

    handleChangeText = (inputText) => {
        let reg = /@[^@\s]+\s/g;//匹配@开头 空格结束的字符串
        let tempText = inputText;
        let keywords = tempText.match(reg)
        const formattedText = [];
        if (keywords) {
            keywords.map((keyword, index) => {
                let keyIndex = tempText.indexOf(keyword);
                let str = tempText.substring(0, keyIndex)
                tempText = tempText.substring(keyIndex + keyword.length);
                if (str.length > 0) {
                    formattedText.push(str);
                }
                let mention = keyword;
                if (this._isInKeywordList(keyword)) {
                    mention = (
                        <Text key={`key-${keyword}-${index}`} style={styles.mention}>
                            {keyword}
                        </Text>
                    );
                }

                formattedText.push(mention);
            })
            if (tempText.length > 0) {
                formattedText.push(tempText);
            }
        } else {
            formattedText.push(tempText);
        }

        this.setState({
            formattedText: formattedText,
            inputText: inputText,
        })
        this.props.onChangeText(inputText)
    }

    render() {
        return (
            <View style={[this.props.style]}>
                <TextInput
                    {...this.props}
                    ref={(ref) => { this.refInput = ref }}
                    style={[this.props.inputStyle]}
                    onChangeText={this.handleChangeText}
                    multiline={true}
                    onSelectionChange={(event) => {
                    }}
                >
                    {
                        this.state.formattedText.map((item) => {
                            return item;
                        })
                    }
                </TextInput>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    mention: {
        color: '#00baf3',
        fontSize: 14,
    },
})

export default HighlightTextInput;