'use strict';
import React, {Component,PureComponent} from "react";
import {Animated, StyleSheet, Text, View ,Image,
     Button,TouchableHighlight,TouchableOpacity,Dimensions} from "react-native";
import * as API from "app-api"; 

var { width, height } = Dimensions.get("window");

const projectImage =  require("app-images/icon_choose_project_item.png");
const projectTimeImage = require("app-images/icon_time_black.png");


export default class QualityDetailCell extends PureComponent {
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
    renderItem = (item,index) => {
        return (
<View style={[styles.containerView,]}>
             <Image
          source={projectTimeImage}
          style={styles.imageTime}/> 
                 <Text style={styles.contentTime}>{item.value.showTime}</Text>
                 {
                    this._toQcStateShowColor(item.value.qcState) == 1 ? (
<Text style={[styles.contentStatus,{color:'red'}]}>{item.value.qcStateShow}</Text>
                    ) : (this._toQcStateShowColor(item.value.qcState) == 2 ? (
<Text style={[styles.contentStatus,{color:'orange'}]}>{item.value.qcStateShow}</Text>

                    ) : (
                        <Text style={[styles.contentStatus]}>{item.value.qcStateShow}</Text>
                    ))
                    
                 }
                 
                 <View style={styles.contentView}>
    
                 {
                     item.url == undefined ? (<Image
                        source={projectImage}
                        style={styles.image}/>) : (<Image
                            source={{uri:item.url}}
                            style={styles.image}/>)
                 }
                  
                 <Text style={styles.content}>{item.value.description}</Text>
                 </View>
                 {
                       index % 2 ==0 ? (
                            null
                        ) : (
                            <View style={[styles.contentActionView]} >
                 <TouchableHighlight onPress={()=>{alert('删除')}} style={[styles.contentActionButton,styles.contentActionButtonDelete]}><Text style={styles.contentActionButtonTextDelete}>删除</Text>
                 </TouchableHighlight>
                 <TouchableHighlight onPress={()=>{alert('提交')}} style={styles.contentActionButton}><Text style={styles.contentActionButtonText}>提交</Text></TouchableHighlight>
                 </View>
                        )
                    }
                 
            </View>
        );
  }
}

const styles = StyleSheet.create({
    contentActionView: {
        height:40,
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
        left:width-140,
        backgroundColor:'#FFFFFF',
        // flex:1,
        top: -30,
        height:30,
        borderRadius:15,
        borderColor:'#eeeeee',
        borderWidth:1,
    },
    contentActionButtonDelete:{
        left:width-100 - 140,
        top:0,
    },
    containerView:{
        flex: 1,
        borderRadius:8,
        // borderWidth:1,
        // borderColor:"#0F0",
        // height:119,
        marginTop: 5,
        
        marginBottom: 5,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: '#FFF',
        elevation:2.5, // android 
        shadowColor:"#333", // iOS
        shadowOffset:{width:3,height:7}, // iOS
        shadowOpacity:0.15, // iOS
        shadowRadius:3, // iOS
    },
    content: {
        left: 80,
        top: -50,
        fontSize: 15,
        color: 'black',
    },
    contentView: {
        left: 0,
        top: -10,
        backgroundColor: '#ededed',
        overflow:'hidden',
        // borderRadius:8,
    },
    image:{
        left:10,
        top:10,
        width:60,
        height:60,
    },
    imageTime:{
        left:10,
        top:10,
        width:20,
        height:20,
    },
    contentTime: {
        left: 35,
        top: -8,
        fontSize: 14,
        color: 'black',
    },
    contentStatus: {
        right: 10,
        top: -28,
        textAlign:'right',
        fontSize: 15,
        color: 'green',
    },
});