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
@interface TestRNViewController ()

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

@end
