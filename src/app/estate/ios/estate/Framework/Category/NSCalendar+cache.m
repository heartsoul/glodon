//
//  NSCalendar+cache.m
//  CKBaseFramework
//
//  Created by soul on 2017/2/14.
//  Copyright © 2017年 soul. All rights reserved.
//

#import "NSCalendar+cache.h"

@implementation NSCalendar (cache)
+ (instancetype) shareInstance {
  static NSCalendar* ret;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    ret = [[NSCalendar alloc] initWithCalendarIdentifier:NSCalendarIdentifierGregorian];
  });
  return ret;
}
@end
