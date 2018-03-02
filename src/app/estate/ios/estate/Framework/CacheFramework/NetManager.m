//
//  NetManager.m
//  NetFramework
//
//  Created by banwj on 16/5/31.
//  Copyright © 2017年 soul. All rights reserved.
//

#import "NetManager.h"

#import "NSData+Compression.h"
#import "NetCacheTool.h"

#import "DataModel.h"
#import "RequestModel.h"
#import "AFNetworking.h"


@implementation NetManager

/**
 向服务器发送数据请求，支持上传附件
 @param requestModel 请求参数对象
 @param finishRequest 成功返回block
 @param failRequest 失败返回block
 */
+ (void)postJSONRequestQueue:(RequestModel *)requestModel
               finishRequest:(FinishRequestBlock)finishRequest
                 failRequest:(FailedRequestBlock)failRequest {
    NSString *url = requestModel.url;
    NSString *path = requestModel.path;
    NSArray *fileDataArray = requestModel.fileArray;
    NSString *ContentEncoding = requestModel.contentEncoding;
    NSString *Timeout = requestModel.timeout;
    id parameters = requestModel.requestParameter;
    
    NSMutableDictionary *theDictionary =
    [NSMutableDictionary dictionaryWithDictionary:parameters];
    
    NSDictionary *theDic = theDictionary;
    //此时上传需要Gzip 不传普通的参数形式 , 传gzip压缩的httpbody
    if ([ContentEncoding isEqualToString:@"gzip"]) {
        theDic = nil;
        [NetCacheTool parameterUrlEncoding:theDictionary];
    }
    
    AFHTTPSessionManager *mgr = [AFHTTPSessionManager manager];
    
    mgr.responseSerializer = [AFHTTPResponseSerializer serializer];
    
    NSMutableURLRequest *request = [[AFHTTPRequestSerializer serializer]
                                    multipartFormRequestWithMethod:@"POST"
                                    URLString:[NSString
                                               stringWithFormat:@"%@%@", url, path]
                                    parameters:theDic
                                    constructingBodyWithBlock:^(id<AFMultipartFormData> formData) {
                                        
                                        for (DataModel *fileDataModel in fileDataArray) {
                                            if ([fileDataModel isKindOfClass:[FileDataModel class]]) {
                                                FileDataModel *model = (FileDataModel *)fileDataModel;
                                                [formData appendPartWithFileData:model.data
                                                                            name:model.name
                                                                        fileName:model.fileName
                                                                        mimeType:model.mimeType];
                                            } else if ([fileDataModel isKindOfClass:[DataModel class]]) {
                                                [formData appendPartWithFormData:fileDataModel.data
                                                                            name:fileDataModel.name];
                                            }
                                        }
                                    }
                                    error:nil];
    
    [request addValue:@"gzip" forHTTPHeaderField:@"Accept-Encoding"];
    [request setCachePolicy:NSURLRequestReloadIgnoringLocalCacheData];
    
    //此时上传需要Gzip
    if ([ContentEncoding isEqualToString:@"gzip"]) {
        //压缩httpbody
        NSData *gzipData = [[NetCacheTool serializeParams:theDictionary]
                            dataUsingEncoding:NSUTF8StringEncoding];
        gzipData = [gzipData gzipDeflate];
        
        //让服务器识别
        [request addValue:@"gzip" forHTTPHeaderField:@"Content-Encoding"];
        [request setHTTPBody:gzipData];
    }
    
    if ([Timeout length]) {
        [request setTimeoutInterval:[Timeout integerValue]];
    } else {
        //如果有附件，超时设置30min
        if ([fileDataArray count]) {
            [request setTimeoutInterval:30 * 60];
        } else {
            [request setTimeoutInterval:15];
        }
    }
    if (requestModel.securityPolicy) {
        [mgr setSecurityPolicy:requestModel.securityPolicy];
    }
    __block NSURLSessionDataTask *task = [mgr dataTaskWithRequest:request completionHandler:^(NSURLResponse * _Nonnull response, id  _Nullable responseObject, NSError * _Nullable error) {
        if (error) {
            failRequest(error, requestModel);
            return ;
        }
        NSData *data = (NSData *)responseObject;
        if (data.length <= 0) {
            NSDictionary *userInfo =
            [NSDictionary dictionaryWithObject:@"Error, data length = 0"
                                        forKey:NSLocalizedDescriptionKey];
            NSError *error = [NSError errorWithDomain:CustomErrorDomain
                                                 code:CustomDefultFailed
                                             userInfo:userInfo];
            failRequest(error, requestModel);
            return;
        }
        finishRequest(data, requestModel);
        
    }];
    
    [task resume];
    
    
}

/**
 向服务器发送数据请求
 @param requestModel 请求参数对象
 @param finishRequest 成功返回block
 @param failRequest 失败返回block
 */
+ (void)sendRequest:(RequestModel *)requestModel
               finishRequest:(FinishRequestBlock)finishRequest
                 failRequest:(FailedRequestBlock)failRequest {
    switch (requestModel.requestParameterType) {
        case NSRequestParameterTypeHttp:
        {
            [[self class] sendHttpRequest:requestModel finishRequest:finishRequest failRequest:failRequest];
        }
            break;
         case NSRequestParameterTypeJson:
        {
            [[self class] sendJsonRequest:requestModel finishRequest:finishRequest failRequest:failRequest];
        }
            break;
        default:
            break;
    }
}
/**
 向服务器发送数据请求
 @param requestModel 请求参数对象
 @param finishRequest 成功返回block
 @param failRequest 失败返回block
 */
+ (void)sendJsonRequest:(RequestModel *)requestModel
             finishRequest:(FinishRequestBlock)finishRequest
               failRequest:(FailedRequestBlock)failRequest {
  NSString *url = requestModel.url;
  NSString *path = requestModel.path;
//  NSString *ContentEncoding = requestModel.contentEncoding;
  NSString *Timeout = requestModel.timeout;
  id parameters = requestModel.requestParameter;



  NSDictionary *theDic = parameters;
 
  AFHTTPSessionManager *mgr = [AFHTTPSessionManager manager];
  
  mgr.responseSerializer = [AFHTTPResponseSerializer serializer];
    NSMutableURLRequest * request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:[NSString
                                                                          stringWithFormat:@"%@%@", url, path]]];
  [request setHTTPMethod:requestModel.requestMethod];

  [request addValue:@"gzip" forHTTPHeaderField:@"Accept-Encoding"];
  [request setCachePolicy:NSURLRequestReloadIgnoringLocalCacheData];

  if ([Timeout length]) {
    [request setTimeoutInterval:[Timeout integerValue]];
  } else {
    [request setTimeoutInterval:15];
    
  }
    if (requestModel.securityPolicy) {
        [mgr setSecurityPolicy:requestModel.securityPolicy];
    }
    // 设置http header
    for (NSString * key in requestModel.requestHeader.keyEnumerator) {
        [request setValue:requestModel.requestHeader[key] forHTTPHeaderField:key];
    }
    
    
    NSURLRequest *jsonRequest = [[AFJSONRequestSerializer serializer]
                                    requestBySerializingRequest:request withParameters:theDic error:nil];
    
  __block NSURLSessionDataTask *task = [mgr dataTaskWithRequest:jsonRequest completionHandler:^(NSURLResponse * _Nonnull response, id  _Nullable responseObject, NSError * _Nullable error) {
    if (error) {
      failRequest(error, requestModel);
      return ;
    }
//      //转换NSURLResponse成为HTTPResponse
//      NSHTTPURLResponse *HTTPResponse = (NSHTTPURLResponse *)response;
//      //获取headerfields
//      NSDictionary *fields = [HTTPResponse allHeaderFields];//原生NSURLConnection写法
//      // NSDictionary *fields = [operation.response allHeaderFields]; //afnetworking写法
//      NSLog(@"fields = %@",[fields description]);
//      
//      //获取cookie方法1
//      // NSArray *cookies = [NSHTTPCookie cookiesWithResponseHeaderFields:fields forURL:url];
//      //获取cookie方法2
//      NSString *cookieString = [[HTTPResponse allHeaderFields] valueForKey:@"Set-Cookie"];
//      NSLog(@"cookie%@", cookieString);
//      //获取cookie方法3
//      NSHTTPCookieStorage *cookieJar = [NSHTTPCookieStorage sharedHTTPCookieStorage];
//      for (NSHTTPCookie *cookie in [cookieJar cookies]) {
//          NSLog(@"cookie%@", cookie);
//      }
    NSData *data = (NSData *)responseObject;
    if (data.length <= 0) {
      NSDictionary *userInfo =
      [NSDictionary dictionaryWithObject:@"Error, data length = 0"
                                  forKey:NSLocalizedDescriptionKey];
      NSError *error = [NSError errorWithDomain:CustomErrorDomain
                                           code:CustomDefultFailed
                                       userInfo:userInfo];
      failRequest(error, requestModel);
      return;
    }
    finishRequest(data, requestModel);

  }];

  [task resume];
  
}


/**
 向服务器发送http格式数据请求
 @param requestModel 请求参数对象
 @param finishRequest 成功返回block
 @param failRequest 失败返回block
 */
+ (void)sendHttpRequest:(RequestModel *)requestModel
               finishRequest:(FinishRequestBlock)finishRequest
                 failRequest:(FailedRequestBlock)failRequest {
    NSString *url = requestModel.url;
    NSString *path = requestModel.path;
    NSString *ContentEncoding = requestModel.contentEncoding;
    NSString *Timeout = requestModel.timeout;
    id parameters = requestModel.requestParameter;
    
    NSMutableDictionary *theDictionary =
    [NSMutableDictionary dictionaryWithDictionary:parameters];
    
    NSDictionary *theDic = theDictionary;
    //此时上传需要Gzip 不传普通的参数形式 , 传gzip压缩的httpbody
    if ([ContentEncoding isEqualToString:@"gzip"]) {
        theDic = nil;
        [NetCacheTool parameterUrlEncoding:theDictionary];
    }
    
    AFHTTPSessionManager *mgr = [AFHTTPSessionManager manager];
    
    mgr.responseSerializer = [AFHTTPResponseSerializer serializer];
    NSMutableURLRequest * request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:[NSString
                                                                                              stringWithFormat:@"%@%@", url, path]]];
    [request setHTTPMethod:requestModel.requestMethod];
    
    [request addValue:@"gzip" forHTTPHeaderField:@"Accept-Encoding"];
    [request setCachePolicy:NSURLRequestReloadIgnoringLocalCacheData];
    
    if ([Timeout length]) {
        [request setTimeoutInterval:[Timeout integerValue]];
    } else {
        [request setTimeoutInterval:15];
        
    }
    if (requestModel.securityPolicy) {
        [mgr setSecurityPolicy:requestModel.securityPolicy];
    }
    // 设置http header
    for (NSString * key in requestModel.requestHeader.keyEnumerator) {
        [request setValue:requestModel.requestHeader[key] forHTTPHeaderField:key];
    }
    
    
    NSURLRequest *jsonRequest = [[AFHTTPRequestSerializer serializer]
                                 requestBySerializingRequest:request withParameters:theDic error:nil];
    
    __block NSURLSessionDataTask *task = [mgr dataTaskWithRequest:jsonRequest completionHandler:^(NSURLResponse * _Nonnull response, id  _Nullable responseObject, NSError * _Nullable error) {
        if (error) {
            failRequest(error, requestModel);
            return ;
        }
        NSData *data = (NSData *)responseObject;
        if (data.length <= 0) {
            NSDictionary *userInfo =
            [NSDictionary dictionaryWithObject:@"Error, data length = 0"
                                        forKey:NSLocalizedDescriptionKey];
            NSError *error = [NSError errorWithDomain:CustomErrorDomain
                                                 code:CustomDefultFailed
                                             userInfo:userInfo];
            failRequest(error, requestModel);
            return;
        }
        finishRequest(data, requestModel);
        
    }];
    
    [task resume];
}
@end
