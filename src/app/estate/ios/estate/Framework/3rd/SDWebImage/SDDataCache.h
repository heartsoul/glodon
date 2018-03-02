//
//  SDDataCache.h
//  tesn
//
//  Created by soul on 15/9/19.
//
//

#import <Foundation/Foundation.h>
#import "SDImageCache.h"
@interface SDDataCache : NSObject

+ (SDDataCache*) taskDataCache;//添加到任务的图片
+ (SDDataCache*) settingDataCache;
+ (SDDataCache*) networkDataCache;
+ (SDDataCache*) fileDataCache;
- (SDImageCache*)imageCache;

/**
 * Add a read-only cache path to search for images pre-cached by SDImageCache
 * Useful if you want to bundle pre-loaded images with your app
 *
 * @param path The path to use for this read-only cache path
 */
- (void)addReadOnlyCachePath:(NSString *)path;
// 直接存储数据 add 2014-03-29
- (void)storeData:(NSData *)dataIn forKey:(NSString *)key;
- (NSData *)diskDataForKey:(NSString *)key;
-(void)removeCacheForKey :(NSString *)key;
- (BOOL)existInCachePathForKey :(NSString *)key;
@end
