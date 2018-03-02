//
//  LoadCacheType.h
//  NetFramework
//
//  Created by banwj on 16/5/31.
//  Copyright © 2017年 soul. All rights reserved.
//
#import <Foundation/Foundation.h>
#ifndef LoadCacheType_h
#define LoadCacheType_h

typedef enum : NSUInteger {
  TypeOnlyLoadNet,//只从网络请求
  TypeOnlyLoadCache,//只从缓存加载
  TypeLoadNetFailLoadCache,//网络请求失败时加载缓存
  TypeFirstLoadCacheLastLoadCache,//先从缓存加载，再请求网络数据
} LoadCacheType;

#endif /* LoadCacheType_h */
