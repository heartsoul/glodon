//
//  RNTSwitch.m
//  estate
//
//  Created by glodon on 2018/3/20.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "RNTSwitch.h"

#import "RNTSwitch.h"
#import <React/RCTEventDispatcher.h>
#import <React/UIView+React.h>
//#import "RCTEventDispatcher.h"
//#import "UIView+React.h"

@implementation RNTSwitchView

- (void)setOn:(BOOL)on animated:(BOOL)animated {
  _wasOn = on;
  [super setOn:on animated:animated];
}

@end
