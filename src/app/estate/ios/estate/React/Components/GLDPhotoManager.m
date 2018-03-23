//
//  GLDRNPhotoManager.m
//  estate
//
//  Created by glodon on 2018/3/19.
//  Copyright © 2018年 Glodon. All rights reserved.
//

#import "GLDPhotoManager.h"
#import <React/RCTComponent.h>
#import <React/RCTUIManager.h>
#import <LPDQuoteImagesView.h>
#import "NSDictionary+SoulPhotoModel.h"
#import "SDDataCache.h"
// 控件定义
@interface RNTImagesView : LPDQuoteImagesView

@property (nonatomic, copy) RCTBubblingEventBlock onChange;// 响应事件定义
- (void)loadFiles:(void(^)(NSArray * files))finish;
@end

@implementation RNTImagesView
#pragma mark UICollectionView

- (void)loadItem:(PHAsset *)asset finish:(void(^)(NSDictionary *))finish {
  // 检查是否已经存在了
  NSMutableDictionary * item = [[NSMutableDictionary alloc] initWithAsset:asset photoQuality:UploadPhotoQualityNormal];
  __block NSString * itemid = [[item getIdentifier] stringByAppendingPathExtension:@"data"];
  SDDataCache * sd = [SDDataCache fileDataCache];
  if([sd existInCachePathForKey:itemid]) {
    NSString * path = [[sd imageCache] defaultCachePathForKey:itemid];
    path = [NSURL fileURLWithPath:path].absoluteString;
    finish(@{@"path":path,@"key":itemid});
    return;
  }
  [item loadImageData:^(NSData *imageData) {
    [[SDDataCache fileDataCache] storeData:imageData forKey:itemid];
    NSString * path = [[[SDDataCache fileDataCache] imageCache] defaultCachePathForKey:itemid];
    path = [NSURL fileURLWithPath:path].absoluteString;
    finish(@{@"path":path,@"key":itemid});
  }];
}
- (void)loadNext:(NSMutableArray *)ret asset:(PHAsset *)asset next:(PHAsset *(^)(void))next{
  if(asset) {
    [self loadItem:asset finish:^(NSDictionary * path) {
      [ret addObject:path];
      PHAsset * nextItem = next();
      if(next()) {
        [self loadNext:ret asset:nextItem next:next];
      }
    }];
  } else {
    PHAsset * nextItem = next();
    if(next()) {
      [self loadNext:ret asset:nextItem next:next];
    }
  }
}
- (void)loadFiles:(void(^)(NSArray * files))finish {
  __block NSArray * array = [self.selectedAssets copy];
  if(array.count < 1) {
    finish(@[]);
    return ;
  }
  __block NSUInteger nCount = array.count;
  __block NSUInteger nIndex = 0;
  __block NSMutableArray * ret = [NSMutableArray array];
  [self loadNext:ret asset:array[nIndex] next:^PHAsset *{
    nIndex ++;
    if(nIndex < nCount) {
      return array[nIndex];
    } else {
      finish(ret);
      return nil;
    }
  }];
}
- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
  if(self.onChange) {
   
    self.onChange(@{@"images":@[]});
  }
  
  if(self.selectedPhotos.count < self.maxSelectedCount) {
    return self.selectedPhotos.count + 1;
  }else {
    return self.selectedPhotos.count  ;
  }
}
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
RCT_CUSTOM_VIEW_PROPERTY(fireOnChange, NSString, RNTImagesView)
{
  if(view.onChange) {
    view.onChange(@{@"images":@[@"1",@"2",@"3"]});
  }
  //[view setRegion:json ? [RCTConvert MKCoordinateRegion:json] : defaultView.region animated:YES];
}
// 组件构建
- (UIView *)view
{
    CGFloat w = [UIApplication sharedApplication].keyWindow.frame.size.width;
    CGFloat h = w / 5 + 34;
    RNTImagesView *quoteImagesView =[[RNTImagesView alloc] initWithFrame:CGRectMake(0, 0, w, h) withCountPerRowInView:0 cellMargin:24];
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

RCT_EXPORT_METHOD (loadFile:(nonnull NSNumber *)reactTag uploadArray:(NSArray*)uploadArray callback:(RCTResponseSenderBlock)callback) {
  RNTImagesView *view = (RNTImagesView*)[self.bridge.uiManager viewForReactTag:reactTag];
    if (![view isKindOfClass:[RNTImagesView class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting RCTWebView, got: %@", view);
    } else {
      [view loadFiles:^(NSArray *files) {
        callback(@[@{@"images":files}]);
      }];
      
    }
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
- (NSDictionary *)constantsToExport {
  CGFloat w = [UIApplication sharedApplication].keyWindow.frame.size.width;
  CGFloat h = w / 5 + 34;
  
  return @{ @"ComponentHeight": @(w),
            @"ComponentWidth": @(h)};
}
@end
