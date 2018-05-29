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
        // 初始状态
        this.state = {
            progress: 3,
            totalNum:100,
            status:1,//状态  1待下载  2下载中  3 暂停  4已完成
        };
    }

    changeProgress() {
        this.setState({
            progress: Math.random() * 360,
        });
    }

    componentDidMount=()=>{
        const { progress,totalNum} = this.props;
        //如果progress 和 totalNum 值一样   则为已下载  
        if(progress!=undefined && totalNum!=undefined){
            let p = Number.parseInt(progress)
            let t = Number.parseInt(totalNum)
                this.setState((pre)=>{
                    return {
                        ...pre,
                        progress:p,
                        totalNum:t,
                        status:p===t?4:2,
                    };
                })
            
        }
    }

    //开始下载
    _startDownload=()=>{
        const {startDownload} = this.props;
        startDownload();
        //进入下载中状态
        this.setState((pre)=>{
            return {
                ...pre,
                status:2,
            }
        })
    }
    //下载中
    _downloading=()=>{
        const {stopDownload} = this.props;
        stopDownload();
        //点击取消下载，进入待下载状态
        this.setState((pre)=>{
            return {
                ...pre,
                status:1,
            }
        })
    }
    _getView=()=>{
        console.log('=============='+this.state.status)
        if(this.state.status==1){
            return (
                <View style={styles.container}>
                    <TouchableOpacity onPress={()=>this._startDownload()}>
                        <Image source={require('app-images/icon_download.png')} style={{width:34,height:34}}  />
                    </TouchableOpacity>
                </View>
            );
        }
        if(this.state.status==2){
            let numF = this.state.progress*100/this.state.totalNum;
            let num = Number.parseInt(numF+'');
            if(num==100){
                return this._getFinishView();
            }
            return (
                <View style={styles.container}>
                    <Text style={{fontSize:12,color:'#00b1f1',marginRight:5}} >下载中{num}%</Text>
                    <CircleProgressView progress={this.state.progress} totalNum={this.state.totalNum} raduis={17}>
                        <View style={{ alignItems: 'center',justifyContent:'center'}}>
                            <TouchableOpacity onPress={()=>this._downloading()}>
                                <Text style={{color:'#979797',fontSize:15}}>| |</Text>
                            </TouchableOpacity>
                        </View>
                    </CircleProgressView>
                </View>
            );
        }
        if(this.state.status==3){
            
            return (
                <View style={styles.container}>
                    <CircleProgressView progress={this.state.progress} totalNum={this.state.totalNum} raduis={17}>
                        <View style={{ alignItems: 'center',flex:1,justifyContent:'center'}}>
                            <Image transform={([{ rotateZ: '90deg' }])} source={require('app-images/icon_blue_trangle_up.png')} style={{width:17,height:17}}  />
                        </View>
                        
                    </CircleProgressView>
                </View>
            );
        }
        if(this.state.status==4){
            return this._getFinishView();
        }
        return null;
    }

    _getFinishView=()=>{
        return (
            <View style={styles.container}>
                <Text style={{color:'#666666',fontSize:12}}>已下载</Text>
            </View>
        );
    }
    render() {
        console.log('render');
        return this._getView();
    }
}

var styles = StyleSheet.create({
    container:{
        width:100,
        height:34,
        alignItems: 'center', 
        flexDirection:'row',
        justifyContent:'flex-end',
        marginRight:20
    }
});