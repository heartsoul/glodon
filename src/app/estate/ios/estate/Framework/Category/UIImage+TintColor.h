//
//  UIImage+TintColor.h
//  ButtonPressDemo
//
//  Created by yangpenghua on 15/8/22.
//  Copyright (c) 2015年 yangpenghua. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIImage (TintColor)

- (UIImage *) imageWithTintColor:(UIColor *)tintColor;
- (UIImage *) imageWithGradientTintColor:(UIColor *)tintColor;
- (UIColor *) mostColor;
- (UIImage *) imageWithTintColor:(UIColor *)tintColor maskImage:(UIImage*)maskImage;
@end
