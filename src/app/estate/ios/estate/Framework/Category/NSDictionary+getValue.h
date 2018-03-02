//
//  NSDictionary+getValue.h
//  tesn
//
//  Created by soul on 14-10-21.
//  Copyright (c) 2017年 soul. All rights reserved.
//

#import <Foundation/Foundation.h>
#ifndef __NSDictionary_getValue__
#define __NSDictionary_getValue__
@interface NSDictionary (getValue)
/**获取int类型值*/
-(int) intValue:(int)defaultValue key:(NSString*)key;
/**获取NSInteger类型值*/
-(NSInteger) integerValue:(NSInteger)defaultValue key:(NSString*)key;
/**获取NSString类型值*/
-(NSString*) stringValueDefault:(NSString*)defaultValue key:(NSString*)key;
/**从main bundle中获取NSInteger类型值*/
-(NSInteger) bundleIntegerValueDefault:(NSInteger)defaultValue  key:(NSString*)key;
/**从main bundle中获取NSString类型值*/
-(NSString*) bundleValueDefault:(NSString*)defaultValue  key:(NSString*)key;

@end
#endif //__NSDictionary_getValue__
