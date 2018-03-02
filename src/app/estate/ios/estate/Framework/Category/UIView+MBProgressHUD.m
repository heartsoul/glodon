//
//  UIView+MBProgressHUD.m
//  meinvli8
//
//  Created by soul on 14-4-4.
//  Copyright (c) 2014年 meinvli. All rights reserved.
//

#import "UIView+MBProgressHUD.h"
#import "MBProgressHUD.h"

@implementation UIView (MBProgressHUD)
-(void)showHUDWaiting:(NSString *)text{
    NSDictionary * dic = @{@"text":text, @"hudDuration":@(60), @"type":@(MBProgressHUDModeIndeterminate)};
    [self performSelectorOnMainThread:@selector(showHUDInner:) withObject:dic waitUntilDone:YES];
}
-(void)showHUDWaiting{
    [self showHUDWaiting:@"正在执行"];
}
-(void)showHUD{
    [self showHUD:@"正在执行..."];
}
-(void)showHUD:(NSString *)text{
    [self showHUD:text hudDuration:2.0f];
}
-(void)showHUDInner: (NSDictionary*) data {
    NSString * text = [data objectForKey:@"text"];
    NSTimeInterval hudDuration = [[data objectForKey:@"hudDuration"] integerValue];
    MBProgressHUD *hud = [MBProgressHUD showHUDAddedTo:self animated:YES];
	// Configure for text only and offset down
    NSInteger type = [[data objectForKey:@"type"] integerValue];
	hud.mode = (int)type;
    if (text.length >=13) {
        hud.detailsLabelText = text;
    }else{
        hud.labelText = text;
    }
	hud.removeFromSuperViewOnHide = YES;
	
	[hud hide:YES afterDelay:hudDuration];
}
-(void)showHUD:(NSString *)text hudDuration:(NSTimeInterval) hudDuration {
  if(!text){
    text = @"";
  }
    NSDictionary * dic = @{@"text":text, @"hudDuration":@(hudDuration), @"type":@(MBProgressHUDModeText)};
    [self performSelectorOnMainThread:@selector(showHUDInner:) withObject:dic waitUntilDone:YES];
}
-(void)hideHUDWaiting:(BOOL)bAll{
    if (bAll) {
        [MBProgressHUD hideAllHUDsForView:self animated:NO];
    } else {
        [MBProgressHUD hideHUDForView:self animated:NO];
    }
}

@end

