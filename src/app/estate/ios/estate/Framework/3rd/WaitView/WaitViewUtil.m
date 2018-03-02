//
//  WaitViewUtil.m
//  meinvlios
//
//  Created by soul on 13-9-3.
//  Copyright (c) 2013年 soul. All rights reserved.
//

// 1.header file
#import <UIKit/UIKit.h>

#import "UIView+MBProgressHUD.h"
#import "WaitViewUtil.h"
#define centerXY(rect,pRect) (CGRectMake((pRect.size.width - rect.size.width) / 2, (pRect.size.height - rect.size.height) / 2, rect.size.width, rect.size.height))
#define iPhone5 ([UIScreen instancesRespondToSelector:@selector(currentMode)] ? [[UIScreen mainScreen] currentMode].size.height >= 1136 : NO)
@interface InsetsLabel : UILabel
@property(nonatomic) UIEdgeInsets insets;
- (id)initWithFrame:(CGRect)frame andInsets:(UIEdgeInsets)insets;
- (id)initWithInsets:(UIEdgeInsets)insets;
@end

// 2. implementation file
@implementation InsetsLabel
@synthesize insets = _insets;
- (id)initWithFrame:(CGRect)frame andInsets:(UIEdgeInsets)insets {
  self = [super initWithFrame:frame];
  if (self) {
    self.insets = insets;
  }
  return self;
}

- (id)initWithInsets:(UIEdgeInsets)insets {
  self = [super init];
  if (self) {
    self.insets = insets;
  }
  return self;
}

- (void)drawTextInRect:(CGRect)rect {
  return [super drawTextInRect:UIEdgeInsetsInsetRect(rect, self.insets)];
}
@end
//
//
//
//调用部分
//
// InsetsLabel * lblTitle=[[InsetsLabel alloc] initWithFrame:CGRectMake(0,
// 35+25*i, 185, 22)];
//[lblTitle setInsets:UIEdgeInsetsMake(0, 5, 0, 5)];

static WaitViewUtil *sharedWaitView = nil;

@implementation WaitViewUtil

@synthesize label;
//创建加载的动画
- (void)createActivityIndicatorView {
  //加载中
  UIActivityIndicatorView *indicator = [[UIActivityIndicatorView alloc]
      initWithFrame:CGRectMake(10, 10, 20, 20)];
  indicator.activityIndicatorViewStyle = UIActivityIndicatorViewStyleWhite;
  indicator.tag = 1;

  //标签
  InsetsLabel *lblTitle = [[InsetsLabel alloc]
      initWithFrame:CGRectMake(110, 120 + (iPhone5 ? 88 : 0), 100, 40)];
  [lblTitle setInsets:UIEdgeInsetsMake(0, 40, 0, 10)];
  label = lblTitle;
  label.backgroundColor = [UIColor colorWithRed:0 green:0 blue:0 alpha:0.8];
  label.textColor = [UIColor whiteColor];
  label.font = [UIFont systemFontOfSize:14];
  label.textAlignment = NSTextAlignmentRight;
  label.layer.masksToBounds = YES;
  label.layer.cornerRadius = 6;
  label.text = @"加载中...";
  label.frame = centerXY(label.frame, sharedWaitView.frame);
  [sharedWaitView addSubview:label];
  _timeInterval = 120;
  //容器嵌套
  [indicator startAnimating];
  [label addSubview:indicator];
}

- (void)startLoadingWithOffHeightTop:(NSInteger)offHeightTop
                     offHeightBottom:(NSInteger)offHeightBottom {
  [UIView animateWithDuration:0.1
                   animations:^{
                     CGRect pFrame = sharedWaitView.superview.frame;
                     sharedWaitView.frame = CGRectMake(
                         0, offHeightTop, pFrame.size.width,
                         pFrame.size.height - offHeightTop - offHeightBottom);
                   }];
}

+ (void)showTip:(NSString *)tip {
  [[UIApplication sharedApplication].keyWindow showHUD:tip];
}

+ (void)startLoading {
  [[self.class sharedWaitView] startLoading];
}

+ (void)endLoading {
  [[self.class sharedWaitView] endLoading];
}
#define dispatch_main_async_safe(block)               \
  if ([NSThread isMainThread]) {                      \
    block();                                          \
  } else {                                            \
    dispatch_async(dispatch_get_main_queue(), block); \
  }

+ (UIWindow *)topShowWindow {
  UIWindow *keywindow = [[UIApplication sharedApplication] keyWindow];
  NSArray *windows = [[UIApplication sharedApplication] windows];
  for (UIWindow *window in windows.reverseObjectEnumerator) {
    NSString *className = NSStringFromClass(window.class);
    if ([className isEqualToString:@"UIRemoteKeyboardWindow"] ||
        [className isEqualToString:@"UITextEffectsWindow"]) {
      if (keywindow == window || [window isKeyWindow]) {
        return window;
      }
    }
  }
  return [windows firstObject];
}

//初始化
+ (WaitViewUtil *)sharedWaitView {
  @synchronized([WaitViewUtil class]) {
    //  AppDelegate *appDelegate = (AppDelegate *)[[UIApplication
    //  sharedApplication] delegate];
    if (sharedWaitView != nil) {
      //            NSArray * windows = [UIApplication
      //            sharedApplication].windows;
      //            DNSLog(@"windows:%@",windows);
         dispatch_main_async_safe(^{
      WaitViewUtil *wvu = (WaitViewUtil *)[self topShowWindow];
      if (wvu != sharedWaitView) {
       

          [[self topShowWindow] addSubview:sharedWaitView];
        
      }
             });
    } else {
      sharedWaitView = [[WaitViewUtil alloc]
          initWithFrame:CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, [UIScreen mainScreen].bounds.size.height)];
      dispatch_main_async_safe(^{

        sharedWaitView.backgroundColor = [UIColor clearColor];
        [sharedWaitView createActivityIndicatorView];

        [[self topShowWindow] addSubview:sharedWaitView];
      });

      return sharedWaitView;
    }
  }
  return sharedWaitView;
}

//初始化
+ (WaitViewUtil *)sharedWaitView:(UIWindow *)window {
  @synchronized([WaitViewUtil class]) {
    if (sharedWaitView != nil) {
      sharedWaitView = nil;
    }
    if (sharedWaitView == nil) {
      sharedWaitView = [[WaitViewUtil alloc]
          initWithFrame:CGRectMake(0, 64, 320, 416 + (iPhone5 ? 88 : 0))];
      sharedWaitView.backgroundColor = [UIColor clearColor];

      [sharedWaitView createActivityIndicatorView];

      [window addSubview:sharedWaitView];

      return sharedWaitView;
    }
  }
  return sharedWaitView;
}

//设置超时关闭时间间隔
- (void)setTimeOut:(CGFloat)timeInterval {
  _timeInterval = timeInterval;
  [self endLoadingMain];
}

//出现加载动画
- (void)startLoading {
  [self performSelectorOnMainThread:@selector(startLoadingMain)
                         withObject:nil
                      waitUntilDone:YES];
}

//出现加载动画
- (void)startLoadingMain {
  if (_timer) {
    [_timer invalidate];
    _timer = nil;
  }
  _timer = [NSTimer scheduledTimerWithTimeInterval:_timeInterval
                                            target:self
                                          selector:@selector(handleGraceTimer:)
                                          userInfo:nil
                                           repeats:NO];
  if (sharedWaitView.hidden == NO) {
    return;
  }
  sharedWaitView.hidden = NO;
  sharedWaitView.alpha = 0.0;
  [UIView animateWithDuration:2
                   animations:^{
                     sharedWaitView.alpha = 1;
                   }];
  UIActivityIndicatorView *indicator =
      (UIActivityIndicatorView *)[sharedWaitView viewWithTag:1];
  [indicator startAnimating];

  [UIApplication sharedApplication].networkActivityIndicatorVisible = YES;
  [self updateTextMain:@"加载中..."];
}

//出现文件上传加载动画
- (void)startLoadingDoc {
  [self performSelectorOnMainThread:@selector(startLoadingMainDoc)
                         withObject:nil
                      waitUntilDone:YES];
}

//出现加载动画
- (void)startLoadingMainDoc {
  if (_timer) {
    [_timer invalidate];
    _timer = nil;
  }
  _timer = [NSTimer scheduledTimerWithTimeInterval:_timeInterval
                                            target:self
                                          selector:@selector(handleGraceTimer:)
                                          userInfo:nil
                                           repeats:NO];
  if (sharedWaitView.hidden == NO) {
    return;
  }
  sharedWaitView.hidden = NO;
  sharedWaitView.alpha = 0.0;
  [UIView animateWithDuration:2
                   animations:^{
                     sharedWaitView.alpha = 1;
                   }];
  UIActivityIndicatorView *indicator =
      (UIActivityIndicatorView *)[sharedWaitView viewWithTag:1];
  [indicator startAnimating];

  [UIApplication sharedApplication].networkActivityIndicatorVisible = YES;
  [self updateTextMain:@"正在为您加密传输 "];
}

- (void)handleGraceTimer:(id)data {
  [self endLoadingMain];
  [self showHUD:@"执行时间过长，可能是网络环境不好，请确定网络畅通后重新尝试。"];
}
//移除加载动画
- (void)endLoading {
  [self performSelectorOnMainThread:@selector(endLoadingMain)
                         withObject:nil
                      waitUntilDone:YES];
}

//移除加载动画
- (void)endLoadingMain {
  if (_timer) {
    [_timer invalidate];
    _timer = nil;
  }
  label.text = @"加载中...";
  if (sharedWaitView.hidden == YES) {
    return;
  }
  sharedWaitView.hidden = YES;
  UIActivityIndicatorView *indicator =
      (UIActivityIndicatorView *)[sharedWaitView viewWithTag:1];
  [indicator stopAnimating];

  [UIApplication sharedApplication].networkActivityIndicatorVisible = NO;
}

//移除加载动画
- (void)updateText:(NSString *)text {
  [self performSelectorOnMainThread:@selector(updateTextMain:)
                         withObject:text
                      waitUntilDone:false];
}

//  修改文字，并根据文字内容自动调整显示大小
- (void)updateTextMain:(NSString *)text {
  if (_timer) {
    [_timer invalidate];
    _timer = nil;
  }
  _timer = [NSTimer scheduledTimerWithTimeInterval:_timeInterval
                                            target:self
                                          selector:@selector(handleGraceTimer:)
                                          userInfo:nil
                                           repeats:NO];
  
  CGSize sizeLabel = [text sizeWithAttributes: @{NSFontAttributeName : label.font}];

  CGRect frontRect = CGRectMake(
      0, 0, fmin(sizeLabel.width + 40 + 10, sharedWaitView.frame.size.width),
      label.frame.size.height);
  label.frame = centerXY(frontRect, sharedWaitView.frame);
  label.text = text;
}

@end
