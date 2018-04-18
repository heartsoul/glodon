import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Dimensions,
    Text,
    View,
    WebView,
    SafeAreaView,
    StatusBar
} from 'react-native';
import * as API from "app-api"
//获取设备的宽度和高度
var {
    height: deviceHeight,
    width: deviceWidth
} = Dimensions.get('window');
const cmdString = "\
function callMessage(action, data, callbackName) { \
  let actionIn = 'unknown'; let dataIn = {}; let callbackNameIn = 'defaultReturn';\
  if(action) { actionIn = action;} else {alert('无效调用');return;}\
  if(data) { dataIn = data;}\
  if(callbackName) { callbackNameIn = callbackName; } \
  let cmd = JSON.stringify({action:actionIn,data:dataIn,callback:callbackNameIn});\
  console.log('执行命令：'+cmd);\
  window.postMessage(cmd);\
}\
window.modelEvent = {\
  defaultReturn : function(data) {console.log('执行命令成功:'+data);},\
  loadDotsData : function() { callMessage('loadDotsData');},\
  invalidateToken : function() { callMessage('invalidateToken');},\
  cancelPosition : function() { callMessage('cancelPosition');},\
  getPosition : function(jsonData) { callMessage('getPosition', jsonData);},\
  getPositionInfo : function(jsonData) { callMessage('getPositionInfo', jsonData);},\
};\
//document.addEventListener('message', function(e) {eval(e.data);});\
";

//默认应用的容器组件
export default class QualityStatardsPage extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: navigation.state.params ? navigation.state.params.title : '',
        headerTintColor: "#FFF",
        headerStyle: { backgroundColor: "#00baf3" },
        // head:null
    });
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            //网络请求状态
            error: false,
            errorInfo: "",
            html: '',
        }
    }

    proccessHtml = (dataItem,level) => {
       let html = `<div class='standardsContent${level+1}'>`;
       let children = dataItem.children;
       html += `<div class='standardsHeader standardsHeader${level}'><p><img src="images/add.jpg"  alt="-" width=20 height=20></img>&nbsp;${dataItem.name}</p></div>`;
       html += `<div class='standardsOff'><p>${API.removeHTMLTag(dataItem.content)}</p>`;
       children.map((item,index)=>{
            html += this.proccessHtml(item,level+1);
       });
       html += '</div></div>';
       return html;
    }
    proccessHtmlTop = (rootItem) => {
        let children = rootItem.children;
        let html = '';
        children.map((item,index)=>{
             html += this.proccessHtml(item,0);
        });
        return html;
     }
    proccessData = (dataList) => {
        
        let head = `<div class='standardsHeaderTop'><p>${this.props.navigation.state.params.qualityCheckpointName}质检标准</p>`
        let treeItem = [];
        let treeItemMap = {'0':[]};
        let treeItemMapAll = {'0':{'children':[]}};
        dataList.map((item,index)=>{
            treeItemMapAll[''+item.id] =item;
            item.children = [];
        });
        dataList.map((item,index)=>{
            let id = item.id;
            let parentId = item.parentId;
            if(!parentId) {
                parentId = '0';
            }
            let name = item.name;
            var parentItem = treeItemMapAll[''+parentId];
            if(!parentItem) {
                parentItem = treeItemMapAll['0'];
            }
            parentItem.children.push(item);
        });

        let body = this.proccessHtmlTop(treeItemMapAll['0']);
        let html = `<HTML>
        <HEAD>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <TITLE>详情</TITLE>
        <style>
        body {
            margin: 20px;
            margin-top: 40px;
            padding: 0px;
        }
        img {
        	width:14px;
        	height:14px;
        }
        .standardsOff {
            margin-left: 20px;
        }
        .standardsHeader {
            font-size:12px;
            font-weight:bold;
            font-family:"Helvetica Neue",Helvetica,Arial,"Hiragino Sans GB","Microsoft YaHei UI",sans-serif;
        }
        .standardsContent {
            font-size:12px;
            font-weight:normal;
            font-family:"Helvetica Neue",Helvetica,Arial,"Hiragino Sans GB","Microsoft YaHei UI",sans-serif;
        }
        .standardsHeaderTop {
            font-size:26px; 
            margin-bottom: 20px;
        }
        .standardsHeader0 {
            font-size:18px;
        }
        .standardsHeader1 {
            font-size:16px;
        }
        .standardsHeader2 {
            font-size:14px;
        }
        .standardsHeader3 {
            font-size:12px;
        }
        .standardsHeader4 {
            font-size:10px;
        }
        .standardsHeader5 {
            font-size:8px;
        }
        .standardsContent0 {
            font-size:18px;
        }
        .standardsContent1 {
            font-size:16px;
            margin-left: 20px;
        }
        .standardsContent2 {
            font-size:14px;
            margin-left: 20px;
        }
        .standardsContent3 {
            font-size:12px;
            margin-left: 20px;
        }
        .standardsContent4 {
            font-size:10px;
            margin-left: 20px;
        }
        .standardsContent5 {
            font-size:8px;
            margin-left: 20px;
        }
        </style>
        <script type="text/javascript">
        
       </script>
        </HEAD>
        <BODY>
        ${head}
        ${body}
        </BODY>
        </HTML>`;
        console.log('>>>>>html:\n'+html);
        return html;
    }

    fetchData = () => {
         // "qualityCheckpointId": 5200014,
        // "qualityCheckpointName": "墙面",
        this.props.navigation.setParams({title:this.props.navigation.state.params.qualityCheckpointName}) 
        let templateId = this.props.navigation.state.params.qualityCheckpointId;
        API.getStandardsItems(templateId).then((responseData) => {
           let html = this.proccessData(responseData.data);
            this.setState({
                isLoading: false,
                error: false,
                errorInfo: "",
                html: html,
            });
        }).catch(err => {
            this.setState = {
                isLoading: false,
                error: err,
                errorInfo: err,
                html: '',
            };
        });
    }
    componentDidMount = () => {
        this.fetchData();

    }

    //渲染
    render() {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <View style={styles.container}>
                    <WebView bounces={false}
                        ref="webview"
                        onNavigationStateChange={() => this.onNavigationStateChange}
                        scalesPageToFit={true}
                        javaScriptEnabled={true}
                        domStorageEnabled={false}
                        dataDetectorTypes='none'
                        // onMessage={(e) => this.onMessage(e)}
                        // injectedJavaScript={cmdString}
                        //  onLoadEnd ={()=>this.refs.webview.postMessage('javascript:window.modelEvent.loadDotsData();')}
                        source={{ html: this.state.html}}
                        style={{ width: deviceWidth, height: deviceHeight }}>
                    </WebView>
                </View>
            </SafeAreaView>
        );
    }
}

//样式定义
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 0
    }
});
