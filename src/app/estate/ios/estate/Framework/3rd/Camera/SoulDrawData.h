//
//  SoulDrawData.h
//  TestOC
//
//  Created by glodon on 2018/3/27.
//  Copyright © 2018年 zyyj. All rights reserved.
//

#import <Foundation/Foundation.h>
@protocol SoulDrawDataDelegate<NSObject>
- (void)draw;
- (void)doTrans;
- (nullable UITextView*)getTextView;
- (CGRect)getBounds;
@optional
- (void)moveBySize:(CGSize)size scale:(CGFloat)scale;
@end

@interface SoulDrawData : UIBezierPath<SoulDrawDataDelegate>
@property(nonatomic, nonnull, copy) UIColor * color; // 绘制颜色
@property(nonatomic, nonnull, copy) UIColor * selectColor; // 选择时绘制颜色，默认与color相同
@property(nonatomic, assign) BOOL bSelected; // 是否选择状态， 默认未选择
@property(nonatomic, assign) CGFloat scaleFactor;  // 缩放比例，默认1.0
@property(nonatomic, assign) CGSize trans;  // 移动量
@property(nonatomic, assign) CGAffineTransform transform;  // 移动量
@property(nonatomic, assign) BOOL bEdit;
@end

@interface SoulDrawDataBezierPath : SoulDrawData
@end

typedef enum : NSUInteger {
    SoulDrawDataChangeTypeNone,
    SoulDrawDataChangeTypeTop,
    SoulDrawDataChangeTypeTopLeft,
    SoulDrawDataChangeTypeLeft,
    SoulDrawDataChangeTypeBottomLeft,
    SoulDrawDataChangeTypeBottom,
    SoulDrawDataChangeTypeBottomRight,
    SoulDrawDataChangeTypeRight,
    SoulDrawDataChangeTypeTopRight,
    
} SoulDrawDataChangeType;

@interface SoulDrawDataText : SoulDrawData
@property(nonatomic, nonnull, copy) NSString * drawText; // 绘制文字
@property(nonatomic, nonnull, copy) UIFont * font; // 字体
@property(nonatomic, assign) CGPoint center; // 中心点
@property(nonatomic, assign) CGSize size; // 显示区域
- (CGSize)calcSize:(CGFloat)width;
@end

@interface SoulDrawDataSelectLine : SoulDrawData
@end

@interface SoulDrawDataSelectDot : SoulDrawData
@property(nonatomic, assign) SoulDrawDataChangeType changeType; // 当前选择的控件变化位置
@end


@interface SoulDrawDataSelect : SoulDrawData
@property(nonatomic,nullable, assign) SoulDrawData * selectDrawData; // 当前选择的控件
@property(nonatomic, assign) CGRect frame; // 当前控件的大小
- (nonnull instancetype)initWithFrame:(CGRect)frame;
- (SoulDrawDataChangeType)getChangeType:(CGPoint)point; // 检查当前的变更类型
- (BOOL)doChangeType:(SoulDrawDataChangeType)changeType size:(CGSize)size; // 执行变更，YES：变更了，NO未改变
@end

@interface SoulDrawDataSelectBezierPath : SoulDrawDataSelect
@end

@interface SoulDrawDataSelectText : SoulDrawDataSelect
@end
