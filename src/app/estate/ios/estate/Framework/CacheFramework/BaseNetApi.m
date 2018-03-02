//
//  BaseNetApi.m
//  PRM
//
//  Created by soul on 2017/9/1.
//  Copyright © 2017年 Soul. All rights reserved.
//

#import "BaseNetApi.h"

NSNotificationName const NetApiBaseErrorNotification = @"__net_api_base_error_notification";

NSRequestParameterName const kRPNParameters = @"parameters";
NSRequestParameterName const kRPNUrl = @"url";
NSRequestParameterName const kRPNPath = @"path";
NSRequestParameterName const kRPNContentEncoding = @"Content-Encoding";
NSRequestParameterName const kRPNTimeout = @"Timeout";
NSRequestParameterName const kRPNKeepSilent = @"keepsilent";
NSRequestParameterName const kRPNFileArr = @"fileArr";
NSRequestParameterName const kRPNDataArr = @"dataArr";;
NSRequestParameterName const kRPNAuthorization = @"Authorization";

NSRequestParameterName const kRPNErrorDomain = @"soul.net.api";
NSRequestParameterName const kRPNErrorTipLevel = @"tip_level";
NSRequestParameterName const kRPNErrorCode = @"error_code";
NSRequestParameterName const kRPNErrorDescription = @"error_description";

NSRequestParameterName const kRPNApiDelegate = @"api_delegate";

NSRequestParameterName const kRPNApiDelegateUpdateNotice = @"ap_delegate_update_notice";

// 对参数值进行安全处理，统一转换成为字符串。
NSString * safeValue(id data) {
    if(data == nil) {
        return @"";
    }
    if ([data isKindOfClass:[NSString class]]) {
        return data;
    }
    return [NSString stringWithFormat:@"%@", data];
}

@implementation BaseNetApi

+ (void)sendJsonWithRequest:(RequestModel *)request ParserFactory:(ParserFactory *)factory cacheType:(LoadCacheType)type finishRequest:(FinishRequestBlock)finishRequest failRequest:(FailedRequestBlock)failRequest {
    // 网络请求对象
    NetCacheManager *manager = [[NetCacheManager alloc] init];
    manager.managerDelegate = request.managerDelegate;
    // 发起请求调用
    [manager loadDataWithRequest:request parseFactory:factory loadCacheType:type finishRequest:^(ResponseModel *responseModel, RequestModel *requestModel) {
        BOOL isCache = responseModel.isCacheData;
        if (finishRequest) {
            finishRequest(responseModel, requestModel, isCache);
        }
        
    }failRequest:^(NSError *error, RequestModel *requestModel) {
        if (failRequest) {
            failRequest(error, requestModel, NO);
        }
        
    }];
}

+ (NSError *)reportErrorToUser:(ResponseErrorModel *)errorInfoDic {
    [[NSNotificationCenter defaultCenter] postNotificationName:NetApiBaseErrorNotification object:errorInfoDic];
    NSError *error = [NSError errorWithDomain:CustomErrorDomain
                                         code:CustomDefultFailed
                                     userInfo:errorInfoDic.toJsonObject];
    return error;
}

@end
