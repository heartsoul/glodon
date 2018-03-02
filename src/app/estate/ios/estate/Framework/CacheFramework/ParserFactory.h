//
//  ParserFactory.h
//  NetFramework
//
//  Created by banwj on 16/6/1.
//  Copyright © 2017年 soul. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ParserStyle.h"
#import "LoadCacheType.h"

@class ResponseModel, RequestModel;
@interface ParserFactory : NSObject
/**
 *  解析类型
 *  如果为 ParserCustomStyle 可以重写 parseCustomResponse:RequestModel:isLoadCache: 方法 来自定义返回数据格式
 */
@property(nonatomic, readonly) ParserStyle parserStyle;
/**
 *  初始化
 *
 *  @param type  解析数据类型
 *
 *  @return <#return value description#>
 */
- (instancetype)initWithType:(ParserStyle)type;
- (ResponseModel *)parseResponse:(NSData *)data
                    RequestModel:(RequestModel *)Request
                     isLoadCache:(BOOL)flag;
/**
 *  自定义解析
 *
 *  @param data    请求返回的数据、或者缓存的数据
 *  @param Request 本次请求的参数
 *  @param flag    是否是本地缓存
 *
 *  @return <#return value description#>
 */
- (ResponseModel *)parseCustomResponse:(NSData *)data
                          RequestModel:(RequestModel *)Request
                           isLoadCache:(BOOL)flag;
@end
