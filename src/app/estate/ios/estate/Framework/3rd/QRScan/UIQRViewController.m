//
//  UIQRViewController.m
//  tesn
//
//  Created by soulimac on 15/6/12.
//  Copyright (c) 2017 ican. All rights reserved.
//
#import <AVFoundation/AVFoundation.h>
#import <AssetsLibrary/AssetsLibrary.h>
#import <libextobjc/EXTScope.h>

#import "UIQRViewController.h"
#import "UIWebViewController.h"
#import "UIAlterUtil.h"
#import "UIColor+RGBA.h"

#define kScreenW [UIScreen mainScreen].bounds.size.width
#define kScreenH [UIScreen mainScreen].bounds.size.height
#define centerX(rect, pRect)                                                   \
(CGRectMake((pRect.size.width - rect.size.width) / 2, rect.origin.y,         \
rect.size.width, rect.size.height))
#define kValidWidth kScreenW*0.618
#define kOffset kScreenW*0.191
#define kLineHeight 3
#define kBorder 13
@interface UIQRViewController ()<
    AVCaptureMetadataOutputObjectsDelegate, UIImagePickerControllerDelegate, UINavigationControllerDelegate>
{
  BOOL originalNavigationBarTrans;
}
@property(strong, nonatomic) AVCaptureDevice *device;
@property(strong, nonatomic) AVCaptureDeviceInput *input;
@property(strong, nonatomic) AVCaptureMetadataOutput *output;
@property(strong, nonatomic) AVCaptureSession *session;
@property(strong, nonatomic) AVCaptureVideoPreviewLayer *preview;
@property(strong, nonatomic) UINavigationController *navController;
@property(assign, nonatomic) BOOL enable;
@property(strong, nonatomic) NSString* tipMessage;
@property(strong, nonatomic) UIView* tipView;
@end

@implementation UIQRViewController

+ (UIViewController *)sharedController {
  return [[UIQRViewController alloc] init];
}

- (instancetype)init {
  [self setHidesBottomBarWhenPushed:YES];
  self = [super init];
  if (self) {
    [self setup];
  }
  return self;
}

- (void)viewDidLoad {
  [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
  [self createBarItem];
}
- (void)viewWillAppear:(BOOL)animated {
  [super viewWillAppear:animated];
  if (self.showTitle) {
    self.title = self.showTitle;
  }
  if (!self.isFromInvite) {
    if (self.presentingViewController) {
      UIBarButtonItem *barItem =
      [[UIBarButtonItem alloc] initWithTitle:@"取消" style:UIBarButtonItemStylePlain target:self action:@selector(back)];
      self.navigationItem.leftBarButtonItem = barItem;
    }
  }
  [self startRunning];
  
  originalNavigationBarTrans = self.navigationController.navigationBar.translucent;
  self.navigationController.navigationBar.translucent = YES;

}

-(void)viewWillDisappear:(BOOL)animated{
  [super viewWillDisappear:animated];
  self.navigationController.navigationBar.translucent = originalNavigationBarTrans;

}
- (void)back {
  [self dismissViewControllerAnimated:YES completion:^{
  }];
}

- (void)didReceiveMemoryWarning {
  [super didReceiveMemoryWarning];
  // Dispose of any resources that can be recreated.
}

- (void)setup {
    AVAuthorizationStatus authStatus =
        [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
    if (authStatus == ALAuthorizationStatusRestricted ||
        authStatus == ALAuthorizationStatusDenied) {
      [[UIAlterUtil sharedManager] showCamraAlterView:self];
      return;
    }
  
  // Device
  _device = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
  if(_device) {
    // Input
    _input = [AVCaptureDeviceInput deviceInputWithDevice:self.device error:nil];
    // Output
    _output = [[AVCaptureMetadataOutput alloc] init];
    [_output setMetadataObjectsDelegate:self queue:dispatch_get_main_queue()];
    
//    float widthPercentage = 1;
    
      //这个CGRectMake(Y,X,H,W) 1代表最大值    原点是导航右下角 为起始点
      
      //    [output setRectOfInterest:CGRectMake(0, 0.5, 0.5, 0.5)];//左上角 1/4 屏幕
      
      //    [output setRectOfInterest:CGRectMake(0.5, 0.5, 0.5, 0.5)];//左下角 1/4 屏幕
      
      //    [output setRectOfInterest:CGRectMake(0.5, 0, 0.5, 0.5)]; //右下角 1/4 屏幕
      
      //    [output setRectOfInterest:CGRectMake(0, 0, 0.5, 0.5)]; //右上角 1/4 屏幕
      
      //     [output setRectOfInterest:CGRectMake((124)/ScreenHigh,          ((ScreenWidth220)/2)/ScreenWidth,220/ScreenHigh,220/ScreenWidth)]; //设置自定义像素点的 位置
      
      CGFloat border = kBorder;
      CGRect rect = CGRectMake(kOffset - border, (kScreenH-kValidWidth)/2 - border, kValidWidth + 2*border, kValidWidth  + 2*border);
    [_output setRectOfInterest:CGRectMake(rect.origin.y / kScreenH,
                                          rect.origin.x / kScreenW,
                                          kValidWidth / kScreenH, kValidWidth / kScreenW)];
    // Session
    _session = [[AVCaptureSession alloc] init];
    [_session setSessionPreset:AVCaptureSessionPresetHigh];
    if ([_session canAddInput:self.input]) {
      [_session addInput:self.input];
    }
    if ([_session canAddOutput:self.output]) {
      [_session addOutput:self.output];
    }
    // 条码类型 AVMetadataObjectTypeQRCode
    _output.metadataObjectTypes = @[ AVMetadataObjectTypeQRCode ];
    // Preview
    _preview = [AVCaptureVideoPreviewLayer layerWithSession:_session];
    _preview.videoGravity = AVLayerVideoGravityResizeAspectFill;
    _preview.frame = self.view.layer.bounds;
    [self.view.layer insertSublayer:_preview atIndex:0];
  }
  // Start
  [self startRunning];
//  self.edgesForExtendedLayout = UIRectEdgeAll;
     _enable = YES;
  [self addMaskView];
  [self loopDrawLine];
 [self addMaskTipView];
  self.title = @"二维码";
   
}

- (void)alertView:(UIAlertView *)alertView
    clickedButtonAtIndex:(NSInteger)buttonIndex {
  if (alertView.tag == 100) {
    if (buttonIndex == 1) {
      NSURL *url = [NSURL URLWithString:UIApplicationOpenSettingsURLString];
      if ([[UIApplication sharedApplication] canOpenURL:url]) {
        [[UIApplication sharedApplication] openURL:url];
      }
    } else
      [self.navigationController popViewControllerAnimated:YES];
  }
}

#pragma mark AVCaptureMetadataOutputObjectsDelegate
- (void)captureOutput:(AVCaptureOutput *)captureOutput
    didOutputMetadataObjects:(NSArray *)metadataObjects
              fromConnection:(AVCaptureConnection *)connection {
    if (self.isStopScan) {
        return;
    }
    
  NSString *stringValue;
  if ([metadataObjects count] > 0) {
    // 停止扫描
      if (self.isContinueProcess && _scanType == QRScanTypeCallback) {
      } else {
          [_session stopRunning];
      }
    
    AVMetadataMachineReadableCodeObject *metadataObject =
        [metadataObjects objectAtIndex:0];
    stringValue = metadataObject.stringValue;
//    DNSLog(@"%@", stringValue);
    
    //是否是web端调用的扫码
    BOOL isWeb =  [[self class] isUpesnTypeUrl:stringValue filterStringArray:@[@"upesntype=h5url"]];
    if (self.sendFinish && (isWeb || _scanType == QRScanTypeCallback)) {
          self.sendFinish(@{@"qrString":stringValue});
      return;
    }
    [self.class processResultQRString:stringValue
                 navigationController:self.navigationController];
  }
}
- (void)startRunning {
  if (TARGET_IPHONE_SIMULATOR) {
    NSLog(@"模拟器");
    return;
  }
  if ([_session isRunning]) {
    return;
  }
  [_session startRunning];
}
- (BOOL)isModal {
  return self.presentingViewController.presentedViewController == self ||
         (self.navigationController != nil &&
          self.navigationController.presentingViewController
                  .presentedViewController == self.navigationController) ||
         [self.tabBarController.presentingViewController
             isKindOfClass:[UITabBarController class]];
}

#pragma mark 边框视图
- (void)addMaskView {
  UIImageView *imageView =
      [[UIImageView alloc] initWithFrame:self.view.layer.bounds];
  UIImage *imgBg = [self bgImage:imageView.frame.size];
  imageView.image = imgBg;
  [self.view addSubview:imageView];
    CGFloat border = kBorder;
    CGRect rect = CGRectMake(kOffset - border, (kScreenH-kValidWidth)/2 - border, kValidWidth + 2*border, kValidWidth  + 2*border);
    CGFloat w = 3;
    CGFloat h = 16;
    UIView * viewBorder = [[UIView alloc] initWithFrame:rect];
    viewBorder.layer.borderColor = [UIColor whiteColor].CGColor;
    viewBorder.backgroundColor = [UIColor clearColor];
    viewBorder.layer.borderWidth = 2.f;
    [self.view addSubview:viewBorder];
    UIView  * viewLT = [[UIView alloc] initWithFrame:CGRectMake(rect.origin.x, rect.origin.y, w, h)];
    NSString * hexColor = NSLocalizedStringFromTable(
                                                     @"HexColor", @"QrCodeBySoul", nil);
    UIColor * color = [UIColor greenColor];
    if (hexColor && ![hexColor isEqualToString:@"HexColor"]) {
        color = [UIColor colorWithHexStringToColor:hexColor];
    }
    viewLT.backgroundColor = color;
    UIView  * viewTL = [[UIView alloc] initWithFrame:CGRectMake(rect.origin.x, rect.origin.y, h, w)];
    viewTL.backgroundColor = color;
    UIView  * viewRT = [[UIView alloc] initWithFrame:CGRectMake(rect.origin.x + rect.size.width - w, rect.origin.y, w, h)];
    viewRT.backgroundColor = color;
    UIView  * viewTR = [[UIView alloc] initWithFrame:CGRectMake(rect.origin.x + rect.size.width - h, rect.origin.y, h, w)];
    viewTR.backgroundColor = color;
    UIView  * viewLB = [[UIView alloc] initWithFrame:CGRectMake(rect.origin.x, rect.origin.y + rect.size.height - h, w, h)];
    viewLB.backgroundColor = color;
    UIView  * viewBL = [[UIView alloc] initWithFrame:CGRectMake(rect.origin.x, rect.origin.y + rect.size.height - w, h, w)];
    viewBL.backgroundColor = color;
    UIView  * viewRB = [[UIView alloc] initWithFrame:CGRectMake(rect.origin.x + rect.size.width - w, rect.origin.y + rect.size.height - w - h, w, h)];
    viewRB.backgroundColor = color;
    UIView  * viewBR = [[UIView alloc] initWithFrame:CGRectMake(rect.origin.x + rect.size.width - h, rect.origin.y + rect.size.height - w, h, w)];
    viewBR.backgroundColor = color;
    
    [self.view addSubview:viewLT];
    [self.view addSubview:viewTL];
    [self.view addSubview:viewLB];
    [self.view addSubview:viewBL];
    [self.view addSubview:viewRB];
    [self.view addSubview:viewBR];
    [self.view addSubview:viewRT];
    [self.view addSubview:viewTR];
    
}


    
- (UIImage *)bgImage:(CGSize)size {
//  CGRect rect = CGRectMake((kScreenW - 220) / 2, 124, 220, 220);
  CGRect rect = CGRectMake(kOffset, (kScreenH-kValidWidth)/2, kValidWidth, kValidWidth);

  
  UIGraphicsBeginImageContextWithOptions(size, NO,[UIScreen mainScreen].scale);
//  UIGraphicsBeginImageContext(size);
  //设置属性
  [[UIColor colorWithWhite:0 alpha:0.5] set];
  //绘制矩形,相当于创建对象、添加对象到上下文、绘制三个步骤
  UIRectFill(self.view.layer.bounds);  //绘制矩形（只有填充）
  [[UIColor clearColor] set];
  //绘制矩形,相当于创建对象、添加对象到上下文、绘制三个步骤
  UIRectFill(rect);  //绘制矩形（只有填充）
    
    UIColor *color = [UIColor whiteColor];        //字体颜色
    
    NSString * hexColor = NSLocalizedStringFromTable(
                                                     @"HexColor", @"QrCodeBySoul", nil);
    if (hexColor && ![hexColor isEqualToString:@"HexColor"]) {
        color = [UIColor colorWithHexStringToColor:hexColor];
    }
    
  //设置属性
  [color setStroke];

  //绘制矩形,相当于创建对象、添加对象到上下文、绘制三个步骤
//  UIRectFrame(rect);  //绘制矩形（只有填充）
  NSString *str = NSLocalizedStringFromTable(
                                              @"将二维码放到框内，即可自动扫描", @"QrCodeBySoul", nil);
  CGRect rect1 = CGRectMake(rect.origin.x, rect.origin.y+kValidWidth+kBorder*3, kValidWidth, 220);
  UIFont *font = [UIFont systemFontOfSize:14];  //设置字体
  
  NSMutableParagraphStyle *style =
      [[NSMutableParagraphStyle alloc] init];     //段落样式
  NSTextAlignment align = NSTextAlignmentCenter;  //对齐方式
  style.alignment = align;
  [str drawInRect:rect1
      withAttributes:@{
        NSFontAttributeName : font,
        NSForegroundColorAttributeName : color,
        NSParagraphStyleAttributeName : style
      }];

  //生成新的image

  UIImage *newimg = UIGraphicsGetImageFromCurrentImageContext();

  UIGraphicsEndImageContext();

  return newimg;
}

#pragma mark 边框视图
- (void)removeMaskTipView {
    if(_tipView) {
        [_tipView removeFromSuperview];
    }
    _tipView = nil;
}
- (void)addMaskTipView {
    [self removeMaskTipView];
    self.navigationItem.rightBarButtonItem.enabled = self.enable;
    if(self.enable) {
        return;
    }
    
    CGRect rect = CGRectMake(kOffset, (kScreenH-kValidWidth)/2, kValidWidth, kValidWidth);
    UILabel * label = [[UILabel alloc] initWithFrame:rect];
    label.text = _tipMessage;
    label.numberOfLines = 0;
    label.font = [UIFont systemFontOfSize:14];
    label.lineBreakMode = NSLineBreakByWordWrapping;
    [label setBackgroundColor:[UIColor colorWithWhite:0 alpha:0.5]];
    [label setTextColor:[UIColor whiteColor]];
    _tipView = label;
    [self.view addSubview:_tipView];
}
    
#pragma mark 绘制矩形（利用UIKit的封装方法）
- (void)drawRectByUIKitWithContext:(CGContextRef)context rect:(CGRect)rect {
  //设置属性
  [[UIColor yellowColor] set];
  //绘制矩形,相当于创建对象、添加对象到上下文、绘制三个步骤
  UIRectFill(rect);  //绘制矩形（只有填充）

  [[UIColor redColor] setStroke];
  UIRectFrame(rect);  //绘制矩形(只有边框)
}

- (UIImage *)borderImage:(CGSize)size {
//  UIGraphicsBeginImageContext(size);
  UIGraphicsBeginImageContextWithOptions(size, NO,[UIScreen mainScreen].scale);
  CGContextRef context = UIGraphicsGetCurrentContext();

  //圆的边框宽度为2，颜色为红色

  CGContextSetLineWidth(context, 1);

  CGContextSetStrokeColorWithColor(context, [UIColor redColor].CGColor);
  CGContextSetFillColorWithColor(context, [UIColor clearColor].CGColor);
  CGRect rect = CGRectMake(0, 0, size.width, size.height);

  CGContextAddRect(context, rect);

  CGContextClip(context);

  CGContextStrokePath(context);

  //生成新的image

  UIImage *newimg = UIGraphicsGetImageFromCurrentImageContext();

  UIGraphicsEndImageContext();

  return newimg;
}
 
#pragma mark 扫描动画
- (void)loopDrawLine {
    
   CGRect rect = CGRectMake(kOffset + 10, (kScreenH-kValidWidth)/2, kValidWidth - 20, kLineHeight);

  UIImageView *readLineView = [[UIImageView alloc] initWithFrame:rect];
    
    UIColor *color = [UIColor greenColor];        //字体颜色
    
    NSString * hexColor = NSLocalizedStringFromTable(
                                                     @"HexColor", @"QrCodeBySoul", nil);
    if (hexColor && ![hexColor isEqualToString:@"HexColor"]) {
        color = [UIColor colorWithHexStringToColor:hexColor];
    }
    UIColor * color1 = [UIColor colorWith255Red:98 green:233 blue:189 alpha:0.0];
     UIColor * color2 = [UIColor colorWith255Red:51 green:206 blue:135 alpha:1.0];
     UIColor * color3 = [UIColor colorWith255Red:51 green:206 blue:135 alpha:0.0];
    CAGradientLayer *gradientLayer = [CAGradientLayer layer];
    gradientLayer.colors = @[(__bridge id)color1.CGColor, (__bridge id)color2.CGColor, (__bridge id)color3.CGColor];
    gradientLayer.locations = @[@0.0, @0.5, @1.0];
    gradientLayer.startPoint = CGPointMake(0, 0);
    gradientLayer.endPoint = CGPointMake(1.0, 0);
    gradientLayer.frame = readLineView.bounds;
    readLineView.alpha = 0.75;
    [readLineView.layer addSublayer:gradientLayer];
    [readLineView setBackgroundColor:[UIColor clearColor]];
  [self.view addSubview:readLineView];
  [self run:readLineView];
}
- (void)run:(UIView *)readLineView {
//  CGRect rect =
//      centerX(CGRectMake((kScreenW - 220) / 2, 124, 220, 1), self.view.frame);
//  
  CGRect rect =
  centerX(CGRectMake(kOffset + 10, (kScreenH-kValidWidth)/2, kValidWidth - 20, kLineHeight), self.view.frame);
  readLineView.frame = rect;
  @weakify(self);
  [UIView animateWithDuration:3.0
      delay:0.0
      options:UIViewAnimationOptionCurveEaseIn
      animations:^{
        //修改fream的代码写在这里
//        readLineView.frame = centerX(
//            CGRectMake((kScreenW - 220) / 2, 344, 220, 1), self.view.frame);
        readLineView.frame = centerX(
                                     CGRectMake(kOffset + 10, (kScreenH-kValidWidth)/2+kValidWidth, kValidWidth - 20, kLineHeight), self.view.frame);

        
      }
      completion:^(BOOL finished) {
        @strongify(self);
        [self run:readLineView];
      }];
}

#pragma mark - 处理扫描结果
+ (BOOL) isUpesnTypeUrl:(NSString *)urlString filterStringArray:(nonnull NSArray *) filters {
  if (!urlString) {
    return NO;
  }
  NSString *resultString = urlString;
  for (NSString * filter in filters) {
    if (!filter) {
      continue;
    }
    if([resultString rangeOfString:filter].length > 0) {
      return YES;
    }
  }
  return NO;
}

+ (BOOL) isPattenUrl:(NSString *)urlString filterStringArray:(nonnull NSArray *) filters {
  if (!urlString) {
    return NO;
  }
  NSString *resultString = urlString;
  for (NSString * filter in filters) {
    if (!filter) {
      continue;
    }
    if([resultString rangeOfString:filter].length > 0) {
      return YES;
    }
  }
  return NO;
}

+ (nullable NSDictionary*)parseQRMessageString:(nonnull NSString*)messageString {
  if (!messageString) {
    return nil;
  }
  
  NSRange rang = [messageString rangeOfString:@"?"];
  NSString * resultString = [messageString substringFromIndex:rang.location + 1];
  NSArray *equalArrary = [resultString componentsSeparatedByString:@"&"];
  NSMutableDictionary *qkMarkUrlDic = [NSMutableDictionary dictionary];
  for (NSString *keyValue in equalArrary) {
    if (!keyValue) {
      continue;
    }
    NSArray *arr = [keyValue componentsSeparatedByString:@"="];
    if (arr.count != 2) {
      continue;
    }
    [qkMarkUrlDic setValue:arr[1] forKey:arr[0]];
  }
  return qkMarkUrlDic;
}

+ (void)processResultQRString:(NSString *)QRString
         navigationController:(UINavigationController *)navigationController {
  [self processResultQRString:QRString finishedProcessQRCodeBlock:^(BOOL isQRCode) {
    if (isQRCode) {
      if ([navigationController isKindOfClass:[UINavigationController class]]) {
        [navigationController popToRootViewControllerAnimated:YES];
      }
    } else {
      UIWebViewController *webView = [[UIWebViewController alloc] init];
      webView.url = QRString;
      UINavigationController *nav = navigationController;
      [nav popViewControllerAnimated:NO];
      [nav pushViewController:webView animated:YES];
    }
  } navigationController:navigationController];
}

+ (void)processResultQRString:(nonnull NSString *)QRString
   finishedProcessQRCodeBlock:(nullable CKPFinishedProcessQRCodeBlock)finishedProcessQRCodeBlock navigationController:(UINavigationController *)navigationController {
  
//  NSString *resultString = QRString;
 
  finishedProcessQRCodeBlock(NO);
}


#pragma mark - 从相册读取二维码

- (void)createBarItem {
    if(!_notUserPicture) {
        UIBarButtonItem *barItem =
        [[UIBarButtonItem alloc] initWithTitle:@"相册" style:UIBarButtonItemStylePlain target:self action:@selector(barItem)];
        self.navigationItem.rightBarButtonItem = barItem;
    }
}

- (void)barItem {
    if(_notUserPicture) {
        return;
    }
  UIImagePickerController *picker = [[UIImagePickerController alloc] init];
  picker.allowsEditing = NO;
  picker.delegate = self;
  picker.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
  [self presentViewController:picker
                     animated:YES
                   completion:^{
                   }];
}

- (void)imagePickerController:(UIImagePickerController *)picker
didFinishPickingMediaWithInfo:(NSDictionary *)info

{
  UIImage *image = [info objectForKey:UIImagePickerControllerOriginalImage];
  
  NSString * qrCode = [self.class QRCodeScan:image];
  if(qrCode) {
    __block NSString *messageString = qrCode;
    @weakify(self);
    [picker
     dismissViewControllerAnimated:YES
     completion:^{
       @strongify(self);
       if (self.sendFinish && _scanType == QRScanTypeCallback) {
         self.sendFinish(@{@"qrString":messageString});
         return;
       }
      [self.class processResultQRString:messageString
                    navigationController:
        self.navigationController];
     }];
    return;
  }
  [picker dismissViewControllerAnimated:YES completion:^{
    UIAlertView *al = [[UIAlertView alloc]
                       initWithTitle:@"提示"
                       message:@"未发现二维码"
                       delegate:nil
                       cancelButtonTitle:@"确定"
                       otherButtonTitles:nil, nil];
    [al show];
  }];
}
    /**
     不可用时进行提示
     
     @param enabled 扫码功能是否可用
     @param tip 不可以用时的提示
     */
- (void)enable:(BOOL)enabled tip:(nullable NSString*)tip {
    _enable = enabled;
    _tipMessage = tip;
    [self addMaskTipView];
    if(_enable) {
        NSLog(@"\n B: >>>%@",tip);
        [self startRunning];
    } else {
        NSLog(@"\n A:%@",tip);
        if([_session isRunning]) {
            [_session stopRunning];
        }
    }
    
}
    
+ (nullable NSString *)QRCodeScan:(nonnull UIImage *)image {
  
  NSString * retQRCode = [self.class QRCodeScanUseSystem:image];
  if (retQRCode) {
    return retQRCode;
  }
  return @"";
}

+ (nullable NSString *)QRCodeScanUseSystem:(nonnull UIImage *)image {
  NSNumber *orientation = [NSNumber numberWithInt:[image imageOrientation]];
  NSDictionary *imageOptions =
  [NSDictionary dictionaryWithObject:orientation
                              forKey:CIDetectorImageOrientation];
  CIImage *ciimage =
  [CIImage imageWithCGImage:[image CGImage] options:imageOptions];
  
  NSDictionary *detectorOptions =
  [NSDictionary dictionaryWithObject:CIDetectorAccuracyLow
                              forKey:CIDetectorAccuracy];
  CIDetector *detector = [CIDetector detectorOfType:CIDetectorTypeQRCode
                                            context:nil
                                            options:detectorOptions];
  NSArray *features = [detector featuresInImage:ciimage];
  
  for (CIFeature *feature in features) {
    if (![feature isKindOfClass:CIQRCodeFeature.class]) {
      continue;
    }
    CIQRCodeFeature *QRCodeFeature = (CIQRCodeFeature *)feature;
    return QRCodeFeature.messageString;
  }
  return nil;
}

- (BOOL)shouldAutorotate {
  return YES;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
  return UIInterfaceOrientationMaskPortrait;
}

- (UIStatusBarStyle)preferredStatusBarStyle {
  return UIStatusBarStyleDefault;
}
@end
