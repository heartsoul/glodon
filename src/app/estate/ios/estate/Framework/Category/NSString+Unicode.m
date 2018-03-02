//
//  NSString+Unicode.m
//  tesn
//
//  Created by soul on 14/11/25.
//  Copyright (c) 2017年 soul. All rights reserved.
//
#import <sys/sysctl.h>
#import <mach/mach.h>
#import "NSString+Unicode.h"
@implementation NSString (Unicode)

+(NSString*) memoryInfoLogString{
    return [NSString stringWithFormat:@"Current Memory Info:%.3fMB,%.3fMB", [self.class availableMemory], [self.class usedMemory] ];
}
+(void) memoryInfoLog{
#ifdef DEBUG
    NSLog(@"Current Memory Info:%.3fMB,%.3fMB", [self.class availableMemory], [self.class usedMemory]);
#endif
}
// 获取当前设备可用内存(单位：MB）
+ (double)availableMemory
{
    vm_statistics_data_t vmStats;
    mach_msg_type_number_t infoCount = HOST_VM_INFO_COUNT;
    kern_return_t kernReturn = host_statistics(mach_host_self(),
                                               HOST_VM_INFO,
                                               (host_info_t)&vmStats,
                                               &infoCount);
    
    if (kernReturn != KERN_SUCCESS) {
        return NSNotFound;
    }
    
    return ((vm_page_size *vmStats.free_count) / 1024.0) / 1024.0;
}

// 获取当前任务所占用的内存（单位：MB）
+ (double)usedMemory
{
    task_basic_info_data_t taskInfo;
    mach_msg_type_number_t infoCount = TASK_BASIC_INFO_COUNT;
    kern_return_t kernReturn = task_info(mach_task_self(),
                                         TASK_BASIC_INFO,
                                         (task_info_t)&taskInfo,
                                         &infoCount);
    
    if (kernReturn != KERN_SUCCESS
        ) {
        return NSNotFound;
    }
    
    return taskInfo.resident_size / 1024.0 / 1024.0;
}

-(NSUInteger) unicodeLength {
    NSUInteger asciiLength = 0;
    for (NSUInteger i = 0; i < self.length; i++) {
        unichar uc = [self characterAtIndex: i];
        asciiLength += isascii(uc) ? 1 : 2;
    }
    NSUInteger unicodeLength = asciiLength / 2;
    if(asciiLength % 2) {
        unicodeLength++;
    }
    return unicodeLength;
}
@end
