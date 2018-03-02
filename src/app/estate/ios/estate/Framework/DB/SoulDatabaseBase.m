//
//  SoulDatabaseBase.m
//  CKBaseFramework
//
//  Created by soul on 2017/2/23.
//  Copyright © 2017年 soul. All rights reserved.
//

#import "SoulDatabaseBase.h"

// 3rd
#import <CKSecurityTool/SecurityTool.h>
#import <libextobjc/EXTScope.h>

// category
#import "NSDictionary+getValue.h"

// db refs
#import "FMDatabase.h"
#import "FMDatabaseQueue.h"

// 常量定义
NSStringDBTableKey const kSoulDBTableVersion = @"soul_table_version";
// prefix suffix
NSStringDBTableKey const kSoulDBNamePrefix = @"soul_database";

NSStringDBTableFiledKey const kSoulDBTableFiledKeyIid = @"iid"; // 自增id
NSStringDBTableFiledKey const kSoulDBTableFiledKeyDbVersion = @"dbVersion"; // 数据库版本
NSStringDBTableFiledKey const kSoulDBTableFiledKeyUpdateTime = @"updateTime"; // 更新时间
NSStringDBTableFiledKey const kSoulDBTableFiledKeySystime = @"systime"; // 系统时间

// 获取当前系统时间戳
NSTimeInterval systime() {
  return (NSInteger)[[NSDate date] timeIntervalSince1970];
}

//// 数据库版本比较
//int compareDBVesion(NSString *versionA, NSString *versionB) {
//  return (int)[[NSDate date] timeIntervalSince1970];
//}

//数据库日志输出
void logDbError(FMDatabase *db) {
#ifdef DEBUG
  if (db.lastErrorCode != 0) {
    NSLog(@"\n>>>数据库错误(code:%@,error:%@)\n", @(db.lastErrorCode), db.lastErrorMessage);
  }
#endif
}

////////////////////////////////////////////////////////////////////////////////
#pragma mark -- NSString(SoulDBSafeParameter)
@implementation NSString(SoulDBSafeParameter)
// 转换成安全的parameter参数，运行参数中出现单独一个 "'"
- (NSString*) toSafeParameter {
  return [self stringByReplacingOccurrencesOfString:@"'" withString:@"''"];
}

@end

////////////////////////////////////////////////////////////////////////////////
#pragma mark -- NSString(SoulDBVersion)
@interface NSString(SoulDBVersion)
- (NSInteger) compareWithDBVersion:(NSString*)dbVersion;
- (NSString*) toDBVersion;
@end

@implementation NSString(SoulDBVersion)

- (NSInteger) compareWithDBVersion:(NSString*)dbVersion {
  
  if (![dbVersion isKindOfClass:[NSString class]]) {
    return DBVersionCompareGreater; // 没有就是最新的了
  }
  if([self isEqualToString:dbVersion]) return DBVersionCompareEqual;
  
  NSArray *versionsA = [self componentsSeparatedByString:@"."];
  NSArray *versionsB = [dbVersion componentsSeparatedByString:@"."];
  
  int nCount = (int)MIN(versionsA.count, versionsB.count);
  for (int i = 0; i < nCount; i++) {
    NSInteger vA = [versionsA[i] integerValue];
    NSInteger vB = [versionsB[i] integerValue];
    if(vA < vB) return DBVersionCompareLess;
    if(vA > vB) return DBVersionCompareGreater;
  }
  return DBVersionCompareEqual;
}

- (NSString*) toDBVersion {
  NSArray * rets = [self componentsSeparatedByString:@"."];
  NSUInteger nCount = MIN(4, rets.count);
  rets = [rets subarrayWithRange:NSMakeRange(0, nCount)];
  return [rets componentsJoinedByString:@"."];
}
@end


///////////////
@interface SoulTableField()

@property (nonatomic, strong) NSString* filedName;
@property (nonatomic, strong) NSString* filedType;

// function
-(instancetype)initByFieldName:(NSString *)name filedType:(NSString *)type;
@end

@implementation SoulTableField

+(instancetype)instanceByFieldName:(NSString *)name filedType:(NSString *)type {
  return [[[self class] alloc] initByFieldName:name filedType:type];
}
-(instancetype)initByFieldName:(NSString *)name filedType:(NSString *)type {
  self = [super init];
  if (self) {
    _filedName = name;
    _filedType = type;
  }
  return self;
}
@end

////////////////////////////////////////////////////////////////////////////////
#pragma mark -- SoulDatabaseBase
@interface SoulDatabaseBase()
@property(atomic, strong) FMDatabaseQueue *dbQueue;
@property(atomic, strong) NSString *dbVersion;
@end

static SoulDatabaseBase* sharedInstance = nil;

@implementation SoulDatabaseBase

+ (Class)sharedInstanceClass {
  return [SoulDatabaseBase class];
}

+ (instancetype) sharedInstance {
  @synchronized (self) {
      static dispatch_once_t onceToken;
      
      dispatch_once(&onceToken, ^{
          sharedInstance = [[[[self class] sharedInstanceClass] alloc] init];
      });
      if (sharedInstance == nil) {
          sharedInstance = [[[[self class] sharedInstanceClass] alloc] init];
      }
      return sharedInstance;
  }
}

+ (NSString*)processParam:(NSString*)param {
  return [param stringByReplacingOccurrencesOfString:@"'" withString:@"''"];
}

/**比较数据库的两个版本， -1:B较新 0:相同 1: A较新  */
+ (DBVersionCompare)compareDBVersionA:(NSString*)versionA versionB:(NSString*)versionB {
    return [versionA compareWithDBVersion:versionB];
}

- (NSString*)tableNameWithKey:(NSStringDBTableKey)tableName {
  return [self md5String:[NSString stringWithFormat:@"%@_%@", tableName, [self getTableNameSubfix]]];
}

- (NSString*)tableDBNameWithKey:(NSStringDBTableKey)dbName {
  return [self md5String:[NSString stringWithFormat:@"%@_%@", dbName, [self getDatabaseNameSubfix]]];
}
// 对数据进行md5编码，不明文输出数据
- (NSString*)md5String:(NSString*)data {
    return [NSString stringWithFormat:@"G%@", [SecurityTool encrypt:data key:data salt:@"db"]];
}

//获取Documents路径下 kSoulDBNamePrefix文件夹
- (NSString *)getDocumentsPath {
  //获取Documents路径
  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,
                                                       NSUserDomainMask, YES);
  NSString *path = [paths objectAtIndex:0];
  
  NSFileManager *fileManager = [NSFileManager defaultManager];
  NSString *iOSDirectory = [path stringByAppendingPathComponent:[self tableDBNameWithKey:kSoulDBNamePrefix]];
  
  if (![fileManager fileExistsAtPath:iOSDirectory]) {
    [fileManager createDirectoryAtPath:iOSDirectory
           withIntermediateDirectories:YES
                            attributes:nil
                                 error:nil];
  }
  return iOSDirectory;
}
#pragma mark -- executeUpdate
// 执行sql语句
- (void)executeUpdate:(void (^)(BOOL successed))completion sql:(NSString*)sql {
    [self.dbQueue inDatabase:^(FMDatabase *db) {
        BOOL ret = [db executeUpdate:sql];
        if(ret) {
            logDbError(db);
        }
        [db closeOpenResultSets];
        if(completion) {
            completion(ret);
        }
    }];
}
#pragma mark -- executeQuery
// 查询数据
- (void)executeQuery:(void (^)(FMResultSet * rs))completion sql:(NSString*)sql {
  
//    NSLog(@"\nexecuteQuery start >>>>>---- %@", self.dbQueue);
    [self.dbQueue inDatabase:^(FMDatabase *db) {
//        NSLog(@"\nexecuteQuery end >>>>>---- %@", self.dbQueue);
        if(completion) {
            logDbError(db);
            FMResultSet * ret = [db executeQuery:sql];
            completion(ret);
        }
    }];
}

- (void)inTransaction:(void (^)(FMDatabase *db, BOOL *rollback))block {
    [self.dbQueue inTransaction:block];

}

- (BOOL)initTable{
    self.dbVersion = @"0.0.0.0";
  __block BOOL bOK = NO;
  NSString * subfixDB = [self md5String:[[self getDatabaseNameSubfix] stringByAppendingString:kSoulDBNamePrefix]];
  NSString *dbPath = [[[self getDocumentsPath] stringByAppendingPathComponent:subfixDB] stringByAppendingPathExtension:@".dbdat"];
#ifdef DEBUG
  NSLog(@"\ndbPath==%@\n", dbPath);
#endif
  self.dbQueue = [FMDatabaseQueue databaseQueueWithPath:dbPath];
  [self.dbQueue inDatabase:^(FMDatabase *db) {
    // 数据库版本表
    NSString *table = [NSString stringWithFormat:@"CREATE TABLE IF NOT EXISTS %@("
                       @"iid INTEGER PRIMARY KEY AUTOINCREMENT,"
                       @"dbVersion VARCHAR(26) DEFAULT('0.0.0.0'),"
                       @"updatetime CHAR(20) DEFAULT('0.0'),"
                       @"systime CHAR(20) DEFAULT('%@'),"
                       @"dblog CHAR(256) DEFAULT(''))", kSoulDBTableVersion, @(systime())];
    bOK = [db executeUpdate:table];
      [db closeOpenResultSets];
    if (!bOK) {
      return ;
    }
      [self fetchDBVersion:db];
      
      if ([self needUpdateDatabase]) {
         
         self.dbVersion =  [self updateToLatest: self.dbVersion db:db];
         
          [self updateDBVersion:db];
      }
      
  }];
    
  return bOK;
}


- (instancetype)init {
  self = [super init];
  if (self) {
    if(![self initTable]) {
      return nil; // 数据库出初始化不成功，那就返回为空了
    }
  }
  return self;
}
- (BOOL)reloadDB {

  if(sharedInstance && sharedInstance.dbQueue) {
    [sharedInstance.dbQueue close];
  }
  sharedInstance = nil;
  sharedInstance = [[[[self class] sharedInstanceClass] alloc] init];
  return NO;
}

// 数据库版本号 规则 版本号 ={d.d.d[.d]}
// {主版本号}.{子版本号} 主={d.d} 子={d[.d]} d=数字，必须存在
// eg.合理的 0.0.1， 0.0.1.0，  0.1.1，  0.1.1.10，  2.0.0.1，  4.1.0.1
// eg.不合理的  0.1，  0，  1.0.0.3.1
- (NSString*) getAppDBVersion {
  return _dbVersion;
}

- (BOOL)needUpdateDatabase {
  if ([self.dbVersion compareWithDBVersion:[self getAppDBVersion]] == DBVersionCompareLess) {
    // 版本过高
    NSLog(@"数据库不是最新版本[当前版本%@，最新版本%@]，需要任何升级", self.dbVersion, [self getAppDBVersion]);
    return YES;
  } else {
    // 版本合适，无需要升级
    NSLog(@"数据库已经是最新版本，不需要任何升级");
    return NO;
  }
}

- (BOOL) updateDBVersion:(FMDatabase *)db {
  //  这里是始终插入版本记录，这样就是所有的数据库升级记录都存在着。
  NSTimeInterval systime = (NSInteger)[[NSDate date] timeIntervalSince1970];
  NSString *initSql = [NSString stringWithFormat:@"INSERT INTO %@(dbVersion,updatetime,systime,dblog) "
                         @"VALUES('%@','%@','%@','%@')",
                         kSoulDBTableVersion, self.dbVersion, @(systime), @(systime), @"数据库升级更新"];
  return [db executeUpdate:initSql];
}

- (NSString*)fetchDBVersion:(FMDatabase *)db {
  
  NSString *querySql = [NSString stringWithFormat:@"SELECT * FROM %@ ORDER BY iid DESC", kSoulDBTableVersion];
  FMResultSet * rs = [db executeQuery:querySql];
  if (rs.next) {
    NSDictionary *dicData = rs.resultDictionary;
    NSString *version = [NSString stringWithFormat:@"%@", [dicData objectForKey:@"dbVersion"]];
    self.dbVersion = [version toDBVersion];
      [rs close];
    return self.dbVersion;
  } else {
    [rs close];
    return nil;
  }
}
- (NSString*)updateToLatest:(NSString*)curentVersion db:(FMDatabase *)db{
//    if (curentVersion < 2.05) {
//
//       // [self updateTo_2_0];
//        NSLog(@"升级到2.0版本");
//    }
    return self.dbVersion;
}

// 用于用户自定义自己的数据库名后缀，实现数据隔离，没有实现的化默认为""
- (NSString*) getDatabaseNameSubfix {
  return @"";
}

// 用于用户自定义自己的数据库表名后缀，实现数据隔离，没有实现的化默认为""
- (NSString*) getTableNameSubfix {
  return @"";
}

// 创建表
- (BOOL) createTable:(FMDatabase *)db sql:(NSString*)sql {
  return [db executeUpdate:sql];
}

// 删除表
- (BOOL) deleteTable:(FMDatabase *)db sql:(NSString*)sql {
  return [db executeUpdate:sql];
}

// 更新表
- (BOOL) updateTable:(FMDatabase *)db sql:(NSString*)sql {
  return [db executeUpdate:sql];
}

/**根据插入或替换数据 tableName：表名称 dataArray：数据列表 fields:字段名列表*/
-(NSInteger) insertOrReplaceData:(NSString*)tableName dataArray:(NSArray<NSString*>*)dataArray fields:(NSArray<SoulTableField*>*)fields {
  if (fields.count < 1) {
    return -1;
  }
  __block NSInteger dbResult;
  
  [self.dbQueue inDatabase:^(FMDatabase *db) {
    NSMutableArray * filedNameArray = [NSMutableArray array];
    NSMutableArray * filedPlaceholderArray = [NSMutableArray array];
    
    for (SoulTableField * field in fields) {
      [filedNameArray addObject:[field.filedName toSafeParameter]];
      [filedPlaceholderArray addObject:@"?"];
    }
    NSString * fn = [filedNameArray componentsJoinedByString:@","];
    NSString * fp = [filedPlaceholderArray componentsJoinedByString:@","];
    
    NSString *sql = [NSString stringWithFormat:@"INSERT OR REPLACE INTO %@(%@) VALUES(%@)",
                        tableName, fn, fp];
   dbResult = [db executeUpdate:sql withArgumentsInArray:dataArray];
      [db closeOpenResultSets];
  }];
 
  return dbResult;
}
- (NSString*)makeCreateTableSQL:(NSArray<SoulTableField*>*)fields tableName:(NSString*)tableName {
  NSMutableString * sql = [[NSMutableString alloc] initWithString:@"CREATE TABLE IF NOT EXISTS "];
  [sql appendString:tableName];
  [sql appendString:@"("];

  NSMutableArray * fieldArray = [NSMutableArray array];
  for (SoulTableField * field in fields) {
    [fieldArray addObject:[NSString stringWithFormat:@"%@ %@,", field.filedName, field.filedType]];
  }
  [sql appendString:[fieldArray componentsJoinedByString:@","]];
  
  [sql appendString:@")"];
  return sql;
}

@end
