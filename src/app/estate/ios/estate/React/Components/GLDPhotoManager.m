//
//  GLDRNPhotoManager.m
//  estate
//
//  Created by glodon on 2018/3/19.
//  Copyright © 2018年 Glodon. All rights reserved.
//

#import "GLDPhotoManager.h"

#import <Photos/PHAsset.h>

#import <React/RCTUIManager.h>

#import "NSDictionary+SoulPhotoModel.h"

#import "RNTImagesView.h"
#import "WaitViewUtil.h"
#import "SDDataCache.h"

@interface RCTConvert (RNTImagesView)

+ (NSDictionary*)toFiles:(id)json;

@end

@interface GLDPhotoManager()
@property(nonnull,nonatomic) RNTImagesView *quoteImagesView;
@end
@implementation GLDPhotoManager
// 组件导出，这里导出给js组件使用的名字就是 GLDPhoto，Manager会被处理掉
RCT_EXPORT_MODULE()
// 响应事件绑定
RCT_EXPORT_VIEW_PROPERTY(onChange, RCTBubblingEventBlock)
// 属性绑定
RCT_EXPORT_VIEW_PROPERTY(backgroundColor, UIColor)
// 属性绑定
RCT_EXPORT_VIEW_PROPERTY(maxSelectedCount, NSUInteger)
RCT_EXPORT_VIEW_PROPERTY(isShowTakePhotoSheet, BOOL)
RCT_CUSTOM_VIEW_PROPERTY(files, NSArray, RNTImagesView)
{
  NSDictionary * dic = [RCTConvert toFiles:json];
  view.selectedPhotos = [dic objectForKey:@"selectedPhotos"];
  view.selectedAssets = [dic objectForKey:@"selectedAssets"];
  [view.collectionView reloadData];
}
// 组件构建
- (UIView *)view
{
  CGFloat w = [UIApplication sharedApplication].keyWindow.frame.size.width;
  CGFloat h = w / 5 + 34;
  RNTImagesView *quoteImagesView =[[RNTImagesView alloc] initWithFrame:CGRectMake(0, 0, w, h) withCountPerRowInView:0 cellMargin:10];
  //初始化view的frame, view里每行cell个数， cell间距（上方的图片1 即为quoteImagesView）
  // 注：设置frame时，我们可以根据设计人员给的cell的宽度和最大个数、排列，间距去大致计算下quoteview的size.
  quoteImagesView.maxSelectedCount = 3;
  //最大可选照片数
  quoteImagesView.collectionView.scrollEnabled = YES;
  //view可否滑动
  UIViewController *root = RCTPresentedViewController();
  
  quoteImagesView.navcDelegate = (UIViewController<LPDQuoteImagesViewDelegate>*) root ;    //self 至少是一个控制器。
  //委托（委托controller弹出picker，且不用实现委托方法）
  _quoteImagesView = quoteImagesView;
  return quoteImagesView;
}

RCT_EXPORT_METHOD (loadFileByReactTag:(nonnull NSNumber *)reactTag callback:(RCTResponseSenderBlock)callback) {
  RNTImagesView *view = (RNTImagesView*)[self.bridge.uiManager viewForReactTag:reactTag];
  if (![view isKindOfClass:[RNTImagesView class]]) {
    RCTLogError(@"Invalid view returned from registry, expecting RCTWebView, got: %@", view);
  } else {
    [WaitViewUtil startLoading];
    [view loadFiles:^(NSArray *files) {
      [WaitViewUtil endLoading];
      callback(@[files]);
    }];
    
  }
  return;
}
RCT_EXPORT_METHOD (loadFile:(nonnull NSDictionary *)params callback:(RCTResponseSenderBlock)callback) {
  NSNumber * reactTag = [params objectForKey:@"handleId"];
  if (!reactTag) {
     callback(@[@[]]);
    return;
  }
  RNTImagesView *view = (RNTImagesView*)[self.bridge.uiManager viewForReactTag:reactTag];
  if (![view isKindOfClass:[RNTImagesView class]]) {
    RCTLogError(@"Invalid view returned from registry, expecting RCTWebView, got: %@", view);
  } else {
    [WaitViewUtil startLoading];
    [view loadFiles:^(NSArray *files) {
      [WaitViewUtil endLoading];
      callback(@[files]);
    }];
    
  }
  return;
}

RCT_EXPORT_METHOD (savePhoto:(NSDictionary*)dicData callback:(RCTResponseSenderBlock)callback) {
 
  NSString * url = @"";
  if(dicData && dicData[@"data"]) {
    NSData* imageData = dicData[@"data"];
    NSString * itemId = @"imageCode";
    [[SDDataCache fileDataCache] storeData:imageData forKey:itemId];
    url = [[[SDDataCache fileDataCache] imageCache] defaultCachePathForKey:itemId];
    callback(@[url,@(YES)]);
  } else {
    callback(@[url,@(NO)]);
  }
  return;
}

RCT_EXPORT_METHOD (takePhoto:(RCTResponseSenderBlock)callback) {
  //view可否滑动
  UIViewController *root = RCTPresentedViewController();
  [RNTImagesView takePhoto:root callback:^(NSArray *files) {
    if(!files) {
      files = @[];
    }
    callback(@[files,files.count?@(YES):@(NO)]);
  }];
  return;
}

RCT_EXPORT_METHOD (pickerImages:(RCTResponseSenderBlock)callbackRet) {
  
  UIViewController *root = RCTPresentedViewController();
  __block bool bRet = false;
  [RNTImagesView imagePicker:root callback:^(NSArray *files) {
    if(!files) {
      files = @[];
    }
    if(callbackRet && !bRet) {
      callbackRet(@[files,files.count?@(YES):@(NO)]);
      bRet = true;
    }
  }];
  return;
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}
+ (BOOL)requiresMainQueueSetup {
  return NO;
}

- (NSArray<id<RCTBridgeMethod>> *)methodsToExport {
  return @[];
}
//- (NSDictionary *)constantsToExport {
//  CGFloat w = [UIApplication sharedApplication].keyWindow.frame.size.width;
//  CGFloat h = w / 5 + 34;
//
//  return @{ @"ComponentHeight": @(w),
//            @"ComponentWidth": @(h)};
//}
@end

@implementation RCTConvert(RNTImagesView)

+ (NSDictionary*)toFiles:(id)json
{
  NSArray *files = [self NSDictionaryArray:json];
  NSMutableArray * ret = [NSMutableArray array];
  NSMutableArray * retPhoto = [NSMutableArray array];
  for(NSDictionary * item in files) {
    NSString * url = [item valueForKey:@"url"];
    NSString * key = [item valueForKey:@"key"];
    //    NSString * name = [item valueForKey:@"name"];
    //    NSString * length = [item valueForKey:@"length"];
    if (key) {
      PHAsset * asset = [NSMutableDictionary getPHAsset:key];
      if(asset) {
        [ret addObject:asset];
        NSMutableDictionary * dic = [[NSMutableDictionary alloc] initWithAsset:asset photoQuality:UploadPhotoQualityNormal];
        [retPhoto addObject:[dic getThumbnail:YES]];
      }
    } else {
      if(url) {
        [ret addObject:item];
        [retPhoto addObject:[[NSMutableDictionary alloc] initWithDictionary:item]];
      }
    }
  }
  return @{@"selectedPhotos":retPhoto,@"selectedAssets":ret};
}

@end






