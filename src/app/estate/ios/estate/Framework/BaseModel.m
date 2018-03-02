//
//  BaseModel.m
//  PRM
//
//  Created by soul on 2017/8/30.
//  Copyright © 2017年 Glodon Inc. . All rights reserved.
//

#import "BaseModel.h"
#import "CoreDataManager.h"
#import "NSObject+SBJson.h"

@implementation NSMutableDictionary(MapAttributesItem)

/**
 合成属性
 
 @param modelFieldKeyName model对象类属性名
 @param jsonDataFiledKeyName json数据对象类属性名
 @return 属性映射对象
 */
- (NSDictionary*)addAttributeByModelKey:(NSString*)modelFieldKeyName jsonKey: (NSString*)jsonDataFiledKeyName {
    if (modelFieldKeyName == nil || jsonDataFiledKeyName == nil) {
        return @{};
    }
    return @{modelFieldKeyName:jsonDataFiledKeyName};
}

@end

@implementation BaseModel

- (BOOL)isSuccessed {
    return YES;
}

- (void)dealloc {
    //    NSLog(@"BaseModel  dealloc");
}

- (id)initWithContent:(NSDictionary *)json {
    self = [self init];
    if (self) {
        [self setModelData:json];
    }
    return self;
}

/**
 通过json对象进行实例化
 
 @param jsonString json字符串格式数据对象
 @return model实例
 */
- (id)initWithJsonString:(NSString *)jsonString {
    self = [self init];
    if (self) {
        [self setModelData:jsonString.JSONValue];
    }
    return self;
}

// {datakey:jsonkey}
// jsonKey支持 ｜分隔多个key
- (id)mapAttributes {
    /* 
     demo 
     @{@"userId":@"id",@"userName":@"name",@"title":@"title|subject"}
    */
    return nil;
}
- (NSMutableDictionary*)toJsonObject {
    NSMutableDictionary * ret = [NSMutableDictionary dictionary];
    @try {
        // 1
        NSDictionary *mapDic = [self mapAttributes]; // {jsonkey:datakey}
        for (id key in mapDic.allKeys) {
            SEL sel = [self getterMethod:key];
            if ([self respondsToSelector:sel]) {
                NSString* jsonKey = [mapDic objectForKey:key];
                NSArray *keys = [jsonKey componentsSeparatedByString:@"|"];
                for (NSString * keyItem in keys) {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
                    NSObject *ov  = [self performSelector:sel];
#pragma clang diagnostic pop
                    if (ov) {
                        // 处理 BaseModel类型数据
                        if ([ov isKindOfClass:[BaseModel class]]) {
                            ov = [(BaseModel*)ov toJsonObject];
                        } else if([ov isKindOfClass:[NSArray<BaseModel*> class]] || [ov isKindOfClass:[NSMutableArray<BaseModel*> class]]) {
                            NSMutableArray * ret1 = [NSMutableArray array];
                            for (BaseModel * dic in (NSArray*)ov) {
                                [ret1 addObject:[dic toJsonObject]];
                            }
                            ov = ret1;
                        }
                        [ret setObject:ov forKey:keyItem];
                    }
                }
            }
        }
        
    }
    @catch (NSException *exception) {
        // 2
        NSLog(@"%s\n%@", __FUNCTION__, exception);
    }
    @finally {
    }
    return ret;
}

- (SEL)getterMethod:(NSString *)key {
    return NSSelectorFromString(key);
}

- (SEL)setterMethod:(NSString *)key {
    NSString *first = [[key substringToIndex:1] capitalizedString];
    NSString *end = [key substringFromIndex:1];
    NSString *setterName = [NSString stringWithFormat:@"set%@%@:", first, end];
    return NSSelectorFromString(setterName);
}

- (void)setModelData:(NSDictionary *)json {
    //    @try {
    // 1
    
    NSDictionary *mapDic = [self mapAttributes]; // {jsonkey:datakey}
    for (id key in mapDic.allKeys) {
        
        SEL sel = [self setterMethod:key];
        if ([self respondsToSelector:sel]) {
            NSString* jsonKey = [mapDic valueForKey:key];
            
            NSArray *keys = [jsonKey componentsSeparatedByString:@"|"];
            id jsonValue = nil;
            for (NSString * keyItem in keys) {
                jsonValue = [json valueForKey:keyItem];
                
                if ([jsonValue isKindOfClass:[NSNull class]]) {
                    jsonValue = @"";
                    //                        DNSLog(@"服务器端数据错误%@",json);
                    break;
                }
                if (jsonValue != nil) {
                    break;
                }
            }
            
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
            [self performSelector:sel withObject:jsonValue];
#pragma clang diagnostic pop
            
        }
    }
    
    //    }
    //    @catch (NSException *exception) {
    //        // 2
    //        NSLog(@"%s\n%@", __FUNCTION__, exception);
    //    }
    //    @finally {
    //    }
}

+ (NSString *)savePath {
    NSArray *codepath = NSSearchPathForDirectoriesInDomains(
                                                            NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *storagePath = [codepath[0]
                             stringByAppendingPathComponent:
                             [NSString stringWithFormat:@"%@.soul",
                              [CoreDataManager
                               encrypt:[self description]
                               key:[[CoreDataManager sharedManager] getApiHost]]]];
    //    DNSLog(@"%@",NSHomeDirectory());
    return storagePath;
}

- (void)saveData {
    
    if ([NSKeyedArchiver archiveRootObject:self toFile:[self.class savePath]]) {
        //        DNSLog(@"数据存档成功");
    }
}

+ (instancetype)loadData {
    NSString *storagePath = [self.class savePath];
    NSFileManager *fileManager = [NSFileManager defaultManager];
    
    BOOL isDir = FALSE;
    
    BOOL isDirExist =
    [fileManager fileExistsAtPath:storagePath isDirectory:&isDir];
    
    if (!isDirExist)
        return nil;
    id un = [NSKeyedUnarchiver unarchiveObjectWithFile:storagePath];
    return un;
}

+ (void)clearData {
    NSString *storagePath = [self.class savePath];
    
    NSFileManager *fileManager = [NSFileManager defaultManager];
    [fileManager removeItemAtPath:storagePath error:nil];
}

@end

