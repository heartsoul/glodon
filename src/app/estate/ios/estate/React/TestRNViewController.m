//
//  TestRNViewController.m
//  estate
//
//  Created by glodon on 2018/2/28.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "TestRNViewController.h"
#import "GLDRNBridgeModule.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTImageSource.h>
#import "AppDelegate.h"
#import "WaitViewUtil.h"
@interface TestRNViewController ()<UINavigationControllerDelegate,UIImagePickerControllerDelegate>

@end

@implementation TestRNViewController

- (void)awakeFromNib {
  [super awakeFromNib];
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)openRNPage:(id)sender {
    // 执行
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.01 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      [[self class] openRN:nil];
    });
  
  
  
}
- (void)openRN:(NSDictionary*)data {
  // 主动调用 rn
//  [GLDRNBridgeModule emitEventWithName:RNAPI_test andPayload:@{@"title":@"Tip", @"msg":@"hello world", @"buttons":@[]}];
  
  NSLog(@"High Score Button Pressed");
  NSURL *jsCodeLocation;
  
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"estate"
                                               initialProperties:@{@"userName":@"18800105362", @"password":@"123qwe!@#"}
                                                   launchOptions:nil];
  
  UIViewController *viewController = [[UIViewController alloc] init];
  viewController.view = rootView;
  [self pushViewController:viewController animated:YES];
}
/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/



#pragma mark - 上传头像相关
- (void)takePhotoInner {
  if (TARGET_IPHONE_SIMULATOR) {
    [WaitViewUtil showTip:@"模拟器！"];
    return;
  }
  UIImagePickerController *PickerC = [[UIImagePickerController alloc] init];
  PickerC.delegate = self;
  PickerC.allowsEditing = YES;
  PickerC.sourceType = UIImagePickerControllerSourceTypeCamera;
  PickerC.navigationBar.translucent = NO;
  PickerC.modalPresentationCapturesStatusBarAppearance = YES;
  UIWindow *keyWindow = [UIApplication sharedApplication].keyWindow;
  UIViewController *  viewController = keyWindow.rootViewController;
  while (viewController.presentedViewController) {
    viewController = viewController.presentedViewController;
  }
  [viewController presentViewController:PickerC animated:YES completion:nil];
}

- (void)navigationController:(UINavigationController *)navigationController
      willShowViewController:(UIViewController *)viewController
                    animated:(BOOL)animated {
  if ([navigationController isKindOfClass:[UIImagePickerController class]] &&
      ((UIImagePickerController *)navigationController).sourceType == UIImagePickerControllerSourceTypePhotoLibrary) {
    navigationController.navigationBar.translucent = NO;
  }
}
//
//- (void)addPhotoInner {
//  LPDQuoteImagesView *quoteImagesView =[[LPDQuoteImagesView alloc] initWithFrame:CGRectMake(0, 0, 400, 100) withCountPerRowInView:5 cellMargin:12];
//  //初始化view的frame, view里每行cell个数， cell间距（上方的图片1 即为quoteImagesView）
//  // 注：设置frame时，我们可以根据设计人员给的cell的宽度和最大个数、排列，间距去大致计算下quoteview的size.
//  quoteImagesView.maxSelectedCount = 6;
//  //最大可选照片数
//
//  quoteImagesView.collectionView.scrollEnabled = NO;
//  //view可否滑动
//
//  quoteImagesView.navcDelegate = self.parentViewController;    //self 至少是一个控制器。
//  //委托（委托controller弹出picker，且不用实现委托方法）
//
//  [self.imageCollectionView addSubview:quoteImagesView];
//
//  //    UIImagePickerController *PickerC = [[UIImagePickerController alloc] init];
//  //    PickerC.delegate = self;
//  //    PickerC.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
//  //    [self.parentViewController presentViewController:PickerC animated:YES completion:nil];
//
//}

- (void)addPhotoInner {
  
  UIImagePickerController *PickerC = [[UIImagePickerController alloc] init];
  PickerC.delegate = self;
  PickerC.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
  UIWindow *keyWindow = [UIApplication sharedApplication].keyWindow;
  UIViewController *  viewController = keyWindow.rootViewController;
  while (viewController.presentedViewController) {
    viewController = viewController.presentedViewController;
  }
  [viewController presentViewController:PickerC animated:YES completion:nil];
  
}

- (void)addPhoto {
  [self.view endEditing:YES];
  
  UIAlertController * ac = [UIAlertController alertControllerWithTitle:@"选择" message:nil preferredStyle:UIAlertControllerStyleActionSheet];
  if (!TARGET_IPHONE_SIMULATOR) {
    [ac addAction:[UIAlertAction actionWithTitle:@"拍照" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
      [self takePhotoInner];
    }]];
  }
  [ac addAction:[UIAlertAction actionWithTitle:@"相册" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
    [self addPhotoInner];
  }]];
  
  [ac addAction:[UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
    
  }]];
  
  UIWindow *keyWindow = [UIApplication sharedApplication].keyWindow;
  UIViewController *  viewController = keyWindow.rootViewController;
  while (viewController.presentedViewController) {
    viewController = viewController.presentedViewController;
  }
  ac.modalPresentationCapturesStatusBarAppearance = YES;
  [viewController presentViewController:ac animated:YES completion:nil];
}

#pragma mark - UIImagePickerController delegate
- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker {
  [picker dismissViewControllerAnimated:YES completion:nil];
}
- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingImage:(UIImage *)image editingInfo:(nullable NSDictionary<NSString *,id> *)editingInfo NS_DEPRECATED_IOS(2_0, 3_0) {
  if(picker.sourceType == UIImagePickerControllerSourceTypeCamera) {
    UIImageWriteToSavedPhotosAlbum(image, nil, nil,
                                   NULL);
  }
  [picker dismissViewControllerAnimated:YES completion:nil];
//  [WaitViewUtil startLoading];
//  //UIImage转换为NSData
//  NSData *imageData = [UIImage compressImage:image];
//
//  __block FileUrlModel * model = [[FileUrlModel alloc] init];
//  NSString * md5 = [GLDUploadService getMD5WithData:imageData];
//  model.fileName = [md5 stringByAppendingString:@".jpg"];//urlFile.lastPathComponent;;
//  //    model.mimeType = @"application/octet-stream";
//  model.mimeType = @"image/jpeg";
//  model.md5 = md5;
//  model.data = imageData;
//  model.name = @"file";
//  [GLDUploadService gDocGetOperationCodeApiDelegate:nil model:model returnBlock:^(NSDictionary *responseDictionary, GLDRequestModel *requestModel) {
//
//    GLDPrevUploadFileModel * fileModel = [[GLDPrevUploadFileModel alloc] initWithContent:responseDictionary];
//    NSInteger prevHeight = self.imageCollectionViewHeight;
//    if(fileModel.gDocId) {
//      GLDQuestionAttachmentModel * attachmentModel = [[GLDQuestionAttachmentModel alloc] init];
//      attachmentModel.gDocId = fileModel.gDocId;
//      attachmentModel.size = [NSString stringWithFormat:@"%@", @(model.data.length)] ;
//      attachmentModel.fileName = model.fileName;
//      attachmentModel.type = @"jpg";
//      attachmentModel.md5 = model.md5;
//      [self.questionModel.formItemList.firstObject.attachedFileIdList addObject:attachmentModel];
//      self.questionModel.formItemList.firstObject.hasModify = YES;
//      self.questionModel.hasModify = YES;
//      [[SDDataCache fileDataCache] storeData:[UIImage compressImage:[UIImage imageWithData:model.data] w:80 h:80 r:1] forKey:[attachmentModel downloadUrl]];
//      NSFileManager *fileManager = [NSFileManager defaultManager];
//      NSString * pathDir = [SoulDownLoadView getLocalPath:[attachmentModel downloadUrl] fileName:nil];
//      if (![fileManager fileExistsAtPath:pathDir]) {
//        [fileManager createDirectoryAtPath:pathDir
//               withIntermediateDirectories:YES
//                                attributes:nil
//                                     error:nil];
//      }
//      [[SDDataCache fileDataCache] storeData:model.data forPath:[SoulDownLoadView getLocalPath:[attachmentModel downloadUrl] fileName:[attachmentModel fileName]]];
//      //            [[SDImageCache sharedImageCache] storeImage:[UIImage imageWithData:model.data] forKey:[attachmentModel downloadUrl]];
//      if (prevHeight != self.imageCollectionViewHeight) {
//        [self reloadData];
//        [self.imageCollectionView reloadData];
//      } else {
//        [self.imageCollectionView reloadData];
//      }
//      //            {"id":"41f01f5b89924b1b97d5f5384525fdca","name":"e9dd2797018cad79186e03e8c5aec8dc.jpg","extension":"jpg","digest":"6db65a8bf7301ab61adab8ab7fcf6611","length":3332,"appKey":"10f23e8c22c34421a6c97db828874b78","createTime":1514357395912,"appkey":"10f23e8c22c34421a6c97db828874b78"}}
//      [WaitViewUtil endLoading];
//    } else {
//      [GLDUploadService gDocUploadApiDelegate:nil operationCode:fileModel.operationCode model:model returnBlock:^(NSDictionary *responseDictionary, GLDRequestModel *requestModel) {
//        GLDUploadFileModel * retFileModel = [[GLDUploadFileModel alloc] initWithContent:responseDictionary];
//        GLDQuestionAttachmentModel * attachmentModel = [[GLDQuestionAttachmentModel alloc] init];
//        attachmentModel.gDocId = retFileModel.fileId;
//        attachmentModel.size = [NSString stringWithFormat:@"%@", retFileModel.length];
//        attachmentModel.fileName = retFileModel.name;
//        attachmentModel.md5 = model.md5;
//        attachmentModel.type = retFileModel.extension;
//        [self.questionModel.formItemList.firstObject.attachedFileIdList addObject:attachmentModel];
//        self.questionModel.formItemList.firstObject.hasModify = YES;
//        self.questionModel.hasModify = YES;
//        [[SDDataCache fileDataCache] storeData:[UIImage compressImage:[UIImage imageWithData:model.data] w:80 h:80 r:1] forKey:[attachmentModel downloadUrl]];
//        NSFileManager *fileManager = [NSFileManager defaultManager];
//        NSString * pathDir = [SoulDownLoadView getLocalPath:[attachmentModel downloadUrl] fileName:nil];
//        if (![fileManager fileExistsAtPath:pathDir]) {
//          [fileManager createDirectoryAtPath:pathDir
//                 withIntermediateDirectories:YES
//                                  attributes:nil
//                                       error:nil];
//        }
//        [[SDDataCache fileDataCache] storeData:model.data forPath:[SoulDownLoadView getLocalPath:[attachmentModel downloadUrl] fileName:[attachmentModel fileName]]];
//        //                [[SDImageCache sharedImageCache] storeImage:[UIImage imageWithData:model.data] forKey:[attachmentModel downloadUrl]];
//        if (prevHeight != self.imageCollectionViewHeight) {
//          [self reloadData];
//          [self.imageCollectionView reloadData];
//        } else {
//          [self.imageCollectionView reloadData];
//        }
//        //                {"id":"41f01f5b89924b1b97d5f5384525fdca","name":"e9dd2797018cad79186e03e8c5aec8dc.jpg","extension":"jpg","digest":"6db65a8bf7301ab61adab8ab7fcf6611","length":3332,"appKey":"10f23e8c22c34421a6c97db828874b78","createTime":1514357395912,"appkey":"10f23e8c22c34421a6c97db828874b78"}}
//        //                {
//        //                    "createTime": "2017-12-19T01:50:44.276Z",
//        //                    "digest": "string",
//        //                    "extension": "string",
//        //                    "id": "string",
//        //                    "length": 0,
//        //                    "name": "string"
//        //                }
//
//        [WaitViewUtil endLoading];
//      } errorBlock:^(NSError *error, GLDRequestModel *requestModel) {
//        [WaitViewUtil endLoading];
//      } progress:^(NSProgress *progress) {
//        if([progress isFinished]) {
//          [[WaitViewUtil sharedWaitView] updateText:@"上传完成。"];
//        } else {
//          NSString * progressText = [NSString stringWithFormat:@"%.0f", (100.0f * progress.completedUnitCount / progress.totalUnitCount)];
//          [[WaitViewUtil sharedWaitView] updateText:progressText];
//        }
//      }];
//    }
//  } errorBlock:^(NSError *error, GLDRequestModel *requestModel) {
//    [WaitViewUtil endLoading];
//  } progress:^(NSProgress *progress) {
//
//  }];
}
+ (instancetype) shareInstanc {
  static TestRNViewController * VC = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    VC = [TestRNViewController new];
  });
  return VC;
}
+ (void)callPhotoTest {
  [[[self class] shareInstanc] addPhoto];
}
@end
