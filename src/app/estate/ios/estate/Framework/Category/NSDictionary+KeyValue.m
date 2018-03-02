//
//  NSDictionary+KeyValue.m
//  PRM
//
//  Created by soul on 2017/9/13.
//  Copyright © 2017年 Glodon Inc. . All rights reserved.
//

#import "NSDictionary+KeyValue.h"
#import "NSDictionary+getValue.h"
@implementation NSDictionary (KeyValue)

/**
 获取key
 
 @return key值
 */
- (NSString*)getKey {
    return [self objectForKey:@"key"];
}

/**
 获取value
 
 @return value值
 */
- (NSString*)getValue {
    return [self objectForKey:@"value"];
}
@end
