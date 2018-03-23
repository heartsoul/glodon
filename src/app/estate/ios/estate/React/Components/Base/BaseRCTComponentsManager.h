//
//  BaseRCTComponentsManager.h
//  soul
//
//  Created by soul on 2018/3/22.
//  Copyright © 2018年 Soul. All rights reserved.
//

#import <React/RCTViewManager.h>

#import "NSDictionary+BaseRCTComponents.h"

typedef NSString * RN_API_NAME NS_STRING_ENUM;

typedef void (^RNAPICompletedBlock)(NSDictionary* outData, NSDictionary* inData);
typedef void (^RNAPIFailedBlock)(NSDictionary* errorData, NSDictionary* inData);

extern const RN_API_NAME rn_api_version; // 获取当前支持的版本号
extern const RN_API_NAME rn_api_call; // 通用调用
@protocol BaseRCTComponentsManagerDelegate<NSObject>
- (BOOL)isValidApi:(RN_API_NAME)api; // 需要重写
@end
@interface BaseRCTComponentsManager : RCTViewManager<BaseRCTComponentsManagerDelegate>

@end

/**
 * 使用实例
 */
/**
 定义API 名 const RN_API_NAME rn_api_demo = @"demo"
 实现
 - (BOOL)isValidApi:(RN_API_NAME)api;
 使得api有效
 实现函数
 + (void)api_demo:(NSDictionary *)dictionary finishBlock:(RNAPICompletedBlock) finishBlock;
 */
