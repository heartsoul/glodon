//
//  NSData+JSON.m
//  tesn
//
//  Created by soul on 14-10-10.
//  Copyright (c) 2017年 soul. All rights reserved.
//

#import "NSData+JSON.h"

@implementation NSData (JSON)
-(id)toJson{
  
    id ret = nil;
    NSError *err;
    ret = [NSJSONSerialization JSONObjectWithData:self options:NSJSONReadingMutableContainers error:&err];
//    if (err != nil && err.code != 0) {
        return ret;
//    }
//    return nil;
}
@end
