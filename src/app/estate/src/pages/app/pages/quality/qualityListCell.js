'use strict';
import React, {Component,PureComponent} from "react";
import {Animated, StyleSheet, Text, View ,Image,
     Button,TouchableHighlight,TouchableOpacity,Dimensions} from "react-native";
 import * as API from "app-api"; 

var { width, height } = Dimensions.get("window");

const projectImage =  require("app-images/icon_choose_project_item.png");
const projectTimeImage = require("app-images/icon_time_black.png");


export default class QualityListCell extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            item: props.item,
            index: props.index,
        }
    }
    render() {
        return this.renderItem(this.state.item,this.state.index);
    }
    _toQcStateShowColor = (qcState)=> {
        // console.log(qcState);
        let ret = API.toQcStateShowColor(qcState);
        // console.log(ret);

        if(ret == 'red') {
            return 1;
        }
        if(ret == 'orange') {
            return 2;
        }
        return 0;
    }
    _toDetail = (item) => {
        storage.pushNext(null,"QualityDetailPage");
    }
    renderItem = (item,index) => {
        return (
            <TouchableHighlight onPress={()=>{this._toDetail(item)}}>
                <View style={[styles.containerView,]}>
                    <View style={[styles.contentHeaderView]}>
                        <Image
                            source={projectTimeImage}
                            style={styles.imageTime} />
                        <Text style={styles.contentTime}>{item.value.showTime}</Text>
                        {
                            this._toQcStateShowColor(item.value.qcState) == 1 ? (
                                <Text style={[styles.contentStatus, { color: 'red' }]}>{item.value.qcStateShow}</Text>
                            ) : (this._toQcStateShowColor(item.value.qcState) == 2 ? (
                                <Text style={[styles.contentStatus, { color: 'orange' }]}>{item.value.qcStateShow}</Text>

                            ) : (
                                    <Text style={[styles.contentStatus]}>{item.value.qcStateShow}</Text>
                                ))
                        }
                    </View>
                    <View style={[styles.contentView, index % 2 == 1 ? {} : styles.contentView_border]}>

                        {
                            item.url == undefined ? (<Image
                                source={projectImage}
                                style={styles.image} />) : (<Image
                                    source={{ uri: item.url }}
                                    style={styles.image} />)
                        }

                        <Text style={styles.content}>{item.value.description}</Text>
                    </View>
                    {
                        index % 2 == 0 ? (
                            null
                        ) : (
                                <View style={[styles.contentActionView]} >
                                    <TouchableHighlight onPress={() => { alert('提交') }} style={styles.contentActionButton}><Text style={styles.contentActionButtonText}>提交</Text></TouchableHighlight>
                                    <TouchableHighlight onPress={() => { alert('删除') }} style={[styles.contentActionButton, styles.contentActionButtonDelete]}><Text style={styles.contentActionButtonTextDelete}>删除</Text>
                                    </TouchableHighlight>
                                </View>
                            )
                    }
                </View>
            </TouchableHighlight>
        );
  }
}

const styles = StyleSheet.create({
    contentActionView: {
        height:50,
        alignItems: "center",
        alignContent: "center",
        flexDirection:'row-reverse',
    },
    contentActionButtonText: {
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        marginTop: 6,
        marginLeft: 5,
        color:'#00baf3'
    },
    contentActionButtonTextDelete: {
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        marginTop: 6,
        marginLeft: 5,
        color:'#FF0000',
        elevation:100, // android
    },
    
    contentActionButton:{
        width:80,
        marginRight:20,
        backgroundColor:'#FFFFFF',
        height:30,
        borderRadius:15,
        borderColor:'#eeeeee',
        borderWidth:1,
    },
    contentActionButtonDelete:{
        marginRight:20,
    },
    containerView:{
        flex: 1,
        borderRadius:8,
        marginTop: 5,
        
        marginBottom: 5,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#FFF',
        elevation:2.5, // android 
        shadowColor:"#333", // iOS
        shadowOffset:{width:1.5,height:5}, // iOS
        shadowOpacity:0.15, // iOS
        shadowRadius:3, // iOS
    },
    contentHeaderView:{
        height:40,
        alignItems: "center",
        alignContent: "center",
        flexDirection:'row',
    },
    content: {
        marginTop:10,
        marginLeft:10,
        fontSize: 15,
        color: 'black',
    },
    contentView: {
        left: 0,
        backgroundColor: '#ededed',
        overflow:'hidden',
        // alignItems: "center",
        alignContent: "center",
        flexDirection:'row',
    },
    contentView_border: {
        borderBottomLeftRadius:8,
        borderBottomRightRadius:8,
    },
    image:{
        marginTop:10,
        marginBottom:10,
        marginLeft:10,
        width:60,
        height:60,
    },
    imageTime:{
        marginLeft:10,
        width:20,
        height:20,
    },
    contentTime: {
        marginLeft: 10,
        fontSize: 14,
        color: 'black',
    },
    contentStatus: {
        right: 10,
        top: 10,
        position:'absolute',
        textAlign:'right',
        fontSize: 15,
        color: 'green',
    },
});