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
#import "UIImageView+Loading.h"
#import <LPDAssetModel.h>
#import <UIView+HandyValue.h>
#import <LPDImageManager.h>
#import <LPDProgressView.h>

#import "GLDPhotoPreviewViewController.h"

@interface LPDImagePickerControllerEx : LPDImagePickerController
@end

@interface RCTConvert (RNTImagesView)

+ (NSDictionary*)toFiles:(id)json;

@end
// 控件定义
@interface RNTImagesView : LPDQuoteImagesView<LPDImagePickerControllerDelegate>
@property (assign, nonatomic) CGFloat myMargin;                         ///已选图片页面Cell的间距
@property (assign, nonatomic) CGFloat myItemWH;                         ///已选图片页面Cell的间距

@property (nonatomic, copy) RCTBubblingEventBlock onChange;// 响应事件定义

- (void)loadFiles:(void(^)(NSArray * files))finish;
@end

@implementation RNTImagesView
// lpdImagePicker每次选照片后的保存和更新操作
- (void)imagePickerController:(LPDImagePickerController *)picker didFinishPickingPhotos:(NSArray *)photos sourceAssets:(NSArray *)assets isSelectOriginalPhoto:(BOOL)isSelectOriginalPhoto {
  self.selectedPhotos = [NSMutableArray arrayWithArray:photos];
  self.selectedAssets = [NSMutableArray arrayWithArray:assets];
  
  [self.collectionView reloadData];
  
  //test**********[self printAssetsName:assets];
}

// 选择了一个视频的代理方法
- (void)imagePickerController:(LPDImagePickerController *)picker didFinishPickingVideo:(UIImage *)coverImage sourceAssets:(id)asset {
  self.selectedPhotos = [NSMutableArray arrayWithArray:@[coverImage]];
  self.selectedAssets = [NSMutableArray arrayWithArray:@[asset]];
  
  /*************** 打开这段代码发送视频
   [[LPDImageManager manager] getVideoOutputPathWithAsset:asset completion:^(NSString *outputPath) {
   NSLog(@"视频导出到本地完成,沙盒路径为:%@",outputPath);
   }]; ***********************/
  
  [self.collectionView reloadData];
}

#pragma mark - DeleteBtn
- (void)deleteBtnClik:(UIButton *)sender {
  [self.selectedPhotos removeObjectAtIndex:sender.tag];
  [self.selectedAssets removeObjectAtIndex:sender.tag];
  
  if(self.selectedPhotos.count == self.maxSelectedCount - 1){
    [self.collectionView reloadData];
  }else{
    [self.collectionView performBatchUpdates:^{
      NSIndexPath *indexPath = [NSIndexPath indexPathForItem:sender.tag inSection:0];
      [self.collectionView deleteItemsAtIndexPaths:@[indexPath]];
    } completion:^(BOOL finished) {
      [self.collectionView reloadData];
    }];
  }
}


- (void)refreshCollectionViewWithAddedAsset:(id)asset image:(UIImage *)image {
  [self.selectedAssets addObject:asset];
  [self.selectedPhotos addObject:image];
  [self.collectionView reloadData];
  
}


- (void)collectionView:(UICollectionView *)collectionView itemAtIndexPath:(NSIndexPath *)sourceIndexPath didMoveToIndexPath:(NSIndexPath *)destinationIndexPath {
  UIImage *image = self.selectedPhotos[sourceIndexPath.item];
  [self.selectedPhotos removeObjectAtIndex:sourceIndexPath.item];
  [self.selectedPhotos insertObject:image atIndex:destinationIndexPath.item];
  
  id asset = self.selectedAssets[sourceIndexPath.item];
  [self.selectedAssets removeObjectAtIndex:sourceIndexPath.item];
  [self.selectedAssets insertObject:asset atIndex:destinationIndexPath.item];
  
  [self.collectionView reloadData];
}

- (void)pushImagePickerController {
  if (self.maxSelectedCount <= 0) {
    return;
  }
  
  LPDImagePickerController *lpdImagePickerVc = [[LPDImagePickerControllerEx alloc] initWithMaxImagesCount:self.maxSelectedCount columnNumber:self.countPerRowInAlbum delegate:self pushPhotoPickerVc:YES];
  lpdImagePickerVc.modalPresentationStyle = UIModalPresentationOverCurrentContext;
  lpdImagePickerVc.allowPickingVideo = NO;
  lpdImagePickerVc.allowPickingOriginalPhoto = NO;
  lpdImagePickerVc.sortAscendingByModificationDate = NO;
  
  if (self.maxSelectedCount > 1) {
    // 设置目前已经选中的图片数组去初始化picker
    NSPredicate * predicate = [NSPredicate predicateWithBlock:^BOOL(id  _Nullable evaluatedObject, NSDictionary<NSString *,id> * _Nullable bindings) {
      if([evaluatedObject isKindOfClass:[PHAsset class]]) {
        return YES;
      }
      return NO;
    }];
    lpdImagePickerVc.selectedAssets =[NSMutableArray arrayWithArray: [self.selectedAssets filteredArrayUsingPredicate:predicate]];
    lpdImagePickerVc.showSelectBtn = NO;
    
  }else {
    lpdImagePickerVc.showSelectBtn = YES;
  }
  
  [self.navcDelegate presentViewController:lpdImagePickerVc animated:YES completion:nil];
}
- (instancetype)initWithFrame:(CGRect)frame withCountPerRowInView:(NSUInteger)ArrangeCount cellMargin:(CGFloat)cellMargin {
  self = [super initWithFrame:frame withCountPerRowInView:ArrangeCount cellMargin:cellMargin];
  if (self) {
    _myMargin = cellMargin;
    _myItemWH = self.frame.size.width / ArrangeCount - _myMargin;
  }
  [self.collectionView registerClass:[LPDPhotoArrangeCell class] forCellWithReuseIdentifier:@"LPDPhotoArrangeCellAdd"];
  return self;
}
#pragma mark UICollectionView
- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath {
 
  if(self.selectedPhotos.count<self.maxSelectedCount) {
    if (indexPath.row == self.selectedPhotos.count) {
      LPDPhotoArrangeCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"LPDPhotoArrangeCellAdd" forIndexPath:indexPath];
      cell.videoThumbnail.hidden = YES;
      cell.imageThumbnail.layer.cornerRadius = 0;
      
      [cell.imageThumbnail setImage:[UIImage imageNamedFromMyBundle:@"AlbumAddBtn.png"]];
      cell.imageThumbnail.layer.borderWidth = 0;
      
      CAShapeLayer *border = [CAShapeLayer new];
      //虚线的颜色
      border.strokeColor = [UIColor grayColor].CGColor;
      //填充的颜色
      border.fillColor = [UIColor clearColor].CGColor;
      
      UIBezierPath *path = [UIBezierPath bezierPathWithRoundedRect:cell.imageThumbnail.bounds cornerRadius:0];
      
      //设置路径
      border.path = path.CGPath;
      
      border.frame = cell.imageThumbnail.bounds;
      //虚线的宽度
      border.lineWidth = 1.f;
      
      
      //设置线条的样式
      //    border.lineCap = @"square";
      //虚线的间隔
      border.lineDashPattern = @[@3, @3];
      
//      cell.imageThumbnail.layer.cornerRadius = 5.f;
      cell.imageThumbnail.layer.masksToBounds = YES;
      [cell.imageThumbnail.layer addSublayer:border];
      cell.nookDeleteBtn.hidden = YES;
      return cell;
      
    }
  }
  LPDPhotoArrangeCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"LPDPhotoArrangeCell" forIndexPath:indexPath];
  cell.videoThumbnail.hidden = YES;
  cell.imageThumbnail.layer.cornerRadius = 0;
  
  UIImage * data = self.selectedPhotos[indexPath.row];
  if ([data isKindOfClass:[UIImage class]]) {
    cell.imageThumbnail.image = data;
  } else {
    NSDictionary * data = self.selectedPhotos[indexPath.row];
    if([data isKindOfClass:[NSDictionary class]]) {
      NSString * url = [data objectForKey:@"url"];
      if ([url isKindOfClass:[NSString class]]) {
        [cell.imageThumbnail loadImageWithURL:[NSURL URLWithString:url]];
      } else {
        cell.imageThumbnail.image = [data getThumbnail:YES];
      }
    }
  }
  
  cell.asset = self.selectedAssets[indexPath.row];
  cell.imageThumbnail.layer.borderWidth = 0;
//  cell.nookDeleteBtn.hidden = NO;
  cell.nookDeleteBtn.tag = indexPath.row;
//  [cell.nookDeleteBtn addTarget:self action:@selector(deleteBtnClik:) forControlEvents:UIControlEventTouchUpInside];
  cell.nookDeleteBtn.hidden = YES;
  
  return cell;
}

- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath {
  if (indexPath.row == self.selectedPhotos.count) {
    
    [self pushImagePickerController];
    
  } else { //预览照片或者视频
    id asset = self.selectedAssets[indexPath.row];
    BOOL isVideo = NO;
    if ([asset isKindOfClass:[PHAsset class]]) {
      PHAsset *phAsset = asset;
      isVideo = phAsset.mediaType == PHAssetMediaTypeVideo;
    } else if ([asset isKindOfClass:[ALAsset class]]) {
      ALAsset *alAsset = asset;
      isVideo = [[alAsset valueForProperty:ALAssetPropertyType] isEqualToString:ALAssetTypeVideo];
    }
    if (isVideo) { // 预览视频
      LPDVideoPlayerController *vc = [[LPDVideoPlayerController alloc] init];
      LPDAssetModel *model = [LPDAssetModel modelWithAsset:asset type:LPDAssetModelMediaTypeVideo timeLength:@""];
      vc.model = model;
      [self.navcDelegate presentViewController:vc animated:YES completion:nil];
    } else { // 预览照片
      LPDImagePickerController *selectImagePickerVc = [[LPDImagePickerControllerEx alloc] initWithSelectedAssets:self.selectedAssets selectedPhotos:self.selectedPhotos index:indexPath.row];
      selectImagePickerVc.maxImagesCount = self.maxSelectedCount;
      selectImagePickerVc.allowPickingOriginalPhoto = NO;
      
      [selectImagePickerVc setDidFinishPickingPhotosHandle:^(NSArray<UIImage *> *photos, NSArray *assets, BOOL isSelectOriginalPhoto) {
        self.selectedPhotos = [NSMutableArray arrayWithArray:photos];
        self.selectedAssets = [NSMutableArray arrayWithArray:assets];
        [self.collectionView reloadData];
        self.collectionView.contentSize = CGSizeMake(0, ((self.selectedPhotos.count + 2) / 3 ) * (_myMargin + _myItemWH));
      }];
      [self.navcDelegate presentViewController:selectImagePickerVc animated:YES completion:nil];
    }
  }
}


- (void)loadItem:(PHAsset *)asset finish:(void(^)(NSDictionary *))finish {
  // 检查是否已经存在了
  NSMutableDictionary * item = [[NSMutableDictionary alloc] initWithAsset:asset photoQuality:UploadPhotoQualityNormal];
  __block NSString * itemid = [[item getIdentifier] stringByAppendingPathExtension:@"data"];
  SDDataCache * sd = [SDDataCache fileDataCache];
  if([sd existInCachePathForKey:itemid]) {
    NSString * path = [[sd imageCache] defaultCachePathForKey:itemid];
    NSDictionary *attr = [[NSFileManager defaultManager] attributesOfItemAtPath:path error:nil];
    NSURL * fileUrl = [NSURL fileURLWithPath:path];
    path = fileUrl.absoluteString;
    id size = @"0";
    if (attr[NSFileSize]) {
      size = attr[NSFileSize];
    }
    finish(@{@"path":path,@"key":itemid,@"name":fileUrl.lastPathComponent,@"length":size});
    return;
  }
  [item loadImageData:^(NSData *imageData) {
    [[SDDataCache fileDataCache] storeData:imageData forKey:itemid];
    NSString * path = [[[SDDataCache fileDataCache] imageCache] defaultCachePathForKey:itemid];
    NSURL * fileUrl = [NSURL fileURLWithPath:path];
    path = fileUrl.absoluteString;
    finish(@{@"path":path,@"key":itemid,@"name":fileUrl.lastPathComponent,@"length":@(imageData.length)});
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
//  if(self.onChange) {
//
//    self.onChange(@{@"images":@[]});
//  }
  
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
RCT_CUSTOM_VIEW_PROPERTY(files, NSArray, RNTImagesView)
{
  NSDictionary * dic = [RCTConvert toFiles:json];
  view.selectedPhotos = [dic objectForKey:@"selectedPhotos"];
  view.selectedAssets = [dic objectForKey:@"selectedAssets"];
  
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
        [retPhoto addObject:[[NSMutableDictionary alloc] initWithAsset:asset photoQuality:UploadPhotoQualityNormal]];
      }
    } else {
      if(url) {
        [ret addObject:item];
        [retPhoto addObject:[[NSMutableDictionary alloc] initWithDictionary:item]];
      }
    }
  }
  return @{@"selectedPhotos":ret,@"selectedAssets":ret};
}

@end

@implementation LPDImagePickerControllerEx
- (instancetype)initWithSelectedAssets:(NSMutableArray *)selectedAssets selectedPhotos:(NSMutableArray *)selectedPhotos index:(NSInteger)index {
  GLDPhotoPreviewViewController *previewVc = [[GLDPhotoPreviewViewController alloc] init];
//  self = [super initWithSelectedAssets:nil selectedPhotos:nil index:0];
  
  self = [super initWithRootViewController:previewVc];
  if (self) {
    [self configDefaultSetting];
    self.selectedAssets = [NSMutableArray arrayWithArray:selectedAssets];
    self.allowPickingOriginalPhoto = self.allowPickingOriginalPhoto;
  
    previewVc.photos = [NSMutableArray arrayWithArray:selectedPhotos];
    previewVc.currentIndex = index;
    __weak typeof(self) weakSelf = self;
    [previewVc setDoneButtonClickBlockWithPreviewType:^(NSArray<UIImage *> *photos, NSArray *assets, BOOL isSelectOriginalPhoto) {
      [weakSelf dismissViewControllerAnimated:YES completion:^{
        if (weakSelf.didFinishPickingPhotosHandle) {
          weakSelf.didFinishPickingPhotosHandle(photos,assets,isSelectOriginalPhoto);
        }
      }];
    }];
  }
  return self;
}
@end


