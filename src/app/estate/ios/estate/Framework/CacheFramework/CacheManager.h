//
//  CacheManager.h
//  NetFramework
//
//  Created by banwj on 16/5/31.
//  Copyright © 2017年 soul. All rights reserved.
//

#import <Foundation/Foundation.h>

@class RequestModel;

@interface CacheManager : NSObject

// read
+ (NSData *)readCacheData:(RequestModel *)requestDic;
+ (NSString *)readCacheString:(RequestModel *)requestDic;

// write
+ (BOOL)writeCacheData:(NSData *)fileData Request:(RequestModel *)requestDic;
+ (BOOL)writeCacheString:(NSString *)fileData
                 Request:(RequestModel *)requestDic;

// delete
+ (BOOL)deleteCacheFileByPath:(NSString *)filePath;
+ (BOOL)deleteCacheFileByRequest:(RequestModel *)requestDic;
+ (BOOL)deleteCacheFileByDeleteTime:(NSString *)time;  // time为时间戳
@end
