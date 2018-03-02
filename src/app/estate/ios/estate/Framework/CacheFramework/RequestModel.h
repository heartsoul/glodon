//
//  RequestModel.h
//  NetFramework
//
//  Created by banwj on 16/5/31.
//  Copyright © 2017年 soul. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AFNetworking.h"
#import "BaseModel.h"

typedef NSString *NSRequestParameterName NS_EXTENSIBLE_STRING_ENUM;

extern const NSRequestParameterName CustomErrorDomain;
extern const NSInteger CustomDefultFailed;

typedef NSString *NSRequestMethodName NS_EXTENSIBLE_STRING_ENUM;

extern const NSRequestMethodName RequestMethodGet;
extern const NSRequestMethodName RequestMethodHead;
extern const NSRequestMethodName RequestMethodPost;
extern const NSRequestMethodName RequestMethodPut;
extern const NSRequestMethodName RequestMethodDelete;

typedef enum : NSUInteger {
    NSRequestParameterTypeHttp = 0,
    NSRequestParameterTypeJson = 1,
    
} NSRequestParameterType;

@protocol NetCacheManagerDelegate;
@class DataModel, NetApiDelegate;
@interface RequestModel : BaseModel

@property(nonatomic, strong) id<NetCacheManagerDelegate> managerDelegate;

/**
 *  http 请求类型
 */
@property(nonatomic, strong) NSRequestParameterName requestMethod; // POST,GET,PUT,DELETE


/**
 *  http 请求数据参数格式
 */
@property(nonatomic, assign) NSRequestParameterType requestParameterType; // 0:普通http表单请求，1:json格式数据请求


/**
 *  发起请求API对象
 */
@property(nonatomic, strong) NetApiDelegate *delegate;
/**
 *  服务地址
 */
@property(nonatomic, strong) NSString *url;
/**
 * 接口名称
 */
@property(nonatomic, strong) NSString *path;
/**
 *  请求RAW数据
 */
@property(nonatomic, strong) NSData * httpBody;
/**
 *  请求参数字典
 */
@property(nonatomic, strong) id requestParameter;

/**
 *  请求头参数
 */
@property(nonatomic, strong) NSMutableDictionary *requestHeader;
/**
 *  其他参数 暂时无用
 */
@property(nonatomic, strong) NSMutableDictionary *otherParameter;
/**
 *  压缩方式 like：gzip
 */
@property(nonatomic, strong) NSString *contentEncoding;
/**
 *  网络超时时间
 */
@property(nonatomic, strong) NSString *timeout;
/**
 *  是否需要加密
 * 默认为 NO  ,如果为YES 则需要实现<NetCacheManagerDelegate>协议
 */
@property(nonatomic, assign) BOOL needSecurity;

/**
 安全策略，通过这个设置HTTPS
 */
@property(nonatomic, strong) AFSecurityPolicy *securityPolicy;
/**
 *  文件上传
 */
@property(nonatomic, strong) NSMutableArray<DataModel *> *fileArray;

/**
 *  此次请求对应的缓存文件名称
 */
@property(nonatomic, strong, readonly) NSString *fileName;

- (void)setFileName:(NSString *)fileName;

- (void)setJSONHttpBody:(NSDictionary*)jsonData;

/**
 请求信息

 @return 请求信息
 */
- (NSString*) requestInfo;
@end
