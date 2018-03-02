//
//  NSString+pinyin.h
//  tesn
//
//  Created by soul on 14-10-10.
//  Copyright (c) 2017年 soul. All rights reserved.
//

#import <Foundation/Foundation.h>
#include "ChineseString.h"
@interface NSString (pinyin)

// 获取拼音
+ (ChineseString *)chineseString:(NSString*)chinese;
@end
