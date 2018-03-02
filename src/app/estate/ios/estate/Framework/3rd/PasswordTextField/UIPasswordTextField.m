//
//  UIPasswordTextField.m
//  PRM
//
//  Created by soul on 2017/10/27.
//  Copyright © 2017年 Glodon Inc. . All rights reserved.
//

#import "UIPasswordTextField.h"

@implementation UIPasswordTextField

//控制清除按钮的位置
-(CGRect)clearButtonRectForBounds:(CGRect)bounds
{
    return CGRectMake(bounds.origin.x + bounds.size.width - 55, bounds.origin.y, bounds.size.height, bounds.size.height);
}
-(CGRect)rightViewRectForBounds:(CGRect)bounds
{
    return  [super rightViewRectForBounds: bounds];
//    return CGRectMake(bounds.origin.x + bounds.size.width - 55, bounds.origin.y, bounds.size.height, bounds.size.height);
}
////控制左视图位置
//- (CGRect)leftViewRectForBounds:(CGRect)bounds
//{
//    CGRect inset = CGRectMake(bounds.size.width-30, bounds.origin.y, bounds.size.width-250, bounds.size.height);
//    return inset;
//}

////控制显示文本的位置
//-(CGRect)textRectForBounds:(CGRect)bounds
//{
//    CGRect inset = CGRectMake(bounds.origin.x, bounds.origin.y, bounds.size.width, bounds.size.height);
//    return inset;
//    
//}
//
////控制编辑文本的位置
//-(CGRect)editingRectForBounds:(CGRect)bounds
//{
//    CGRect inset = CGRectMake(bounds.origin.x, bounds.origin.y, bounds.size.width, bounds.size.height);
//    return inset;
//}
@end

