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
@end
