//
//  UIAlertController+Soul.h
//  PRM
//
//  Created by soul on 2017/11/3.
//  Copyright © 2017年 Glodon Inc. . All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UIAlertController (Soul)
- (void)setTitleColor:(UIColor *)color;
- (void)setMessageColor:(UIColor *)color;
- (void)setTitle:(NSMutableAttributedString *)titleString font:(UIFont*)font;
- (void)setMessage:(NSMutableAttributedString *)message style:(NSMutableParagraphStyle *)style;
@end
