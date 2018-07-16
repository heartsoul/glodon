'use strict';
import React from 'react';
import {
    TouchableOpacity,
    Text,
    Image,
    View,
    StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import {DeviceEventEmitter} from 'app-3rd'
import SERVICE from 'app-api/service'
import {CircleProgressView} from 'app-components'
// import {DocProcessView} from './DocProcessView'
export default class extends React.Component {
    
    static propTypes = {
        uploadKey: PropTypes.string,
        onPress: PropTypes.func,
        progressState:PropTypes.oneOf('progress','waitDown','waitUpload','finished'),
    }
    constructor(props) {
        super(props);
        this.state = {
            percent: 0,
            total:100,
            uploading: false,
            uploadKey: props.data.randomKey,
        }
    }
    transProcess = (key, percent, total, task) => {
        let uv = this;
        if (key && key === uv.state.uploadKey && task) {
            this.setState({
                percent: percent,
                total:total,
                uploading: true,
            });
        }
    }
    // 这个会被任务给重写
    onCancel = () => {
        // 这里如果有任务的话，就可以取消掉任务。
    }
    componentWillMount = () => {
        if (!this.state.uploadKey) {
            return;
        }
        DeviceEventEmitter.addListener('transProcessPercent',this.transProcess);
    }

    componentWillUnmount = () => {
        try {
            if (!this.state.uploadKey) {
                return;
            }
            DeviceEventEmitter.removeListener('transProcessPercent',this.transProcess);
        } catch (error) {

        }

    }
    onProgress = (written, total) => {
        let percent = parseInt(written * 100 / total / 100);
        this.setState({
            percent: percent,
            total:total,
        });
    }

    onFinish = () => {
        this.onCancel = ()=>{}; // 重置取消方法，完成了就不用了。
        let percent = this.state.total;
        this.setState(
            {
                percent: percent,
            });
        setTimeout(()=>{
            this.setState(
                {
                    uploading: false,
                });
        }, 500
        );
    }
    renderStatusView = (data,onPress) => {
        // <Text style={{width:28,height:28,lineHeight:24,transform:[{ rotateX: type == 'download' ? '0deg' : '180deg' }],textDecorationLine:'underline',fontSize:14,textAlign:'center',color:'#F56323',borderColor:'#F56323',borderWidth:1,borderRadius:14}}>{'↓'}</Text>
        let {type,taskState = null} = data;
        if(taskState == SERVICE.TAKS_ITEM_STATUS.pending ||taskState == SERVICE.TAKS_ITEM_STATUS.stoped || taskState == SERVICE.TAKS_ITEM_STATUS.failed || taskState == SERVICE.TAKS_ITEM_STATUS.pause) {
            return <TouchableOpacity style={{justifyContent:'center'}} activeOpacity={0.5} onPress={(event) => { event.preventDefault(); onPress && onPress(event) }}>
           
            <CircleProgressView totalNum={this.state.total} percent={this.state.percent} raduis={14} progressWidth={2} baseProgressWidth={1} progressColor={'#F56323'} progressBaseColor={'#F56323'} >
                <Text style={{lineHeight:16,textAlign:'center',transform:[{ rotateX: type == 'download' ? '0deg' : '180deg' }],textDecorationLine:'underline',fontSize:16,color:'#F56323'}}>{'↓'}</Text>
            </CircleProgressView>
        </TouchableOpacity>
        } else {
            return (<TouchableOpacity style={{height:'10%',justifyContent:'center'}} activeOpacity={0.5} onPress={(event) => { event.preventDefault(); onPress && onPress(event) }}>
            <CircleProgressView totalNum={this.state.total} percent={this.state.percent} raduis={14} progressWidth={2} baseProgressWidth={1} progressColor={'#00B0F1'} progressBaseColor={'#E6E6E6'} >
            <Text style={{color:'#666666',fontSize:9,textAlign:'center'}}>||</Text>
            </CircleProgressView>
            </TouchableOpacity>);
        }
        

    }
    render = () => {
        let {onPress,data} = this.props;
        let {type,taskState = null} = data;
        let showText = SERVICE.toShowStatus(taskState);
        return(
        <View style={[styles.taskStateView,this.props.style]}>
        <Text style={{fontSize:12,color:'#00b1f1',paddingRight:5}} >{''+showText}</Text>
        {this.renderStatusView(data,onPress)}
        </View>);
      
    }
};
const styles = StyleSheet.create({
    taskStateView: {
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent:'center',
        paddingRight:10,
    },
});
