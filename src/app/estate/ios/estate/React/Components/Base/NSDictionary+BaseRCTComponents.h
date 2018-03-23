//
//  NSDictionary+BaseRCTComponents.h
//  soul
//
//  Created by soul on 2018/3/22.
//  Copyright © 2018年 Soul. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NSDictionary (BaseRCTComponents)

@end
// 请求数据对象
@interface NSDictionary(BaseRCTComponentsRequest)

// 合法的数据格式为 {"caller":"soulrn","name":"version","ver":"1.0","data":{}}}
/**
 校验是否是合法调用
 
 @return YES:合法 NO: 不合法
 */
- (BOOL)isValidCallData;

/**
 校验是否是合法API
 
 @return YES:合法 NO: 不合法
 */
- (BOOL)isValidCallApi;

/**
 获取调用的api 名
 
 @return API名
 */
- (NSString*) getCallName;

// api的版本信息
- (NSString*) getVersion;

// 调用者 这里必须是 soulrn
- (NSString*) getCaller;

// 数据对象，这个与业务相关，但必须是字典对象，不支持其它类型的对象
- (NSDictionary*) getCallData;

/**
 返回字符串类型数据
 
 @param key 数据key
 @return 数据值，没有找到返回nil
 */
- (NSString*) stringValueByKey:(NSString*)key;

/**
 返回字符串类型数据
 
 @param key 数据key
 @param defaultValue 找不到时的默认值
 @return 数据值，没有找到返回defaultValue值
 */
- (NSString*) stringValueByKey:(NSString*)key defaultValue:(NSString*)value;

/**
 返回NSInteger类型数据
 
 @param key 数据key
 @return 数据值
 */
- (NSInteger) integerValueByKey:(NSString*)key;

/**
 返回NSInteger类型数据
 
 @param key 数据key
 @param defaultValue 找不到时的默认值
 @return 数据值，没有找到返回defaultValue值
 */
- (NSInteger) integerValueByKey:(NSString*)key defaultValue:(NSInteger)value;

@end

// 返回数据对象
@interface NSDictionary(BaseRCTComponentsResponse)

/**
 防止非法数据，字符串类型数据
 
 @param value 输入值
 @param defaultValue 不合法是的默认值，
 @return 合法的数据
 */
- (NSString*)safeV:(NSString*)value d:(NSString*)defaultValue;

/**
 防止非法数据，字典类型数据
 
 @param value 输入值
 @param defaultValue 不合法是的默认值，
 @return 合法的数据
 */
- (NSDictionary*)safeVD:(NSDictionary*)value d:(NSDictionary*)defaultValue;

// 出现错误时返回数据标准格式 {code:xxx,msg:xxx}
- (NSDictionary*)errorResponseCode:(NSString*)code message:(NSString*)msg;
// 执行成功后的标准返回格式,默认code >= 0 为成功 {code:xxx,msg:xxx,data:xxx}
- (NSDictionary*)successedResponseCode:(NSString*)code message:(NSString*)msg data:(NSDictionary*)data;
/**
 非法调用默认返回
 
 @return 非法调用返回对象
 */
- (NSDictionary*)errorResponseInvalidCall;

/**
 未支持调用默认返回
 
 @return 非法调用返回对象
 */
- (NSDictionary*)errorResponseNotFound;

/**
 参数错误默认返回
 
 @return 非法调用返回对象
 */
- (NSDictionary*)errorResponseInvalidParameter;

/**
 校验是否是合法
 
 @return YES:合法 NO: 不合法
 */
- (BOOL)isValidResponseData;
/**
 校验是否是错误
 
 @return YES:合法 NO: 不合法
 */
- (BOOL) isError;

/**
 获取返回code值
 
 @return code值，类型不对就返回nil
 */
- (NSString*) getCode;
/**
 获取返回msg值
 
 @return msg值，类型不对就返回nil
 */
- (NSString*) getMsg;
@end

@interface NSObject(BaseRCTComponentsRequest)

/**
 校验是否是合法调用
 
 @return YES:合法 NO: 不合法
 */
- (BOOL)isValidCall;

/**
 校验是否是合法返回
 
 @return YES:合法 NO: 不合法
 */
- (BOOL)isValidResponse;
@end
