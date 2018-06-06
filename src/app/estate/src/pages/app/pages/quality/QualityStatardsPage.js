import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Dimensions,
    Text,
    View,
    SafeAreaView,
    StatusBar
} from 'react-native';

import { WebView } from 'app-3rd/index';
import * as API from "app-api"
import { BarItems, LoadingView } from "app-components";
//获取设备的宽度和高度
var {
    height: deviceHeight,
    width: deviceWidth
} = Dimensions.get('window');

const imagePlus = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAAXNSR0IArs4c6QAAAjJJREFUWAntmUFOwkAUhp2GuOICegITD+CeeALXxI1WYMPKRBMTURITTVyxAYxsjHsvYFjrAYgXMNEDsGJB/f9mpmkII0P7oDV2kvIebzozX//XKfBQG7oFQaB6vd6xUuoI/i7CZdO3ZjsGwwgMg3q9/gg/4PqKL/1+f2s6nT7DrfB9jtrQ87xqrVb78qhkTiGpV4VsZFTdbtdH4IFRyDyBuYR94lUwtu7G7ALsEOu2YTf1+ie8L98Q2GMAgOe4L+50Z6YGXGfgutVc70w9N07YqKTxs7ZxFjJ6AIp2d1bpnifKDEuZoH+iiYMiTYqH9NWLgmLH7mATfPKgLwkrCgqwAxzb+qAv1kRB8XA2z72NuC9BKwoqAWSbowC1KZM0XiiaVDnbuEJRmzJJ44WiSZWzjSvZOuJx/Aq4wffDU3zZiD554v0Wv4VxLUtfGMacE8x532g0Ln47j32uqW8uCblo3bBfz9l0OdkVtMOrd5lwmXP0nB2XMU6p16lZmB6k+gqLmnRfYxzfizRXRUUWSzNJAZpGvXljC0XnqZIm9j8VReUtetbG/TRKmrGiigLuBRN/89C+WSe1dXrgu67i+/4HPhb5c5kFt7AA6zp20XmioKsANBcgmnoz6SosQcdmYhZRjZ+1nWEZe7iXRgYK9xcrvblocRYylhAYgCysOMO2UeDiRshFadwoRsawRAi4VwQrpiNndohy/T5TH+CZVwXcMGeAxAn/viFjVHCFvLn+Q+wH19fSqWHjCcYAAAAASUVORK5CYII=';
const imageMinus = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAAXNSR0IArs4c6QAAAbNJREFUWAntmUFKxDAUhk0YXM0FPIMHcF88hrjRse1mVoKC4GJAUHA1m7bibMRjSNd6gDmDF+hqFo3/XxIZBqFxeEwjJou+zGv68vV/KWRe1J5txhhVluW5UuoM/UO4x+7ejm0DhiUYFlmWPaNvOL/ipaqqg7ZtX9FN+DugVmutT9I0/dRUMlBI6pWQjYyqKIoJHE/0QuYVzC3sC9+Cvl03Zhdgp5h3Brtv57/gunyH44gOAF5jXTzYm4MacF2B695yfTD1/HC6RiVdf2i7zkJGDaDvr3uodP8kygbLmKB/okVQ6TRFRaOi0gpIx4trNCoqrYB0vLhG/62iI583x7+AO+wPL7EvdDtun8d6xyDmCjEf8zy/6Rvsu0an0pAEszGnfZC87ws659v7BPzNGBtz7vOMV+ptanrT4zPhtmN8Fd02vthzEVRMShsoKhoVlVZAOl5co1FRaQWk43GNNi4oi6iuP7TdYGk0djBLB4VtFyu9QbR1FjKO4FiArKs4w85Q6WXlOYjSuFOMjAoXlsff4EzcjcBsjXL9MVNveEQCuDowQOJ0xzdk7M6Z6LHKBnsg9gUjHKh1fPU0mwAAAABJRU5ErkJggg==';

//默认应用的容器组件
export default class QualityStatardsPage extends Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        // head:null
        headerTitle: <BarItems.TitleBarItem text={navigation.state.params ? navigation.state.params.title : ''}/>,
        headerRight:<View/>,
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

    proccessHtml = (dataItem, level, isFirst) => {
        let style = isFirst? 'display:""' : 'display:none';
        let html = `<div class='standardsContent${level + 1}'>
       `;
        let children = dataItem.children;
        html += `<div class='standardsHeader standardsHeader${level}'>
       <p><img onclick='onImageClick(this,"id_${dataItem.id}")' open=false src='${isFirst ? imageMinus : imagePlus}'  alt="-" width=20 height=20></img>&nbsp;${dataItem.name}</p></div>
       <div class='standardsOff' style='${style}' id='id_${dataItem.id}'>
       <p>${API.removeHTMLTag(dataItem.content)}</p>
       `;
        children.map((item, index) => {
            html += this.proccessHtml(item, level + 1, false);
        });
        html += `
       </div>
       </div>
       `;
        return html;
    }
    proccessHtmlTop = (rootItem) => {
        let children = rootItem.children;
        let html = '';
        let size = children.length;
        children.map((item, index) => {
            html += this.proccessHtml(item, 0, size <= 1);
        });
        return html;
    }
    proccessData = (dataList) => {

        let head = `<div class='standardsHeaderTop'><p>${this.props.navigation.state.params.qualityCheckpointName}质检标准</p>
        `
        let treeItem = [];
        let treeItemMap = { '0': [] };
        let treeItemMapAll = { '0': { 'children': [] } };
        dataList.map((item, index) => {
            treeItemMapAll['' + item.id] = item;
            item.children = [];
        });
        dataList.map((item, index) => {
            let id = item.id;
            let parentId = item.parentId;
            if (!parentId) {
                parentId = '0';
            }
            let name = item.name;
            var parentItem = treeItemMapAll['' + parentId];
            if (!parentItem) {
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
        const imagePlus = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAAXNSR0IArs4c6QAAAjJJREFUWAntmUFOwkAUhp2GuOICegITD+CeeALXxI1WYMPKRBMTURITTVyxAYxsjHsvYFjrAYgXMNEDsGJB/f9mpmkII0P7oDV2kvIebzozX//XKfBQG7oFQaB6vd6xUuoI/i7CZdO3ZjsGwwgMg3q9/gg/4PqKL/1+f2s6nT7DrfB9jtrQ87xqrVb78qhkTiGpV4VsZFTdbtdH4IFRyDyBuYR94lUwtu7G7ALsEOu2YTf1+ie8L98Q2GMAgOe4L+50Z6YGXGfgutVc70w9N07YqKTxs7ZxFjJ6AIp2d1bpnifKDEuZoH+iiYMiTYqH9NWLgmLH7mATfPKgLwkrCgqwAxzb+qAv1kRB8XA2z72NuC9BKwoqAWSbowC1KZM0XiiaVDnbuEJRmzJJ44WiSZWzjSvZOuJx/Aq4wffDU3zZiD554v0Wv4VxLUtfGMacE8x532g0Ln47j32uqW8uCblo3bBfz9l0OdkVtMOrd5lwmXP0nB2XMU6p16lZmB6k+gqLmnRfYxzfizRXRUUWSzNJAZpGvXljC0XnqZIm9j8VReUtetbG/TRKmrGiigLuBRN/89C+WSe1dXrgu67i+/4HPhb5c5kFt7AA6zp20XmioKsANBcgmnoz6SosQcdmYhZRjZ+1nWEZe7iXRgYK9xcrvblocRYylhAYgCysOMO2UeDiRshFadwoRsawRAi4VwQrpiNndohy/T5TH+CZVwXcMGeAxAn/viFjVHCFvLn+Q+wH19fSqWHjCcYAAAAASUVORK5CYII=';
        const imageMinus = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAAXNSR0IArs4c6QAAAbNJREFUWAntmUFKxDAUhk0YXM0FPIMHcF88hrjRse1mVoKC4GJAUHA1m7bibMRjSNd6gDmDF+hqFo3/XxIZBqFxeEwjJou+zGv68vV/KWRe1J5txhhVluW5UuoM/UO4x+7ejm0DhiUYFlmWPaNvOL/ipaqqg7ZtX9FN+DugVmutT9I0/dRUMlBI6pWQjYyqKIoJHE/0QuYVzC3sC9+Cvl03Zhdgp5h3Brtv57/gunyH44gOAF5jXTzYm4MacF2B695yfTD1/HC6RiVdf2i7zkJGDaDvr3uodP8kygbLmKB/okVQ6TRFRaOi0gpIx4trNCoqrYB0vLhG/62iI583x7+AO+wPL7EvdDtun8d6xyDmCjEf8zy/6Rvsu0an0pAEszGnfZC87ws659v7BPzNGBtz7vOMV+ptanrT4zPhtmN8Fd02vthzEVRMShsoKhoVlVZAOl5co1FRaQWk43GNNi4oi6iuP7TdYGk0djBLB4VtFyu9QbR1FjKO4FiArKs4w85Q6WXlOYjSuFOMjAoXlsff4EzcjcBsjXL9MVNveEQCuDowQOJ0xzdk7M6Z6LHKBnsg9gUjHKh1fPU0mwAAAABJRU5ErkJggg==';
        function onImageClick(img, divId) {
            alert(divId)
            var open = img.open ? false : true;
            var divSub = document.getElementById(divId);
            divSub.style.display = open ? '' : 'none';
            
            img.open = open;
            img.src = open ? imageMinus : imagePlus;
        }
        </script>
        </HEAD>
        <BODY>
        ${head}

        ${body}

        </BODY>
        </HTML>`;
        // console.log('>>>>>html:\n' + html);
        return html;
    }

    fetchData = () => {
        // "qualityCheckpointId": 5200014,
        // "qualityCheckpointName": "墙面",
        this.props.navigation.setParams({ title: this.props.navigation.state.params.qualityCheckpointName })
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
                        source={{ html: this.state.html }}
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
