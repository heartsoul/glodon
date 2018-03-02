//
//  UIWebViewController.h
//  tesn
//
//  Created by soulimac on 15/3/31.
//  Copyright (c) 2017 ican. All rights reserved.
//
#import <UIKit/UIKit.h>

@interface UIWebViewController : UIViewController<UIWebViewDelegate>

@property (strong, nonatomic) UIWebView *webView;
@property (strong, nonatomic) NSString * url;
@property (strong, nonatomic) NSString * htmlName;
@property (assign, nonatomic) BOOL hideToolbar;
@property (strong, nonatomic) NSString * showTitle;

@property(strong, nonatomic) UIColor *navTintColor;

- (void)openInBrowser:(id)sender;

@end
