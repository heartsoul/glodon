//
//  SoulDatabaseBase+cache.m
//  CKBaseFramework
//
//  Created by soul on 2017/2/24.
//  Copyright © 2017年 soul. All rights reserved.
//

#import "SoulDatabaseBase+cache.h"

#import <FMDB.h>
#import "SBJson.h"

NSStringDBTableKey const kSoulDBTableCache = @"soul_table_cache_key_value"; // 通用缓存表
NSStringDBTableFiledKey const kSoulDBTableFiledKeyCacheKey = @"key"; // 关键子
NSStringDBTableFiledKey const kSoulDBTableFiledKeyCacheJsonValue = @"value"; // 值

@implementation SoulDatabaseBase (cache)
// 应用对应的数据库版本号，数据库需要升级到这个版本
//- (NSString*) getAppDBVersion {
//  return @"1.0.0.0";
//}
//// 用于用户自定义自己的数据库名后缀，实现数据隔离，没有实现的化默认为""
//- (NSString*) getDatabaseNameSubfix {
//  return @"_cache";
//}
//// 用于用户自定义自己的数据库表名后缀，实现数据隔离，没有实现的化默认为""
//- (NSString*) getTableNameSubfix {
//  return @"_default";
//}


/**
 创建缓存数据库
 */
- (BOOL)setupCacheTable {
        __block BOOL bOK = NO;
    // 数据库版本表
    NSString *table = [NSString stringWithFormat:@"CREATE TABLE IF NOT EXISTS %@("
                       @"%@ VARCHAR,%@ VARCHAR,PRIMARY KEY(%@))", TABLENAME(self, kSoulDBTableCache), kSoulDBTableFiledKeyCacheKey, kSoulDBTableFiledKeyCacheJsonValue, kSoulDBTableFiledKeyCacheKey];
      [self executeUpdate:^(BOOL successed) {
          bOK = successed;
      } sql:table];
    return bOK;
    
}

- (void)saveCacheDataObj:(NSArray*)dataArray key:(NSStringDBTableCacheKey)key {
    
  SBJsonWriter * sbjw = [[SBJsonWriter alloc] init];
  NSError * error;
  NSString * retData = [sbjw stringWithObject:dataArray error:&error];
  if (error) {
    NSLog(@"%@",error);
    return;
  }
  if (retData) {
    NSArray * dataArray = @[key,retData];
    NSArray * fields = @[[SoulTableField instanceByFieldName:kSoulDBTableFiledKeyCacheKey filedType:@"VARCHAR"],[SoulTableField instanceByFieldName:kSoulDBTableFiledKeyCacheJsonValue filedType:@"VARCHAR"]];
    [self insertOrReplaceData:TABLENAME(self, kSoulDBTableCache) dataArray:dataArray fields:fields];
  }
//    NSLog(@"\nsaveCacheDataObj end >>>>>---- %@", key);
}

- (void)loadCacheDataArrByKey:(NSString*)key result:(void (^)(NSMutableArray * dataArray))result {
// NSLog(@"\nloadCacheDataArrByKey start >>>>>---- %@", key);
  NSString * selectSql = [NSString stringWithFormat:@"SELECT * FROM %@ WHERE %@='%@'", TABLENAME(self, kSoulDBTableCache), kSoulDBTableFiledKeyCacheKey, key];
  [self executeQuery:^(FMResultSet *rs) {
//      NSLog(@"\nloadCacheDataArrByKey end >>>>>---- %@", key);
    NSMutableArray *arrayRet= [[NSMutableArray alloc] init];
    if ([rs next]) {
      NSString * value = [rs stringForColumn:kSoulDBTableFiledKeyCacheJsonValue];
      NSObject * data = value.JSONValue;
      
      if ([data isKindOfClass:[NSArray class]]) {
        NSArray *array = (NSArray *)data;
        [arrayRet addObjectsFromArray:array];
      }
    }
      [rs close];
      dispatch_async(dispatch_get_main_queue(), ^{
          result(arrayRet);
      });
    
  } sql:selectSql];
}

@end
