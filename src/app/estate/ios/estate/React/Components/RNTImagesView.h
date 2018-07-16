//
//  RNTImagesView.h
//  estate
//
//  Created by glodon on 2018/4/16.
//  Copyright © 2018年 Glodon. All rights reserved.
//

#import <LPDQuoteImagesView.h>
#import <React/RCTComponent.h>

@interface RNTImagesView : LPDQuoteImagesView

@property (nonatomic, copy) RCTBubblingEventBlock onChange;// 响应事件定义

- (void)loadFiles:(void(^)(NSArray * files))finish;
+ (void)takePhoto:(UIViewController*)navcDelegate callback:(void(^)(NSArray * files))callback;
+ (void)pickerVideo:(UIViewController*)navcDelegate callback:(void(^)(NSArray * files))callback;
+ (void)imagePicker:(UIViewController*)navcDelegate callback:(void(^)(NSArray * files))callback;
@end
