//
//  SoulDrawView.h
//  TestOC
//
//  Created by glodon on 2018/3/27.
//  Copyright © 2018年 zyyj. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface SoulDrawView : UIScrollView
//画笔的颜色
@property (nonatomic,copy) UIColor *lineColor;
@property (nonatomic,assign) BOOL bDrawText;
- (void)setBackgroundImage:(UIImage*)image;
- (void)saveImage:(void (^)(NSString*assetId))finisdBlock;
@end
