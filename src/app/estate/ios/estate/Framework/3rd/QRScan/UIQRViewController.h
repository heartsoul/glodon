//
//  UIQRViewController.h
//  tesn
//
//  Created by soul on 15/6/12.
//  Copyright © 2017 ican. All rights reserved.
//

#import <UIKit/UIKit.h>

typedef void(^CKPFinishedProcessQRCodeBlock)(BOOL isQRCode);
typedef BOOL (^CKPProcessQRCodeBlock)(NSDictionary * _Nonnull data);

typedef enum : NSUInteger {
  QRScanTypeAuto,
  QRScanTypeCallback,

} QRScanType;

@interface UIQRViewController : UIViewController
@property (nonatomic, strong, nonnull) NSString *showTitle;
@property (nonatomic,assign) BOOL isFromInvite;

// 扫码类型
@property (nonatomic, assign) QRScanType scanType;

@property (nonatomic, assign) BOOL isStopScan;
@property(assign, nonatomic) BOOL notUserPicture; // 是否使用相册

/**
 *  是否连续扫描
 */
@property (nonatomic,assign) BOOL isContinueProcess;
/**
 *  扫描成功回调
 */
@property (nonatomic,copy,nonnull) CKPProcessQRCodeBlock sendFinish;
- (void)startRunning;
/**
 不可用时进行提示

 @param enabled 扫码功能是否可用
 @param tip 不可以用时的提示
 */
- (void)enable:(BOOL)enabled tip:(nullable NSString*)tip;

+ (nonnull UIQRViewController *)sharedController;
+ (void)processResultQRString:(nonnull NSString *)QRString
           navigationController:(nonnull UINavigationController *)navigationController;
+ (void)processResultQRString:(nonnull NSString *)QRString
         finishedProcessQRCodeBlock:(nullable CKPFinishedProcessQRCodeBlock) finishedProcessQRCodeBlock navigationController:(nullable UINavigationController *)navigationController;
+ (nullable NSString *)QRCodeScan:(nonnull UIImage *)image; // 扫描图片，检测图片中的二维码，检测不到就返回nil，检测到就返回对应的二维码
+ (BOOL)isPattenUrl:(nonnull NSString *)urlString filterStringArray:(nonnull NSArray *)filters;
+ (nullable NSDictionary*)parseQRMessageString:(nonnull NSString*)messageString;
@end
