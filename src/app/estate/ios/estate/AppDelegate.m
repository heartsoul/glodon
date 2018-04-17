/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"



@implementation AppDelegate
- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge; {
    NSURL *jsCodeLocation;
  
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
//  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForFallbackResource:nil fallbackExtension:nil];
  return jsCodeLocation;
  
}
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  _bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
//  NSURL *jsCodeLocation;
//
//  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
//
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:_bridge moduleName:@"estate"
                                               initialProperties:nil];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  self.window.backgroundColor = [UIColor whiteColor];
//
//  UIStoryboard *secondStoryBoard = [UIStoryboard storyboardWithName:@"TestRNViewController" bundle:nil];
//  UIViewController* viewController = [secondStoryBoard instantiateInitialViewController];  //viewController为viewcontroller
//  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
//  self.window.rootViewController = viewController;
//  [self.window makeKeyAndVisible];
//  self.window.backgroundColor = [UIColor whiteColor];
  return YES;
}

@end
