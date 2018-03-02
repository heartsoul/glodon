//
//  BaseModel.h
//  PRM
//
//  Created by soul on 2017/8/30.
//  Copyright © 2017年 Glodon Inc. . All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NSMutableDictionary(MapAttributesItem)

/**
 合成属性
 
 @param modelFieldKeyName model对象类属性名
 @param jsonDataFiledKeyName json数据对象类属性名
 @return 属性映射对象
 */
- (NSDictionary*)addAttributeByModelKey:(NSString*)modelFieldKeyName jsonKey: (NSString*)jsonDataFiledKeyName;

@end

@interface BaseModel : NSObject

/**
 通过json对象进行实例化

 @param json json数据字典对象
 @return model实例
 */
- (id)initWithContent:(NSDictionary *)json;
/**
 通过json对象进行实例化
 
 @param jsonString json字符串格式数据对象
 @return model实例
 */
- (id)initWithJsonString:(NSString *)jsonString;

/**
 数据是否是成功数据，在获取到服务器端数据后，通过这个来判断数据的成功／失败。

 @return YES：成功数据 NO：失败数据
 */
- (BOOL)isSuccessed;

/**
 model转json字典对象

 @return json字典对象
 */
- (NSMutableDictionary*)toJsonObject;

/**
 {datakey:jsonkey}
 jsonKey支持 ｜分隔多个key
 demo
 @{@"userId":@"id",@"userName":@"name",@"title":@"title|subject"}
*/
/**
 json数据对象属性与model数据对象熟悉的自动转化映射关系

 @return 映射关系字典
 */
- (id)mapAttributes;

#pragma mark -- 这些属性需要实现<NSCoding>

/**
 从存储中还原加载实例，这个仅仅适用与唯一对象的加载，比如用户登录数据

 @return model实例
 */
+ (instancetype)loadData;

/**
 删除存储的实例数据
 */
+ (void)clearData;

/**
 存储实例数据，这个仅仅适用与唯一对象的加载，比如用户登录数据
 */
- (void)saveData;
@end
