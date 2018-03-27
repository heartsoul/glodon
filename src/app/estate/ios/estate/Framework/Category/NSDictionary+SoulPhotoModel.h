//
//  NSDictionary+SoulPhotoModel.h
//  PRM
//
//  Created by soul on 2017/12/25.
//  Copyright © 2017年 Glodon Inc. . All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
//使用 PHAsset 需要引入Photos Framework，支持 iOS8.0 及以上版本。
#import <Photos/Photos.h>

typedef NSString * SoulPhotoUploadKey NS_STRING_ENUM;

typedef enum : NSInteger {
    UploadPhotoQualityNormal, // 默认处理
    UploadPhotoQualityOrigin, // 原图
} UploadPhotoQuality; // 图片清晰度

typedef enum : NSInteger {
    UploadPhotoAssetTypeUnknown, // 不能识别
    UploadPhotoAssetTypePHAsset, // 新版本库
    UploadPhotoAssetTypeALAsset, // 老版本库
} UploadPhotoAssetType; // 图片库类型，ALAsset or PHAsset
// 上传对象key
extern SoulPhotoUploadKey const SoulCmdUploadKeyPhotoQuality; // 返回UploadPhotoQuality 对象
extern SoulPhotoUploadKey const SoulCmdUploadKeyIdentifier; // 与AssetType相匹配， 是ALAsset时就是url，时PHAsset时就是 localIdentifier

@interface NSDictionary(SoulPhotoModel)
//- (NS)toJsonObject
- (UIImage*)getThumbnail:(BOOL)needCache;
- (UIImage*)getThumbnail:(BOOL)needCache size:(CGSize)size;
- (void)loadVideoData:(void(^)(NSData * videoData))finish;
- (void)loadImageData:(void(^)(NSData * imageData))finish;
- (BOOL)hasValidData;
- (BOOL)isVideo;
- (NSString*)getIdentifier;
- (PHAsset*)getPHAsset;
+ (PHAsset*)getPHAsset:(NSString*)assetLocalIdentifier;
+(void)saveImageToCameraRoll:(UIImage*)image completionBlock:(void(^)(id assetObj , BOOL successFlag))completionBlock;
@end

@interface NSMutableDictionary(SoulPhotoModel)

- (instancetype) initWithAsset:(PHAsset*)asset photoQuality:(UploadPhotoQuality)photoQuality;
@end
