//
//  UIImage+BundleImage.h
//  CKBaseFramework
//
//  Created by liujing on 16/1/25.
//  Copyright © 2016年 Yonyou Chaoke Network Technology Co., Ltd. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIImage (BundleImage)
+ (UIImage *)getImageFromBundle:(NSString *)bundlePathString image:(NSString *)bundleImage;
@end
