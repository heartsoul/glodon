//
//  BaseRCTComponentsManager.m
//  soul
//
//  Created by soul on 2018/3/22.
//  Copyright © 2018年 Soul. All rights reserved.
//

#import "BaseRCTComponentsManager.h"
const RN_API_NAME rn_api_version = @"version"; // 获取当前支持的版本号
const RN_API_NAME rn_api_call = @"call"; // 通用调用
@implementation BaseRCTComponentsManager
- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}
+ (BOOL)requiresMainQueueSetup {
  return NO;
}

NSArray* apiArray() {
  static NSArray * apiSet;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    apiSet = @[rn_api_version,rn_api_call];
  });
  return apiSet;
}

- (NSDictionary *)constantsToExport {
  NSMutableDictionary * apiDic = [NSMutableDictionary dictionary];
  for (RN_API_NAME name in apiArray()) {
    [apiDic setObject:name forKey:name];
  }
  return @{@"api":apiDic};
}

- (BOOL)isValidApi:(RN_API_NAME)api {
  return [apiArray() containsObject:api];
}

+ (void)api_excute:(NSDictionary *)dictionary finishBlock:(RNAPICompletedBlock)finishBlock {
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

+ (void)api_version:(NSDictionary *)dictionary finishBlock:(RNAPICompletedBlock) finishBlock {
  // 响应
  finishBlock([dictionary successedResponseCode:@"0" message:@"" data:@{@"version":@"v1.0.0"}],dictionary);
}

+ (void)api_callNative:(NSDictionary*)dictionary finishBlock:(RNAPICompletedBlock) finishBlock {
  
  // 执行
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.01 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    [[self class] callNative:dictionary];
    // 响应
    finishBlock([dictionary successedResponseCode:@"0" message:@"" data:@{}],dictionary);
  });
}


+ (void)callNative:(NSDictionary*)data {
  NSLog(@"callNative:%@",@"successed");
}

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
}
@end
