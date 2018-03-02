//
//  UIView+MBProgressHUD.h
//  meinvli8
//
//  Created by soul on 14-4-4.
//  Copyright (c) 2014年 meinvli. All rights reserved.
//

#import <UIKit/UIKit.h>
@class MBProgressHUD;
@interface UIView (MBProgressHUD)

-(void)showHUD;
-(void)showHUD:(NSString *)text;
-(void)showHUD:(NSString *)text hudDuration:(NSTimeInterval) hudDuration;

-(void)showHUDWaiting:(NSString *)text;
-(void)showHUDWaiting;
-(void)hideHUDWaiting:(BOOL)bAll;
@end


