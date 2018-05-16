'use strict'

import React,{Component} from 'react';
import {
    View,
    ScrollView,
    Text,
    Image,
    FlatList,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
} from 'react-native';

import { connect } from 'react-redux' // 引入connect函数
import * as API from 'app-api';
import * as AuthorityManager from "../navigation/project/AuthorityManager";
import * as actions from './../../actions/ChangeProjectAction'
import {Dimensions} from 'react-native';

//切换项目主页
class ChangeProjectPage extends Component{
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: '设置',
      });

      constructor(){
          super();
          this.state = {
            pressed: false,
          };
      }

    //跳转至切换租户页面
      _tenantChoose = () => {
        let navigator = this.props.navigation;
        storage.projectIdVersionId = '';
        storage.pushNext(navigator, "TenantPage")
    }

    //返回键
    _goBack = ()=>{
        let navigator = this.props.navigation;
        storage.goBack(navigator,null);
    }

    //item点击事件
    _itemClick = (item, index) => {
        let navigator = this.props.navigation;
        //切换项目了  需要先获取项目的权限
        AuthorityManager.loadAuthoritys("" + item.value.id, (success) => {
            if (!success) {
                alert('获取权限失败');
                return;
            }
            storage.saveProject("" + item.value.id, "" + item.value.name);
            storage.gotoMainPage(navigator);
        });
    }
    //item的view
    renderItemView = ({ item, index }) => {
        let width = Dimensions.get('window').width-22;
        return (
            <TouchableOpacity key={index} activeOpacity={0.5} onPress={() => this._itemClick(item, index)}>
                <View style={styles.containerView}>
                    <Text style={styles.content}> {item.value.name}</Text>
                    <View style={{marginLeft:22,height:1,width:{width},backgroundColor:'#F7F7F7'}} />
                </View>
            </TouchableOpacity>
        );
    }

    render(){
        return (
            <ScrollView style={{backgroundColor:'#F7F7F7'}} >
                <TouchableOpacity onPress={this._tenantChoose}>
                    <View  style={{flexDirection:'row',alignItems:'center',backgroundColor:'#FFFFFF',height:51}}>
                        <Image source={require('app-images/icon_choose_project_item.png')} style={{width:30,height:30,marginLeft:20}}  />
                        <Text style={{fontSize:16,color:'#6F899B',marginLeft:12,flex:1}} >当前租户名称</Text>
                        <Image source={require('app-images/icon_arrow_right_gray.png')} style={{width:5,height:12,marginRight:18}}  />
                    </View>
                </TouchableOpacity>
                <FlatList style={{marginTop:10,backgroundColor:'#FFFFFF'}}
                    data={this.props.dataArray}
                    renderItem={this.renderItemView}
                    />

                <TouchableHighlight
                    onPress={this._goBack}
                    underlayColor="#0099f3"
                    activeOpacity={1.0}

                    style={
                        this.state.pressed
                        ? styles.logoutTextViewPressed
                        : styles.logoutTextView
                    }
                    onHideUnderlay={() => {
                        this.setState({ pressed: false });
                    }}
                    onShowUnderlay={() => {
                        this.setState({ pressed: true });
                    }}
                    >
                        <Text style={styles.logoutText}>返回 </Text>
                    </TouchableHighlight>
            </ScrollView>
        );
    }

}

export default connect(
    state => ({
        dataArray: state.projectList.data,
        isLoading: state.projectList.isLoading,
        error: state.projectList.error,
        page: state.projectList.page,
        hasMore: state.projectList.hasMore,
    }),
    dispatch => ({
        fetchData: (page,dataArray) => {
            if (dispatch) {
                dispatch(actions.fetchData(page,dataArray))
            }
        },
        resetData: () => {
            if (dispatch) {
                dispatch(actions.reset())
            }
        },
    })
)(ChangeProjectPage)

const styles = StyleSheet.create({
    
    logoutTextView: {
      overflow: "hidden",
      height: 40,
      backgroundColor: "#00baf3",
      borderRadius: 20,
      marginTop: 40,
      marginLeft: 20,
      marginRight: 20,
      marginBottom:40,
    },
  
    logoutTextViewPressed: {
      overflow: "hidden",
      height: 40,
      backgroundColor: "#33baf3",
      borderRadius: 20,
      marginTop: 40,
      marginLeft: 20,
      marginRight: 20,
      marginBottom:40,
    },
    logoutText: {
      overflow: "hidden",
      height: 20,
      marginTop: 10,
      marginLeft: 20,
      marginRight: 20,
      borderRadius: 20,
      alignItems: "center",
      textAlign: "center",
      fontSize: 16,
      color: "#fff"
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    containerSimpleView: {
        flex: 1,
        borderRadius: 8,
        // borderWidth:1,
        // borderColor:"#0F0",
        height: 60,
        marginTop: 5,

        marginBottom: 10,
        marginLeft: 40,
        marginRight: 40,
        backgroundColor: '#FFF',
        elevation: 5, // android 
        shadowColor: "#333", // iOS
        shadowOffset: { width: 3, height: 7 }, // iOS
        shadowOpacity: 0.15, // iOS
        shadowRadius: 3, // iOS

    },
    containerView: {
        flex: 1,
        height: 50,
        // marginLeft: 40,
        // marginRight: 40,
        // backgroundColor: '#FFF',
        flexDirection:'column',
    },
    title: {
        fontSize: 15,
        color: 'blue',
    },
    content: {
        left: 0,
        top: 15,
        alignItems: "center",
        textAlign: "left",
        fontSize: 15,
        color: 'black',
         marginLeft: 22,
        marginRight: 22,
    },
    contentSimple: {
        left: 60,
        top: -20,
        fontSize: 15,
        color: 'black',
    },
    image: {
        left: 10,
        top: 10,
        width: 40,
        height: 40,
    }
  
  });