//
//  NetManager.h
//  NetFramework
//
//  Created by banwj on 16/5/31.
//  Copyright © 2017年 soul. All rights reserved.
//

#import <Foundation/Foundation.h>
@class RequestModel;
typedef void (^FinishRequestBlock)(id responseDic, RequestModel *requestDic);
typedef void (^FailedRequestBlock)(NSError *error, RequestModel *requestDic);

@interface NetManager : NSObject

/**
 向服务器发送Json格式数据请求
 @param requestModel 请求参数对象
 @param finishRequest 成功返回block
 @param failRequest 失败返回block
 */
+ (void)sendRequest:(RequestModel *)requestModel
               finishRequest:(FinishRequestBlock)finishRequest
                 failRequest:(FailedRequestBlock)failRequest;
@end
