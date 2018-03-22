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

// 组件构建
- (UIView *)view
{
    CGFloat w = [UIApplication sharedApplication].keyWindow.frame.size.width;
    CGFloat h = w / 5 + 34;
    RNTImagesView *quoteImagesView =[[RNTImagesView alloc] initWithFrame:CGRectMake(0, 0, w, h) withCountPerRowInView:0 cellMargin:24];
    //初始化view的frame, view里每行cell个数， cell间距（上方的图片1 即为quoteImagesView）
    // 注：设置frame时，我们可以根据设计人员给的cell的宽度和最大个数、排列，间距去大致计算下quoteview的size.
    quoteImagesView.maxSelectedCount = 3;
    //最大可选照片数
    quoteImagesView.collectionView.scrollEnabled = YES;
    //view可否滑动
    quoteImagesView.navcDelegate = (UIViewController<LPDQuoteImagesViewDelegate>*) [UIApplication sharedApplication].keyWindow.rootViewController ;    //self 至少是一个控制器。
    //委托（委托controller弹出picker，且不用实现委托方法）
  return quoteImagesView;
}
@end
