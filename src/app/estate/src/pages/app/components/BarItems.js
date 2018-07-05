import React from 'react';
import PropTypes from 'prop-types'
import { StyleSheet, View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import GLDDrawerPaneView from "./GLDDrawerPaneView"

export class TitleBarItem extends React.Component {
    render = () => {
        return <Text style={[{ color: '#ffffff', fontWeight: 'bold', fontSize: 17, marginTop: 5, alignSelf: "center", flex: 1, textAlign: "center" }, this.props.textStyle ? this.props.textStyle : {}]}>{this.props.text ? this.props.text : ''}</Text>
    }
}
TitleBarItem.propTypes = {
    textStyle: PropTypes.any,
    text: PropTypes.any,
}

export class RightBarItem extends React.Component {

    measureInWindow(callback) {
        this.refs.refText.measureInWindow(callback)
    }

    render = () => {
        return <View ref='actionView'><TouchableOpacity style={styles.actionView} onPress={(event) => { event.preventDefault(); this.props.onPress(this.props.navigation, event, this) }} >
            <View style={styles.spliteItem} />
            {
                this.props.imageSource
                    ? (<Image style={[styles.barItemImage, this.props.imageStyle ? this.props.imageStyle : {}]} source={this.props.imageSource} />) : null
            }
            {
                this.props.text
                    ? (<Text numberOfLines={1} style={[styles.barItemText, this.props.textStyle ? this.props.textStyle : {}]}>{this.props.text ? this.props.text : '返回'}</Text>)
                    : null
            }
            <View style={styles.spliteItem} />
            <Text ref='refText' style={styles.spliteItem} />
        </TouchableOpacity>
        </View>
    }
}
RightBarItem.propTypes = {
    imageStyle: PropTypes.any,
    textStyle: PropTypes.any,
    navigation: PropTypes.any,
    text: PropTypes.any, // text 
    imageSource: PropTypes.any, // image source
    onPress: PropTypes.func.isRequired, // function(navigation)
}

export class LeftBarItem extends React.Component {
    render = () => {
        let onPress = (event) => {
            event.preventDefault();
            this.props.onPress(this.props.navigation)
        };
        return <TouchableOpacity style={styles.actionView} onPress={(event) => { event.preventDefault(); onPress && onPress(event) }} >
            <View style={styles.spliteItem} />
            <View style={styles.spliteItem} />
            {
                this.props.imageSource
                    ? (<Image style={[styles.barItemImage, this.props.imageStyle ? this.props.imageStyle : {}]} source={this.props.imageSource} />) : null
            }
            {
                this.props.text
                    ? (<Text style={[styles.barItemText, this.props.textStyle ? this.props.textStyle : {}]}>{this.props.text ? this.props.text : '返回'}</Text>)
                    : null
            }
            <View style={styles.spliteItem} />
        </TouchableOpacity>
    }
}
LeftBarItem.propTypes = {
    imageStyle: PropTypes.any,
    navigation: PropTypes.any,
    text: PropTypes.any, // text 
    imageSource: PropTypes.any, // image source
    onPress: PropTypes.func.isRequired, // function(navigation)
}

export default class BarItems extends React.Component {
    static LeftBarItem = LeftBarItem;
    static RightBarItem = RightBarItem;
    static TitleBarItem = TitleBarItem;
    _onBackPress = (navigation) => {
        if (this.props.needBack) {
            this.props.needBack((needBack) => {
                if (needBack) {
                    storage.pop(navigation, 1)
                }
            })
            return;
        }
        storage.pop(navigation, 1)
    }

    _onMenuPress = (navigation) => {
        GLDDrawerPaneView.open(this.props.currentItem, navigation);
    }

    render = () => {
        if (this.props.children) {
            return <View style={styles.barItem}>
                {this.props.children}
            </View>
        } else
            return <View style={styles.barItem}>
                <LeftBarItem
                    imageStyle={{}}
                    navigation={this.props.navigation}
                    onPress={(navigation) => this._onBackPress(navigation)}
                    imageSource={require('app-images/icon_back_white.png')} />
                {this.props.top === true ?
                    <LeftBarItem imageStyle={styles.barItemImageMenu} navigation={this.props.navigation} onPress={this._onMenuPress} imageSource={require('app-images/icon_quality_check_menu.png')} />
                    : null}
            </View>
    }
}

BarItems.propTypes = {
    currentItem: PropTypes.string,
    navigation: PropTypes.any,
    top: PropTypes.any,
    needBack: PropTypes.func, // 是否需要返回，不需要的话在回调函数中返回fasle
}

const styles = StyleSheet.create({
    barItem: {
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
    },
    actionView: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        // width: 30,
        height: Platform.OS === 'ios' ? 44 : 56,

    },
    barItemImage: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },
    barItemImageMenu: {
        width: 26,
        height: 26,
        resizeMode: 'contain'
    },
    barItemText: {
        color: '#ffffff',
        fontSize: 15,
    },
    spliteItem: {
        width: 5,
        height: '100%',
    },
});