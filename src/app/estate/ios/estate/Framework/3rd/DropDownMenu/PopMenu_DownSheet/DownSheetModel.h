//
//  DownSheetModel.h
//  DownSheet
//
//  Created by wolf on 14-11-30.
//  Copyright (c) 2014年 wolf. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIColor.h>
#import <UIKit/UIFont.h>
@interface DownSheetModel : NSObject
@property(nonatomic,strong) NSString *icon;
@property(nonatomic,strong) NSString *icon_on;
@property(nonatomic,strong) NSString *title;
@property(nonatomic,strong) UIColor *bgColor;
@property(nonatomic,strong) UIColor *selectBgColor;
@property(nonatomic,strong) UIColor *titleColor;
@property(nonatomic,strong) UIFont *titleFont;
@property(nonatomic,assign) float topOff;
@property(nonatomic,assign) float bottomOff;
//default is YES
@property(nonatomic,assign) BOOL showSeparatorLine;

@end

// 版权属于原作者
// http://code4app.com (cn) http://code4app.net (en)
// 发布代码于最专业的源码分享网站: Code4App.com 