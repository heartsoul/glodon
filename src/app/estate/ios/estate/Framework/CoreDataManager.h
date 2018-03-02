//
//  CoreDataManager.h
//  PRM
//
//  Created by soul on 2017/8/30.
//  Copyright © 2017年 Glodon Inc. . All rights reserved.
//

#import <Foundation/Foundation.h>

/**
 基础数据获取代理
 */
@protocol CoreDataManagerDelegate <NSObject>

@required

/**
 获取权限token

 @return token
 */
- (NSString* _Nullable)getToken;

/**
 获取用户ID

 @return 用户ID
 */
- (NSString* _Nullable)getUserID;

/**
 获取服务器主机地址

 @return 服务器主机地址
 */
- (NSString* _Nullable)getApiHost;

/**
 获取应用版本号

 @return 版本号
 */
- (NSString* _Nullable)getVersionCode;

/**
 获取静态资源服务器主机地址

 @return 静态资源服务器主机地址
 */
- (NSString* _Nullable)getHtmlHost;

@optional
/** 网络相关信息，需要用户实现，可以通过 Reachable 或 第三方库 RealReachability 库 */
- (BOOL) isUseableness; // 当前网络是否可用
- (NSInteger)networkStatus; // 当前网络状态 0: NotReachable 1: ReachableViaWifi 2:ReachableViaWWAN

@end

/** 核心数据管理类*/
@interface CoreDataManager : NSObject<CoreDataManagerDelegate>
/** 配置信息 */
@property (nonatomic,nullable, readonly) NSDictionary * configDic;
/** 用户数据信息 */
@property (nonatomic, strong, nullable) id model;

//@property (nonatomic, strong) Reachability *reachability;

/** 1. 设置服务器  serverDic：{"apiServer:http://napi.upesn.com/rest/","imServer": ws://imws.upesn.com:7272/} */
- (NSString* _Nullable)configServer:(NSDictionary* _Nullable)serverDic;


/**
 共享示例，如果用户重写了类，需要将此方法也重写，否则无法正确创建对象

 @return 共享实例对象
 */
+ (instancetype _Nonnull)sharedManager;


/**
 对数据进行加密，采用的是SHA1

 @param data 数据
 @param key 密钥
 @return 结果数据
 */
+ (NSString* _Nullable)encrypt:(NSString* _Nullable)data key:(NSString* _Nullable)key;

/**
 对参数合法性进行校验

 @param parameterDic 参与的参数
 @param key 密钥
 */
+ (void)parameterVarification:(NSMutableDictionary* _Nullable)parameterDic key:(NSString* _Nullable)key;

/**
 获取设备token

 @return 设备token
 */
+ (NSString* _Nullable)getDeviceToken;

/**
 设置设备token

 @param deviceToken 设备token
 */
+ (void)saveDeviceToken:(NSString* _Nullable)deviceToken;

/**
 对参数进行编码，转译不合法字符

 @param parameterDic 需要编码的参数
 */
+ (void)parameterUrlEncoding:(NSMutableDictionary* _Nonnull)parameterDic;

/**
 专用加密

 @param ts 数据
 @param salt 加密盐
 @return 结果数据
 */
+ (NSString* _Nonnull)encryptByTs:(NSString* _Nonnull)ts
salt:(NSString* _Nonnull)salt;

@end
