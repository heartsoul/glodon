
import PropTypes from 'prop-types';
import React from 'react';
import {View, StyleSheet,Text as Label,Image, TouchableOpacity} from 'react-native';
const benchmarkImage = require("app-images/icon_benchmark.png");


export default class QualityInfoItem extends React.Component {
    onClick = (event) => {
        if (!this.props.onClick) {
            return;
        }
        this.props.onClick();
    }
    renderInfo=()=>{
        if(!this.props.onClick) {
            return (
                <View style={styles.containerView} >
                <View style={styles.titleView}>
                <Label style={styles.leftTitle}>{this.props.leftTitle}</Label>
                </View>
                <View style={styles.contentView}>
                <Label style={styles.content}>{this.props.content}</Label>
                </View>
                </View>
            );
        }
        return (
            <View style={styles.containerView} >
            <View style={styles.titleView}>
            <Label style={styles.leftTitle}>{this.props.leftTitle}</Label>
            </View>
            <View style={styles.contentView}>
            <Label style={styles.content}>{this.props.content}</Label>
            <TouchableOpacity activeOpacity={0.5} onPress={(event)=>{this.onClick(event)}}>
                <Image source={benchmarkImage} style={styles.infoMark} />
            </TouchableOpacity>
            </View>
            </View>
        );
    }
    renderLink=()=>{
        return (
            <View style={styles.containerView} >
            <View style={styles.titleView}>
            <Label style={styles.leftTitle}>{this.props.leftTitle}</Label>
            </View>
            <View style={styles.contentView}>
            <TouchableOpacity activeOpacity={0.5} onPress={(event)=>{this.onClick(event)}}>
                <Label style={[styles.content,styles.link]}>{this.props.content}</Label>
            </TouchableOpacity>
            </View>
            </View>
        );
    }
    renderLine=() =>{
        return (
            <View style={[styles.containerView,styles.lineView]}>
            </View>
        );
    }
    renderItem=() =>{
        return (
            <View style={styles.containerView} >
            <View style={styles.titleView}>
            <Label style={styles.leftTitle}>{this.props.leftTitle}</Label>
            </View>
            <View style={styles.contentView}>
            <Label style={styles.content}>{this.props.content}</Label>
            </View>
            </View>
        );
    }
    render=() =>{
        if(this.props.showType === 'info') {
            return this.renderInfo();
        }
        if(this.props.showType === 'link') {
            return this.renderLink();
        }
        if(this.props.showType === 'line') {
            return this.renderLine();
        }
        return this.renderItem();
    }
}
QualityInfoItem.propTypes = {
   
    /**
     * 控件展现类型 default|info|link|user|image|images|description|line
     */
    showType: PropTypes.string,
    /**
     * 点击响应
     */
    onClick: PropTypes.func,
    /**
     * 左侧标题
     */
    leftTitle: PropTypes.string,

    /**
     * 内容
     */
    content: PropTypes.string,
};


const styles = StyleSheet.create({

    containerView:{
        marginTop: 10,
        marginBottom: 0,
        marginLeft: 20,
        marginRight: 20,
        flexDirection:'row',
    },
    content: {
        fontSize:14,
        fontWeight:'100',
    },
    link: {
        color:'#00b5f2',
        textDecorationLine:'underline',
        fontSize:14,
        marginRight:75,
        fontWeight:'100',
    },
    leftTitle: {
        fontSize:14,
        width:75,
        color:'#666666',
        fontWeight:'100',
        // fontFamily:"PingFangSC-Light",
    },
    titleView: {
        flexDirection:'row',
        
    },
    contentView: {
        flexDirection:'row',
        marginRight:75,
        alignItems:'center'
    },
    infoMark:{
        marginLeft:5,
        width:15,
        height:15,
    },
    lineView: {
        height:0.5,
        marginTop:20,
        marginLeft:10,
        width:'100%',
        backgroundColor:'#e9e9e9'
    },
});