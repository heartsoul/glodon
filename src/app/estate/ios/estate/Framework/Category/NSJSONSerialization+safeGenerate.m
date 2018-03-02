//
//  NSJSONSerialization+safeGenerate.m
//  NSJSONSerializationSafe
//
//  Created by lsx on 15/9/23.
// Copyright (c) 2017年 soul. All rights reserved.
//

#import "NSJSONSerialization+safeGenerate.h"

@implementation NSJSONSerialization  (SafeGenerate)


+(id)SafeJSONObjectWithData:(NSData *)data options:(NSJSONReadingOptions)opt error:(NSError *__autoreleasing *)error{
    
    if (!data) {
        return [self SafeJSONObjectWithData:[@"" dataUsingEncoding:NSUTF8StringEncoding] options:opt error:error];
    }else{
        return [self SafeJSONObjectWithData:data options:opt error:error];
    }
}

+ (NSData *)SafedataWithJSONObject:(id)obj options:(NSJSONWritingOptions)opt error:(NSError **)error{
    
    if (!obj) {
        return [self SafedataWithJSONObject:@{} options:opt error:error];
    }else{
        return [self SafedataWithJSONObject:obj options:opt error:error];
    }

}

@end
