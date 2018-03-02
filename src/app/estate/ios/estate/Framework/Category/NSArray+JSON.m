//
//  NSArray+JSON.m
//  CKBaseFramework
//
//  Created by soul on 2017/3/6.
//  Copyright © 2017年 soul. All rights reserved.
//

#import "NSArray+JSON.h"
#import <JSONKit.h>
@implementation NSArray (JSON)
- (NSString*)toJsonString {
  if ([NSJSONSerialization isValidJSONObject:self]) {
    NSError *error;
    NSData *data =
    [NSJSONSerialization dataWithJSONObject:self
                                    options:NSJSONWritingPrettyPrinted
                                      error:&error];
    NSString *jsonString =
    [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    return jsonString;
  }
  return [self JSONString];
}

- (BOOL)isEqualWithOther:(NSArray*)other {
  NSString * stringA = [self toJsonString];
  NSString * stringB = [other toJsonString];
  return [stringA isEqualToString:stringB];
}
@end
