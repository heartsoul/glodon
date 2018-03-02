//
//  NSJSONSerialization+safeGenerate.h
//  NSJSONSerializationSafe
//
//  Created by lsx on 15/9/23.
// Copyright (c) 2017年 soul. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NSJSONSerialization  (SafeGenerate)
+(id)SafeJSONObjectWithData:(NSData *)data options:(NSJSONReadingOptions)opt error:(NSError *__autoreleasing *)error;
+ (NSData *)SafedataWithJSONObject:(id)obj options:(NSJSONWritingOptions)opt error:(NSError **)error;

@end
