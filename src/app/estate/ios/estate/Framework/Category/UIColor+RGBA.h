//
//  UIColor+RGBA.h
//  meinvli8
//
//  Created by soul on 14-4-3.
//  Copyright (c) 2017年 soul. All rights reserved.
// red ,green, blue 的值0-255，省去了转化过程

#import <UIKit/UIKit.h>

@interface UIColor (RGBA)
/**将16进制形式的色值转化成颜色 hexColor：色值  支持两种完整形式 0xa2b3e1 #a9873b */
+ (UIColor *)colorWithHexStringToColor: (NSString *) hexColor;
+ (UIColor *)colorWith255Red:(CGFloat)red green:(CGFloat)green blue:(CGFloat)blue alpha:(CGFloat)alpha;
+ (UIColor *)colorWith255White:(CGFloat)white alpha:(CGFloat)alpha;
@end
