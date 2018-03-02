//
//  SoulDatabaseBase+cache.h
//  CKBaseFramework
//
//  Created by soul on 2017/2/24.
//  Copyright © 2017年 soul. All rights reserved.
//
//  通用数据缓存表，采用最简单的key value形式实现的, value存储成json格式数据。
//  特别适用于小数据量的数据缓存，高效率，简明。

#import "SoulDatabaseBase.h"

extern NSStringDBTableFiledKey const kSoulDBTableFiledKeyCacheKey; // 唯一健
extern NSStringDBTableFiledKey const kSoulDBTableFiledKeyCacheJsonValue; // 值
extern NSStringDBTableKey const kSoulDBTableCache;

typedef NSString * NSStringDBTableCacheKey NS_STRING_ENUM;

@interface SoulDatabaseBase (cache)
- (BOOL)setupCacheTable;
- (void)saveCacheDataObj:(NSArray*)dataArray key:(NSStringDBTableCacheKey)key;
- (void)loadCacheDataArrByKey:(NSString*)key result:(void (^)(NSMutableArray * dataArray))result;
@end
