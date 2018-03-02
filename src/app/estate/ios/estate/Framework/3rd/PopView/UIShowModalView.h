//
//  UIShowModalView.h
//  tesn
//
//  Created by soulimac on 15/4/22.
//  Copyright (c) 2015年 yonyouup. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIShowModalView : UIView
+(UIShowModalView*)showModelView:(UIView*)contentView;
+(UIShowModalView*)showModelViewFixed:(UIView*)contentView;
+(void)hideContentView;
@end
