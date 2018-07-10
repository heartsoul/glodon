import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet
} from 'react-native';
import { GLDGrid, GLDActionSheet } from 'app-components'

class DocActionSheet {
    static dataItemNewfolder = { source: require("app-images/doc/icon_doc_new_folder.png"), name: "新建", itemKey:'newfolder' };
    static dataItemTakephoto = { source: require("app-images/doc/icon_doc_take_photo.png"), name: "拍照", itemKey:'takephoto' };
    static dataItemImage = { source: require("app-images/doc/icon_doc_add_picture.png"), name: "照片", itemKey:'image' };
    static dataItemVideo = { source: require("app-images/doc/icon_doc_add_video.png"), name: "视频", itemKey:'video' };
    static dataItemAll = { source: require("app-images/doc/icon_doc_add_all.png"), name: "全部", itemKey:'all' };

    static dataItemDownload = { source: require("app-images/doc/icon_doc_pane_download.png"), name: "下载", itemKey:'download' };
    static dataItemShare = { source: require("app-images/doc/icon_doc_pane_share.png"), name: "分享", itemKey:'share' };
    static dataItemDelete = { source: require("app-images/doc/icon_doc_pane_delete.png"), name: "删除", itemKey:'delete' };
    static dataItemCopyto = { source: require("app-images/doc/icon_doc_pane_copy.png"), name: "复制到", itemKey:'copyto' };
    static dataItemMoveto = { source: require("app-images/doc/icon_doc_pane_move.png"), name: "移动到", itemKey:'moveto' };
    static dataItemFavorite = { source: require("app-images/doc/icon_doc_pane_fav.png"), name: "收藏", itemKey:'favorite' };
    static dataItemFavoriteCancel = { source: require("app-images/doc/icon_doc_pane_fav_click.png"), name: "取消收藏", itemKey:'favorite-cancel' };
    static dataItemRename = { source: require("app-images/doc/icon_doc_pane_rename.png"), name: "重命名", itemKey:'rename' };
    
    static dataItemRestore = { source: require("app-images/doc/icon_doc_pane_recovery.png"), name: "还原", itemKey:'recovery' };
    static dataItemDestroy = { source: require("app-images/doc/icon_doc_pane_destroy.png"), name: "彻底删除", itemKey:'destroy' };
    
    
    static showAdd(datas=null,onPress=null) {
        let dataShow = datas || [
        ];
        let docActionSheet = (
            <View style={[styles.container,{
                height:'100%',}]} >
                <View style={{flex:1}}>
                   
                </View>
                <GLDGrid
                    style={{ width: "100%"}}
                    data={dataShow}
                    numColumns={4}
                    imageStyle={{ height: 60, width: 60,marginBottom:10}}
                    onPress={(item, index) => {
                        GLDActionSheet.close();
                        if(onPress) {
                            onPress(item,index,item.itemKey);
                        } else {
                            alert(item.name);
                        }
                    }}
                />
                <View style={styles.closeBar}>
                    <TouchableOpacity onPress={()=>{GLDActionSheet.close();}}><Image source={require("app-images/doc/icon_doc_close.png")} style={styles.folder} /></TouchableOpacity>
                </View>
                
            </View>

        )
        GLDActionSheet.show(docActionSheet,true)
    }
    static show(datas=null,onPress=null,title) {
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
            <View style={[styles.container,{backgroundColor:'rgba(0,0,0,0.10)',paddingBottom:20}]} >
                {title?<View style={styles.titleBox}>
                    <Text>{title}</Text>
                </View>:null}
                <View style={[styles.line]} />
                <GLDGrid
                    style={{ width: "100%"}}
                    data={dataShow}
                    numColumns={4}
                    imageStyle={{ height: 80, width: 60,marginBottom:0}}
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
    static close() {
        GLDActionSheet.close();
    }
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingBottom: 10,
    },
    titleBox: {
        flexDirection: "row",
        width:'100%',
        alignItems: "center",
        marginLeft: 20,
        paddingTop: 20,
        paddingBottom: 10
    },
    closeBar: {
        flexDirection: "row",
        width:'100%',
        alignItems: "center",
        justifyContent: "center",
        height:48,
        marginTop: 20,
    },

    folder: {
        width: 30,
        height: 30,
        alignSelf:'center'
    },

    line: {
        height: 1,
        width: "100%",
        marginBottom: 10,
        backgroundColor: "#f7f7f7",
    }
})

export default DocActionSheet;