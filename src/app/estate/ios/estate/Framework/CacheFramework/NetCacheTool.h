//
//  NetCacheTool.h
//  NetFramework
//
//  Created by banwj on 16/5/31.
//  Copyright © 2017年 soul. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NetCacheTool : NSObject
/**
 *  对字典值进行去除 :/?&=;+!@#$()',* 的编码转换
 *
 *  @param parameterDic 源字典
 */
+ (void)parameterUrlEncoding:(NSMutableDictionary *)parameterDic;
/**
 *  字典转json串 键之间用 & 符分割
 *
 *  @param params 源字典
 *
 *  @return json字符串
 */
+ (NSString *)serializeParams:(NSDictionary *)params;
/**
 *  md5加密
 *
 *  @param input <#input description#>
 *
 *  @return 16位的md5值
 */
+ (NSString *)md5HexDigest:(NSString *)input;
/**
 *  将字典转换成json字符串
 *
 *  @param dic <#dic description#>
 *
 *  @return <#return value description#>
 */
+ (NSString *)dictionaryToJson:(NSDictionary *)dic;
/**
 *  转为时间戳
 *
 *  @param date <#date description#>
 *
 *  @return <#return value description#>
 */
+ (NSString *)getTimeStampFromTimeDate:(NSDate *)date;
@end
