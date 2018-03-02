//
//  MNLUUID.h
//  meinvli8
//
//  Created by soul on 14-6-6.
//  Copyright (c) 2017年 soul. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface MNLUUID : NSObject
+ (NSString *) macaddress;
+ (NSString *)getMacAddress;
+ (NSString*)IDFA;
+ (NSString*)vender;
+ (NSString*)uuid;
+ (NSString *) localWiFiIPAddress;
+ (NSString *) platformString;
+ (NSString *) platform;
@end
