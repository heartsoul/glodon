//
//  UIImage+Compress.m
//  tesn
//
//  Created by soul on 14-10-29.
//  Copyright (c) 2017年 soul. All rights reserved.
//

#import "UIImage+Compress.h"
#define MB(a) 1024 * 1024 * a
//static float kMinCompressionSize = 1024 * 200;
//static float kCompressionLevelUnitSize = 1024 * 100;
//static float kCompressionQuality = 0.5;//50 percent compression
@implementation UIImage (Compress)
+(NSData *)compressImage:(UIImage *)image{
  return [self compressImage:image w:1280 h: 1280 r:0.6];
}
+(NSData *)compressImage:(UIImage *)image w:(CGFloat)w h:(CGFloat)h r:(CGFloat)r {
  float actualHeight = image.size.height;
  float actualWidth = image.size.width;
  float imgRatio = actualWidth/actualHeight;
  float maxRatio = w/h;
  //    NSLog(@"压缩前大小：(w:%@,h:%@,ratio:%@",@(actualWidth),@(actualHeight), @(imgRatio));
  
  if (actualHeight > h || actualWidth > w){
    if(imgRatio < maxRatio){
      //adjust width according to maxHeight
      //            imgRatio = w / actualHeight;
      actualWidth = w;
      actualHeight = w / imgRatio;
    }
    else if(imgRatio > maxRatio){
      //adjust height according to maxWidth
      //            imgRatio = h / actualWidth;
      actualHeight = w / imgRatio;
      actualWidth = w;
    }
    else{
      actualHeight = h;
      actualWidth = w;
    }
  }
  
  CGRect rect = CGRectMake(0.0, 0.0, actualWidth, actualHeight);
  UIGraphicsBeginImageContext(rect.size);
  //  UIGraphicsBeginImageContextWithOptions(rect.size, NO, 0);
  [image drawInRect:rect];
  UIImage *img = UIGraphicsGetImageFromCurrentImageContext();
  NSData *imageData = UIImageJPEGRepresentation(img, 1.0);
  //    NSLog(@"压缩前大小：(w:%@,h:%@)%@kb",@(actualWidth),@(actualHeight), @(imageData.length/1024.0));
  // 压缩边界判定 200KB~1000KB 线性压缩;  200KB 以下不压缩; 1000KB 以上压缩系数 0.6
  if (imageData.length > MB(0.2) && imageData.length < MB(1)) {
    
    float interval = ( 1 - 0.6 ) / 9 ;
    
    if (imageData.length > MB(0.9) && imageData.length < MB(1.0)) {
      r = 0.6 + 1 * interval;
    }else if (imageData.length > MB(0.8) && imageData.length < MB(0.9)){
      r = 0.6 + 2 * interval;
    }else if (imageData.length > MB(0.7) && imageData.length < MB(0.8)){
      r = 0.6 + 3 * interval;
    }else if (imageData.length > MB(0.6) && imageData.length < MB(0.7)){
      r = 0.6 + 4 * interval;
    }else if (imageData.length > MB(0.5) && imageData.length < MB(0.6)){
      r = 0.6 + 5 * interval;
    }else if (imageData.length > MB(0.4) && imageData.length < MB(0.5)){
      r = 0.6 + 6 * interval;
    }else if (imageData.length > MB(0.3) && imageData.length < MB(0.4)){
      r = 0.6 + 7 * interval;
    }else if (imageData.length > MB(0.2) && imageData.length < MB(0.3)){
      r = 0.6 + 8 * interval;
    }
    
  }else if (imageData.length < MB(0.2)){
    r = 1 ;
  }else {
    r = 0.6 ;
  }
  if (r < 1) {
    imageData = UIImageJPEGRepresentation(img, r);
  }
  
  //    NSLog(@"压缩后大小：%@kb", @(imageData.length/1024.0));
  UIGraphicsEndImageContext();
  return imageData;
}


+ (NSData *)originImage:(UIImage *)image{
  UIImage *editImage = [UIImage fixOrientation:image];
  NSData *data = UIImageJPEGRepresentation(editImage, 1.0);
  return data;
}

+ (UIImage *)fixOrientation:(UIImage *)aImage {
  if (aImage == nil) { return nil; }
  CGImageRef imgRef = aImage.CGImage;    CGFloat width = CGImageGetWidth(imgRef);    CGFloat height = CGImageGetHeight(imgRef); CGAffineTransform transform = CGAffineTransformIdentity; CGRect bounds = CGRectMake(0, 0, width, height); CGFloat scaleRatio = 1; CGFloat boundHeight;
  UIImageOrientation orient = aImage.imageOrientation;
  switch(orient) {
    case UIImageOrientationUp: //EXIF = 1
    { transform = CGAffineTransformIdentity; break; }
    case UIImageOrientationUpMirrored: //EXIF = 2
    {    transform = CGAffineTransformMakeTranslation(width, 0.0);
      transform = CGAffineTransformScale(transform, -1.0, 1.0); break; }
    case UIImageOrientationDown: //EXIF = 3
    {    transform = CGAffineTransformMakeTranslation(width, height); transform = CGAffineTransformRotate(transform, M_PI); break; }
    case UIImageOrientationDownMirrored: //EXIF = 4
    {    transform = CGAffineTransformMakeTranslation(0.0, height); transform = CGAffineTransformScale(transform, 1.0, -1.0); break; }
    case UIImageOrientationLeftMirrored: //EXIF = 5
    {    boundHeight = bounds.size.height; bounds.size.height = bounds.size.width; bounds.size.width = boundHeight; transform = CGAffineTransformMakeTranslation(height, width); transform = CGAffineTransformScale(transform, -1.0, 1.0); transform = CGAffineTransformRotate(transform, 3.0 * M_PI / 2.0); break; }
    case UIImageOrientationLeft: //EXIF = 6
    {    boundHeight = bounds.size.height; bounds.size.height = bounds.size.width; bounds.size.width = boundHeight; transform = CGAffineTransformMakeTranslation(0.0, width); transform = CGAffineTransformRotate(transform, 3.0 * M_PI / 2.0); break; }
    case UIImageOrientationRightMirrored: //EXIF = 7
    {    boundHeight = bounds.size.height; bounds.size.height = bounds.size.width; bounds.size.width = boundHeight; transform = CGAffineTransformMakeScale(-1.0, 1.0); transform = CGAffineTransformRotate(transform, M_PI / 2.0); break; }
    case UIImageOrientationRight: //EXIF = 8
    {    boundHeight = bounds.size.height; bounds.size.height = bounds.size.width; bounds.size.width = boundHeight; transform = CGAffineTransformMakeTranslation(height, 0.0); transform = CGAffineTransformRotate(transform, M_PI / 2.0); break; }
    default: {    [NSException raise:NSInternalInconsistencyException format:@"Invalid image orientation"]; break; }
  }
  UIGraphicsBeginImageContext(bounds.size);
  //  UIGraphicsBeginImageContextWithOptions(bounds.size, NO, 0);
  CGContextRef context = UIGraphicsGetCurrentContext();
  if (orient == UIImageOrientationRight || orient == UIImageOrientationLeft) {
    CGContextScaleCTM(context, -scaleRatio, scaleRatio);
    CGContextTranslateCTM(context, -height, 0);
  }
  else {
    CGContextScaleCTM(context, scaleRatio, -scaleRatio);
    CGContextTranslateCTM(context, 0, -height);
  }
  CGContextConcatCTM(context, transform);
  CGContextDrawImage(UIGraphicsGetCurrentContext(), CGRectMake(0, 0, width, height), imgRef);
  UIImage *imageCopy = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  return imageCopy;
}

@end

