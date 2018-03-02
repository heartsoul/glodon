//
//  ResponseModel.h
//  NetFramework
//
//  Created by banwj on 16/6/12.
//  Copyright © 2017年 soul. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "BaseModel.h"

typedef enum : NSUInteger {
    ResponseErrorTipLevelFixed = -1,
    ResponseErrorTipLevelIgnore = 0,
    ResponseErrorTipLevelAlert = 1,
    ResponseErrorTipLevelTip = 2,
    ResponseErrorTipLevelSilence = 3,
} ResponseErrorTipLevel;

@class RequestModel;
@interface ResponseModel : BaseModel
/**
 *  请求模型
 */
@property(nonatomic, strong) RequestModel *requestModel;

/**
 *  cookie
 */
@property(nonatomic, assign) NSHTTPCookie* cookie;

/**
 *  是否是缓存数据
 */
@property(nonatomic, assign) BOOL isCacheData;
/**
 *  请求返回的数据（按照ParserFactory数据返回）
 */
@property(nonatomic, strong) id data;

@property(nonatomic, strong) id raw;

/**
 *  业务数据
 */
@property(nonatomic, strong) id bussinessData;

/**
 *  错误等级，可应用于处理提示信息。
 */
@property(nonatomic, strong) NSNumber* tipLevel;

@end
