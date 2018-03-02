//
//  NSCalendar+cache.h
//  CKBaseFramework
//
//  Created by soul on 2017/2/14.
//  Copyright © 2017年 soul. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NSCalendar (cache)
// 建立共享单例子对象
+ (instancetype) shareInstance;
@end
