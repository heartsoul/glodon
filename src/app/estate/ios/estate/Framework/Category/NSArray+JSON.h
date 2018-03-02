//
//  NSArray+JSON.h
//  CKBaseFramework
//
//  Created by soul on 2017/3/6.
//  Copyright © 2017年 soul. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NSArray (JSON)
// 转成JSON字符串
- (NSString*)toJsonString;
// 两个对象比较，通过二者转成的json字符串来比较
- (BOOL)isEqualWithOther:(NSArray*)other;
@end
