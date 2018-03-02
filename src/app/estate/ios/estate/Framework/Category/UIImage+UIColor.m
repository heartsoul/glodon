//
//  UIImage+UIColor.m
//  PRM
//
//  Created by soul on 2017/9/12.
//  Copyright © 2017年 Glodon Inc. . All rights reserved.
//

#import "UIImage+UIColor.h"

@implementation UIImage (UIColor)

/**
 根据颜色创建图片

 @param color 颜色
 @return 图片对象，1x1大小
 */
+ (UIImage*)imageWithColor:(UIColor*)color {
    
    CGRect rect = CGRectMake(0.0f,0.0f,1.0f,1.0f);UIGraphicsBeginImageContext(rect.size);
    
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextSetFillColorWithColor(context, [color CGColor]);
    
    CGContextFillRect(context, rect);
    
    UIImage*theImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return theImage;
    
}

@end
