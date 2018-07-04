import React,{Component} from 'react';
import{
    View,Image,TouchableOpacity,Text,StyleSheet
} from 'react-native';

//网络不畅 页面显示组件
export default class NetWorkErrorPage extends Component{

    constructor(){
        super();
        
        
    }

    //点击刷新
    _click = ()=>{
        
    }

    componentDidMount=()=>{
        
    }

    render(){
        return (
            <View style={{flex:1, backgroundColor: '#f9f9f9',alignItems:'center'}} >
                <Image style={{width:234,height:210,marginTop:103 }}  source={require('app-images/icon_network_error.png')}/>
                <Text style={{color:'#999992',fontSize:14,marginTop:21}} >网络不畅，请稍后重试</Text>
                <TouchableOpacity onPress={this._click}>
                    <View style={{backgroundColor:'#00b5f2',width:148,height:40,alignItems:'center',justifyContent:'center',borderRadius:100,marginTop:25}} >
                        <Text style={{fontSize:16,color:'#ffffff'}} >刷新</Text>
                    </View>
                </TouchableOpacity>
            </View>
            
        );
    }
}