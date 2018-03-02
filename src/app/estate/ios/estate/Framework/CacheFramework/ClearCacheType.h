//
//  ClearCacheType.h
//  NetFramework
//
//  Created by banwj on 16/6/7.
//  Copyright © 2017年 soul. All rights reserved.
//

#ifndef ClearCacheType_h
#define ClearCacheType_h

typedef enum : NSUInteger {
  ClearCacheBySize,
  ClearCacheByPath,
  ClearCacheByTime,
  ClearCacheByModule,
} ClearCacheType;

#endif /* ClearCacheType_h */
