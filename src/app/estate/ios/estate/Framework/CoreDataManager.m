//
//  CoreDataManager.m
//  PRM
//
//  Created by soul on 2017/8/30.
//  Copyright © 2017年 Glodon Inc. . All rights reserved.
//

#import "CoreDataManager.h"
// system
#import <UIKit/UIKit.h>
// 3rd
#import <CKSecurityTool/SecurityTool.h>
#import "SSKeychain.h"
#import "MNLUUID.h"
#import "NSDictionary+getValue.h"

@implementation CoreDataManager
+ (void)parameterVarification:(NSMutableDictionary *)parameterDic
                          key:(NSString *)key {
    NSString *salt = [[self class] getSalt];
    if (!salt.length) {
        salt = nil;
    }
    return [SecurityTool parameterVarification:parameterDic key:key salt:salt];
}
+ (NSString *)encrypt:(NSString *)data key:(NSString *)key {
    NSString *salt = [[self class] getSalt];
    if (!salt.length) {
        salt = nil;
    }
    return [SecurityTool encrypt:data key:key salt:salt];
}
/** 1. 设置服务器
 * serverDic：{"apiServer:http://napi.upesn.com/rest/","imServer":
 * ws://imws.upesn.com:7272/} */
- (NSString *)configServer:(NSDictionary *)serverDic {
    _configDic = serverDic;
    return nil;
}

+ (instancetype)sharedManager {
    static dispatch_once_t once;
    static id instance;
    dispatch_once(&once, ^{
        instance = [[self alloc] init];
    });
    return instance;
}
#define KEY_KEYCHAIN_SERVICE_DEVICE_TOKEN @"KEY_GLD_KEYCHAIN_SERVICE_DEVICE_TOKEN"
+ (NSString *)getDeviceToken {
    return [SSKeychainSoul passwordForService:KEY_KEYCHAIN_SERVICE_DEVICE_TOKEN
                                      account:KEY_KEYCHAIN_SERVICE_DEVICE_TOKEN];
}
+ (void)saveDeviceToken:(NSString *)deviceToken {
    [SSKeychainSoul setPassword:deviceToken
                     forService:KEY_KEYCHAIN_SERVICE_DEVICE_TOKEN
                        account:KEY_KEYCHAIN_SERVICE_DEVICE_TOKEN];
}

- (void)saveDeviceToken:(NSString* _Nullable)deviceToken {
    return;
}

- (NSString* _Nullable)getToken {
    return nil;
}

- (NSString* _Nullable)getUserID {
    return nil;
}

- (NSString* _Nullable)getApiHost {
  return nil;
}

- (NSString* _Nullable)getHtmlHost {
    return nil;
}

- (NSString* _Nullable)getVersionCode {
    return @"0.0.0.0";
}
#pragma mark - 为demo准备的方法，获取设备信息
- (NSDictionary *)deviceInfo {
    UIDevice *device_ = [[UIDevice alloc] init];
    NSString *deviceid = [self loadDeviceId];
    NSString *devicetoken =
    [SSKeychainSoul passwordForService:KEY_KEYCHAIN_SERVICE_DEVICE_TOKEN
                               account:KEY_KEYCHAIN_SERVICE_DEVICE_TOKEN];
    
    if (devicetoken == nil) {
        devicetoken = @"0";
    }

    return @{
             @"owner" : device_.name,
             @"type" : device_.model,
             @"deviceid" : deviceid,
             @"devicetoken" : devicetoken,
             @"appVersion" : [[[NSBundle mainBundle] infoDictionary]
                              objectForKey:@"CFBundleShortVersionString"],
             @"platform" : [MNLUUID platform],
             @"platformShow" : [MNLUUID platformString],
             @"localVersion" : device_.localizedModel,
             @"osName" : device_.systemName,
             @"osVersion" : device_.systemVersion,
             @"screen" : NSStringFromCGSize([UIScreen mainScreen].currentMode.size),
             @"net" : @"wifi网络"
             };
}
/**临时获取device，没有存储到keychain*/
- (NSString *)loadDeviceId {
    NSString *uuid = [MNLUUID vender];
    return uuid;
}
+ (NSString *)deviceInfoString {
    return [NSString stringWithFormat:@"%@", [self.class deviceInfo]];
}

+ (NSString *)getSalt {
    NSString *ret =
    [[CoreDataManager sharedManager].configDic objectForKey:@"saltKey"];
    if (ret) {
        return ret;
    }
    return @""; // 没有，就是正式环境了
}

+ (void)parameterUrlEncoding:(NSMutableDictionary *)parameterDic {
    NSCharacterSet *characterSet = [[NSCharacterSet
                                     characterSetWithCharactersInString:@":/?&=;+!@#$()',*"] invertedSet];
    NSArray *keys = parameterDic.allKeys;
    for (NSString *key in keys) {
        NSString *value = [parameterDic stringValueDefault:@"" key:key];
        NSString *valueEncode =
        [value stringByAddingPercentEncodingWithAllowedCharacters:characterSet];
        [parameterDic setObject:valueEncode forKey:key];
    }
}

+ (NSString*)encryptByTs:(NSString* __nonnull)ts
                    salt:(NSString* __nonnull)salt {
    return [SecurityTool encryptByTs:ts salt:salt];
}


@end
