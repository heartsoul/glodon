//
//  NSDictionary+getValue.m
//  tesn
//
//  Created by soul on 14-10-21.
//  Copyright (c) 2017年 soul. All rights reserved.
//

#import "NSDictionary+getValue.h"
#ifndef __NSDictionary_getValue_m__
#define __NSDictionary_getValue_m__

@implementation NSDictionary (getValue)
-(int) intValue:(int)defaultValue key:(NSString*)key{
  
  id ret = [self objectForKey:key];
  if (ret == nil || [ret isKindOfClass:[NSNull class]]) {
    return defaultValue;
  }
  NSString * data = [NSString stringWithFormat:@"%@",ret];
  return  data.intValue;
}
-(NSInteger) integerValue:(NSInteger)defaultValue key:(NSString*)key{
  id ret = [self objectForKey:key];
  if (ret == nil || [ret isKindOfClass:[NSNull class]]) {
    return defaultValue;
  }
  NSString * data = [NSString stringWithFormat:@"%@",ret];
  return  data.integerValue;
}
-(NSString*) stringValueDefault:(NSString*)defaultValue key:(NSString*)key{
  id ret = [self objectForKey:key];
  if (ret == nil || [ret isKindOfClass:[NSNull class]]) {
    return defaultValue;
  }
  return [NSString stringWithFormat:@"%@",ret];
}

-(NSInteger) bundleIntegerValueDefault:(NSInteger)defaultValue  key:(NSString*)key{
  NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
  return  [infoDictionary integerValue:defaultValue key:key];
}

-(NSString*) bundleValueDefault:(NSString*)defaultValue  key:(NSString*)key{
  NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
  NSString *bundleValue = [infoDictionary stringValueDefault:defaultValue key:key];
  return bundleValue;
}

@end

#endif //#define __NSDictionary_getValue_m__
