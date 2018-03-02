//
//  UIAlertAction+Soul.m
//  PRM
//
//  Created by soul on 2017/11/3.
//  Copyright © 2017年 Glodon Inc. . All rights reserved.
//

#import "UIAlertAction+Soul.h"
#import <objc/runtime.h>

@implementation UIAlertAction (Soul)
- (void)setTextColor:(UIColor *)color {
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
        NSString *key = [NSString stringWithUTF8String:ivar_getName(ivar)];
        // 若此变量未在类结构体中声明而只声明为Property，则变量名加前缀 '_'下划线
        // 比如 @property(retain) NSString *abc;则 key == _abc;
       NSArray * ret = [key componentsSeparatedByString:@"TextColor"];
        if(ret.count >1) {
            // 找到了
            [self setValue:color forKey:key]; // 设置颜色
        }
    }
}
@end

//extension UIAlertAction {
//    func setTextColor(color: UIColor) {
//        var count: uint = 0;
//        let ivars =  class_copyIvarList(UIAlertAction.classForCoder(), &count)
//        for i in 0 ..< Int(count) {
//            let ivar = ivars[i]
//            let name = ivar_getName(ivar)
//            if let varName = String.fromCString(name) {
//                if varName == "_titleTextColor" {
//                    self.setValue(color, forKey: "titleTextColor")
//                }
//            }
//        }
//    }
//}
//

