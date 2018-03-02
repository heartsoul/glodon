//
//  ParserFactory.m
//  NetFramework
//
//  Created by banwj on 16/6/1.
//  Copyright © 2017年 soul. All rights reserved.
//

#import "ParserFactory.h"
#import "RequestModel.h"
#import "ResponseModel.h"

@implementation ParserFactory
- (instancetype)initWithType:(ParserStyle)type {
  self = [super init];
  if (self) {
    _parserStyle = type;
  }
  return self;
}
- (ResponseModel *)parseResponse:(NSData *)data
                    RequestModel:(RequestModel *)Request
                     isLoadCache:(BOOL)flag {
  ResponseModel *response = [[ResponseModel alloc] init];
  response.requestModel = Request;
  response.isCacheData = flag;
  response.raw = data;
  switch (self.parserStyle) {
  case ParserObjectStyle: {
    id dic =
        [[NSJSONSerialization JSONObjectWithData:data
                                         options:NSJSONReadingMutableContainers
                                           error:nil] mutableCopy];
      if (data && dic == nil) {
         dic = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
      }
    response.data = dic;
  } break;
  case ParserDataStyle: {
    response.data = data;
  } break;
  default:
    break;
  }
  return response;
}
- (ResponseModel *)parseCustomResponse:(NSData *)data
                          RequestModel:(RequestModel *)Request
                           isLoadCache:(BOOL)flag {
  ResponseModel *response = [[ResponseModel alloc] init];
  response.requestModel = Request;
  response.isCacheData = flag;
  response.data = data;
  return response;
}
@end
