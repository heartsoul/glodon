//
//  NetCacheManager.h
//  NetFramework
//
//  Created by banwj on 16/5/31.
//  Copyright © 2017年 soul. All rights reserved.
//

#import "LoadCacheType.h"
#import <Foundation/Foundation.h>

@class RequestModel,ResponseModel ,ParserFactory;

@protocol NetCacheManagerDelegate <NSObject>

@optional
/**
 *  给Request参数自定加密方式
 *  若RequestModel中needSecurity为NO 此方法不生效
 *  若RequestModel中needSecurity为YES 此方法生效,若不实现则默认添加et ek
 *
 *  @param request <#request description#>
 *
 *  @return <#return value description#>
 */
- (RequestModel *)needSecurityFrom:(RequestModel *)request;
/**
 *  自定义文件名,若不自定义即为取 request 中
 *  md5(request.path)+md5(request.requestParamter)作为文件名
 *
 *  @param request 请求model
 *
 *  @return <#return value description#>
 */
- (NSString *)fileNameByRequest:(RequestModel *)request;
@end

typedef void (^FinishRequestModelBlock)(ResponseModel *responseDic, RequestModel *requestDic);
typedef void (^FailedRequestModelBlock)(NSError *error, RequestModel *requestDic);

@interface NetCacheManager : NSObject
@property(nonatomic, assign) id<NetCacheManagerDelegate> managerDelegate;
/**
 *  请求网络、缓存数据
 *
 *  @param request   RequestModel
 *  @param factory   ParserFactory 返回格式（可以重定义）
 *  @param cacheType LoadCacheType 缓存策略
 *  @param finishRequest 成功块
 *  @param failRequest   失败块
 */
- (void)loadDataWithRequest:(RequestModel *)request
               parseFactory:(ParserFactory *)factory
              loadCacheType:(LoadCacheType)cacheType
            finishRequest:(FinishRequestModelBlock)finishRequest
              failRequest:(FailedRequestModelBlock)failRequest;

/**
 *  删除小于时间戳的缓存文件
 *
 *  @param time 时间戳
 *
 *  @return <#return value description#>
 */
+ (BOOL)deleteCacheFileByDeleteTime:(NSString *)time;
/**
 *  删除指定路径的文件
 *
 *  @param filePath <#filePath description#>
 *
 *  @return <#return value description#>
 */
+ (BOOL)deleteCacheFileByPath:(NSString *)filePath;
/**
 *  删除指定请求的文件
 *
 *  @param requestDic <#requestDic description#>
 *
 *  @return <#return value description#>
 */
- (BOOL)deleteCacheFileByRequest:(RequestModel *)requestDic;

/**
 *  比较 字典、数组对象的内容 是否一致
 *
 *  @param cacheData 缓存数据
 *  @param netData   网络数据
 *
 *  @return <#return value description#>
 */
+ (BOOL)compareResponse:(id)cacheData WithResponse:(id)netData;
@end
