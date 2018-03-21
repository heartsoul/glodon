//
//  GLDUISwithManager.m
//  estate
//
//  Created by glodon on 2018/3/20.
//  Copyright © 2018年 Glodon. All rights reserved.
//

#import "RNTSwitchManager.h"

#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import "RNTSwitch.h"
#import <React/UIView+React.h>

@implementation RNTSwitchManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  RNTSwitchView *switcher = [RNTSwitchView new];
  [switcher addTarget:self
               action:@selector(onChange:)
     forControlEvents:UIControlEventValueChanged];
  return switcher;
}

- (void)onChange:(RNTSwitchView *)sender
{
  if (sender.wasOn != sender.on) {
    if (sender.onChange) {
      sender.onChange(@{ @"value": @(sender.on) });
    }
    sender.wasOn = sender.on;
  }
}

RCT_EXPORT_VIEW_PROPERTY(onTintColor, UIColor);
RCT_EXPORT_VIEW_PROPERTY(tintColor, UIColor);
RCT_EXPORT_VIEW_PROPERTY(thumbTintColor, UIColor);
RCT_REMAP_VIEW_PROPERTY(value, on, BOOL);
RCT_EXPORT_VIEW_PROPERTY(onChange, RCTBubblingEventBlock);
RCT_CUSTOM_VIEW_PROPERTY(disabled, BOOL, RNTSwitchView)
{
  if (json) {
    view.enabled = !([RCTConvert BOOL:json]);
  } else {
    view.enabled = defaultView.enabled;
  }
}

@end
