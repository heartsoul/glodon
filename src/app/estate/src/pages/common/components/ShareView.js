import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { GLDGrid, GLDActionSheet } from 'app-components'
import { Toast } from 'antd-mobile'
import SERVICE from 'app-api/service'
var { width, height } = Dimensions.get("window")

const SHARE_EXPIRE_TIME = [
    { name: "一天过期" },
    { name: "七天过期" },
    { name: "永久有效" },
]

const SHARE_PERMISSION = [
    { name: "加密" },
    { name: "允许下载" },
]

class ShareView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectExpireTime: {},
            selectPermission: []
        };
    }


    _getRadioSource = (selected) => {
        let url = selected ? require('app-images/icon_downloading_selected.png') : require('app-images/icon_downloading_unselected.png');
        return url
    }

    _selectExpireTime = (item) => {
        if (this.state.selectExpireTime.name != item.name) {
            this.setState({
                selectExpireTime: item
            })
        }
    }

    _renderRadio = (item) => {
        return (
            <TouchableOpacity onPress={(event) => {
                event.preventDefault();
                this._selectExpireTime(item);
            }}
                key={item.name}
            >
                <View style={[styles.flexContainer, { width: (width - 20) / 3 }]}>
                    <Image style={styles.checkImage} source={this._getRadioSource(this.state.selectExpireTime.name === item.name)} />
                    <Text style={[styles.checkText,]}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    _getCheckBoxSource = (selected) => {
        let url = selected ? require('app-images/icon_downloading_selected.png') : require('app-images/icon_downloading_unselected.png');
        return url
    }

    _selectPermission = (item) => {
        let index = this._findPermissionIndex(item);
        if (index < 0) {
            this.state.selectPermission.push(item)
        } else {
            this.state.selectPermission.splice(index, 1)
        }
        this.setState({
            selectPermission: this.state.selectPermission
        })
    }

    _findPermissionIndex = (item) => {
        let index = this.state.selectPermission.findIndex(function (value, index, arr) {
            return item.name === value.name;
        })
        return index;
    }

    _renderCheckBox = (item) => {
        let index = this._findPermissionIndex(item);
        return (
            <TouchableOpacity onPress={(event) => {
                event.preventDefault();
                this._selectPermission(item);
            }}
                key={item.name}
            >
                <View style={[styles.flexContainer, { width: (width - 20) / 3 }]}>
                    <Image style={styles.checkImage} source={this._getCheckBoxSource(index >= 0)} />
                    <Text style={[styles.checkText,]}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    _generateShareToken = (item) => {
        // containerId = "d289a697494247c8a8c148365513bc13";
        // fileId = "7fd5503f31004b79866cfa10fd15c2ce"
        SERVICE.generateShareToken(this.props.containerId, this.props.fileId)
            .then((shareInfo) => {
                GLDActionSheet.close();
                this.props.share(item, shareInfo.token, shareInfo.title, shareInfo.password);
            }).catch(error => {
                console.log(error)
                Toast.show("分享链接生成失败")
            });
    }

    render() {
        let url = this.state.selected ? require('app-images/icon_downloading_selected.png') : require('app-images/icon_downloading_unselected.png');

        return (
            <View style={{ width: width, paddingTop: 20, paddingBottom: 15 }}>
                <Text style={styles.title}>文件分享有效期</Text>
                <View style={[styles.flexContainer, styles.checkContainer]}>
                    {
                        SHARE_EXPIRE_TIME.map((item => {
                            return this._renderRadio(item)
                        }))
                    }
                </View>
                <View style={[styles.line]} />

                <Text style={styles.title}>文件分享权限</Text>
                <View style={[styles.flexContainer, styles.checkContainer]}>
                    {
                        SHARE_PERMISSION.map((item => {
                            return this._renderCheckBox(item)
                        }))
                    }
                </View>
                <View style={[styles.line]} />
                <GLDGrid
                    style={{ width: "100%", }}
                    data={this.props.data}
                    horizontal={true}
                    itemStyle={{ height: 2 * width / 9, width: 2 * width / 9 }}
                    imageStyle={{ height: 60, width: 60 }}
                    onPress={(item, index) => {
                        this._generateShareToken(item);
                    }}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({

    flexContainer: {
        flexDirection: "row",
        alignItems: "center"
    },

    title: {
        color: "#000",
        fontSize: 14,
        marginLeft: 20,
    },
    checkContainer: {
        marginLeft: 20,
        paddingTop: 20,
    },
    checkImage: {
        width: 16,
        height: 16,
        resizeMode: "contain"
    },

    checkText: {
        color: "#000",
        fontSize: 14,
        marginLeft: 10,
    },



    line: {
        height: 1,
        width: width,
        marginTop: 10,
        marginBottom: 20,
        backgroundColor: "#f7f7f7",
    }

})

export default ShareView;
