//
//  GLDRNEventEmitter.m
//  PRM
//
//  Created by glodon on 2017/11/17.
//  Copyright © 2017年 Glodon Inc. . All rights reserved.
//

#import "GLDRNEventEmitter.h"


@implementation GLDRNEventEmitter

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
    return @[@"version"]; //这里返回的将是你要发送的消息名的数组。
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
    [self sendEventWithName:@"version"
                       body:notification.object];
}

+ (void)emitEventWithName:(NSString *)name andPayload:(NSDictionary *)payload
{
    [[NSNotificationCenter defaultCenter] postNotificationName:@"event-emitted"
                                                        object:self
                                                      userInfo:payload];
}

//+ (NSString *)moduleName {
//    return @"GLDRNEventEmitter";
//}
@end


// js code
//import React,{Component} from 'react';
//import {
//    NativeModules,
//    NativeEventEmitter,
//} from 'react-native';
//
//var nativeBridge = NativeModules.GLDRNEventEmitter;//你的类名
//const NativeModule = new NativeEventEmitter(nativeBridge);
//
//export default class callTest extends React.Component {
//
//    render() {
//        return (
//                <Text />
//                );
//    }
//
//    componentDidMount(){
//        NativeModule.addListener('version',(data)=>this._getNotice(data));
//    }
//
//    _getNotice (body) {//body 看你传什么
//        this.forceUpdate();//重新渲染
//    }
//
//    componentWillUnmount() {
//        //删除监听
//        this.NativeModule.remove()
//    }
//
//}

