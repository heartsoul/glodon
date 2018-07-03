//
//  ModelServer.h
//  estate
//
//  Created by glodon on 2018/7/3.
//  Copyright © 2018年 Glodon. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>
#ifdef __cplusplus
extern "C" {
#endif
@interface GCDWebServer : NSObject
@property(nonatomic, readonly) NSURL* serverURL;
- (void)addGETHandlerForBasePath:(NSString*)basePath directoryPath:(NSString*)directoryPath indexFilename:(NSString*)indexFilename cacheAge:(NSUInteger)cacheAge allowRangeRequests:(BOOL)allowRangeRequests;
- (void)stop;
- (BOOL)startWithPort:(NSUInteger)port bonjourName:(NSString*)name;
@end

#ifdef __cplusplus
}
#endif

@interface ModelServer : RCTViewManager

@end
