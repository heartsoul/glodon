//
//  UIWebViewController.m
//  tesn
//
//  Created by soulimac on 15/3/31.
//  Copyright (c) 2017 ican. All rights reserved.
//

#import "UIWebViewController.h"
#import "Masonry.h"
#import "WaitViewUtil.h"

#define COLOR_PROCCESS_LINE [UIColor colorWithHexStringToColor:@"#1b1b1b"]
#define COLOR_PROCCESS_TABLE [UIColor colorWithHexStringToColor:@"#666666"]
#define HEIHGT_PROGRESS    0.5f

@interface UIWebViewController()<UIActionSheetDelegate>
@end

@implementation UIWebViewController

- (void)viewDidLoad {
  self.hidesBottomBarWhenPushed = YES;
  [super viewDidLoad];
  
  self.webView = [[UIWebView alloc] init];
  self.webView.delegate = self;
  self.webView.scalesPageToFit = YES;
  [self.view addSubview:self.webView];
  [self.webView mas_makeConstraints:^(MASConstraintMaker *make) {
    make.edges.equalTo(self.view).with.insets(UIEdgeInsetsMake(0, 0, 0, 0));
  }];

  [self setTitle:self.showTitle ? self.showTitle : self.url];

  if (self.htmlName) {

    NSString *filePath =
        [[NSBundle mainBundle] pathForResource:self.htmlName ofType:@"html"];

    NSString *htmlString =
        [NSString stringWithContentsOfFile:filePath
                                  encoding:NSUTF8StringEncoding
                                     error:nil];
    [self.webView loadHTMLString:htmlString
                         baseURL:[NSURL URLWithString:filePath]];
  } else {
    [self.webView
        loadRequest:[NSURLRequest
                        requestWithURL:[NSURL URLWithString:self.url]]];
  }
  if (!_hideToolbar) {
    // 初始化
    self.navigationItem.rightBarButtonItem =
    [[UIBarButtonItem alloc] initWithTitle:@"更多" style: UIBarButtonItemStylePlain target:self action:@selector(openInBrowser:)];
  }
}

- (void)viewWillAppear:(BOOL)animated {
  [super viewWillAppear:animated];
}

- (void)viewWillDisappear:(BOOL)animated {
  [super viewWillDisappear:animated];
}

- (void)didReceiveMemoryWarning {
  [super didReceiveMemoryWarning];
}

- (void)setUrl:(NSString *)url {
  _url = [url stringByReplacingOccurrencesOfString:@" " withString:@""];
  if (_url) {
    NSArray *ret = [_url componentsSeparatedByString:@"://"];
    if (ret.count == 1) {
      _url = [NSString stringWithFormat:@"http://%@", _url];
    }
  }
}

- (void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error {
}

- (void)webViewDidFinishLoad:(UIWebView *)webView {
//  [UIApplication sharedApplication].networkActivityIndicatorVisible = NO;
  if(!self.showTitle) {
    NSString * title = [webView stringByEvaluatingJavaScriptFromString:@"window.document.title"];
    if(title) {
      [self setTitle:title];
    }
  }
}

- (BOOL)webView:(UIWebView *)webView
    shouldStartLoadWithRequest:(NSURLRequest *)request
                navigationType:(UIWebViewNavigationType)navigationType {
  
  if (_hideToolbar && UIWebViewNavigationTypeLinkClicked == navigationType) {
    return NO;
  }
//  [UIApplication sharedApplication].networkActivityIndicatorVisible = YES;
  return YES;
}

- (void)openInBrowser:(id)sender {
  if (self.url) {
    UIActionSheet *action = [[UIActionSheet alloc]
                             initWithTitle:nil
                             delegate:self
                             cancelButtonTitle:@"取消"
                             destructiveButtonTitle:nil
                             otherButtonTitles:@"刷新", @"在浏览器中打开", nil];
    
    [action showInView:self.view];
  } else {
    //[WaitViewUtil showTip:@"地址无效，无法打开"];
  }
}

#pragma mark - UIActionsheetDelegate
- (void)actionSheet:(UIActionSheet *)actionSheet
clickedButtonAtIndex:(NSInteger)buttonIndex {
  if (buttonIndex == 1) {
    NSURL *openUrl = [NSURL URLWithString:self.url];
    if (![[UIApplication sharedApplication] canOpenURL:openUrl]) {
      [WaitViewUtil
       showTip:
       @"抱"
       @"歉，该地址无法打开，请确认地址的正确性！"];
      return;
    } else {
      [[UIApplication sharedApplication] openURL:openUrl];
    }
    return;
  } else if (buttonIndex == 0) {
    [_webView reload];
  }
}

- (BOOL)shouldAutorotate {
  return YES;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations {
  return UIInterfaceOrientationMaskPortrait;
}

- (UIStatusBarStyle)preferredStatusBarStyle {
  return UIStatusBarStyleLightContent;
}
@end
