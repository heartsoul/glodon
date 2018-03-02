//
//  ResponseErrorModel.h
//  PRM
//
//  Created by soul on 2017/9/1.
//  Copyright © 2017年 Glodon Inc. . All rights reserved.
//

#import "ResponseModel.h"

@interface ResponseErrorModel : ResponseModel
@property (nonatomic, copy) NSNumber *statusCode;
@property (nonatomic, copy) NSString *error_code;
@property (nonatomic, copy) NSString *error;
@property (nonatomic, copy) NSString *error_description;
@property (nonatomic, copy) NSString *errcode;
@end
