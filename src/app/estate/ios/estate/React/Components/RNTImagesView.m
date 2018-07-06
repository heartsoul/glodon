//
//  RNTImagesView.m
//  estate
//
//  Created by glodon on 2018/4/16.
//  Copyright © 2018年 Glodon. All rights reserved.
//

#import "RNTImagesView.h"
#import <CommonCrypto/CommonDigest.h>
#import <libextobjc/EXTScope.h>
#import <LPDQuoteImagesView.h>
#import <LPDAssetModel.h>
#import <UIView+HandyValue.h>
#import <LPDImageManager.h>
#import <LPDProgressView.h>
#import <React/RCTUIManager.h>

#import "NSDictionary+SoulPhotoModel.h"
#import "NSObject+SoulAlertView.h"
#import "UIImageView+Loading.h"

#import "SDDataCache.h"

#import "GLDPhotoPreviewViewController.h"
#import "SoulCameraViewController.h"
#import "WaitViewUtil.h"
@interface LPDImagePickerControllerEx : LPDImagePickerController
@end

// 控件定义
@interface RNTImagesView()<LPDImagePickerControllerDelegate>
@property (assign, nonatomic) CGFloat myMargin;                         ///已选图片页面Cell的间距
@property (assign, nonatomic) CGFloat myItemWH;                         ///已选图片页面Cell的间距

@end

@implementation RNTImagesView
// lpdImagePicker每次选照片后的保存和更新操作
- (void)imagePickerController:(LPDImagePickerController *)picker didFinishPickingPhotos:(NSArray *)photos sourceAssets:(NSArray *)assets isSelectOriginalPhoto:(BOOL)isSelectOriginalPhoto {
  [self processImages:photos assets:assets replace:NO];
  //  self.selectedPhotos = [NSMutableArray arrayWithArray:photos];
  //  self.selectedAssets = [NSMutableArray arrayWithArray:assets];
  //
  //  [self.collectionView reloadData];
  
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
  UIAlertController *ac = [UIAlertController alertControllerWithTitle:@"选择" message:nil preferredStyle:UIAlertControllerStyleActionSheet];
  [ac addAction:[UIAlertAction actionWithTitle:@"相册" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
    [self pushImagePickerControllerEx];
  }]];
  [ac addAction:[UIAlertAction actionWithTitle:@"拍照" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
    [self takePhoto];
  }]];
  [ac addAction:[UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
    
  }]];
  [self.navcDelegate presentViewController:ac animated:YES completion:nil];
}
- (void)takePhotoOld {
  SoulCameraViewController * vc = [[SoulCameraViewController alloc] initWithNibName:nil bundle:nil];
  @weakify(vc,self);
  [vc setDidFinishPickingBlock:^(UIImage * _Nonnull image){
    SoulPhotoEditViewController * vc1 = [[SoulPhotoEditViewController alloc] initWithNibName:nil bundle:nil];
    vc1.inputImageBlock = ^UIImage * _Nonnull{
      return image;
    };
    [vc1 setDidFinishPickingBlock:^(NSString *localIdentifier) {
      if (localIdentifier) {
        PHAsset * asset = [NSMutableDictionary getPHAsset:localIdentifier];
        NSMutableDictionary * dic =  [[NSMutableDictionary alloc] initWithAsset:asset photoQuality:UploadPhotoQualityNormal];
        UIImage * thumbImage = [dic getThumbnail:NO];
        @strongify(self);
        [self.navcDelegate dismissViewControllerAnimated:NO completion:nil];
        [self refreshCollectionViewWithAddedAsset:(id)asset image:thumbImage];
      }
    }];
    @strongify(vc);
    
    //    [vc dismissViewControllerAnimated:YES completion:^{
    //
    //    }];
    [vc presentViewController:vc1 animated:NO completion:^{
      
    }];
    
    
  }];
  [self.navcDelegate presentViewController:vc animated:YES completion:nil];
}
- (void)takePhoto {
  SoulCameraViewControllerOrigin * vc = [[SoulCameraViewControllerOrigin alloc] init];
  UIImagePickerControllerSourceType sourceType = UIImagePickerControllerSourceTypeCamera;
  if (![UIImagePickerController isSourceTypeAvailable: UIImagePickerControllerSourceTypeCamera]) {
    NSLog(@"模拟器中无法打开照相机,请在真机中使用");
  } else {
    vc.sourceType = sourceType;
    vc.modalPresentationStyle = UIModalPresentationOverCurrentContext;
  }
  
  vc.delegate = vc;
  @weakify(self);
  [vc setDidFinishPickingBlock:^(UIImage * _Nonnull image){
    
    @strongify(self);
    [self.navcDelegate dismissViewControllerAnimated:NO completion:^{
      @strongify(self);
      SoulPhotoEditViewController * vc1 = [[SoulPhotoEditViewController alloc] initWithNibName:nil bundle:nil];
      vc1.inputImageBlock = ^UIImage * _Nonnull{
        return image;
      };
      [vc1 setDidFinishPickingBlock:^(NSString *localIdentifier) {
        @strongify(self);
        if (localIdentifier) {
          PHAsset * asset = [NSMutableDictionary getPHAsset:localIdentifier];
          NSMutableDictionary * dic =  [[NSMutableDictionary alloc] initWithAsset:asset photoQuality:UploadPhotoQualityNormal];
          UIImage * thumbImage = [dic getThumbnail:NO];
          [self refreshCollectionViewWithAddedAsset:(id)asset image:thumbImage];
        }
      }];
      [vc1 setDidCancelBlock:^{
      }];
      [self.navcDelegate presentViewController:vc1 animated:NO completion:nil];
    }];
    
    
  }];
  [self.navcDelegate presentViewController:vc animated:YES completion:nil];
}
+ (void)takePhotoOld:(UIViewController*)navcDelegate callback:(void(^)(NSArray * files))callback {
  SoulCameraViewController * vc = [[SoulCameraViewController alloc] initWithNibName:nil bundle:nil];
  @weakify(self);
  [vc setDidFinishPickingBlock:^(UIImage * _Nonnull image){
    [navcDelegate dismissViewControllerAnimated:NO completion:^{
      SoulPhotoEditViewController * vc1 = [[SoulPhotoEditViewController alloc] initWithNibName:nil bundle:nil];
      vc1.inputImageBlock = ^UIImage * _Nonnull{
        return image;
      };
      [vc1 setDidFinishPickingBlock:^(NSString *localIdentifier) {
        if (localIdentifier) {
          PHAsset * asset = [NSMutableDictionary getPHAsset:localIdentifier];
          @strongify(self);
          [navcDelegate dismissViewControllerAnimated:NO completion:nil];
          [WaitViewUtil startLoading];
          [self.class loadItem:asset finish:^(NSDictionary *data) {
            [WaitViewUtil endLoading];
            callback(@[data]);
          }];
        } else {
          callback(@[]);
        }
      }];
      [vc1 setDidCancelBlock:^{
        callback(@[]);
      }];
      [navcDelegate presentViewController:vc1 animated:NO completion:nil];
    }];
  }];
  [navcDelegate presentViewController:vc animated:YES completion:nil];
}

+ (void)takePhoto:(UIViewController*)navcDelegate callback:(void(^)(NSArray * files))callback {
  
  SoulCameraViewControllerOrigin * vc = [[SoulCameraViewControllerOrigin alloc] init];
  UIImagePickerControllerSourceType sourceType = UIImagePickerControllerSourceTypeCamera;
  if (![UIImagePickerController isSourceTypeAvailable: UIImagePickerControllerSourceTypeCamera]) {
    NSLog(@"模拟器中无法打开照相机,请在真机中使用");
  } else {
    vc.sourceType = sourceType;
    vc.modalPresentationStyle = UIModalPresentationOverCurrentContext;
  }
  
  vc.delegate = vc;
  @weakify(self);
  [vc setDidFinishPickingBlock:^(UIImage * _Nonnull image){
    [navcDelegate dismissViewControllerAnimated:NO completion:^{
      SoulPhotoEditViewController * vc1 = [[SoulPhotoEditViewController alloc] initWithNibName:nil bundle:nil];
      vc1.inputImageBlock = ^UIImage * _Nonnull{
        return image;
      };

      [vc1 setDidFinishPickingBlock:^(NSString *localIdentifier) {
        if (localIdentifier) {
          PHAsset * asset = [NSMutableDictionary getPHAsset:localIdentifier];
          @strongify(self);
          [WaitViewUtil startLoading];
          [self.class loadItem:asset finish:^(NSDictionary *data) {
            [WaitViewUtil endLoading];
            callback(@[data]);
          }];
        } else {
          callback(@[]);
        }
      }];
      [vc1 setDidCancelBlock:^{
        callback(@[]);
      }];
      [navcDelegate presentViewController:vc1 animated:NO completion:nil];
    }];
  }];
  [navcDelegate presentViewController:vc animated:YES completion:nil];
}


+ (void)imagePicker:(UIViewController*)navcDelegate callback:(void(^)(NSArray * files))callback {
  LPDImagePickerController *lpdImagePickerVc = [[LPDImagePickerControllerEx alloc] initWithMaxImagesCount:3 columnNumber:5 delegate:nil pushPhotoPickerVc:YES];
  lpdImagePickerVc.modalPresentationStyle = UIModalPresentationOverCurrentContext;
  lpdImagePickerVc.allowPickingVideo = NO;
  lpdImagePickerVc.allowPickingOriginalPhoto = NO;
  lpdImagePickerVc.allowTakePicture = NO;
  lpdImagePickerVc.sortAscendingByModificationDate = NO;
  
  lpdImagePickerVc.selectedAssets =[NSMutableArray array];
  lpdImagePickerVc.showSelectBtn = NO;
  lpdImagePickerVc.allowPreview = NO;
  lpdImagePickerVc.maxImagesCount = 3;
  
  [lpdImagePickerVc setDidFinishPickingPhotosHandle:^(NSArray<UIImage *> *photos, NSArray *assets, BOOL isSelectOriginalPhoto) {
    [WaitViewUtil startLoading];
    [self.class loadFiles:assets finish:^(NSArray *datas) {
      [WaitViewUtil endLoading];
      callback(datas);
    }];
  }];
  [lpdImagePickerVc setImagePickerControllerDidCancelHandle:^{
    callback(@[]);
  }];
  
  [navcDelegate presentViewController:lpdImagePickerVc animated:YES completion:nil];
}

- (void)pushImagePickerControllerEx {
  
  LPDImagePickerController *lpdImagePickerVc = [[LPDImagePickerControllerEx alloc] initWithMaxImagesCount:self.maxSelectedCount columnNumber:self.countPerRowInAlbum delegate:self pushPhotoPickerVc:YES];
  lpdImagePickerVc.modalPresentationStyle = UIModalPresentationOverCurrentContext;
  lpdImagePickerVc.allowPickingVideo = NO;
  lpdImagePickerVc.allowPickingOriginalPhoto = NO;
  lpdImagePickerVc.allowTakePicture = NO;
  lpdImagePickerVc.sortAscendingByModificationDate = NO;
  
  if (self.maxSelectedCount > 1) {
    NSInteger nPrev = self.selectedAssets.count;
    // 设置目前已经选中的图片数组去初始化picker
    NSPredicate * predicate = [NSPredicate predicateWithBlock:^BOOL(id  _Nullable evaluatedObject, NSDictionary<NSString *,id> * _Nullable bindings) {
      if([evaluatedObject isKindOfClass:[PHAsset class]]) {
        return YES;
      }
      return NO;
    }];
    lpdImagePickerVc.selectedAssets =[NSMutableArray arrayWithArray: [self.selectedAssets filteredArrayUsingPredicate:predicate]];
    lpdImagePickerVc.showSelectBtn = NO;
    lpdImagePickerVc.allowPreview = NO;
    lpdImagePickerVc.maxImagesCount = self.maxSelectedCount - (nPrev - lpdImagePickerVc.selectedAssets.count);
    
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
      
      [cell.imageThumbnail setImage:[UIImage imageNamed:@"icon_add_picture"]];
      cell.imageThumbnail.layer.borderWidth = 0;
//      
//      CAShapeLayer *border = [CAShapeLayer new];
//      //虚线的颜色
//      border.strokeColor = [UIColor grayColor].CGColor;
//      //填充的颜色
//      border.fillColor = [UIColor clearColor].CGColor;
//      
//      UIBezierPath *path = [UIBezierPath bezierPathWithRoundedRect:cell.imageThumbnail.bounds cornerRadius:0];
//      
//      //设置路径
//      border.path = path.CGPath;
//      
//      border.frame = cell.imageThumbnail.bounds;
//      //虚线的宽度
//      border.lineWidth = 1.f;
//      
//      
//      //设置线条的样式
//      //    border.lineCap = @"square";
//      //虚线的间隔
//      border.lineDashPattern = @[@3, @3];
//      
//      //      cell.imageThumbnail.layer.cornerRadius = 5.f;
//      cell.imageThumbnail.layer.masksToBounds = YES;
//      [cell.imageThumbnail.layer addSublayer:border];
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
    cell.imageThumbnail.contentMode = UIViewContentModeScaleAspectFill;
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
  if(!self.navcDelegate) {
    UIViewController *root = RCTPresentedViewController();
    self.navcDelegate = (UIViewController<LPDQuoteImagesViewDelegate>*) root ;    //self 至少是一个控制
  }
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
      @weakify(self);
      [selectImagePickerVc setDidFinishPickingPhotosHandle:^(NSArray<UIImage *> *photos, NSArray *assets, BOOL isSelectOriginalPhoto) {
        @strongify(self);
        [self processImages:photos assets:assets replace:YES];
      }];
      [self.navcDelegate presentViewController:selectImagePickerVc animated:YES completion:nil];
    }
  }
}
- (void)processImages:(NSArray<UIImage *>*)photos assets:(NSArray*)assets replace:(BOOL)replace{
  if (replace) {
    self.selectedPhotos = [NSMutableArray arrayWithArray:photos];
    self.selectedAssets = [NSMutableArray arrayWithArray:assets];
  } else {
    // 设置目前已经选中的图片数组去初始化picker
    NSPredicate * predicate = [NSPredicate predicateWithBlock:^BOOL(id  _Nullable evaluatedObject, NSDictionary<NSString *,id> * _Nullable bindings) {
      if(![evaluatedObject isKindOfClass:[PHAsset class]]) {
        return YES;
      }
      return NO;
    }];
    self.selectedAssets =[NSMutableArray arrayWithArray: [self.selectedAssets filteredArrayUsingPredicate:predicate]];
    
    NSPredicate * predicatePhoto = [NSPredicate predicateWithBlock:^BOOL(id  _Nullable evaluatedObject, NSDictionary<NSString *,id> * _Nullable bindings) {
      if(![evaluatedObject isKindOfClass:[UIImage class]]) {
        return YES;
      }
      return NO;
    }];
    self.selectedPhotos =[NSMutableArray arrayWithArray: [self.selectedPhotos filteredArrayUsingPredicate:predicatePhoto]];
    
    [self.selectedPhotos addObjectsFromArray:photos];
    [self.selectedAssets addObjectsFromArray:assets];
  }
  [self.collectionView reloadData];
  self.collectionView.contentSize = CGSizeMake(0, ((self.selectedPhotos.count + 2) / 3 ) * (_myMargin + _myItemWH));
  //  if(self.onChange) {
  //    self.onChange(@{@"images":@[]});
  //  }
}
+ (NSString*)getMD5WithData:(NSData *)data{
  const char* original_str = (const char *)[data bytes];
  unsigned char digist[CC_MD5_DIGEST_LENGTH]; //CC_MD5_DIGEST_LENGTH = 16
  CC_MD5(original_str, (uint)data.length, digist);
  NSMutableString* outPutStr = [NSMutableString stringWithCapacity:10];
  for(int  i =0; i<CC_MD5_DIGEST_LENGTH;i++){
    [outPutStr appendFormat:@"%02x",digist[i]];//小写x表示输出的是小写MD5，大写X表示输出的是大写MD5
  }
  
  //也可以定义一个字节数组来接收计算得到的MD5值
  //    Byte byte[16];
  //    CC_MD5(original_str, strlen(original_str), byte);
  //    NSMutableString* outPutStr = [NSMutableString stringWithCapacity:10];
  //    for(int  i = 0; i<CC_MD5_DIGEST_LENGTH;i++){
  //        [outPutStr appendFormat:@"%02x",byte[i]];
  //    }
  //    [temp release];
  
  return [outPutStr lowercaseString];
  
}
+ (void)loadItem:(PHAsset *)asset finish:(void(^)(NSDictionary *))finish {
  if ([asset isKindOfClass:[NSDictionary class]]) {
    finish((NSDictionary*)asset); // 传入的文件，直接就返回原数据。
    return;
  }
  // 检查是否已经存在了
  NSMutableDictionary * item = [[NSMutableDictionary alloc] initWithAsset:asset photoQuality:UploadPhotoQualityNormal];
  __block NSString * itemid = [[item getIdentifier] stringByAppendingPathExtension:@"png"];
  SDDataCache * sd = [SDDataCache fileDataCache];
  if([sd existInCachePathForKey:itemid]) {
    NSString * path = [[sd imageCache] defaultCachePathForKey:itemid];
    NSDictionary *attr = [[NSFileManager defaultManager] attributesOfItemAtPath:path error:nil];
    NSURL * fileUrl = [NSURL fileURLWithPath:path];
    id size = @"0";
    if (attr[NSFileSize]) {
      size = attr[NSFileSize];
    }
//    path = fileUrl.absoluteString;
    
    NSString * md5 = [self.class getMD5WithData:[NSData dataWithContentsOfURL:fileUrl]]; finish(@{@"path":path,@"key":itemid,@"md5":md5,@"name":fileUrl.lastPathComponent,@"length":size});
    return;
  }
  [item loadImageData:^(NSData *imageData) {
    [[SDDataCache fileDataCache] storeData:imageData forKey:itemid];
    NSString * path = [[[SDDataCache fileDataCache] imageCache] defaultCachePathForKey:itemid];
    NSURL * fileUrl = [NSURL fileURLWithPath:path];
//    path = fileUrl.absoluteString;
    NSString * md5 = [self.class getMD5WithData:[NSData dataWithContentsOfURL:fileUrl]]; finish(@{@"path":path,@"key":itemid,@"md5":md5,@"name":fileUrl.lastPathComponent,@"length":@(imageData.length)});
  }];
}
+ (void)loadNext:(NSMutableArray *)ret asset:(PHAsset *)asset next:(PHAsset *(^)(void))next{
  if(asset) {
    [self.class loadItem:asset finish:^(NSDictionary * path) {
      [ret addObject:path];
      PHAsset * nextItem = next();
      if(nextItem) {
        [self.class loadNext:ret asset:nextItem next:next];
      }
    }];
  } else {
    PHAsset * nextItem = next();
    if(nextItem) {
      [self.class loadNext:ret asset:nextItem next:next];
    }
  }
}
+ (void)loadFiles:(NSArray*)array finish:(void(^)(NSArray * files))finish {
  if(array.count < 1) {
    finish(@[]);
    return ;
  }
  __block NSUInteger nCount = array.count;
  __block NSUInteger nIndex = 0;
  __block NSMutableArray * ret = [NSMutableArray array];
  [self.class loadNext:ret asset:array[nIndex] next:^PHAsset *{
    nIndex ++;
    if(nIndex < nCount) {
      return array[nIndex];
    } else {
      finish(ret);
      return nil;
    }
  }];
}
- (void)loadFiles:(void(^)(NSArray * files))finish {
  [self.class loadFiles:[self.selectedAssets copy] finish:finish];
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

@implementation LPDImagePickerControllerEx
- (instancetype)initWithSelectedAssets:(NSMutableArray *)selectedAssets selectedPhotos:(NSMutableArray *)selectedPhotos index:(NSInteger)index {
  GLDPhotoPreviewViewController *previewVc = [[GLDPhotoPreviewViewController alloc] init];
  //  self = [super initWithSelectedAssets:nil selectedPhotos:nil index:0];
  
  self = [super initWithRootViewController:previewVc];
  if (self) {
//    [self configDefaultSetting];
    [self performSelector:@selector(configDefaultSetting)];
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


