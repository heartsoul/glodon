//
//  UIImage+UIColor.h
//  PRM
//
//  Created by soul on 2017/9/12.
//  Copyright © 2017年 Glodon Inc. . All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIImage (UIColor)
/**
 根据颜色创建图片
 
 @param color 颜色
 @return 图片对象，1x1大小
 */
+ (UIImage*)imageWithColor:(UIColor*)color;
@end
