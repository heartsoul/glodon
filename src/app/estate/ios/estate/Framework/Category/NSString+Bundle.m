//
//  NSString+Bundle.m
//  CKBaseFramework
//
//  Created by soul on 2016/10/24.
//  Copyright © 2016年 soul. All rights reserved.
//

#import "NSString+Bundle.h"
#ifndef __NSString_Bundle_m_
#define __NSString_Bundle_m_

@implementation NSString (Bundle)

/**从main bundle中获取NSString类型值, 默认值是自己*/
-(NSString*) stringValueByKey:(NSString*)key {
  return  [self stringValueByKey:key bundleName:nil];
}

/**从给定 bundle中获取NSString类型值, 默认值是自己*/
-(NSString*) stringValueByKey:(NSString*)key bundleName:(NSString*)bundleName {
  
  NSBundle * bundle = [NSBundle mainBundle];
  do {
    NSURL * bundleURL = [bundle URLForResource:bundleName withExtension:@"bundle"];
    
    if (!bundleURL) {
      break;
    }
    NSBundle * tempBundle = [NSBundle bundleWithURL:bundleURL];
    if (!tempBundle) {
      break;
    }
    id retValue;
    retValue = [self bundleValueByKey:key infoDictionary:tempBundle.infoDictionary];
    if (retValue) {
      return [NSString stringWithFormat:@"%@", retValue];
    }
    
    retValue = [self bundleValueByKey:key infoDictionary:bundle.infoDictionary];
    if (retValue) {
      return [NSString stringWithFormat:@"%@", retValue];
    }
    break; // 防止代码疏忽导致死循环。
  } while (false);
  // 没有对应的值，就会自己作为默认值。
  return self;
}
/**从main bundle中获取NSString类型值*/
-(id) bundleValueByKey:(NSString*)key infoDictionary:(NSDictionary *)infoDictionary {
  id find = [infoDictionary valueForKey:key];
  return find;
}

@end
#endif //#define __NSString_Bundle_m_
