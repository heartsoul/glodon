//
//  ParserStyle.h
//  NetFramework
//
//  Created by banwj on 16/6/12.
//  Copyright © 2017年 soul. All rights reserved.
//
#import <Foundation/Foundation.h>
#ifndef ParserStyle_h
#define ParserStyle_h
/**
 解析数据类型
 */
typedef enum : NSUInteger {
  ParserObjectStyle,//解析成oc对象
  ParserDataStyle,//data
  ParserCustomStyle,//自定义类型
} ParserStyle;

#endif /* ParserStyle_h */
