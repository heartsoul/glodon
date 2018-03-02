//
//  UIAlertController+Soul.m
//  PRM
//
//  Created by soul on 2017/11/3.
//  Copyright © 2017年 Glodon Inc. . All rights reserved.
//

#import "UIAlertController+Soul.h"
#import <objc/runtime.h>

@implementation UIAlertController (Soul)
    
- (void)setValue:(id)value byKey:(NSString*)key {
    //  取得当前类类型
    Class cls = [self class];
    
    unsigned int ivarsCnt = 0;
    //　获取类成员变量列表，ivarsCnt为类成员数量
    Ivar *ivars = class_copyIvarList(cls, &ivarsCnt);
    
    //　遍历成员变量列表，其中每个变量都是Ivar类型的结构体
    for (const Ivar *p = ivars; p < ivars + ivarsCnt; ++p)
    {
        Ivar const ivar = *p;
        
        //　获取变量名
        NSString *name = [NSString stringWithUTF8String:ivar_getName(ivar)];
        NSString *type = [NSString stringWithUTF8String:ivar_getTypeEncoding(ivar)];
//        NSString *valueType = [NSString stringWithUTF8String:object_getClassName(value)];
        
        NSLog(@"UIAlertController拥有的成员变量的类型为%@，名字为 %@ ",type, key);
//        if([type compare:valueType] != NSOrderedSame) {
//            continue; // 类型不一样就不能设置
//        }
        // 若此变量未在类结构体中声明而只声明为Property，则变量名加前缀 '_'下划线
        // 比如 @property(retain) NSString *abc;则 key == _abc;
        NSArray * ret = [name componentsSeparatedByString:key];
         if(ret.count >1) {
            // 找到了
            [self setValue:value forKey:key]; // 设置颜色
             break;
        }
    }
}

- (void)setTitle:(NSMutableAttributedString *)titleString font:(UIFont*)font {
    if(font == nil) {
        font = [UIFont systemFontOfSize:18];
    }
     [titleString addAttribute:NSFontAttributeName value:font range:NSMakeRange(0, titleString.length)];
   NSMutableParagraphStyle * style = [[NSMutableParagraphStyle alloc] init];     //段落样式
        NSTextAlignment align = NSTextAlignmentLeft;  //对齐方式
        style.alignment = align;
        style.lineSpacing = 15;
    style.paragraphSpacing = 10;
    style.lineBreakMode = NSLineBreakByCharWrapping;
        [titleString addAttribute:NSParagraphStyleAttributeName value:style range:NSMakeRange(0, titleString.length)];
    
    [self setValue:titleString byKey:@"attributedTitle"];
    //          /修改title
    
//              NSMutableAttributedString *alertControllerStr = [[NSMutableAttributedString alloc] initWithString:@"提示"];
    //
    //          [alertControllerStr addAttribute:NSForegroundColorAttributeName value:[UIColor redColor] range:NSMakeRange(0, 2)];
    //
    
    //
    //          [alertController setValue:alertControllerStr forKey:@"attributedTitle"];
    //
    //
}
    
- (void)setMessage:(NSMutableAttributedString *)message style:(NSMutableParagraphStyle *)style {
    if(style == nil) {
        style = [[NSMutableParagraphStyle alloc] init];     //段落样式
        NSTextAlignment align = NSTextAlignmentLeft;  //对齐方式
        style.alignment = align;
        style.lineSpacing = 5;
        style.lineBreakMode = NSLineBreakByCharWrapping;
        [message addAttribute:NSParagraphStyleAttributeName value:style range:NSMakeRange(0, message.length)];
    }
    [self setValue:message byKey:@"attributedMessage"];
}
    
- (void)setTitleColor:(UIColor *)color {
    [self setValue:color byKey:@"TitleColor"];
}
- (void)setMessageColor:(UIColor *)color {
    [self setValue:color byKey:@"MessageColor"];
}
@end
