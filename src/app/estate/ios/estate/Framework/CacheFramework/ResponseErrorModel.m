//
//  ResponseErrorModel.m
//  PRM
//
//  Created by soul on 2017/9/1.
//  Copyright © 2017年 Glodon Inc. . All rights reserved.
//

#import "ResponseErrorModel.h"

@implementation ResponseErrorModel
- (id)mapAttributes
{
    NSDictionary *dic = [NSDictionary dictionaryWithObjectsAndKeys:
                         @"statusCode", @"statusCode",
                         @"error_code", @"error_code",
                         @"error", @"error",
                         @"error_description", @"error_description",
                         @"errcode", @"errcode",
                         @"tipLevel|tip_level", @"tipLevel",
                         nil];
    return dic;
}
- (BOOL)isSuccessed{
    
    if (self.errcode == nil && self.error_code == nil) {
        return YES;
    }
    if (self.errcode) {
        NSString * code = [NSString stringWithFormat:@"%@", self.errcode];
        if([@"0" isEqualToString:code])
            return YES;
    }
    else {
        NSString * code = [NSString stringWithFormat:@"%@", self.error_code];
        if([@"0" isEqualToString:code])
            return YES;
    }
    return NO;
}
@end
