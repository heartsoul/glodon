//
//  NSString+Bundle.h
//  CKBaseFramework
//
//  Created by soul on 2016/10/24.
//  Copyright © 2016年 soul. All rights reserved.
//

#import <Foundation/Foundation.h>
#ifndef __NSString_Bundle__
#define __NSString_Bundle__
@interface NSString (Bundle)
/**从main bundle中获取NSString类型值*/
-(NSString*) stringValueByKey:(NSString*)key;
/**从bundle中获取NSString类型值, 如果bundleName无效，则从main bundle中获取*/
-(NSString*) stringValueByKey:(NSString*)key bundleName:(NSString*)bundleName;
@end
#endif //#define __NSString_Bundle__
