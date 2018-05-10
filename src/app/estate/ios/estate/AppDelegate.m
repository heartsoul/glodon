/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  
  if (TARGET_IPHONE_SIMULATOR) {
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  } else {
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForFallbackResource:nil fallbackExtension:nil];
  }
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"estate"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  self.window.tintColor = [UIColor colorWithRed:0x00/255.0f green:0xba/255.0f blue:0xfa/255.0f alpha:0xff/255.0f];
  self.window.backgroundColor = [UIColor whiteColor];
  [UINavigationBar appearance].backIndicatorImage = [UIImage imageNamed:@"icon_fanhui"];
  [UINavigationBar appearance].backIndicatorTransitionMaskImage = [UIImage imageNamed:@"icon_fanhui"];
  return YES;
}

@end
