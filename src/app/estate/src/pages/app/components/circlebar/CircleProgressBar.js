'use strict';

import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    StyleSheet
} from 'react-native';

import CircleProgressView from './CircleProgressView'


export default class CircleProgressBar extends Component {

    // 构造
    constructor(props) {
        super(props);
    }

    

    //开始下载
    _startDownload=()=>{
        const {startDownload} = this.props;
        startDownload();
    }
    //下载中
    _downloading=()=>{
        const {stopDownload} = this.props;
        stopDownload();
    }
    _getView=()=>{
        const { progress,totalNum,finishText} = this.props;
        if(progress==null ||progress==undefined ||totalNum==null ||totalNum==undefined){
            return (
                <View style={styles.container}>
                    <TouchableOpacity onPress={()=>this._startDownload()}>
                        <Image source={require('app-images/icon_download.png')} style={{width:34,height:34}}  />
                    </TouchableOpacity>
                </View>
            );
        }
        if(progress!=null &&progress!=undefined &&totalNum!=null &&totalNum!=undefined){
            let numF = this.props.progress*100/this.props.totalNum;
            let num = Number.parseInt(numF+'');
            if(num==100){
                return this._getFinishView();
            }
            return (
                <View style={styles.container}>
                    <Text style={{fontSize:12,color:'#00b1f1',marginRight:5}} >缓存中{num}%</Text>
                    <CircleProgressView progress={this.props.progress} totalNum={this.props.totalNum} raduis={17}>
                        <View style={{ alignItems: 'center',justifyContent:'center'}}>
                            <TouchableOpacity onPress={()=>this._downloading()}>
                                <Text style={{color:'#979797',fontSize:15}}>| |</Text>
                            </TouchableOpacity>
                        </View>
                    </CircleProgressView>
                </View>
            );
        }
        return null;
    }

    _getFinishView=()=>{
        return (
            <View style={styles.container}>
                <Text style={{color:'#666666',fontSize:12}}>{this.props.finishText} 已缓存</Text>
            </View>
        );
    }
    render() {
        return this._getView();
    }
}

var styles = StyleSheet.create({
    container:{
        width:130,
        height:34,
        alignItems: 'center', 
        flexDirection:'row',
        justifyContent:'flex-end',
        marginRight:20
    }
});