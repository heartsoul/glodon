//
//  UIImage+Bundle.m
//  CKBaseFramework
//
//  Created by lsx on 16/1/25.
//  Copyright © 2016年 Yonyou Chaoke Network Technology Co., Ltd. All rights reserved.
//

#import "UIImage+Bundle.h"

@implementation UIImage (Bundle)

+(NSBundle*)bundleWithBundleName:(NSString*)bundlename{
  if (bundlename == nil) {
    return [NSBundle mainBundle];
  }
  NSURL * url = [[NSBundle mainBundle] URLForResource:bundlename withExtension:@"bundle"];
  if (url) {
    [NSBundle bundleWithURL:url];
  }
  return [NSBundle mainBundle];
}

+(id)imageNamed:(NSString*)name bundleName:(NSString*)bundleName{
    
    NSBundle *bundle = [[self class] bundleWithBundleName:bundleName];
    NSString *imagePath = [bundle pathForResource:name ofType:@"png"];
    UIImage *imageIM = [[UIImage alloc]initWithContentsOfFile:imagePath];
    return imageIM;
}

@end
