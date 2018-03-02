//
//  RequestModel.m
//  NetFramework
//
//  Created by banwj on 16/5/31.
//  Copyright © 2017年 soul. All rights reserved.
//

#import "RequestModel.h"
#import "DataModel.h"
#import "NSJSONSerialization+safeGenerate.h"

const NSRequestParameterName CustomErrorDomain = @"soul.net.api";
const NSInteger CustomDefultFailed = -1983;

const NSRequestMethodName RequestMethodGet = @"GET";
const NSRequestMethodName RequestMethodHead = @"HEAD";
const NSRequestMethodName RequestMethodPost = @"POST";
const NSRequestMethodName RequestMethodPut = @"PUT";
const NSRequestMethodName RequestMethodDelete = @"DELETE";



@implementation RequestModel

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.requestMethod = RequestMethodPost;
        self.requestParameter = [NSMutableDictionary dictionary];
        self.requestHeader = [NSMutableDictionary dictionary];
        self.otherParameter = [NSMutableDictionary dictionary];
    }
    return self;
}

- (void)setFileName:(NSString *)fileName {
  if (_fileName != fileName) {
    _fileName = fileName;
  }
}
- (void)setJSONHttpBody:(NSDictionary*)jsonData {
   NSData * data = [NSJSONSerialization SafedataWithJSONObject:jsonData options:NSJSONWritingPrettyPrinted error:nil];
    _httpBody = data;
}

- (NSString*) requestInfo {
    return [NSString stringWithFormat:@"%@%@/", self.url, self.path];
}
@end
