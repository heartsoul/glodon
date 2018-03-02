//
//  WaitViewUtil.h
//  meinvlios
//
//  Created by soul on 13-9-3.
//  Copyright (c) 2013年 soul. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <QuartzCore/QuartzCore.h>
/* 等待覆盖的区域偏移量 NSOffHeight */
#define NSOffHeightMask                 0xFFFF // 用户自定义时使用这个 例如 NSOffHeightMask & 200
#define NSOffHeightFullScreen           0    // 全屏
#if TARGET_OS_IPHONE
    // top
#define NSOffTopSysBar                  20    // 系统显示栏
#define NSOffTopNavigator               64    // 有导航条
    // bottom
#define NSOffBottomTab                  44    // 有Tab条
#endif


@interface WaitViewUtil : UIView
+(void)startLoading;
+(void)endLoading;
//初始化
+(WaitViewUtil *) sharedWaitView;
+(WaitViewUtil *)sharedWaitView:(UIWindow*)window;
//设置超时关闭时间间隔
-(void) setTimeOut:(CGFloat)timeInterval;
//开启加载状态
-(void) startLoading;
//文档上传加载
- (void) startLoadingDoc;
-(void) startLoadingWithOffHeightTop:(NSInteger)offHeightTop offHeightBottom:(NSInteger)offHeightBottom;
//结束加载状态
-(void) endLoading;
- (void) updateText:(NSString *) text;
+ (void)showTip:(NSString*)tip;


@property (nonatomic, strong)           UILabel         *label;
@property (nonatomic, strong, readonly) NSTimer         *timer;
@property (nonatomic, assign, setter=setTimeOut:) CGFloat timeInterval;
@end
