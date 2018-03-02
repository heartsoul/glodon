//
//  GLDRNEventEmitter.h
//  PRM
//
//  Created by glodon on 2017/11/17.
//  Copyright © 2017年 Glodon Inc. . All rights reserved.
//

#import <Foundation/Foundation.h>

#import <React/RCTEventEmitter.h>

/**
 oc 主动调用rn 类
 */
@interface GLDRNEventEmitter : RCTEventEmitter
+ (void)emitEventWithName:(NSString *)name andPayload:(NSDictionary *)payload;
@end
