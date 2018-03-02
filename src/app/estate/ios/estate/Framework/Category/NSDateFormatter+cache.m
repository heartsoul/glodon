//
//  NSDateFormatter+cache.m
//  CKBaseFramework
//
//  Created by soul on 2017/2/14.
//  Copyright © 2017年 soul. All rights reserved.
//

#import "NSDateFormatter+cache.h"

@implementation NSDateFormatter (cache)
// 创建对象，带有缓存功能
// formatterString 格式化串，同一个串全应用生命周期只会有一个对象
+ (instancetype) instanceWithFormatter:(NSString*)formatterString {
  static NSMutableDictionary * cachedFormaterDictionary;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    cachedFormaterDictionary = [NSMutableDictionary dictionary];
  });
  NSDateFormatter *formatter = [cachedFormaterDictionary objectForKey:formatterString];
  if(formatter) {
    return formatter;
  }
  
  formatter = [[NSDateFormatter alloc] init];
  [formatter setDateStyle:NSDateFormatterMediumStyle];
  [formatter setTimeStyle:NSDateFormatterShortStyle];
  [formatter setDateFormat:formatterString];
  NSTimeZone *timeZone = [NSTimeZone systemTimeZone];
  [formatter setTimeZone:timeZone];
  return formatter;
}

@end
