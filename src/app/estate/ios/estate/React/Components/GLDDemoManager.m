//
//  GLDDemoManager.m
//  estate
//
//  Created by glodon on 2018/3/19.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "GLDDemoManager.h"

// 数据转换
@interface RCTConvert (Button)

+ (NSString*)buttonTitle:(id)json;
+ (UIColor*)buttonColor:(id)json;

@end

@implementation RCTConvert(Button)
+ (NSString*)buttonTitle:(id)json {
   json = [self NSDictionary:json];
  return json[@"title"];
}
+ (UIColor*)buttonColor:(id)json {
  json = [self NSDictionary:json];
  return [RCTConvert UIColor: json[@"color"]];
}
@end

// 控件定义
@interface RNTButtonView: UIButton

@property (nonatomic, copy) RCTBubblingEventBlock onChange;// 响应事件定义

@end

@implementation RNTButtonView

@end

@implementation GLDDemoManager
// 组件导出，这里导出给js组件使用的名字就是 GLDDemo，Manager会被处理掉
RCT_EXPORT_MODULE()
// 响应事件绑定
RCT_EXPORT_VIEW_PROPERTY(onChange, RCTBubblingEventBlock)
// 属性绑定
RCT_EXPORT_VIEW_PROPERTY(backgroundColor, UIColor)
// 自定义属性绑定
RCT_CUSTOM_VIEW_PROPERTY(title, NSString, UIButton)
{
  // 设置相关属性
  [view setTitle:json ? [RCTConvert buttonTitle:json] : @"button" forState:UIControlStateNormal];
  [view setTitleColor:json ? [RCTConvert buttonColor:json] : nil forState:UIControlStateNormal];
}
// 组件构建
- (UIView *)view
{
  RNTButtonView * ret = [[RNTButtonView alloc] initWithFrame:CGRectMake(0, 0, 0, 0)];
  [ret setTitle:@"组件测试" forState:UIControlStateNormal];
  [ret addTarget:self action:@selector(onClick:) forControlEvents:UIControlEventTouchUpInside];
  return ret;
}

// 点击事件
- (void)onClick:(RNTButtonView*) button{
  NSLog(@"onClick");
  if (button.onChange) {
    button.onChange(@{});
  }
  
}
@end
