//
//  GLDRNPhotoManager.m
//  estate
//
//  Created by glodon on 2018/3/19.
//  Copyright © 2018年 Glodon. All rights reserved.
//

#import "GLDPhotoManager.h"
#import <React/RCTComponent.h>
#import <LPDQuoteImagesView.h>

// 控件定义
@interface RNTImagesView : LPDQuoteImagesView

@property (nonatomic, copy) RCTBubblingEventBlock onChange;// 响应事件定义

@end

@implementation RNTImagesView

@end

@implementation GLDPhotoManager
// 组件导出，这里导出给js组件使用的名字就是 GLDPhoto，Manager会被处理掉
RCT_EXPORT_MODULE()
// 响应事件绑定
RCT_EXPORT_VIEW_PROPERTY(onChange, RCTBubblingEventBlock)
// 属性绑定
RCT_EXPORT_VIEW_PROPERTY(backgroundColor, UIColor)
// 属性绑定
RCT_EXPORT_VIEW_PROPERTY(maxSelectedCount, NSUInteger)
RCT_EXPORT_VIEW_PROPERTY(isShowTakePhotoSheet, BOOL)
//// 自定义属性绑定
//RCT_CUSTOM_VIEW_PROPERTY(title, NSString, UIButton)
//{
//  // 设置相关属性
//  [view setTitle:json ? [RCTConvert buttonTitle:json] : @"button" forState:UIControlStateNormal];
//  [view setTitleColor:json ? [RCTConvert buttonColor:json] : nil forState:UIControlStateNormal];
//}
// 组件构建
- (UIView *)view
{
    RNTImagesView *quoteImagesView =[[RNTImagesView alloc] initWithFrame:CGRectMake(0, 0, 400, 100) withCountPerRowInView:3 cellMargin:12];
    //初始化view的frame, view里每行cell个数， cell间距（上方的图片1 即为quoteImagesView）
    // 注：设置frame时，我们可以根据设计人员给的cell的宽度和最大个数、排列，间距去大致计算下quoteview的size.
    quoteImagesView.maxSelectedCount = 3;
    //最大可选照片数
    quoteImagesView.collectionView.scrollEnabled = NO;
    //view可否滑动
    quoteImagesView.navcDelegate = (UIViewController<LPDQuoteImagesViewDelegate>*) [UIApplication sharedApplication].keyWindow.rootViewController ;    //self 至少是一个控制器。
    //委托（委托controller弹出picker，且不用实现委托方法）
  return quoteImagesView;
}

// 点击事件
- (void)onClick:(RNTImagesView*) button{
  NSLog(@"onClick");
  if (button.onChange) {
    button.onChange(@{});
  }

}
@end
