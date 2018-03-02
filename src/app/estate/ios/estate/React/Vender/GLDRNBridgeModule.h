//
//  GLDRNBridgeModule.h
//  PRM
//
//  Created by glodon on 2017/11/17.
//  Copyright © 2017年 Glodon Inc. . All rights reserved.
//

#import <Foundation/Foundation.h>
/**
 rn 调用 oc 类
 */
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

typedef NSString * NSStringRNAPI NS_STRING_ENUM;
extern const NSStringRNAPI RNAPI_version;
extern const NSStringRNAPI RNAPI_alert;
extern const NSStringRNAPI RNAPI_test;
extern const NSStringRNAPI RNAPI_push;
extern const NSStringRNAPI RNAPI_present;

typedef void (^FinishJSApiBlock)(NSDictionary* outData, NSDictionary* inData);
typedef void (^FailedJSApiBlock)(NSDictionary* errorData, NSDictionary* inData);

@interface GLDRNBridgeModule : RCTEventEmitter<RCTBridgeModule>
+ (void)emitEventWithName:(NSString *)name andPayload:(NSDictionary *)payload;
@end


