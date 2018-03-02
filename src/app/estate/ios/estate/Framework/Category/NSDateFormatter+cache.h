//
//  NSDateFormatter+cache.h
//  CKBaseFramework
//
//  Created by soul on 2017/2/14.
//  Copyright © 2017年 soul. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NSDateFormatter (cache)
// 创建对象，带有缓存功能
// formatterString 格式化串，同一个串全应用生命周期只会有一个对象
+ (instancetype) instanceWithFormatter:(NSString*)formatterString;
@end
