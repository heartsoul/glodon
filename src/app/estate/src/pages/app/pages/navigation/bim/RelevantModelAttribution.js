import React, { Component } from 'react';
import { Accordion, List } from 'antd-mobile';
import { 
    View,
    StatusBar, 
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Text,
    FlatList,
    Image
} from 'react-native';
import * as API from "app-api";

 export default class RelevantModelAttribution extends Component {

    constructor(){
        super();
        this.state={
            list:[]
        }
    }

    renderItem = (item) => {
        return (
            <ItemView item={item} />
        );
    }

    componentDidMount(){
        let projectId = this.props.projectId;
        let projectVersionId = this.props.projectVersionId;
        let fileId = this.props.fileId;
        let elementId = this.props.elementId;
        API.getModelAttribute(projectId,projectVersionId,fileId,elementId)
        .then((response)=>{
            /**
 * 获取模型构件的属性
                        { data:
I/ReactNativeJS( 7746):    { code: '0',
I/ReactNativeJS( 7746):      message: 'success',
I/ReactNativeJS( 7746):      data:
I/ReactNativeJS( 7746):       { elementId: '8398946',
I/ReactNativeJS( 7746):         name: '热镀锌 -普通-1.0',
I/ReactNativeJS( 7746):         familyGuid: '',
I/ReactNativeJS( 7746):         boundingBox:
I/ReactNativeJS( 7746):          { min: { x: -10640.99, y: 13619.73, z: 20183.15 },
I/ReactNativeJS( 7746):            max: { x: -7952.671, y: 13653.43, z: 20216.85 } },
I/ReactNativeJS( 7746):         properties:
I/ReactNativeJS( 7746):          [ { group: '基本属性',
I/ReactNativeJS( 7746):              items:
I/ReactNativeJS( 7746):               [ { key: 'specialty', value: '', unit: '' },
I/ReactNativeJS( 7746):                 { key: 'floor', value: '8', unit: '' },
I/ReactNativeJS( 7746):                 { key: 'categoryId', value: '-2008044', unit: '' },
I/ReactNativeJS( 7746):                 { key: 'categoryName', value: '管道', unit: '' },
I/ReactNativeJS( 7746):                 { key: 'family', value: '管道类型', unit: '' },
I/ReactNativeJS( 7746):                 { key: 'familyType', value: '热镀锌 -普通-1.0', unit: '' },
I/ReactNativeJS( 7746):                 { key: 'systemType', value: '', unit: '' },
I/ReactNativeJS( 7746):                 { key: 'building', value: '', unit: '' } ] },
I/ReactNativeJS( 7746):            { group: 'PG_SEGMENTS_FITTINGS',
I/ReactNativeJS( 7746):              items: [ { key: '布管系统配置', value: '', unit: '' } ] },
I/ReactNativeJS( 7746):            ]}}}
*/
            console.log('response------------------')
            console.log(response)
            if(response && response.data && response.data.data &&response.data.data.properties &&response.data.data.properties.length>0){
                let list = response.data.data.properties;
                this.setState((pre)=>{
                    return {
                        list:list,
                    }
                })
            }
        }).catch((err)=>{
            console.log('err------------------')
            console.log(err)
        })
    }

  render() {
    return (
        <View style={{height:"100%",width:"100%",backgroundColor:"#424242"}}>
        <StatusBar barStyle="light-content" translucent={false} backgroundColor="#424242" />
        
            <View style={{backgroundColor:'#424242',height:56,width:"100%",alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:'#ffffff',fontSize:17}}>构件属性</Text>
            </View>
            <FlatList 
                data={this.state.list}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => index + ''}
            />
    </View>
    );
  }
}

class ItemView extends Component{
    constructor(){
        super();
        this.state={
            show:false,
        }
    }
    clickHeader=()=>{
        this.setState((pre)=>{
            return {
                show:!pre.show,
            }
        })
    }

    renderItem=(data)=>{
        let item = data.item
        return (
            <View >
                <TouchableOpacity onPress={() => {  }} >
                    <View style={{backgroundColor:'#424242',height:28,width:'100%',flexDirection:'row',alignItems:'center'}} >
                        <Text style={{color:'#ffffff',fontSize:11,flex:1,marginLeft:13}}>{item.key}</Text>
                        <View style={{backgroundColor:'rgba(202,203,203,0.23)',width:1,height:"100%"}} />
                        <Text style={{color:'#ffffff',fontSize:11,flex:1,marginLeft:13}}>{item.value}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{backgroundColor:'rgba(202,203,203,0.23)',height:1}} />
            </View>
        );
        return null;
    }


    showList = (childlist)=>{
        return this.state.show?
        <FlatList 
            data={childlist}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index + ''}
        />
        :
        <View style={{backgroundColor:'#424242',height:1}} />;
    }
    render(){
        let item = this.props.item;
        let childlist = item.item.items;
        let url = this.state.show? require("app-images/icon_draw_arrow_up.png"):require("app-images/icon_drawer_arrow_down.png")
        return (
            <View >
                
                <TouchableOpacity onPress={() => { this.clickHeader() }} >
                    <View style={{flexDirection:'row',alignItems:'center', backgroundColor:'#5f5f5f',height:28,width:"100%",justifyContent:'center'}}>
                        <Text style={{color:'#ffffff',fontSize:12,marginLeft:13,flex:1}}>{item.item.group}</Text>
                        <Image style={{width:8,height:4,marginRight:14}} source={url} />
                    </View>
                </TouchableOpacity>
                {
                    this.showList(childlist)
                }
                
            </View>
        );
    }
}