//
//  SoulDatabaseBase.h
//  CKBaseFramework
//
//  Created by soul on 2017/2/23.
//  Copyright © 2017年 soul. All rights reserved.
//
//  数据库基础类，主要实现数据库的版本管理，支持数据库的创建，升级，控制数据的增删改查，无业务逻辑
//  用户不能直接使用此类库，需要继承，来实现对应的设置
#import <Foundation/Foundation.h>
@class FMResultSet, FMDatabase;
/*所有表格名称枚举对象定义，这个这里只定义版本相关表，业务要到到各自的业务模块中去定义*/
typedef NSString * NSStringDBTableKey NS_STRING_ENUM;
typedef NSString * NSStringDBTableFiledKey NS_STRING_ENUM;
/* Keys for entries in io parameters dictionaries.*/
extern NSStringDBTableKey const kSoulDBTableVersion;
extern NSStringDBTableFiledKey const kSoulDBTableFiledKeyIid; // 自增id
extern NSStringDBTableFiledKey const kSoulDBTableFiledKeyUpdateTime; // 更新时间
extern NSStringDBTableFiledKey const kSoulDBTableFiledKeySystime; // 系统时间

#define TABLENAME(DB,KEY) [DB tableNameWithKey:KEY]

// 数据库版本比较
typedef enum : NSInteger {
    DBVersionCompareLess = -1,
    DBVersionCompareEqual = 0,
    DBVersionCompareGreater = 1,
    
} DBVersionCompare;


// 业务操作接口
@protocol SoulDatabaseDelegate <NSObject>
// 数据库版本号 规则 版本号 ={d.d.d[.d]}
// {主版本号}.{子版本号} 主={d.d} 子={d[.d]} d=数字，必须存在
// eg.合理的 0.0.1， 0.0.1.0，  0.1.1，  0.1.1.10，  2.0.0.1，  4.1.0.1
// eg.不合理的  0.1，  0，  1.0.0.3.1
// 应用对应的数据库版本号，数据库需要升级到这个版本
- (NSString*) getAppDBVersion;
// 用于用户自定义自己的数据库名后缀，实现数据隔离，没有实现的化默认为""
- (NSString*) getDatabaseNameSubfix;
// 用于用户自定义自己的数据库表名后缀，实现数据隔离，没有实现的化默认为""
- (NSString*) getTableNameSubfix;
// 升级数据库到最新版本,返回真正升级到的版本
- (NSString*)updateToLatest:(NSString*)curentVersion db:(FMDatabase *)db;
@optional

@end

// 安全parameter参数
@interface NSString(SoulDBSafeParameter)
- (NSString*)toSafeParameter;
@end

// 表字段对象
@interface SoulTableField : NSObject
+ (instancetype)instanceByFieldName:(NSString*)name filedType:(NSString*)type;
@end


@interface SoulDatabaseBase : NSObject<SoulDatabaseDelegate>
// 必须使用 sharedInstance 创建使用的类
+ (Class)sharedInstanceClass;
// 必须使用 sharedInstance来创建使用库
+ (instancetype)sharedInstance;


/**处理参数，防止非法sql */
+(NSString*)processParam:(NSString*)param;

/**比较数据库的两个版本， -1:B较新 0:相同 1: A较新  */
+(DBVersionCompare)compareDBVersionA:(NSString*)versionA versionB:(NSString*)versionB;

- (NSString*)tableNameWithKey:(NSStringDBTableKey)tableName;
// 执行sql语句
- (void)executeUpdate:(void (^)(BOOL successed))completion sql:(NSString*)sql;
// 查询数据
- (void)executeQuery:(void (^)(FMResultSet * rs))completion sql:(NSString*)sql;

// 表结构修改相关，这里只是做了封装，需要使用这些方法来执行对应的操作，这里的db来源于
// inTransaction，updateDatabase 方法, 都是使用了事务
// 创建表
- (BOOL) createTable:(FMDatabase *)db sql:(NSString*)sql;
// 删除表
- (BOOL) deleteTable:(FMDatabase *)db sql:(NSString*)sql;
// 更新表
- (BOOL) updateTable:(FMDatabase *)db sql:(NSString*)sql;

// 重新加载数据库
- (BOOL) reloadDB;


/**根据主键更新数据（没有就添加） tableName：表名称 dataArray：数据列表 key：主键字段 fieldsDic:(datakey:dbkey)*/
//- (NSInteger) updateData:(NSString*)tableName dataArray:(NSArray*)dataArray key:(NSString*)key fieldsDic:(NSDictionary*)fieldsDic;

/**根据主键更新数据（没有就添加） tableName：表名称 dataArray：数据列表 key：主键字段 key2：主键字段2*/
//- (NSInteger) updateData:(NSString*)tableName dataArray:(NSArray*)dataArray key:(NSString*)key key2:(NSString*)key2 fieldsDic:(NSDictionary*)fieldsDic;

/**根据主键更新数据（没有就添加） tableName：表名称 dataArray：数据列表 key：主键字段 key2：主键字段2 key3：主键字段3*/
//- (NSInteger) updateData:(NSString*)tableName dataArray:(NSArray*)dataArray key:(NSString*)key key2:(NSString*)key2 key3:(NSString*)key3 fieldsDic:(NSDictionary*)fieldsDic;

/**根据主键更新数据（没有就添加） tableName：表名称 dataArray：数据列表 key：主键字段 key2：主键字段2 key3：主键字段3*/
//-(NSInteger) updateData:(NSString*)tableName dataArray:(NSArray*)dataArray key:(NSString*)key key2:(NSString*)key2 key3:(NSString*)key3 fieldsDic:(NSDictionary*)fieldsDic;

/**根据插入或替换数据 tableName：表名称 dataArray：数据列表 key：主键字段 key2：主键字段2 key3：主键字段3*/
- (NSInteger) insertOrReplaceData:(NSString*)tableName dataArray:(NSArray<NSString*>*)dataArray fields:(NSArray<SoulTableField*>*)fields;


/**构造创建表语句*/
- (NSString*)makeCreateTableSQL:(NSArray<SoulTableField*>*)fields tableName:(NSString*)tableName;
@end

