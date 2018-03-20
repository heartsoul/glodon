//
//  GLDRNBridgeModule.m
//  PRM
//
//  Created by glodon on 2017/11/17.
//  Copyright © 2017年 Glodon Inc. . All rights reserved.
//

#import "GLDRNBridgeModule.h"
#import <React/RCTEventEmitter.h>
#import <libextobjc/EXTScope.h>
#import "GLDRNEventEmitter.h"
#import "NSObject+SoulAlertView.h"
#import "TestRNViewController.h"
#import "AppDelegate.h"
const NSStringRNAPI RNAPI_version = @"version";
const NSStringRNAPI RNAPI_alert = @"alert";
const NSStringRNAPI RNAPI_test = @"test";
const NSStringRNAPI RNAPI_push = @"push";
const NSStringRNAPI RNAPI_present = @"present";
const NSStringRNAPI RNAPI_clearCookie = @"clearCookie";
const NSStringRNAPI RNAPI_saveCookie = @"saveCookie";
const NSStringRNAPI RNAPI_callNative = @"callNative"; // 调用原生功能
@interface NSDictionary(GLDRNBridgeModuleRequest)

@end

@implementation NSDictionary(GLDRNBridgeModuleRequest)

// 合法的数据格式为 {"caller":"gldrn","name":"version","ver":"1.0","data":{}}}
- (BOOL)isValidCallData {
    NSString * caller = [self getCaller];
    NSString * callName = [self getCallName];
    NSDictionary * callData = [self getCallData];
    if ([caller isKindOfClass:[NSString class]] && [callName isKindOfClass:[NSString class]] && [callData isKindOfClass:[NSDictionary class]]) {
        return [@"gldrn" isEqualToString:caller]; // 唯一标识
    }
    return NO;
}

- (BOOL)isValidCallApi {
    return YES;
}
// 调用的api 名
- (NSString*) getCallName {
    NSString* ret = [self objectForKey:@"name"];
    if (![ret isKindOfClass:[NSString class]]) {
        return nil;
    }
    return ret;
}

// api的版本信息
- (NSString*) getVersion {
    NSString* ret = [self objectForKey:@"ver"];
    if (![ret isKindOfClass:[NSString class]]) {
        return nil;
    }
    return ret;
}

// 调用者 这里必须是 gldrn
- (NSString*) getCaller {
    NSString* ret = [self objectForKey:@"caller"];
    if (![ret isKindOfClass:[NSString class]]) {
        return nil;
    }
    return ret;
}

// 数据对象，这个与业务相关，但必须是字典对象，不支持其它类型的对象
- (NSDictionary*) getCallData {
    NSDictionary* ret = [self objectForKey:@"data"];
    if (![ret isKindOfClass:[NSDictionary class]]) {
        return nil;
    }
    return ret;
}

- (NSString*) stringValueByKey:(NSString*)key {
  return [self stringValueByKey:key defaultValue:nil];
}

- (NSString*) stringValueByKey:(NSString*)key defaultValue:(NSString*)value {
  NSString* ret = [self objectForKey:key];
  if (![ret isKindOfClass:[NSString class]]) {
    return value;
  }
  return ret;
}

- (NSInteger) integerValueByKey:(NSString*)key {
  return [self stringValueByKey:key defaultValue:nil].integerValue;
}

- (NSInteger) integerValueByKey:(NSString*)key defaultValue:(NSInteger)value {
  return [self stringValueByKey:key defaultValue:[NSString stringWithFormat:@"%@",@(value)]].integerValue;
}

@end

@interface NSDictionary(GLDRNBridgeModuleResponse)
@end

@implementation NSDictionary(GLDRNBridgeModuleResponse)

- (NSString*)safeV:(NSString*)value d:(NSString*)defaultValue{
    if (value == nil || ![value isKindOfClass:[NSString class]]) {
        return @"";
    }
    return value;
}
- (NSDictionary*)safeVD:(NSDictionary*)value d:(NSDictionary*)defaultValue{
    if (value == nil || ![value isKindOfClass:[NSDictionary class]]) {
        return @{};
    }
    return value;
}
// 出现错误时返回数据标准格式 {code:xxx,msg:xxx}
- (NSDictionary*)errorResponseCode:(NSString*)code message:(NSString*)msg {
    return @{@"code":[self safeV:code d:@"0"], @"msg":[self safeV:msg d:@""]};
}
// 执行成功后的标准返回格式,默认code >= 0 为成功 {code:xxx,msg:xxx,data:xxx}
- (NSDictionary*)successedResponseCode:(NSString*)code message:(NSString*)msg data:(NSDictionary*)data {
    return @{@"code":[self safeV:code d:@"0"], @"msg":[self safeV:msg d:@""], @"data":[self safeVD:data d:@{}]};
}

- (NSDictionary*)errorResponseInvalidCall {
    return [self errorResponseCode:@"-1000" message:@"非法调用"];
}

- (NSDictionary*)errorResponseNotFound {
    return [self errorResponseCode:@"-1001" message:@"暂未支持功能"];
}

- (NSDictionary*)errorResponseInvalidParameter {
    return [self errorResponseCode:@"-1002" message:@"参数错误"];
}
- (BOOL)isValidResponseData {
    NSString * code = [self getCode];
    NSString * msg = [self getMsg];
    NSDictionary * callData = [self getCallData];
    if ([code isKindOfClass:[NSString class]] && [msg isKindOfClass:[NSString class]] && [callData isKindOfClass:[NSDictionary class]]) {
        return YES; //
    }
    return NO;
}
- (BOOL) isError {
    return [self getCode].integerValue < 0;
}
- (NSString*) getCode {
    NSString* ret = [self objectForKey:@"code"];
    if (![ret isKindOfClass:[NSString class]]) {
        return nil;
    }
    return ret;
}

- (NSString*) getMsg {
    NSString* ret = [self objectForKey:@"msg"];
    if (![ret isKindOfClass:[NSString class]]) {
        return nil;
    }
    return ret;
}

@end

@interface NSObject(GLDRNBridgeModuleRequest)
@end

@implementation NSObject(GLDRNBridgeModuleRequest)
- (BOOL)isValidCall {
    if(![self isKindOfClass:[NSDictionary class]]) {
        return NO;
    }
    NSDictionary * callData = (NSDictionary*)self;
    return [callData isValidCallData];
}

- (BOOL)isValidResponse {
    if(![self isKindOfClass:[NSDictionary class]]) {
        return NO;
    }
    NSDictionary * callData = (NSDictionary*)self;
    return [callData isValidResponseData];
}
@end

@interface GLDRNBridgeModule()
@end

@implementation GLDRNBridgeModule
NSArray* apiSet() {
  static NSArray * apiSet;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    apiSet = @[RNAPI_version,RNAPI_alert,RNAPI_test,RNAPI_push,RNAPI_present,RNAPI_clearCookie,RNAPI_saveCookie,RNAPI_callNative];
  });
  return apiSet;
}

//- (instancetype)init
//{
//    self = [super init];
//    if (self) {
//        _apiSet = ;
//    }
//    return self;
//}


- (BOOL)isValidApi:(NSStringRNAPI)api {
    return [apiSet() containsObject:api];
}

+ (void)api_excute:(NSDictionary *)dictionary finishBlock:(FinishJSApiBlock)finishBlock {
    @try {
        NSString * apiMethod = [NSString stringWithFormat:@"api_%@:finishBlock:", [dictionary getCallName]];
      
        SEL sel = NSSelectorFromString(apiMethod);
        if ([[self class] respondsToSelector:sel]) {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
            
            [[self class] performSelector:sel withObject:dictionary withObject:finishBlock];
#pragma clang diagnostic pop
        } else {
            finishBlock([dictionary errorResponseNotFound],dictionary);
        }
    }
    @catch (NSException *exception) {
        // 2
        NSLog(@"%s\n%@", __FUNCTION__, exception);
        finishBlock([dictionary errorResponseCode:@"-1" message:exception.reason],dictionary);
    }
    @finally {
    }
}

+ (void)api_version:(NSDictionary *)dictionary finishBlock:(FinishJSApiBlock) finishBlock {
  // 响应
  finishBlock([dictionary successedResponseCode:@"0" message:@"" data:@{@"version":@"v1.0.0"}],dictionary);
}

+ (void)api_alert:(NSDictionary *)dictionary finishBlock:(FinishJSApiBlock) finishBlock {
  // 响应
    finishBlock([dictionary successedResponseCode:@"0" message:@"" data:@{}],dictionary);
  // 执行
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.01 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [[self class] alert:dictionary];
    });
}
+ (void)api_test:(NSDictionary *)dictionary finishBlock:(FinishJSApiBlock) finishBlock {
  // 响应
    finishBlock([dictionary successedResponseCode:@"0" message:@"" data:@{}],dictionary);
  // 执行
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.01 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [[self class] test:nil];
    });
    //    [[self class] performSelector:@selector(test:) withObject:@{@"title":@"Tip", @"msg":@"hello world", @"buttons":@[]} afterDelay:10];
    
    //    [GLDRNBridgeModule emitEventWithName:RNAPI_alert andPayload:@{@"title":@"Tip", @"msg":@"hello world", @"buttons":@[]}];
}

+ (void)api_callNative:(NSDictionary*)dictionary finishBlock:(FinishJSApiBlock) finishBlock {
 
  // 执行
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.01 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
     [[self class] callNative:dictionary];
    // 响应
    finishBlock([dictionary successedResponseCode:@"0" message:@"" data:@{}],dictionary);
  });
}


+ (void)callNative:(NSDictionary*)data {
  NSLog(@"callNative:%@",@"successed");
  
  [TestRNViewController callPhotoTest];
}

+ (void)api_push:(NSDictionary *)dictionary finishBlock:(FinishJSApiBlock) finishBlock {
  // 响应
  finishBlock([dictionary successedResponseCode:@"0" message:@"" data:@{}],dictionary);
  // 执行
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.01 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    [[self class] push:dictionary];
  });
}

+ (void)api_present:(NSDictionary *)dictionary finishBlock:(FinishJSApiBlock) finishBlock {
  // 响应
  finishBlock([dictionary successedResponseCode:@"0" message:@"" data:@{}],dictionary);
  // 执行
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.01 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    [[self class] present:dictionary];
  });
}
+ (void)api_clearCookie:(NSDictionary*)dictionary finishBlock:(FinishJSApiBlock) finishBlock {
 [[self class] clearCookie:dictionary];
  // 执行
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.01 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    
    // 响应
    finishBlock([dictionary successedResponseCode:@"0" message:@"" data:@{}],dictionary);
  });
}

+ (void)clearCookie:(NSDictionary*)data {
  NSArray * allCookies = [[NSHTTPCookieStorage sharedHTTPCookieStorage] cookies];
  for (NSHTTPCookie * cookie in allCookies) {
            NSLog(@"\n%@:%@", cookie.name, cookie.value);
    if ([cookie.path isEqualToString:@"/"]&&[cookie.name isEqualToString:@"JSESSIONID"]) {
//      userModel.access_token = [NSString stringWithFormat:@"%@=%@", cookie.name, cookie.value];
      //continue;
    }
    [[NSHTTPCookieStorage sharedHTTPCookieStorage] deleteCookie:cookie];
  }
}
+ (void)api_saveCookie:(NSDictionary*)dictionary finishBlock:(FinishJSApiBlock) finishBlock {
  [[self class] saveCookie:dictionary];
  // 执行
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.01 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    // 响应
    finishBlock([dictionary successedResponseCode:@"0" message:@"" data:@{}],dictionary);
  });
}

+ (void)saveCookie:(NSDictionary*)data {
  NSArray * allCookies = [[NSHTTPCookieStorage sharedHTTPCookieStorage] cookies];
  for (NSHTTPCookie * cookie in allCookies) {
    NSLog(@"\n%@:%@", cookie.name, cookie.value);
    if ([cookie.path isEqualToString:@"/"]&&[cookie.name isEqualToString:@"JSESSIONID"]) {
      NSLog(@"%@",[NSString stringWithFormat:@"%@=%@", cookie.name, cookie.value]);
      //      userModel.access_token = [NSString stringWithFormat:@"%@=%@", cookie.name, cookie.value];
      //continue;
    }
    [[NSHTTPCookieStorage sharedHTTPCookieStorage] deleteCookie:cookie];
  }
}

+ (void)test:(NSDictionary*)data {
  // 主动调用 rn
    [GLDRNBridgeModule emitEventWithName:RNAPI_test andPayload:@{@"title":@"Tip", @"msg":@"hello world", @"buttons":@[]}];
}

+ (void)alert:(NSDictionary*)data {
  // 弹出提示
  NSDictionary * dataDic = [data getCallData];
  NSString * title = [dataDic stringValueByKey:@"title" defaultValue:@"提示"];
  NSString * message = [dataDic stringValueByKey:@"message" defaultValue:@"确认"];
  [NSObject showTipWithTitle:title message:message closeButtonTitle:@"关闭"];
}

+ (void)push:(NSDictionary*)data {
//  TestRNViewController * viewController = [[TestRNViewController alloc] initWithNibName:@"TestRNViewController" bundle:[NSBundle mainBundle]];
  
  UIStoryboard *secondStoryBoard = [UIStoryboard storyboardWithName:@"TestRNViewController" bundle:nil];
  TestRNViewController* viewController = [secondStoryBoard instantiateInitialViewController];  //viewController为viewcontroller
//  UIViewController * rootVC = [UIApplication sharedApplication].keyWindow.rootViewController;
  [UIApplication sharedApplication].keyWindow.rootViewController = viewController;
  [[UIApplication sharedApplication].keyWindow makeKeyAndVisible];
}
+ (void)present:(NSDictionary*)data {
  [NSObject showTipWithTitle:@"abc" message:@"Hello" closeButtonTitle:@"close"];
}

RCT_EXPORT_MODULE(GLDRNBridgeModule)

//RN传参数调用原生OC,并且返回数据给RN  通过CallBack
RCT_EXPORT_METHOD(RNInvokeOCCallBack:(NSDictionary *)dictionary callback:(RCTResponseSenderBlock)callback){
#ifdef DEBUG
    NSLog(@"接收到RN传过来的数据为:%@",dictionary);
#endif
    if(![dictionary isValidCall]) {
        // 非法调用，调用格式多不正确
        callback(@[[dictionary errorResponseInvalidCall], dictionary]);
        NSLog(@"非法调用：%@",dictionary);
        return;
    }
    
    if(![self isValidApi:[dictionary getCallName]]) {
        // api 不受支持
        callback(@[[dictionary errorResponseNotFound], dictionary]);
        NSLog(@"非法调用：%@",dictionary);
        return;
    }
    [[self class] api_excute:dictionary finishBlock:^(NSDictionary *outData, NSDictionary *inData) {
        callback(@[outData, dictionary]);
    }];
    
    
//    NSArray *events = [[NSArray alloc] initWithObjects:@"张三",@"李四", nil];
//
//    callback(@[[NSNull null], events]);
}

//RN传参数调用原生OC,并且返回数据给RN  通过Promise
RCT_EXPORT_METHOD(RNInvokeOCPromise:(NSDictionary *)dictionary resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
#ifdef DEBUG
    NSLog(@"接收到RN传过来的数据为:%@",dictionary);
#endif
    
    if(![dictionary isValidCall]) {
        NSDictionary * error = [dictionary errorResponseInvalidCall];
        reject([error getCode], [error getMsg], nil);
    }
    
    if(![self isValidApi:[dictionary getCallName]]) {
        // api 不受支持
        NSDictionary * error = [dictionary errorResponseNotFound];
        reject([error getCode], [error getMsg], nil);
        return;
    }
    [[self class] api_excute:dictionary finishBlock:^(NSDictionary *outData, NSDictionary *inData) {
        if([outData isValidResponse] && ![outData isError]) {
            resolve(@[outData, dictionary]);
        } else {
            reject([outData getCode], [outData getMsg], nil);
        }
        
    }];
    
//    NSString *value=[dictionary objectForKey:@"name"];
//    if([value isEqualToString:@"jiangqq"]){
//        resolve(@"回调成功啦,Promise...");
//    }else{
//        NSError *error=[NSError errorWithDomain:@"传入的name不符合要求,回调失败啦,Promise..." code:100 userInfo:nil];
//        reject(@"100",@"传入的name不符合要求,回调失败啦,Promise...",error);
//    }
}

// RN直接调用原生接口例子
RCT_EXPORT_METHOD(RNCallApiTest:(NSString *)data){
    NSLog(@"RN传入原生界面的数据为:%@",data);
}

//OC调用RN
RCT_EXPORT_METHOD(VCOpenRN:(NSDictionary *)dictionary){
    NSString *value=[dictionary objectForKey:@"name"];
    if([value isEqualToString:@"open"]){
        RCTEventEmitter * event = [RCTEventEmitter new];
        event.bridge = self.bridge;
        [event sendEventWithName:@"EventReminder" body:@{@"name":[NSString stringWithFormat:@"%@",value],@"errorCode":@"0",@"msg":@"成功"}];
    }else{
        RCTEventEmitter * event = [RCTEventEmitter new];
        event.bridge = self.bridge;
        [event sendEventWithName:@"EventReminder" body:@{@"name":[NSString stringWithFormat:@"%@",value],@"errorCode":@"0",@"msg":@"输入的name不是open"}];
    }
}


- (NSArray<NSString *> *)supportedEvents {
    return @[RNAPI_version,RNAPI_alert,RNAPI_test,RNAPI_push,RNAPI_present]; //这里返回的将是你要发送的消息名的数组。
}

- (void)startObserving
{
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(emitEventInternal:)
                                                 name:@"event-emitted"
                                               object:nil];
}
- (void)stopObserving
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)emitEventInternal:(NSNotification *)notification
{
    NSDictionary* event = notification.object;
    
    if ([event isValidCallApi] && [event isValidCallData]) {
        [self sendEventWithName:[event getCallName]
                           body:notification.userInfo];
    }
    
}

+ (void)emitEventWithName:(NSString *)name andPayload:(NSDictionary *)payload
{
    if (!name || ![name isKindOfClass:[NSString class]]) {
        return;
    }
    NSDictionary * event = @{@"caller":@"gldrn",@"name":name,@"ver":@"1.0",@"data":@{}};
    [[NSNotificationCenter defaultCenter] postNotificationName:@"event-emitted"
                                                        object:event
                                                      userInfo:payload];
}

@end

// js code
//
///**
// * Sample React Native App
// * https://github.com/facebook/react-native
// * @flow
// */
//
//import React, { Component } from 'react';
//import {
//    AppRegistry,
//    StyleSheet,
//    Text,
//    View,
//    TouchableHighlight
//} from 'react-native';
//var { NativeModules } = require('react-native');
//var RNBridgeModule=NativeModules.RNBridgeModule;
//import { NativeAppEventEmitter } from 'react-native';
//var subscription; //订阅者
//class RNOCDemo extends Component {
//    render() {
//        return (
//                <TouchableHighlight
//                style={styles.button}
//                underlayColor="#a5a5a5"
//                onPress={this.props.onPress}>
//                <Text style={styles.buttonText}>{this.props.text}</Text>
//                </TouchableHighlight>
//                );
//    }
//}
//class hunheDemo extends Component {
//    constructor(props){
//        super(props);
//        this.state={
//        events:'',
//        msg:'',
//        }
//    }
//    //获取Promise对象处理
//    async _updateEvents(){
//        try{
//            var events=await RNBridgeModule.RNInvokeOCPromise({'name':'jiangqqlmj'});
//            this.setState({events});
//        }catch(e){
//            this.setState({events:e.message});
//        }
//    }
//    componentDidMount(){
//        console.log('开始订阅通知...');
//        subscription = NativeAppEventEmitter.addListener(
//                                                         'EventReminder',
//                                                         (reminder) => {
//                                                             let errorCode=reminder.errorCode;
//                                                             if(errorCode===0){
//                                                                 this.setState({msg:reminder.name});
//                                                             }else{
//                                                                 this.setState({msg:reminder.msg});
//                                                             }
//
//                                                         }
//                                                         );
//    }
//    componentWillUnmount(){
//        subscription.remove();
//    }
//
//    render() {
//        return (
//                <View style={{marginTop:20}}>
//                <Text style={styles.welcome}>
//                混合与RN,iOS通信实例讲解
//                </Text>
//                <Text style={{margin:20}}>
//                来自:江清清的技术专栏(http://www.lcode.org)
//                            </Text>
//                            <Text style={{margin:5}}>'返回数据为:'+{this.state.events}</Text>
//                            <CustomButton text='RN调用iOS原生方法_CallBack回调'
//                            onPress={()=>{RNBridgeModule.RNInvokeOCCallBack(
//                                                                            {'name':'jiangqq','description':'http://www.lcode.org'},
//                                                                            (error,events)=>{
//                                                                                if(error){
//                                                                                    console.error(error);
//                                                                                }else{
//                                                                                    this.setState({events:events});
//                                                                                }
//                                                                            })}}
//                            />
//                            <CustomButton text='RN调用iOS原生方法_Promise回调'
//                            onPress={()=>this._updateEvents()}
//                            />
//                            <Text style={{margin:20}}>
//                            '返回数据为:'+{this.state.msg}
//                            </Text>
//                            <CustomButton text='iOS调用访问React Native'
//                            onPress={()=>RNBridgeModule.VCOpenRN({'name':'jiangqqlmj'})}
//                            />
//
//                            </View>
//                            );
//                }
//                }
//
//                const styles = StyleSheet.create({
//        welcome: {
//        fontSize: 20,
//        textAlign: 'center',
//        margin: 10,
//        },
//        button: {
//        margin:5,
//        backgroundColor: 'white',
//        padding: 10,
//        borderWidth: 1,
//        borderColor: '#facece',
//        },
//        });
//
//                AppRegistry.registerComponent('PRM', () => RNOCDemo);

