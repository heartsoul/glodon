import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet
} from 'react-native';
import { GLDGrid, GLDActionSheet } from 'app-components'

class DocActionSheet {
    static dataItemNewfolder = { source: require("app-images/icon_share_pyq.png"), name: "新建", itemKey:'newfolder' };
    static dataItemTakephoto = { source: require("app-images/icon_share_pyq.png"), name: "拍照", itemKey:'takephoto' };
    static dataItemImage = { source: require("app-images/icon_share_pyq.png"), name: "照片", itemKey:'image' };
    static dataItemVideo = { source: require("app-images/icon_share_pyq.png"), name: "视频", itemKey:'video' };
    static dataItemAll = { source: require("app-images/icon_share_pyq.png"), name: "全部", itemKey:'all' };

    static dataItemDownload = { source: require("app-images/icon_share_pyq.png"), name: "下载", itemKey:'download' };
    static dataItemShare = { source: require("app-images/icon_share_collect.png"), name: "分享", itemKey:'share' };
    static dataItemDelete = { source: require("app-images/icon_share_pyq.png"), name: "删除", itemKey:'delete' };
    static dataItemCopyto = { source: require("app-images/icon_share_pyq.png"), name: "复制到", itemKey:'copyto' };
    static dataItemMoveto = { source: require("app-images/icon_share_pyq.png"), name: "移动到", itemKey:'moveto' };
    static dataItemFavorite = { source: require("app-images/icon_share_pyq.png"), name: "收藏", itemKey:'favorite' };
    static dataItemFavoriteCancel = { source: require("app-images/icon_share_pyq.png"), name: "取消收藏", itemKey:'favorite-cancel' };
    static dataItemRename = { source: require("app-images/icon_share_pyq.png"), name: "重命名", itemKey:'rename' };
    static show(datas=null,onPress=null) {
        let dataShow = datas || [
            dataItemDownload,
            dataItemShare,
            dataItemDelete,
            dataItemCopyto,
            dataItemMoveto,
            dataItemFavorite,
            dataItemRename,
        ];
        let docActionSheet = (
            <View style={styles.container} >
                <View style={styles.titleBox}>
                    <Image source={require("app-images/icon_blueprint_file.png")} style={styles.folder} />
                    <Text>新建文件夹</Text>
                </View>
                <View style={[styles.line]} />
                <GLDGrid
                    style={{ width: "100%", }}
                    data={dataShow}
                    numColumns={3}
                    imageStyle={{ height: 60, width: 60 }}
                    onPress={(item, index) => {
                        GLDActionSheet.close();
                        if(onPress) {
                            onPress(item,index,item.itemKey);
                        } else {
                            alert(item.name);
                        }
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