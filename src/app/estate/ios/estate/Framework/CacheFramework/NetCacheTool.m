//
//  NetCacheTool.m
//  NetFramework
//
//  Created by banwj on 16/5/31.
//  Copyright © 2017年 soul. All rights reserved.
//

#import <CommonCrypto/CommonDigest.h>
#import "NetCacheTool.h"

@implementation NetCacheTool
+ (void)parameterUrlEncoding:(NSMutableDictionary *)parameterDic {
  NSCharacterSet *characterSet = [[NSCharacterSet
      characterSetWithCharactersInString:@":/?&=;+!@#$()',*"] invertedSet];
  NSArray *keys = parameterDic.allKeys;
  for (NSString *key in keys) {
    NSString *value = [parameterDic objectForKey:key];
    NSString *valueEncode =
        [value stringByAddingPercentEncodingWithAllowedCharacters:characterSet];
    [parameterDic setObject:valueEncode forKey:key];
  }
}
+ (NSString *)serializeParams:(NSDictionary *)params {
  NSMutableArray *array1 = [NSMutableArray array];
  for (NSString *key in [params allKeys]) {
    [array1 addObject:[NSString stringWithFormat:@"%@=%@", key,
                                                 [params objectForKey:key]]];
  }
  NSString *joinedString = [array1 componentsJoinedByString:@"&"];
  return joinedString;
}

+ (NSString *)md5HexDigest:(NSString *)input {
  const char *str = [input UTF8String];
  unsigned char result[CC_MD5_DIGEST_LENGTH];
  CC_MD5(str, (CC_LONG)strlen(str), result);
  NSMutableString *ret =
      [NSMutableString stringWithCapacity:CC_MD5_DIGEST_LENGTH];

  for (int i = 0; i < CC_MD5_DIGEST_LENGTH; i++) {
    [ret appendFormat:@"%02X", result[i]];
  }
  return ret;
}
+ (NSString *)dictionaryToJson:(NSDictionary *)dic {
  if (!dic) {
    return nil;
  }
  NSError *parseError = nil;
  NSData *jsonData =
      [NSJSONSerialization dataWithJSONObject:dic
                                      options:NSJSONWritingPrettyPrinted
                                        error:&parseError];
  return [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
}
+ (NSString *)getTimeStampFromTimeDate:(NSDate *)date {
  NSString *timeSp =
      [NSString stringWithFormat:@"%lu", (long)[date timeIntervalSince1970]];
  return timeSp;
}
@end
