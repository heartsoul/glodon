//
//  UIImage+BundleImage.m
//  CKBaseFramework
//
//  Created by liujing on 16/1/25.
//  Copyright © 2016年 Yonyou Chaoke Network Technology Co., Ltd. All rights reserved.
//

#import "UIImage+BundleImage.h"

@implementation UIImage (BundleImage)
+ (UIImage *)getImageFromBundle:(NSString *)bundlePathString image:(NSString *)bundleImage
{
    NSString *bundlePath = [[NSBundle mainBundle].resourcePath stringByAppendingPathComponent:bundlePathString];
    NSBundle *bundle = [NSBundle bundleWithPath:bundlePath];
    UIImage *(^getBundleImage)(NSString *) = ^(NSString *n) {
        return [UIImage imageWithContentsOfFile:[bundle pathForResource:n ofType:@"png"]];
    };
    UIImage *image = getBundleImage(bundleImage);
    return image;
}
@end
