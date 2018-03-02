//
//  NSString+Unicode.h
//  tesn
//
//  Created by soul on 14/11/25.
//  Copyright (c) 2017年 soul. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NSString (Unicode)
+(NSString*) memoryInfoLogString;
+(void) memoryInfoLog;
// 获取当前设备可用内存(单位：MB）
+ (double)availableMemory;

// 获取当前任务所占用的内存（单位：MB）
+ (double)usedMemory;
-(NSUInteger) unicodeLength ;
@end
