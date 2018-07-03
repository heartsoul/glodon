//
//  ModelServer.m
//  estate
//
//  Created by glodon on 2018/7/3.
//  Copyright © 2018年 Glodon. All rights reserved.
//

#import "ModelServer.h"

static GCDWebServer * __glbWebServer = nil;

@implementation ModelServer
RCT_EXPORT_MODULE()
RCT_EXPORT_METHOD (startServer:(NSString*)directoryPath port:(NSString*)port) {
  NSLog(@"server info:%@:%@",directoryPath,port);
  dispatch_sync(dispatch_get_main_queue(), ^{
    if(__glbWebServer) {
      [__glbWebServer stop];
      __glbWebServer = nil;
    }
    __glbWebServer = [[GCDWebServer alloc] init];
    [__glbWebServer addGETHandlerForBasePath:@"/" directoryPath:directoryPath indexFilename:nil cacheAge:3600 allowRangeRequests:true];
    [__glbWebServer startWithPort:port.integerValue bonjourName: @"GCD Web Server for bimface"];
    NSLog(@"server:%@:%@",__glbWebServer.serverURL, port);
  });
  
  return;
}
RCT_EXPORT_METHOD (stopServer) {
  dispatch_sync(dispatch_get_main_queue(), ^{
    if(__glbWebServer) {
      [__glbWebServer stop];
      __glbWebServer = nil;
    }
  });
  return;
}
@end

