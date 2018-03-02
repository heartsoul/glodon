//
//  NSDictionary+KeyValue.h
//  PRM
//
//  Created by soul on 2017/9/13.
//  Copyright © 2017年 Glodon Inc. . All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NSDictionary (KeyValue)

/**
 获取key

 @return key值
 */
- (NSString*)getKey;

/**
 获取value

 @return value值
 */
- (NSString*)getValue;
@end
