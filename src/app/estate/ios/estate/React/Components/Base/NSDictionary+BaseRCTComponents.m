//
//  NSDictionary+BaseRCTComponents.m
//  estate
//
//  Created by glodon on 2018/3/22.
//  Copyright © 2018年 Glodon. All rights reserved.
//

#import "NSDictionary+BaseRCTComponents.h"

@implementation NSDictionary (BaseRCTComponents)

@end
// 数据调用相关操作
@implementation NSDictionary(BaseRCTComponentsRequest)

// 合法的数据格式为 {"caller":"soulrn","name":"version","ver":"1.0","data":{}}}
/**
 校验是否是合法调用

 @return YES:合法 NO: 不合法
 */
- (BOOL)isValidCallData {
  NSString * caller = [self getCaller];
  NSString * callName = [self getCallName];
  NSDictionary * callData = [self getCallData];
  if ([caller isKindOfClass:[NSString class]] && [callName isKindOfClass:[NSString class]] && [callData isKindOfClass:[NSDictionary class]]) {
    return [@"soulrn" isEqualToString:caller]; // 唯一标识
  }
  return NO;
}

/**
 校验是否是合法API
 
 @return YES:合法 NO: 不合法
 */
- (BOOL)isValidCallApi {
  return YES;
}

/**
 获取调用的api 名

 @return API名
 */
- (NSString*) getCallName {
  NSString* ret = [self objectForKey:@"name"];
  if (![ret isKindOfClass:[NSString class]]) {
    return nil;
  }
  return ret;
}

// api的版本信息
- (NSString*) getVersion {
  NSString* ret = [self objectForKey:@"ver"];
  if (![ret isKindOfClass:[NSString class]]) {
    return nil;
  }
  return ret;
}

// 调用者 这里必须是 soulrn
- (NSString*) getCaller {
  NSString* ret = [self objectForKey:@"caller"];
  if (![ret isKindOfClass:[NSString class]]) {
    return nil;
  }
  return ret;
}

// 数据对象，这个与业务相关，但必须是字典对象，不支持其它类型的对象
- (NSDictionary*) getCallData {
  NSDictionary* ret = [self objectForKey:@"data"];
  if (![ret isKindOfClass:[NSDictionary class]]) {
    return nil;
  }
  return ret;
}

/**
 返回字符串类型数据

 @param key 数据key
 @return 数据值，没有找到返回nil
 */
- (NSString*) stringValueByKey:(NSString*)key {
  return [self stringValueByKey:key defaultValue:nil];
}
/**
 返回字符串类型数据
 
 @param key 数据key
 @param defaultValue 找不到时的默认值
 @return 数据值，没有找到返回defaultValue值
 */
- (NSString*) stringValueByKey:(NSString*)key defaultValue:(NSString*)value {
  NSString* ret = [self objectForKey:key];
  if (![ret isKindOfClass:[NSString class]]) {
    return value;
  }
  return ret;
}

/**
 返回NSInteger类型数据
 
 @param key 数据key
 @return 数据值
*/
- (NSInteger) integerValueByKey:(NSString*)key {
  return [self stringValueByKey:key defaultValue:nil].integerValue;
}

/**
 返回NSInteger类型数据
 
 @param key 数据key
 @param defaultValue 找不到时的默认值
 @return 数据值，没有找到返回defaultValue值
 */
- (NSInteger) integerValueByKey:(NSString*)key defaultValue:(NSInteger)value {
  return [self stringValueByKey:key defaultValue:[NSString stringWithFormat:@"%@",@(value)]].integerValue;
}

@end

// 返回数据相关操作
@implementation NSDictionary(BaseRCTComponentsResponse)


/**
 防止非法数据，字符串类型数据

 @param value 输入值
 @param defaultValue 不合法是的默认值，
 @return 合法的数据
 */
- (NSString*)safeV:(NSString*)value d:(NSString*)defaultValue{
  if (value == nil || ![value isKindOfClass:[NSString class]]) {
    return defaultValue;
  }
  return value;
}

/**
 防止非法数据，字典类型数据
 
 @param value 输入值
 @param defaultValue 不合法是的默认值，
 @return 合法的数据
 */
- (NSDictionary*)safeVD:(NSDictionary*)value d:(NSDictionary*)defaultValue{
  if (value == nil || ![value isKindOfClass:[NSDictionary class]]) {
    return @{};
  }
  return value;
}

// 出现错误时返回数据标准格式 {code:xxx,msg:xxx}
- (NSDictionary*)errorResponseCode:(NSString*)code message:(NSString*)msg {
  return @{@"code":[self safeV:code d:@"0"], @"msg":[self safeV:msg d:@""]};
}
// 执行成功后的标准返回格式,默认code >= 0 为成功 {code:xxx,msg:xxx,data:xxx}
- (NSDictionary*)successedResponseCode:(NSString*)code message:(NSString*)msg data:(NSDictionary*)data {
  return @{@"code":[self safeV:code d:@"0"], @"msg":[self safeV:msg d:@""], @"data":[self safeVD:data d:@{}]};
}

/**
 非法调用默认返回

 @return 非法调用返回对象
 */
- (NSDictionary*)errorResponseInvalidCall {
  return [self errorResponseCode:@"-1000" message:@"非法调用"];
}

/**
 未支持调用默认返回
 
 @return 非法调用返回对象
 */
- (NSDictionary*)errorResponseNotFound {
  return [self errorResponseCode:@"-1001" message:@"暂未支持功能"];
}

/**
 参数错误默认返回
 
 @return 非法调用返回对象
 */
- (NSDictionary*)errorResponseInvalidParameter {
  return [self errorResponseCode:@"-1002" message:@"参数错误"];
}

/**
 校验是否是合法
 
 @return YES:合法 NO: 不合法
 */
- (BOOL)isValidResponseData {
  NSString * code = [self getCode];
  NSString * msg = [self getMsg];
  NSDictionary * callData = [self getCallData];
  if ([code isKindOfClass:[NSString class]] && [msg isKindOfClass:[NSString class]] && [callData isKindOfClass:[NSDictionary class]]) {
    return YES; //
  }
  return NO;
}
/**
 校验是否是错误
 
 @return YES:合法 NO: 不合法
 */
- (BOOL) isError {
  return [self getCode].integerValue < 0;
}

/**
 获取返回code值
 
 @return code值，类型不对就返回nil
 */
- (NSString*) getCode {
  NSString* ret = [self objectForKey:@"code"];
  if (![ret isKindOfClass:[NSString class]]) {
    return nil;
  }
  return ret;
}

/**
 获取返回msg值
 
 @return msg值，类型不对就返回nil
 */
- (NSString*) getMsg {
  NSString* ret = [self objectForKey:@"msg"];
  if (![ret isKindOfClass:[NSString class]]) {
    return nil;
  }
  return ret;
}

@end

@implementation NSObject(BaseRCTComponentsRequest)

/**
 校验是否是合法调用
 
 @return YES:合法 NO: 不合法
 */
- (BOOL)isValidCall {
  if(![self isKindOfClass:[NSDictionary class]]) {
    return NO;
  }
  NSDictionary * callData = (NSDictionary*)self;
  return [callData isValidCallData];
}

/**
 校验是否是合法返回
 
 @return YES:合法 NO: 不合法
 */
- (BOOL)isValidResponse {
  if(![self isKindOfClass:[NSDictionary class]]) {
    return NO;
  }
  NSDictionary * callData = (NSDictionary*)self;
  return [callData isValidResponseData];
}
@end
