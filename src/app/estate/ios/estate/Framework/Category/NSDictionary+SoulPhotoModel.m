//
//  NSDictionary+SoulPhotoModel.m
//  PRM
//
//  Created by soul on 2017/12/25.
//  Copyright © 2017年 Glodon Inc. . All rights reserved.
//

#import "NSDictionary+SoulPhotoModel.h"
#import "NSDictionary+getValue.h"
#import "UIImage+Compress.h"
// 上传对象key
SoulPhotoUploadKey const SoulCmdUploadKeyPhotoQuality = @"photoQuality"; // 返回UploadPhotoQuality 对象
SoulPhotoUploadKey const SoulCmdUploadKeyDataType = @"dataType"; // 返回 Image,Video,Audio 对象
SoulPhotoUploadKey const SoulCmdUploadKeyIdentifier = @"identifier"; // 与AssetType相匹配， 是ALAsset时就是url，时PHAsset时就是 localIdentifier
SoulPhotoUploadKey const SoulCmdUploadKeyThumbnail = @"thumbnail"; // 缩略图，生成一次就够用了。下次同一个对象就不重新生成了。 这个要慎重使用。

#define kSoulMargin 2
#define kSoulThumbnailWidth ([UIScreen mainScreen].bounds.size.width - 2 * kSoulMargin - 4) / 4 - kSoulMargin
#define kSoulThumbnailSize CGSizeMake(kSoulThumbnailWidth, kSoulThumbnailWidth)

@implementation NSDictionary (SoulPhotoModel)



- (UIImage*)getThumbnail:(BOOL)needCache {
    
    return [self getThumbnail:needCache size:kSoulThumbnailSize];
}

- (UIImage*)getThumbnail:(BOOL)needCache size:(CGSize)size {
    
    __block UIImage *resultImage;
    if(needCache) {
        resultImage = [self objectForKey:SoulCmdUploadKeyThumbnail];
        if (resultImage) {
            return resultImage;
        }
    }
    [self getThumbnailWithAsset:[self getAsset] size:size completionBlock:^(UIImage *image){
        resultImage = image;
    }];
    return resultImage;
}

- (BOOL)isVideo {
    NSString * dataType = [self stringValueDefault:@"" key:SoulCmdUploadKeyDataType];
    return [[dataType lowercaseString] isEqualToString:@"video"];
}

- (BOOL)hasValidData {
    return [self objectForKey:SoulCmdUploadKeyIdentifier] && [self objectForKey:SoulCmdUploadKeyPhotoQuality];
}

- (UploadPhotoQuality)getPhotoQuality {
    
    NSInteger ret = [(NSNumber*)[self objectForKey:SoulCmdUploadKeyPhotoQuality] integerValue];
    if (ret == UploadPhotoQualityOrigin) {
        return UploadPhotoQualityOrigin;
    }
    return UploadPhotoQualityNormal;
}

- (NSString*)getIdentifier {
    return [self objectForKey:SoulCmdUploadKeyIdentifier];
}

- (id)getAsset {
   return [self getPHAsset];
}
/**
 *  根据提供的asset获取缩略图
 *  使用同步方法获取
 *  @param asset           具体的asset资源 PHAsset or ALAsset
 *  @param size            缩略图大小
 *  @param completionBlock 回调block
 */
- (void)getThumbnailWithAsset:(id _Nonnull)asset
                         size:(CGSize)size
              completionBlock:(void(^_Nonnull)(UIImage *_Nullable image))completionBlock {
    PHImageRequestOptions *imageRequestOptions = [[PHImageRequestOptions alloc] init];
    imageRequestOptions.synchronous = YES;
    imageRequestOptions.networkAccessAllowed = YES;
    imageRequestOptions.deliveryMode = PHImageRequestOptionsDeliveryModeOpportunistic;
    imageRequestOptions.resizeMode = PHImageRequestOptionsResizeModeExact;
    // 在 PHImageManager 中，targetSize 等 size 都是使用 px 作为单位，因此需要对targetSize 中对传入的 Size 进行处理，宽高各自乘以 ScreenScale，从而得到正确的图片
    CGFloat screenScale = [UIScreen mainScreen].scale;
    CGSize sizeIn = CGSizeMake(size.width * screenScale, size.height * screenScale);
    @autoreleasepool {
        [[PHImageManager defaultManager] requestImageForAsset:asset targetSize:sizeIn contentMode:PHImageContentModeAspectFit options:imageRequestOptions resultHandler:^(UIImage * _Nullable result, NSDictionary * _Nullable info) {
            completionBlock ? completionBlock(result) : nil;
        }];
    }
}

- (NSString*)getAssetLocalIdentifier:(id)asset {
    
    if ([asset isKindOfClass:[PHAsset class]]) {
        PHAsset *phAsset = (PHAsset *)asset;
        return phAsset.localIdentifier;
    }
    return nil;
}

- (NSString*)getAssetDataType:(id)asset {
    
    if ([asset isKindOfClass:[PHAsset class]]) {
        PHAsset *phAsset = (PHAsset *)asset;
        if (phAsset.mediaType == PHAssetMediaTypeImage) {
            return @"Image";
        }
        if (phAsset.mediaType == PHAssetMediaTypeVideo) {
            return @"Video";
        }
        if (phAsset.mediaType == PHAssetMediaTypeAudio) {
            return @"Audio";
        }
        return [NSString stringWithFormat:@"%@", @(phAsset.mediaType)];
    }
    return nil;
}


+ (PHAsset*)getPHAsset:(NSString*)assetLocalIdentifier {
    
    return [PHAsset fetchAssetsWithLocalIdentifiers:@[assetLocalIdentifier] options:nil].firstObject;
}

- (PHAsset*)getPHAsset {
    
    return [PHAsset fetchAssetsWithLocalIdentifiers:@[[self getIdentifier]] options:nil].firstObject;
}

- (PHImageRequestID)getPhotoWithAsset:(id)asset photoSize:(CGSize)imageSize completion:(void (^)(UIImage *photo,NSDictionary *info,BOOL isDegraded))completion progressHandler:(void (^)(double progress, NSError *error, BOOL *stop, NSDictionary *info))progressHandler networkAccessAllowed:(BOOL)networkAccessAllowed {
    if ([asset isKindOfClass:[PHAsset class]]) {
        // 修复获取图片时出现的瞬间内存过高问题
        // 下面两行代码，来自hsjcom
        PHImageRequestOptions *option = [[PHImageRequestOptions alloc] init];
        option.synchronous = YES;
        option.resizeMode = PHImageRequestOptionsResizeModeFast;
        PHImageRequestID imageRequestID = [[PHImageManager defaultManager] requestImageForAsset:asset targetSize:imageSize contentMode:PHImageContentModeAspectFill options:option resultHandler:^(UIImage * _Nullable result, NSDictionary * _Nullable info) {
            BOOL downloadFinined = (![[info objectForKey:PHImageCancelledKey] boolValue] && ![info objectForKey:PHImageErrorKey]);
            if (downloadFinined && result) {
                if (completion) completion(result,info,[[info objectForKey:PHImageResultIsDegradedKey] boolValue]);
            }
            // Download image from iCloud / 从iCloud下载图片
            if ([info objectForKey:PHImageResultIsInCloudKey] && !result && networkAccessAllowed) {
                PHImageRequestOptions *options = [[PHImageRequestOptions alloc] init];
                options.progressHandler = ^(double progress, NSError *error, BOOL *stop, NSDictionary *info) {
                    dispatch_async(dispatch_get_main_queue(), ^{
                        if (progressHandler) {
                            progressHandler(progress, error, stop, info);
                        }
                    });
                };
                options.networkAccessAllowed = YES;
                options.resizeMode = PHImageRequestOptionsResizeModeFast;
                [[PHImageManager defaultManager] requestImageDataForAsset:asset options:options resultHandler:^(NSData * _Nullable imageData, NSString * _Nullable dataUTI, UIImageOrientation orientation, NSDictionary * _Nullable info) {
                    UIImage *resultImage = [UIImage imageWithData:imageData scale:0.1];
                    if (resultImage) {
                        if (completion) completion(resultImage,info,[[info objectForKey:PHImageResultIsDegradedKey] boolValue]);
                    }
                }];
            }
        }];
        return imageRequestID;
    }
    return 0;
}


- (void)loadVideoData:(void(^)(NSData * videoData))finish {
    if (![self hasValidData]) {
        finish(nil);
    }
   
    PHAsset * asset =  [self getPHAsset];
    
    if (asset.mediaType == PHAssetMediaTypeVideo) {
        PHAsset *phAsset = asset;
        if (phAsset.mediaType == PHAssetMediaTypeVideo) {
            PHVideoRequestOptions *options = [[PHVideoRequestOptions alloc] init];
            options.version = PHImageRequestOptionsVersionCurrent;
            options.deliveryMode = PHVideoRequestOptionsDeliveryModeAutomatic;
            
            PHImageManager *manager = [PHImageManager defaultManager];
            [manager requestAVAssetForVideo:phAsset options:options resultHandler:^(AVAsset * _Nullable asset, AVAudioMix * _Nullable audioMix, NSDictionary * _Nullable info) {
                AVURLAsset *urlAsset = (AVURLAsset *)asset;
                
                NSURL *url = urlAsset.URL;
                NSData *data = [NSData dataWithContentsOfURL:url];
                finish ? finish(data) : nil;
            }];
        }
        
    }
}

- (void)loadImageData:(void(^)(NSData * imageData))finish {
    if (![self hasValidData]) {
        finish(nil);
    }
    UploadPhotoQuality quality = [self getPhotoQuality];
    PHAsset * asset =  [self getPHAsset];
    
    if (asset.mediaType == PHAssetMediaTypeImage) {
        PHImageRequestOptions *options = [[PHImageRequestOptions alloc] init];
        options.networkAccessAllowed = YES;
        options.synchronous = YES;
        if(quality == UploadPhotoQualityOrigin) {
            options.version = PHImageRequestOptionsVersionOriginal;
            options.deliveryMode = PHImageRequestOptionsDeliveryModeHighQualityFormat;
            @autoreleasepool {
                [[PHImageManager defaultManager] requestImageDataForAsset:asset options:options resultHandler: ^(NSData *imageData, NSString *dataUTI, UIImageOrientation orientation, NSDictionary *info) {
                    if(finish) {
                        finish(imageData);
                    }
                }];
            }
        } else {
            [self getPhotoWithAsset:asset photoSize:CGSizeMake(1280, 1280) completion:^(UIImage *photo, NSDictionary *info, BOOL isDegraded) {
                NSData * data = [UIImage compressImage:photo w:1280 h: 1280 r:0.75];
                finish ? finish(data) : nil;
            } progressHandler:nil networkAccessAllowed:YES];
        }
    }
    return;
    
}
+(void)saveImageToCameraRoll:(UIImage*)image completionBlock:(void(^)(id assetObj , BOOL successFlag))completionBlock {
   
    __block PHObjectPlaceholder *placeholderAsset = nil;
    [[PHPhotoLibrary sharedPhotoLibrary] performChanges:^{
        PHAssetChangeRequest *newAssetRequest = [PHAssetChangeRequest creationRequestForAssetFromImage:image];
        newAssetRequest.creationDate = [NSDate date];
        placeholderAsset = newAssetRequest.placeholderForCreatedAsset;
    } completionHandler:^(BOOL success, NSError *error) {
        if(success){
            PHAsset *asset = [NSDictionary getPHAsset:placeholderAsset.localIdentifier];
            completionBlock(asset, YES);
        } else {
            completionBlock(nil, NO);
        }
    }];
}

@end

@implementation NSMutableDictionary(SoulPhotoModel)
- (UIImage*)getThumbnail:(BOOL)needCache {
    
    __block UIImage *resultImage;
    if(needCache) {
        resultImage = [self objectForKey:SoulCmdUploadKeyThumbnail];
        if (resultImage) {
            return resultImage;
        }
    }
    [self getThumbnailWithAsset:[self getAsset] size:kSoulThumbnailSize completionBlock:^(UIImage *image){
        resultImage = image;
    }];
    if(needCache) {
        [self setObject:resultImage forKey:SoulCmdUploadKeyThumbnail];
    }
    return resultImage;
}
//@property(nonatomic, assign) NSInteger photoQuality; // 1： 原图，0:屏幕尺寸图
//@property(nonatomic, assign) NSInteger assetType; // 图片资源类型，1: ALAsset 0:默认 PHAsset 资源
//@property(nonatomic, strong) NSString * identifier;

- (instancetype) initWithAsset:(PHAsset*)asset photoQuality:(UploadPhotoQuality)photoQuality {
    self = [self init];
    if (self) {
        NSString * identifier = [self getAssetLocalIdentifier:asset];
        if(!identifier) {
            return self;
        }
        [self setObject:identifier forKey:SoulCmdUploadKeyIdentifier];

        [self setObject:@(photoQuality) forKey:SoulCmdUploadKeyPhotoQuality];
    }
    return self;
}

@end
