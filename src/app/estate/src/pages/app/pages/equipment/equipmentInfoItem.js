
import PropTypes from 'prop-types';
import React from 'react';
import { View, StyleSheet, Text, TextInput, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
const rightImage = require("app-images/icon_arrow_right_gray.png");
const clearImage = require("app-images/login/icon_login_password_delete.png")
var { width, height } = Dimensions.get("window");
class TextInputWithData extends TextInput {
    componentWillMount = () => {
        this.value = '' + this.props.defaultValue;
    }
}

class EquipmentInfoItemTextInput extends React.Component {

    constructor(props) {
        super(props);
        
        let key = 'key'+Math.random();
        if(!key) {
            key = 'key';
        }
        this.keyPrev =  key+ new Date().getTime()
        this.state = {
            dValue: this.props.content,
            focus: false,
            key: 1
        }
    }

    onClick = (event) => {
        if (!this.props.onClick) {
            return;
        }
        this.props.onClick(event);
    }
    onChangeText = (value) => {
        value = value || '';
        this.state.dValue = value;
        if (this.props.onChangeText) {
            this.props.onChangeText(value);
        }
        let dis = value.length > 0 ? 'flex' : 'none';
        this.refs.clearButton.setNativeProps({ style: { 'display': dis } });
    }
    onClear = (event) => {
        let key = this.state.key;
        this.setState({
            dValue: key % 2 ? '' : null,
            key: key + 1,
        });
        this.refs.textInput.focus();
        if (this.props.onClear) {
            this.props.onClear(event);
        } else {
            if (this.props.onChangeText) {
                this.props.onChangeText('');
            }
        }
        let dis = 'none';
        this.refs.clearButton.setNativeProps({ style: { 'display': dis } });
    }
    onBlur = (event) => {
        this.state.focus = false;
        this.refs.clearButton.setNativeProps({ style: { 'display': 'none' } });
        if (this.props.onBlur) {
            this.props.onBlur(event);
        }
    }
    onFocus = (event) => {
        let value = this.state.dValue || '';
        this.state.focus = true;
        let dis = (value.length > 0 && this.state.focus) ? 'flex' : 'none';
        this.refs.clearButton.setNativeProps({ style: { 'display': dis } });
        if (this.props.onFocus) {
            this.props.onFocus(event);
        }
    }
    render = () => {
        return (
            <View style={styles.containerView} >
                <View style={[styles.titleView, this.props.titleWidth ? { width: this.props.titleWidth } : null]}>
                    <Text style={[styles.leftTitle, this.props.leftTitleColor ? { color: this.props.leftTitleColor } : {}]}>{this.props.leftTitle}</Text>
                </View>
                <View style={[styles.contentInputView, this.props.titleWidth ? { width: width - 40 - this.props.titleWidth } : null]}>
                    <TextInputWithData key={this.keyPrev + this.state.key} onFocus={this.onFocus} onBlur={this.onBlur} ref="textInput" returnKeyType="next" underlineColorAndroid={"transparent"} autoCorrect={false} autoCapitalize='none'
                        defaultValue={this.state.dValue}
                        value={Platform.OS === 'ios' ? this.state.dValue : null} style={styles.textInput}
                        onChangeText={(value) => this.onChangeText(value)} />
                </View>

            {
                Platform.OS === 'ios' ?(<TouchableOpacity ref='clearButton' style={[styles.rightAction,(this.state.dValue && this.state.dValue.length > 0 && this.state.focus) ? {} : {'display':'none'}]} activeOpacity={0.5} onPress={(event) => {event.preventDefault(); this.onClear(event); }}>
                <Image source={clearImage} style={styles.inputClear} />
                </TouchableOpacity> ) : (<View style={styles.rightAction}>
                <TouchableOpacity ref='clearButton' style={[(this.state.dValue && this.state.dValue.length > 0 && this.state.focus) ? {} : {'display':'none'}]} activeOpacity={0.5} onPress={(event) => {event.preventDefault(); this.onClear(event); }}>
                    <Image source={clearImage} style={styles.inputClear} />
                </TouchableOpacity>
               </View>)
            }   
            </View>
        );

    }
    renderClickInput = (content) => {
        return (
            <View style={styles.containerView} >
                <View style={[styles.titleView, this.props.titleWidth ? { width: this.props.titleWidth } : null]}>
                    <Text style={[styles.leftTitle, this.props.leftTitleColor ? { color: this.props.leftTitleColor } : {}]}>{this.props.leftTitle}</Text>
                </View>
                <View style={styles.contentInputView}>
                    <TextInputWithData defaultValue={content} style={styles.textInput} returnKeyType="next" underlineColorAndroid={"transparent"} autoCorrect={false} autoCapitalize='none'></TextInputWithData>
                </View>
                <TouchableOpacity style={[styles.rightAction, {}]} activeOpacity={0.5} onPress={(event) => {event.preventDefault(); this.onClick(event) }}>
                    <Image source={rightImage} style={styles.infoMark} />
                </TouchableOpacity>
            </View>
        );
    }

}
export default class EquipmentInfoItem extends React.Component {
    static EquipmentInfoItemTextInput = EquipmentInfoItemTextInput;
    onClick = (event) => {
        if (!this.props.onClick) {
            return;
        }
        this.props.onClick();
    }

    renderInput = () => {
        console.log('renderInput');
        let { content } = this.props;
        if (content) {
            content = '' + content;
        }
        if (this.props.onClick) {
            return this.renderClickInput(content);
        }
        return (
            <View style={styles.containerView} >
                <View style={[styles.titleView, this.props.titleWidth ? { width: this.props.titleWidth } : null]}>
                    <Text style={[styles.leftTitle, this.props.leftTitleColor ? { color: this.props.leftTitleColor } : {}]}>{this.props.leftTitle}</Text>
                </View>
                <View style={[styles.contentInputView, this.props.titleWidth ? { width: width - 40 - this.props.titleWidth } : null]}>
                    <TextInputWithData ref="textInput" onFocus={() => { }} returnKeyType="next" underlineColorAndroid={"transparent"} autoCorrect={false} autoCapitalize='none' defaultValue={content} style={styles.textInput}
                        onChangeText={(value) => {
                            value = value || '';
                            this.props.onChangeText(value);
                        }} />
                </View>
            </View>
        );

    }
    renderClickInput = (content) => {
        return (
            <View style={styles.containerView} >
                <View style={[styles.titleView, this.props.titleWidth ? { width: this.props.titleWidth } : null]}>
                    <Text style={[styles.leftTitle, this.props.leftTitleColor ? { color: this.props.leftTitleColor } : {}]}>{this.props.leftTitle}</Text>
                </View>
                <View style={styles.contentInputView}>
                    <TextInputWithData defaultValue={content} style={styles.textInput} returnKeyType="next" underlineColorAndroid={"transparent"} autoCorrect={false} autoCapitalize='none'></TextInputWithData>
                </View>
                <TouchableOpacity style={[styles.rightAction, {}]} activeOpacity={0.5} onPress={(event) => {event.preventDefault(); this.onClick(event) }}>
                    <Image source={rightImage} style={styles.infoMark} />
                </TouchableOpacity>
            </View>
        );
    }

    renderHeaderInfo = () => {
        if (!this.props.onClick) {
            return (
                <View style={styles.containerView} >
                    <View style={styles.titleViewHeader}>
                        <Text style={{ backgroundColor: '#00b5f2', width: 2, marginRight: 5, height: 16, fontSize: 20, fontWeight: 'bold' }}>{' '}</Text>
                        <Text style={[styles.leftTitleHeader, this.props.leftTitleColor ? { color: this.props.leftTitleColor } : {}]}>{this.props.leftTitle}</Text>
                    </View>
                    <View style={styles.contentView}>
                        <Text style={styles.content}>{this.props.content}</Text>
                    </View>
                </View>
            );
        }
        return (
            <View style={[styles.containerView,{ height: 40 }]} >
                <View style={styles.titleViewHeader}>
                    <Text style={{ backgroundColor: '#00b5f2', width: 2, marginRight: 5, height: 16, fontSize: 20, fontWeight: 'bold' }}>{' '}</Text>
                    <Text style={[styles.leftTitleHeader, this.props.leftTitleColor ? { color: this.props.leftTitleColor } : {}]}>{this.props.leftTitle}</Text>
                </View>
                <View style={styles.contentView}>
                    <Text style={styles.content}>{this.props.content}</Text>
                </View>
                <TouchableOpacity style={styles.rightAction} activeOpacity={0.5} onPress={(event) => {event.preventDefault(); this.onClick(event) }}>
                    <Image source={rightImage} style={styles.infoMark} />
                </TouchableOpacity>
            </View>
        );
    }
    renderInfo = () => {
        if (!this.props.onClick) {
            return (
                <View style={[styles.containerView, { height: 40 }]} >
                    <View style={styles.titleView}>
                        <Text style={styles.leftTitle}>{this.props.leftTitle}</Text>
                    </View>
                    <View style={styles.contentView}>
                        <Text style={styles.content}>{this.props.content}</Text>
                    </View>
                </View>
            );
        }
        return (
            <View style={[styles.containerView, { height: 40 }]} >
                <View style={styles.titleView}>
                    <Text style={[styles.leftTitle, this.props.leftTitleColor ? { color: this.props.leftTitleColor } : {}]}>{this.props.leftTitle}</Text>
                </View>
                <TouchableOpacity activeOpacity={0.5} style={{ flex: 1, marginLeft: 2}} onPress={(event) => {event.preventDefault(); this.onClick(event) }}>
                    <Text style={[styles.content, { textAlignVertical:"center" }]}>{this.props.content}</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} onPress={(event) => {event.preventDefault(); this.onClick(event) }}>
                    <Image source={rightImage} style={styles.infoMark} />
                </TouchableOpacity>

            </View>
        );
    }
    renderLink = () => {
        return (
            <View style={styles.containerView} >
                <View style={styles.titleView}>
                    <Text style={styles.leftTitle}>{this.props.leftTitle}</Text>
                </View>
                <View style={styles.contentView}>
                    <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.5} onPress={(event) => {event.preventDefault(); this.onClick(event) }}>
                        <Text style={[styles.content, styles.link]}>{this.props.content}</Text>
                    </TouchableOpacity>
                    {
                        (this.props.onClick) ? (
                            <TouchableOpacity activeOpacity={0.5} onPress={(event) => {event.preventDefault(); this.onClick(event) }}>
                                <Image source={rightImage} style={styles.infoMark} />
                            </TouchableOpacity>
                        ) : (null)
                    }

                </View>
            </View>
        );
    }
    renderLine = () => {
        return (
            <View style={[styles.containerView, styles.lineView]}>
            </View>
        );
    }
    bigImage = (images, index) => {
        let media = [];
        images.map((item, index) => {
            media.push({
                photo: item.url,
                objectId: item.objectId
            });
        });
        storage.pushNext(null, 'BigImageViewPage', { media: media, index: index })

    }
    renderImage = () => {
        const { url } = this.props;
        return (
            <View style={styles.containerView} >
                <TouchableOpacity activeOpacity={0.5} onPress={(event) => {event.preventDefault();
                    this.bigImage([url], 0);
                }}>
                    <Image source={{ uri: url.url }} style={styles.imageMax} />
                </TouchableOpacity>
            </View>
        );
    }
    renderImages = () => {
        return (
            <View style={styles.containerView} >
                {
                    this.props.urls.map((url, index) => {
                        return (
                            <TouchableOpacity key={'xxx' + index} activeOpacity={0.5} onPress={(event) => {event.preventDefault(); this.bigImage(this.props.urls, index); }}>
                                <Image source={{ uri: url.url }} style={styles.imageNarmal} />
                            </TouchableOpacity>
                        );
                    })
                }

            </View>
        );
    }
    renderItem = () => {
        return (
            <View style={styles.containerView} >
                <View style={styles.titleView}>
                    <Text style={styles.leftTitle}>{this.props.leftTitle}</Text>
                </View>
                <View style={styles.contentView}>
                    <Text style={styles.content}>{this.props.content}</Text>
                </View>
            </View>
        );
    }
    render = () => {
        if (this.props.showType === 'headerInfo') {
            return this.renderHeaderInfo();
        }
        if (this.props.showType === 'info') {
            return this.renderInfo();
        }
        if (this.props.showType === 'link') {
            return this.renderLink();
        }
        if (this.props.showType === 'line') {
            return this.renderLine();
        }
        if (this.props.showType === 'image') {
            return this.renderImage();
        }
        if (this.props.showType === 'images') {
            return this.renderImages();
        }
        if (this.props.showType === 'input') {
            return this.renderInput();
        }
        return this.renderItem();
    }
}
EquipmentInfoItem.propTypes = {

    /**
     * 控件展现类型 default|info|headerInfo|link|line|image|images|input
     */
    showType: PropTypes.string,
    /**
     * 点击响应
     */
    onClick: PropTypes.func,
    /**
     * 数据变化响应
     */
    onChangeText: PropTypes.func,
    /**
     * 内容变更
     */
    onValueChange: PropTypes.func,
    /**
     * 左侧标题
     */
    leftTitle: PropTypes.any,

    /**
     * 左侧标题颜色
     */
    leftTitleColor: PropTypes.any,
    /**
     * 内容
     */
    content: PropTypes.any,
    // image 类型需要的数据
    /**
    * 图片链接
    */
    url: PropTypes.any,
    // images 类型需要的数据
    /**
    * 图片链接
    */
    urls: PropTypes.array,
    /**
      * 标题宽度
      */
    titleWidth: PropTypes.any,


};


const styles = StyleSheet.create({

    containerView: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 20,
        marginRight: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        color: '#666666',
        fontSize: 16,
        fontWeight: '200',
        marginTop: 0,
        marginBottom: 0,
        marginRight: 15,
        height: 40,
    },
    content: {
        fontSize: 16,
        fontWeight: '100',
        alignContent: 'center',
        color: "#666666"
    },
    link: {
        color: '#00b5f2',
        textDecorationLine: 'underline',
        fontSize: 16,
        marginRight: 75,
        fontWeight: '100',
    },
    leftTitle: {
        fontSize: 16,
        width: '100%',
        color: '#000000',
        fontWeight: '200',
        // fontFamily:"PingFangSC-Light",
    },
    leftTitleHeader: {
        fontSize: 14,
        width: '100%',
        color: '#666666',
        fontWeight: '200',
        // fontFamily:"PingFangSC-Light",
    },
    titleViewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleView: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 85,
    },
    contentView: {
        flexDirection: 'row',
        marginRight: 85,
        height: 40,
        width: width - 85 - 40,
        alignItems: 'center',
    },
    contentViewAction: {
        flexDirection: 'row',
        height: 40,
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    contentInputView: {
        width: width - 85 - 40,
        height: 40,
    },
    infoMark: {
        marginRight: -1,
        width: 17,
        height: 17,
        resizeMode: 'contain'
    },
    inputClear: {
        marginRight: 0,
        width: 17,
        height: 17,
        resizeMode: 'contain',
    },
    rightAction: {
        right: 0,
        width: 20,
        flexDirection: 'row-reverse',
        position: 'absolute',
        alignItems: 'center',
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
        display:'flex',
    },
    lineView: {
        height: 1,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 20,
        width: '100%',
        backgroundColor: '#f7f7f7'
    },
    imageNarmal: {
        marginRight: 10,
        width: 106,
        height: 106,
        resizeMode: 'cover'
    },
    imageMax: {
        width: 230,
        height: 230,
        resizeMode: 'contain'
    },
});
