import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet
} from 'react-native';
import { GLDGrid, GLDActionSheet } from 'app-components'


const data = [
    { source: require("app-images/icon_share_wx.png"), name: "下载", },
    { source: require("app-images/icon_share_collect.png"), name: "分享", },
    { source: require("app-images/icon_share_pyq.png"), name: "删除", },
    { source: require("app-images/icon_share_pyq.png"), name: "下载", },
    { source: require("app-images/icon_share_pyq.png"), name: "移动", },
    { source: require("app-images/icon_share_pyq.png"), name: "收藏", },
    { source: require("app-images/icon_share_pyq.png"), name: "重命名", },
];

class DocActionSheet {

    static show() {
        let docActionSheet = (
            <View style={styles.container} >
                <View style={styles.titleBox}>
                    <Image source={require("app-images/icon_blueprint_file.png")} style={styles.folder} />
                    <Text>新建文件夹</Text>
                </View>
                <View style={[styles.line]} />
                <GLDGrid
                    style={{ width: "100%", }}
                    data={data}
                    numColumns={3}
                    imageStyle={{ height: 60, width: 60 }}
                    onPress={(item, index) => {
                        GLDActionSheet.close();
                        alert(item.name)
                    }}
                />
            </View>

        )
        GLDActionSheet.show(docActionSheet)
    }
}
const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingBottom: 10
    },

    titleBox: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 20,
        paddingTop: 20,
        paddingBottom: 10
    },

    folder: {
        width: 21,
        height: 17,
        marginRight: 10
    },

    line: {
        height: 1,
        width: "100%",
        marginBottom: 10,
        backgroundColor: "#f7f7f7",
    }
})

export default DocActionSheet;