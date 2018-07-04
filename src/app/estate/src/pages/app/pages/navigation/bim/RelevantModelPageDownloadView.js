import React,{Component} from 'react';
import  {PropTypes} from 'prop-types';
import {
    View,TouchableOpacity,Image,
} from 'react-native';
import OfflineManager from '../../../../offline/manager/OfflineManager';
//模型展示页面中右下角的下载按钮
export default class RelevantModelPageDownloadView extends Component{

    static propTypes = {
        fileId: PropTypes.string.isRequired,
        downloadModel:PropTypes.func.isRequired,
      }

    constructor(){
        super();
        this.state = {
            showDownloadView:false,//是否显示下载按钮
        };
    }

    componentDidMount(){
        const {fileId} = this.props;
        let mm = OfflineManager.getModelManager();
        //判断是否有了离线包
        mm.exist(fileId).then((result)=>{
            console.log('offline zip exist?++++++++++++++'+result);
            if(!result){
                this.setState({
                    showDownloadView:true
                });
            }
        }).catch((error)=>{
            console.log(error);
        })
    }

    _createDownloadView =()=>{
        const{downloadModel} = this.props;
        return  (
            <View style={{ alignItems: 'flex-end',position:'absolute',right:14,bottom:14}} >
                <TouchableOpacity onPress={(downloadModel)}>
                    <Image source={require('app-images/icon_download.png')} style={{width:28,height:28,marginTop:5}} />
                </TouchableOpacity>
                <View style={{width:10,height:10,backgroundColor:'#FF460D',borderRadius:15,position:'absolute'}} />
            </View>
        );
    }

    render(){
        return (this.state.showDownloadView?this._createDownloadView():null);
    }
}