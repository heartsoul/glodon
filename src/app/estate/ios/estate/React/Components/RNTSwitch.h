//
//  RNTSwitch.h
//  estate
//
//  Created by glodon on 2018/3/20.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

#import <React/RCTComponent.h>

@interface RNTSwitchView : UISwitch

@property (nonatomic, assign) BOOL wasOn;
@property (nonatomic, copy) RCTBubblingEventBlock onChange;

@end
