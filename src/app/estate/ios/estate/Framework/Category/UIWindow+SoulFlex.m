//
//  UIWindow+SoulFlex.m
//  PRM
//
//  Created by soul on 2017/11/7.
//  Copyright © 2017年 Glodon Inc. . All rights reserved.
//

#import "UIWindow+SoulFlex.h"

#if SoulFlexDebug
#import "FLEXManager.h"
#endif

@implementation UIWindow (SoulFlex)
#if SoulFlexDebug
static int times = 0;
static NSTimeInterval timestamp = 0;
- (void)motionEnded:(UIEventSubtype)motion withEvent:(UIEvent *)event
{
    [super motionEnded:motion withEvent:event];
    
    if (motion == UIEventSubtypeMotionShake) {
        if ((++times ) > 2) {
            times = 0;
            NSTimeInterval n = (int)[NSDate date].timeIntervalSince1970;
            if (n - timestamp > 8) {
                timestamp = 0;
                return; // 必须在给定时间内摇晃才有效
            }
            timestamp = 0;
        } else {
            if (timestamp == 0) {
                timestamp = (int)[NSDate date].timeIntervalSince1970;
            }
            return;
        }
        [[FLEXManager sharedManager] showExplorer];
        
    }
}
#endif
@end
