//
//  UIColor+DarkAddition.h
//  tesn
//
//  Created by lsx on 15/9/23.
//
//
#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>

@interface UIColor (DarkAddition)

- (BOOL)pc_isDarkColor;
- (BOOL)pc_isDistinct:(UIColor *)compareColor;
- (UIColor *)pc_colorWithMinimumSaturation:(CGFloat)saturation;
- (BOOL)pc_isBlackOrWhite;
- (BOOL)pc_isContrastingColor:(UIColor *)color;

@end


