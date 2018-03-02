//
//  UINavigationController+Theme.m
//  PRM
//
//  Created by soul on 2017/9/18.
//  Copyright © 2017年 Glodon Inc. . All rights reserved.
//

#import "UINavigationController+Theme.h"

@implementation UINavigationController (Theme)

- (UIViewController *)childViewControllerForStatusBarStyle {
    return self.visibleViewController;
}

- (UIViewController *)childViewControllerForStatusBarHidden {
    return self.visibleViewController;
}

@end
