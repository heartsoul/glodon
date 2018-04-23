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
import * as AppConfig from "common-module"
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
export default class GLDWebView extends Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: navigation.state.params?navigation.state.params.title : '图纸',
    headerTintColor: "#FFF",
    headerStyle: { backgroundColor: "#00baf3" },
    headerRight:(  
      <Text  onPress={()=>navigation.state.params.rightNavigatePress()} style={{marginLeft:5, width:30, textAlign:"center"}} >  
          测试 
      </Text>  
  )  
  });
  componentDidMount=()=> {
    console.log(this.props.navigation.state.params);
    //请求数据
     this.props.navigation.setParams({title:this.props.navigation.state.params.title, rightNavigatePress:this._rightAction }) 
  }
  
  _rightAction = ()=> {
    console.log("执行js window.modelEvent.loadDotsData();");
    this.refs.webview.injectJavaScript('javascript:window.modelEvent.loadDotsData();')
    // this.props.navigation.pop("BimFileChooserPage");
  }
  onMessage =(e)=> {
    console.log(e.nativeEvent.data);
    let action = e.nativeEvent.data;
    if(action) {
      switch (action) {
        case 'loadDotsData':
          {

          }
          break;
        case 'invalidateToken':
        {

        }
        case 'cancelPosition':
        {
          
        }
        case 'getPosition':
        {
          
        }
        break;
        case 'getPositionInfo':
        {
          
        }
        break;
        default:
          break;
      }
    }
  }
  //在WebView中注册该回调方法
  
  onNavigationStateChange(event){
    console.log('onNavigationStateChange:');
    console.log(event); //打印出event中属性
    }
  //渲染
  render() {
    let url = AppConfig.BASE_URL_BLUEPRINT_TOKEN + storage.bimToken + `&show=false`;
    // let url = "https://sg.glodon.com";
    console.log("web view:" + url);
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#ecf0f1' }]}>
        <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
        <View style={styles.container}>
          <WebView bounces={false}
            ref="webview"
            onNavigationStateChange={()=>this.onNavigationStateChange}
            scalesPageToFit={true}
            javaScriptEnabled={true}
            domStorageEnabled={false}
             onMessage={(e)=>this.onMessage(e)}
             injectedJavaScript={cmdString}
           //  onLoadEnd ={()=>this.refs.webview.postMessage('javascript:window.modelEvent.loadDotsData();')}
            source={{ uri: url, method: 'GET' }}
            style={{ width: deviceWidth, height: deviceHeight }}>
          </WebView>
        </View>
      </SafeAreaView>
    );
  }
  //模型加载完毕后的回调
  loadDotsData() {
    // LogUtil.e("loadDotsData");
    // pageFinished();
  }

  //token失效的情况
  invalidateToken() {
    // LogUtil.e("invalidateToken");
    // showTokenError();
  }

  //取消选中构件
  cancelPosition() {
    // LogUtil.e("cancelPosition");
    // component = null;
  }

  //点击构件返回信息
  getPosition(json) {
    // LogUtil.e("getPosition json=" + json + " type=" + type);
    // if (TextUtils.isEmpty(json)) {
    //     component = null;
    // } else {
    //     component = new GsonBuilder().create().fromJson(json, ModelComponent.class);
    // }

    // //0新建检查单 1检查单编辑状态 2详情查看  3模型模式   4新建材设进场  5新增材设进场编辑状态  6材设模型模式
    // switch (type) {
    //     case 0:
    //         if (checkComponent()) {
    //             backData();
    //         }
    //         break;
    //     case 1:
    //         if (checkComponent()) {
    //             backData();
    //         }
    //         break;
    //     case 2:

    //         break;
    //     case 3:
    //         if (checkComponent()) {
    //             //跳转到检查单创建页
    //             Intent intent = new Intent(mActivity, CreateCheckListActivity.class);
    //             mModelSelectInfo.component = component;
    //             intent.putExtra(CommonConfig.RELEVANT_MODEL, mModelSelectInfo);
    //             startActivity(intent);
    //             finish();
    //         }
    //         break;
    //     case 4:
    //         if (checkComponent()) {
    //             backData();
    //         }
    //         break;
    //     case 5:
    //         if (checkComponent()) {
    //             backData();
    //         }
    //         break;
    //     case 6:
    //         if (checkComponent()) {
    //             //跳转到材设记录创建页
    //             Intent intent = new Intent(mActivity, CreateEquipmentMandatoryActivity.class);
    //             mModelSelectInfo.component = component;
    //             intent.putExtra(CommonConfig.RELEVANT_MODEL, mModelSelectInfo);
    //             startActivity(intent);
    //         }
    //         break;
    // }
  }

  //点击圆点 返回信息
  getPositionInfo(json) {
    // LogUtil.e("getPositionInfo json=" + json);
    // switch (type) {
    //     case 3:
    //         handleQuality(json);
    //         break;
    //     case 6:
    //         handleEquipment(json);
    //         break;
    // }
  }
}

//样式定义
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0
  }
});


// /**
//  * 描述：关联模型-模型展示
//  * 作者：zhourf on 2017/9/8
//  * 邮箱：zhourf@glodon.com
//  */
// public class RelevantModelActivity extends BaseActivity implements View.OnClickListener, RelevantModelContract.View {

//     private View mStatusView;
//     private RelativeLayout mBackView;
//     private RelativeLayout mFinishView;
//     private ImageView mChangeModelView;
//     private WebView mWebview;
// //    private String mFileName = "";
//     private String mFileId = "";//模型id

//     private RelevantBluePrintAndModelDialog mRepairDialog, mReviewDialog, mQualityDetailDialog, mEquipmentDetailDialog;

//     private RelevantModelContract.Presenter mPresenter;

//     private ModelListBeanItem mModelSelectInfo;//编辑时有过这个item
//     private ModelComponent component;//选中的构件
//     private int type = 0;//0新建检查单 1检查单编辑状态 2详情查看  3模型模式  4新建材设进场 5新增材设进场编辑状态  6材设模型模式
//     private boolean show = false;//true  不相应长按事件  false相应长按事件

//     @Override
//     protected void onCreate(Bundle savedInstanceState) {
//         super.onCreate(savedInstanceState);
//         setContentView(R.layout.quality_relevant_model_activity);
//         initView();
//         initStatusBar(mStatusView);
//         setListener();
//         initData();

//     }

//     private void initView() {
//         mStatusView = findViewById(R.id.relevant_model_statusview);
//         mBackView = (RelativeLayout) findViewById(R.id.relevant_model_back);
//         mFinishView = (RelativeLayout) findViewById(R.id.relevant_model_finish);
//         mChangeModelView = (ImageView) findViewById(R.id.relevant_model_change_model);
//         mWebview = (WebView) findViewById(R.id.relevant_model_webview);
//         initWebview();
//     }

//     private void initWebview() {
//         mWebview.setWebChromeClient(new WebChromeClient());
//         /**
//          * 依旧当前webview加载新的html
//          */
//         mWebview.setWebViewClient(new CustomWebViewClient());
//         // 解决html中js跨域问题
//         try {
//             if (Build.VERSION.SDK_INT >= 16) {
//                 Class<?> clazz = mWebview.getSettings().getClass();
//                 Method method = clazz.getMethod("setAllowUniversalAccessFromFileURLs", boolean.class);
//                 if (method != null) {
//                     method.invoke(mWebview.getSettings(), true);
//                 }
//             }
//         } catch (Exception e) {
//             LogUtil.e(e.getMessage());
//         }
//         // 一般设置
//         if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
//             mWebview.setWebContentsDebuggingEnabled(true);
//         }

//         WebSettings setting = mWebview.getSettings();
//         setting.setJavaScriptCanOpenWindowsAutomatically(true);
//         setting.setPluginState(WebSettings.PluginState.ON);
//         setting.setJavaScriptEnabled(true);
//         mWebview.addJavascriptInterface(new ModelEvent(), "modelEvent");
//         setting.setDomStorageEnabled(false);

//         // 暂时先去掉（在HuaWeiP6上显示异常）
//         // this.setLayerType(WebView.LAYER_TYPE_HARDWARE, new Paint());
// //        setting.setAppCacheMaxSize(1024 * 1024 * 8);
// //        setting.setAppCachePath(appCachePath);
//         setting.setAllowFileAccess(true);
//         setting.setAppCacheEnabled(false);
//         setting.setDatabaseEnabled(false);
//         setting.setUseWideViewPort(true);
//         setting.setCacheMode(WebSettings.LOAD_NO_CACHE);
// //        setting.setCacheMode(WebSettings.LOAD_DEFAULT);
//         // 1、LayoutAlgorithm.NARROW_COLUMNS ： 适应内容大小
//         // 2、LayoutAlgorithm.SINGLE_COLUMN:适应屏幕，内容将自动缩放
//         // setting.setLayoutAlgorithm(LayoutAlgorithm.SINGLE_COLUMN);
//         // setting.setLayoutAlgorithm(LayoutAlgorithm.NARROW_COLUMNS);
//         setting.setLoadWithOverviewMode(true);
//     }


//     @Override
//     public void sendBasicInfo(String token) {
//         String url = AppConfig.BASE_URL_BLUEPRINT_TOKEN + token + "&show=" + show;
//         LogUtil.e("url=" + url);
//         mWebview.loadUrl(url);
//     }


//     // 点击构件的回调
//     class ModelEvent {

//         //模型加载完毕后的回调
//         @JavascriptInterface
//         public void loadDotsData() {
//             LogUtil.e("loadDotsData");
//             pageFinished();
//         }

//         //token失效的情况
//         @JavascriptInterface
//         public void invalidateToken() {
//             LogUtil.e("invalidateToken");
//             showTokenError();
//         }

//         //取消选中构件
//         @JavascriptInterface
//         public void cancelPosition() {
//             LogUtil.e("cancelPosition");
//             component = null;
//         }

//         //点击构件返回信息
//         @JavascriptInterface
//         public void getPosition(final String json) {
//             LogUtil.e("getPosition json=" + json + " type=" + type);
//             if (TextUtils.isEmpty(json)) {
//                 component = null;
//             } else {
//                 component = new GsonBuilder().create().fromJson(json, ModelComponent.class);
//             }

//             //0新建检查单 1检查单编辑状态 2详情查看  3模型模式   4新建材设进场  5新增材设进场编辑状态  6材设模型模式
//             switch (type) {
//                 case 0:
//                     if (checkComponent()) {
//                         backData();
//                     }
//                     break;
//                 case 1:
//                     if (checkComponent()) {
//                         backData();
//                     }
//                     break;
//                 case 2:

//                     break;
//                 case 3:
//                     if (checkComponent()) {
//                         //跳转到检查单创建页
//                         Intent intent = new Intent(mActivity, CreateCheckListActivity.class);
//                         mModelSelectInfo.component = component;
//                         intent.putExtra(CommonConfig.RELEVANT_MODEL, mModelSelectInfo);
//                         startActivity(intent);
//                         finish();
//                     }
//                     break;
//                 case 4:
//                     if (checkComponent()) {
//                         backData();
//                     }
//                     break;
//                 case 5:
//                     if (checkComponent()) {
//                         backData();
//                     }
//                     break;
//                 case 6:
//                     if (checkComponent()) {
//                         //跳转到材设记录创建页
//                         Intent intent = new Intent(mActivity, CreateEquipmentMandatoryActivity.class);
//                         mModelSelectInfo.component = component;
//                         intent.putExtra(CommonConfig.RELEVANT_MODEL, mModelSelectInfo);
//                         startActivity(intent);
//                     }
//                     break;
//             }
//         }

//         //点击圆点 返回信息
//         @JavascriptInterface
//         public void getPositionInfo(String json) {
//             LogUtil.e("getPositionInfo json=" + json);
//             switch (type) {
//                 case 3:
//                     handleQuality(json);
//                     break;
//                 case 6:
//                     handleEquipment(json);
//                     break;
//             }
//         }


//     }

//     //材设模型模式
//     private void handleEquipment(String json) {
//         final EquipmentHistoryItem dot = new GsonBuilder().create().fromJson(json, EquipmentHistoryItem.class);
//         if (dot != null) {
//             runOnUiThread(new Runnable() {
//                 @Override
//                 public void run() {
//                     switch (dot.qcState) {
//                         case CommonConfig.QC_STATE_STANDARD://合格
//                         case CommonConfig.QC_STATE_NOT_STANDARD://不合格
//                             if (AuthorityManager.isEquipmentBrowser()) {
//                                 showEquipmentDialog(dot);
//                             }
//                             break;
//                     }
//                 }


//             });
//         }
//     }

//     private void showEquipmentDialog(final EquipmentHistoryItem item) {
//         mEquipmentDetailDialog.getEquipmentDialog(new View.OnClickListener() {
//             @Override
//             public void onClick(View view) {
//                 mPresenter.detail(item);
//             }
//         }).show();
//     }

//     //质量模型模式
//     private void handleQuality(String json) {
//         final ModelElementHistory dot = new GsonBuilder().create().fromJson(json, ModelElementHistory.class);
//         if (dot != null) {
//             runOnUiThread(new Runnable() {
//                 @Override
//                 public void run() {
// //          {"全部", "待提交",  "待整改",       "待复查",      "已检查",      "已复查",    "已延迟",  "已验收"};
// //          {"",     "staged", "unrectified",  "unreviewed",  "inspected",  "reviewed",  "delayed","accepted"};
//                     switch (dot.qcState) {
//                         case CommonConfig.QC_STATE_UNRECTIFIED://"待整改"
//                         case CommonConfig.QC_STATE_DELAYED://"已延迟"
//                             showRepairDialog(dot, AuthorityManager.isCreateRepair() && AuthorityManager.isMe(dot.responsibleUserId), AuthorityManager.isQualityBrowser());
//                             break;
//                         case CommonConfig.QC_STATE_UNREVIEWED://"待复查"
//                             showReviewDialog(dot, AuthorityManager.isCreateReview() && AuthorityManager.isMe(dot.inspectionUserId), AuthorityManager.isQualityBrowser());
//                             break;
//                         case CommonConfig.QC_STATE_INSPECTED://"已检查"
//                         case CommonConfig.QC_STATE_REVIEWED://"已复查"
//                         case CommonConfig.QC_STATE_ACCEPTED://"已验收"
//                             showDetailDialog(dot, AuthorityManager.isQualityBrowser());
//                             break;
//                     }
//                 }
//             });
//         }
//     }


//     private void setListener() {
//         mBackView.setOnClickListener(this);
//         mFinishView.setOnClickListener(this);
//         ThrottleClickEvents.throttleClick(mChangeModelView,this);

//     }

//     //获取选中的构件信息
//     private void getSelectedComponent() {
//         LogUtil.e("javascript:getSelectedComponent()");
//         mWebview.loadUrl("javascript:getSelectedComponent()");
//     }

//     private void initData() {
//         //入口类型
//         type = getIntent().getIntExtra(CommonConfig.RELEVANT_TYPE, 0);
//         mModelSelectInfo = (ModelListBeanItem) getIntent().getSerializableExtra(CommonConfig.MODEL_SELECT_INFO);
// //        mFileName = getIntent().getStringExtra(CommonConfig.BLUE_PRINT_FILE_NAME);
//         mFileId = getIntent().getStringExtra(CommonConfig.BLUE_PRINT_FILE_ID);
//         handleType();
//         //初始化底部弹出框
//         mRepairDialog = new RelevantBluePrintAndModelDialog(this);
//         mReviewDialog = new RelevantBluePrintAndModelDialog(this);
//         mQualityDetailDialog = new RelevantBluePrintAndModelDialog(this);
//         mEquipmentDetailDialog = new RelevantBluePrintAndModelDialog(this);

//         //获取数据
//         mPresenter = new RelevantModelPresenter(this);
//         mPresenter.initData(getIntent());
//     }

//     //不同的入口处理数据不同
//     private void handleType() {
//         //0新建检查单 1检查单编辑状态 2详情查看  3模型模式  4新建材设进场 5新增材设进场编辑状态  6材设模型模式
//         switch (type) {
//             case 0:
//                 show = false;
//                 break;
//             case 1:
//                 show = false;
//                 break;
//             case 2:
//                 show = true;
//                 mFinishView.setVisibility(View.GONE);
//                 break;
//             case 3:
//                 show = false;
//                 //判断是否有权限新建检查单
//                 if (!AuthorityManager.isQualityCreate()) {
//                     //无权限
//                     show = true;//不响应点击事件
//                     mFinishView.setVisibility(View.GONE);
//                 }
//                 break;
//             case 4:
//                 show = false;
//                 break;
//             case 5:
//                 show = false;
//                 break;
//             case 6:
//                 show = false;
//                 if(!AuthorityManager.isEquipmentModify()){
//                     mFinishView.setVisibility(View.GONE);
//                 }
//                 break;
//         }
//     }


//     @Override
//     public void onClick(View view) {
//         int id = view.getId();
//         switch (id) {
//             case R.id.relevant_model_back://返回键
//                 mActivity.finish();
//                 break;
//             case R.id.relevant_model_finish://+号
//                 getSelectedComponent();
//                 break;
//             case R.id.relevant_model_change_model://切换模型
//                 changeModel();
//                 break;
//         }
//     }

//     private void changeModel() {
//         mPresenter.changeModel();
//     }

//     //检测是否选择了构件
//     private boolean checkComponent() {
//         if (component == null || TextUtils.isEmpty(component.elementId) || "undefined".equals(component.elementId)) {
//             SaveDeleteDialog mHintDialog = new SaveDeleteDialog(getActivity());
//             mHintDialog.getModelHintDialog(ResourceUtil.getResourceString(R.string.str_quality_model_choose_component_hint));
//             mHintDialog.show();
//             return false;
//         }
//         return true;
//     }

//     private void backData() {
//         Intent data = new Intent();
//         mModelSelectInfo.component = component;
//         data.putExtra(CommonConfig.MODEL_SELECT_INFO, mModelSelectInfo);
//         setResult(RESULT_OK, data);
//         finish();
//     }


//     //设定选中的构件  单个和多个
//     private void showSelectedComponent(final List<String> list) {
//         runOnUiThread(new Runnable() {
//             @Override
//             public void run() {
//                 String param = new GsonBuilder().create().toJson(list);
//                 LogUtil.e("设置选中构件 param=" + param);
//                 mWebview.loadUrl("javascript:showSelectedComponent('" + param + "')");
//             }
//         });


//     }

//     //设置多个点
//     @Override
//     public void showModelHistory(List<ModelElementHistory> list) {

//         //设置多点
//         String param = new GsonBuilder().create().toJson(list);
//         LogUtil.e("设置质量多点 params=" + param);
//         mWebview.loadUrl("javascript:loadCircleItems('" + param + "')");

//         //设置多个构件选中
// //        List<String> dotList = new ArrayList<>();
// //        for(ModelElementHistory history:list){
// //            dotList.add(history.elementId);
// //        }
// //        showSelectedComponent(dotList);
//     }

//     @Override
//     public void showEquipmentList(final List<EquipmentHistoryItem> items) {

//         runOnUiThread(new Runnable() {
//             @Override
//             public void run() {
//                 String param = new GsonBuilder().create().toJson(items);
//                 LogUtil.e("设置材设多点 params=" + param);
//                 mWebview.loadUrl("javascript:loadCircleItems('" + param + "')");
//             }
//         });

//     }

//     @Override
//     public void clearDots() {
//         mWebview.loadUrl("javascript:removeDrawableItem()");
//     }

//     @Override
//     public void showNewModel(ModelListBeanItem model) {
//         mModelSelectInfo = model;
//     }


//     @Override
//     public void showTokenError() {
//         ToastManager.show(ResourceUtil.getResourceString(R.string.str_toast_authority_hint));
//     }


//     //新建整改单的弹出框
//     private void showRepairDialog(final ModelElementHistory dot, boolean create, boolean browser) {
//         mRepairDialog.getRepairDialog(new View.OnClickListener() {
//             @Override
//             public void onClick(View view) {
//                 //创建整改单
//                 Intent intent = new Intent(mActivity, CreateReviewActivity.class);
//                 intent.putExtra(CommonConfig.CREATE_TYPE, CommonConfig.CREATE_TYPE_REPAIR);
//                 intent.putExtra(CommonConfig.SHOW_PHOTO, true);
//                 intent.putExtra(CommonConfig.QUALITY_CHECK_LIST_DEPTID, SharedPreferencesUtil.getProjectId());
//                 intent.putExtra(CommonConfig.QUALITY_CHECK_LIST_ID, dot.inspectionId);
//                 startActivity(intent);
//             }
//         }, new View.OnClickListener() {
//             @Override
//             public void onClick(View view) {
//                 //查看详情
//                 Intent intent = new Intent(mActivity, QualityCheckListDetailActivity.class);
//                 intent.putExtra(CommonConfig.QUALITY_CHECK_LIST_DEPTID, SharedPreferencesUtil.getProjectId());
//                 intent.putExtra(CommonConfig.QUALITY_CHECK_LIST_ID, dot.inspectionId);
//                 startActivity(intent);
//             }
//         }, create, browser).show();
//     }

//     //新建复查单的弹出框
//     private void showReviewDialog(final ModelElementHistory dot, boolean create, boolean browser) {
//         mReviewDialog.getReviewDialog(new View.OnClickListener() {
//             @Override
//             public void onClick(View view) {
//                 //创建复查单
//                 Intent intent = new Intent(mActivity, CreateReviewActivity.class);
//                 intent.putExtra(CommonConfig.CREATE_TYPE, CommonConfig.CREATE_TYPE_REVIEW);
//                 intent.putExtra(CommonConfig.SHOW_PHOTO, true);
//                 intent.putExtra(CommonConfig.QUALITY_CHECK_LIST_DEPTID, SharedPreferencesUtil.getProjectId());
//                 intent.putExtra(CommonConfig.QUALITY_CHECK_LIST_ID, dot.inspectionId);
//                 startActivity(intent);
//             }
//         }, new View.OnClickListener() {
//             @Override
//             public void onClick(View view) {
//                 //查看详情
//                 Intent intent = new Intent(mActivity, QualityCheckListDetailActivity.class);
//                 intent.putExtra(CommonConfig.QUALITY_CHECK_LIST_DEPTID, SharedPreferencesUtil.getProjectId());
//                 intent.putExtra(CommonConfig.QUALITY_CHECK_LIST_ID, dot.inspectionId);
//                 startActivity(intent);
//             }
//         }, create, browser).show();
//     }

//     //查看质量详情
//     private void showDetailDialog(final ModelElementHistory dot, boolean browser) {
//         mQualityDetailDialog.getQualityDetailDialog(new View.OnClickListener() {
//             @Override
//             public void onClick(View view) {
//                 //查看详情
//                 Intent intent = new Intent(mActivity, QualityCheckListDetailActivity.class);
//                 intent.putExtra(CommonConfig.QUALITY_CHECK_LIST_DEPTID, SharedPreferencesUtil.getProjectId());
//                 intent.putExtra(CommonConfig.QUALITY_CHECK_LIST_ID, dot.inspectionId);
//                 startActivity(intent);
//             }
//         }, browser).show();
//     }

//     /**
//      * 创建返回的事件
//      */
//     private static String createReturnUrl(String eventName, String json) {
//         String temp = "javascript:{ var e = document.createEvent('Event');" + "e.data=" + json + ";" + "e.initEvent('"
//                 + eventName + "',false,true);" + "document.dispatchEvent(e);}";
//         LogUtil.e("向H5传递参数=======" + temp);
//         return temp;
//     }

//     private void pageFinished() {
//         //0新建检查单 1检查单编辑状态 2详情查看  3模型模式  4新建材设进场 5新增材设进场编辑状态  6材设模型模式
//         LogUtil.e("pageFinish type=" + type);
//         switch (type) {
//             case 0:

//                 break;
//             case 1:
//                 if (mModelSelectInfo != null) {
//                     component = mModelSelectInfo.component;
//                     if (component != null) {
//                         List<String> list = new ArrayList<>();
//                         list.add(mModelSelectInfo.component.elementId);
//                         showSelectedComponent(list);
//                     }
//                     runOnUiThread(new Runnable() {
//                         @Override
//                         public void run() {
//                             mChangeModelView.setVisibility(View.VISIBLE);
//                         }
//                     });

//                 }
//                 break;
//             case 2:
//                 if (mModelSelectInfo != null) {
//                     component = mModelSelectInfo.component;
//                     if (component != null) {
//                         List<String> list = new ArrayList<>();
//                         list.add(mModelSelectInfo.component.elementId);
//                         showSelectedComponent(list);
//                     }
//                 }
//                 break;
//             case 3:
//                 mPresenter.getElements();
// //                    showModelHistory(null);
//                 break;
//             case 4:

//                 break;
//             case 5:
//                 if (mModelSelectInfo != null) {
//                     component = mModelSelectInfo.component;
//                     if (component != null) {
//                         List<String> list = new ArrayList<>();
//                         list.add(mModelSelectInfo.component.elementId);
//                         showSelectedComponent(list);

//                     }
//                     runOnUiThread(new Runnable() {
//                         @Override
//                         public void run() {
//                             mChangeModelView.setVisibility(View.VISIBLE);
//                         }
//                     });
//                 }
//                 break;
//             case 6:
//                 mPresenter.getEquipmentList();
//                 break;
//         }

//     }

//     class CustomWebViewClient extends WebViewClient {


//         @Override
//         public void onPageStarted(WebView view, String url, Bitmap favicon) {
//             super.onPageStarted(view, url, favicon);
//             showLoadingDialog();
//         }

//         @Override
//         public void onPageFinished(WebView view, String url) {
//             super.onPageFinished(view, url);
//             dismissLoadingDialog();
//         }

//         @Override
//         public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
//             handler.proceed();
//         }
//     }


//     @Override
//     public void showLoadingDialog() {
//         showLoadDialog(true);
//     }

//     @Override
//     public void dismissLoadingDialog() {
//         dismissLoadDialog();
//     }

//     @Override
//     public Activity getActivity() {
//         return mActivity;
//     }

//     @Override
//     protected void onActivityResult(int requestCode, int resultCode, Intent data) {
//         if(mPresenter!=null)
//         {
//             mPresenter.onActivityResult(requestCode, resultCode, data);
//         }
//     }

//     @Override
//     protected void onDestroy() {
//         super.onDestroy();
//         if (mWebview != null) {
//             //清空所有Cookie
//             CookieSyncManager.createInstance(BaseApplication.getInstance());  //Create a singleton CookieSyncManager within a context
//             CookieManager cookieManager = CookieManager.getInstance(); // the singleton CookieManager instance
//             cookieManager.removeAllCookie();// Removes all cookies.
//             CookieSyncManager.getInstance().sync(); // forces sync manager to sync now

//             mWebview.setWebChromeClient(null);
//             mWebview.setWebViewClient(null);
//             mWebview.getSettings().setJavaScriptEnabled(false);
//             mWebview.clearCache(true);
//         }
//     }
// }
