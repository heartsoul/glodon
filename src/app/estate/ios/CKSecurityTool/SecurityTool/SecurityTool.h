//
//  SecurityTool.h
//  SecurityTool
//
//  Created by soul on 15/12/10.
//  Copyright © 2015年 Yonyou Chaoke Network Technology Co., Ltd. All rights reserved.
//

#import <Foundation/Foundation.h>
@interface SecurityTool : NSObject
+ (NSString* __nullable)encrypt:(NSString* __nonnull)data
                            key:(NSString* __nonnull)key
                           salt:(NSString* __nullable)salt;
+ (void)parameterVarification:(NSMutableDictionary* __nonnull)parameterDic
                          key:(NSString* __nonnull)key
                         salt:(NSString* __nullable)salt;
+ (NSString* __nullable)encryptByTs:(NSString* __nonnull)ts salt:(NSString* __nullable)salt;
@end
