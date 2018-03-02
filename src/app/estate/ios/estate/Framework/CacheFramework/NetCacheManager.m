//
//  NetCacheManager.m
//  NetFramework
//
//  Created by banwj on 16/5/31.
//  Copyright © 2017年 soul. All rights reserved.
//

#import "NetCacheManager.h"

#import "CacheManager.h"
#import "NetManager.h"

#import "ParserFactory.h"
#import "RequestModel.h"
#import "ResponseModel.h"

@implementation NetCacheManager
- (void)loadDataWithRequest:(RequestModel *)request
               parseFactory:(ParserFactory *)factory
              loadCacheType:(LoadCacheType)cacheType
            finishRequest:(FinishRequestModelBlock)finishRequest
              failRequest:(FailedRequestModelBlock)failRequest {
  // 是否需要加密
  if (request.needSecurity) {
    if (self.managerDelegate &&
        [self.managerDelegate
            respondsToSelector:@selector(needSecurityFrom:)]) {
      [self.managerDelegate needSecurityFrom:request];
    }
  }
  
  
  // 缓存策略
  switch (cacheType) {
  case TypeOnlyLoadCache: {
    //文件名称
    [request setFileName:[self fileNameByRequest:request]];
    //读取文件
    NSData *data = [CacheManager readCacheData:request];
    //调用解析
    ResponseModel *response =
    [factory parseResponse:data RequestModel:request isLoadCache:YES];
    
    finishRequest(response, request);
  } break;
  case TypeOnlyLoadNet: {
    //网络请求
    [NetManager sendRequest:request
        finishRequest:^(id responseDic, RequestModel *requestDic) {
          //解析
          ResponseModel *response = [factory parseResponse:responseDic
                                  RequestModel:request
                                   isLoadCache:NO];

          finishRequest(response, requestDic);
        }
        failRequest:^(NSError *error, RequestModel *requestDic) {
          failRequest(error, requestDic);
        }];
  } break;
  case TypeLoadNetFailLoadCache: {
    //文件名称
    [request setFileName:[self fileNameByRequest:request]];
    [NetManager sendRequest:request
        finishRequest:^(id responseDic, RequestModel *requestDic) {
          //解析
          ResponseModel *response = [factory parseResponse:responseDic
                                  RequestModel:request
                                   isLoadCache:NO];

          finishRequest(response, requestDic);
          //存储
          [CacheManager writeCacheData:responseDic Request:request];
        }
        failRequest:^(NSError *error, RequestModel *requestDic) {
          //读取文件
          NSData *data = [CacheManager readCacheData:request];
          //调用解析
          ResponseModel *response =
          [factory parseResponse:data RequestModel:request isLoadCache:YES];
          
          finishRequest(response, request);
        }];
  } break;
  case TypeFirstLoadCacheLastLoadCache: {
    //缓存文件名称
    [request setFileName:[self fileNameByRequest:request]];
    //读取文件
    NSData *data = [CacheManager readCacheData:request];
    //调用解析
    ResponseModel *response =
    [factory parseResponse:data RequestModel:request isLoadCache:YES];
    
    finishRequest(response, request);
    
    [NetManager sendRequest:request
        finishRequest:^(id responseDic, RequestModel *requestDic) {
          //调用解析
          ResponseModel *response = [factory parseResponse:responseDic
                                  RequestModel:request
                                   isLoadCache:NO];
          finishRequest(response, requestDic);
          //存储
          [CacheManager writeCacheData:responseDic Request:request];
        }
        failRequest:^(NSError *error, RequestModel *requestDic) {
          failRequest(error, requestDic);
        }];

  } break;
  default:
    break;
  }
}

+ (BOOL)deleteCacheFileByDeleteTime:(NSString *)time {
  return [CacheManager deleteCacheFileByDeleteTime:time];
}
+ (BOOL)deleteCacheFileByPath:(NSString *)filePath {
  return [CacheManager deleteCacheFileByPath:filePath];
}
- (BOOL)deleteCacheFileByRequest:(RequestModel *)requestDic {
  //文件名称
  [requestDic setFileName:[self fileNameByRequest:requestDic]];
  
  return [CacheManager deleteCacheFileByRequest:requestDic];
}
+ (BOOL)compareResponse:(id)cacheData WithResponse:(id)netData {
  NSData *cdata = [NSJSONSerialization dataWithJSONObject:cacheData options:NSJSONWritingPrettyPrinted error:nil];
  NSData *ndata = [NSJSONSerialization dataWithJSONObject:netData options:NSJSONWritingPrettyPrinted error:nil];
  
  if ([cdata isEqualToData:ndata]) {
    return YES;
  }
  return NO;
}

#pragma mark - pravite
- (NSString *)fileNameByRequest:(RequestModel *)request {
  if (self.managerDelegate &&
      [self.managerDelegate respondsToSelector:@selector(fileNameByRequest:)]) {
    return [self.managerDelegate fileNameByRequest:request];
  }
  return nil;
}

@end
