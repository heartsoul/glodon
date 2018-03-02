//
//  BaseNetApi.h
//  PRM
//
//  Created by soul on 2017/9/1.
//  Copyright © 2017年 Glodon Inc. . All rights reserved.
//

#import <Foundation/Foundation.h>
#import "CacheFramework.h"
#import "WaitViewUtil.h"
// 错误信息通知，包含 ResponseErrorModel 信息
UIKIT_EXTERN NSNotificationName const NetApiBaseErrorNotification;

extern NSRequestParameterName const kRPNParameters; // 业务数据参数
extern NSRequestParameterName const kRPNUrl; // 请求的业务url
extern NSRequestParameterName const kRPNPath; // 请求的服务器地址
extern NSRequestParameterName const kRPNContentEncoding; // 内容编码
extern NSRequestParameterName const kRPNTimeout; // 请求超时时间
extern NSRequestParameterName const kRPNKeepSilent;// 开启静默模式，开始后将不会进行返回结果提示
extern NSRequestParameterName const kRPNCmdDelegate; // 命令请求对象delegate，用于实现随delegate自动释放无用请求，避免无用回调

// output
extern NSRequestParameterName const kRPNErrorDomain; //
extern NSRequestParameterName const kRPNErrorTipLevel; // 错误提示级别，当前的级别有
extern NSRequestParameterName const kRPNErrorCode; // 错误码
extern NSRequestParameterName const kRPNErrorDescription; // 错误描述


typedef void (^FinishCacheRequestBlock)(NSDictionary *responseDic, RequestModel *requestModel, BOOL isCache);
typedef void (^FailedCacheRequestBlock)(NSError *error, RequestModel *requestModel, BOOL isCache);

typedef void (^FinishRequestBlock)(ResponseModel *responseModel, RequestModel *requestModel, BOOL isCache);
typedef void (^FailedRequestBlock)(NSError *error, RequestModel *requestModel, BOOL isCache);
// 对参数值进行安全处理，统一转换成为字符串。
NSString * safeValue(id data);

@interface BaseNetApi : NSObject

+ (void)sendJsonWithRequest:(RequestModel *)request
              ParserFactory:(ParserFactory *)factory
                  cacheType:(LoadCacheType)type
            finishRequest:(FinishRequestBlock)finishRequest
              failRequest:(FailedRequestBlock)failRequest;

+ (NSError *)reportErrorToUser:(ResponseErrorModel *)errorInfoDic;
@end


