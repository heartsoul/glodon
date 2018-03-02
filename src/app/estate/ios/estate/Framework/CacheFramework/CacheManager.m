//
//  CacheManager.m
//  NetFramework
//
//  Created by banwj on 16/5/31.
//  Copyright © 2017年 soul. All rights reserved.
//

#import "CacheManager.h"
#import "CacheUtil.h"
#import "NetCacheTool.h"
#import "RequestModel.h"

@implementation CacheManager
// read
+ (NSData *)readCacheData:(RequestModel *)requestDic {
  NSString *fileName = [NSString
      stringWithFormat:@"%@", [CacheManager fileNameOfRequest:requestDic]];
  CacheUtil *util = [[CacheUtil alloc] init];

  NSString *filePath = [util getDocumentsPathFileName:fileName];

  if ([util isSxistAtPath:filePath]) {
    return [util readFileContentDataFilePath:filePath];
  }
  return nil;
}
+ (NSString *)readCacheString:(RequestModel *)requestDic {
  NSString *fileName = [NSString
      stringWithFormat:@"%@", [CacheManager fileNameOfRequest:requestDic]];
  CacheUtil *util = [[CacheUtil alloc] init];

  NSString *filePath = [util getDocumentsPathFileName:fileName];

  if ([util isSxistAtPath:filePath]) {
    return [util readFileContentStringFilePath:filePath];
  }
  return nil;
}

// write
+ (BOOL)writeCacheData:(NSData *)fileData Request:(RequestModel *)requestDic {
  NSString *fileName = [NSString
      stringWithFormat:@"%@", [CacheManager fileNameOfRequest:requestDic]];
  CacheUtil *util = [[CacheUtil alloc] init];

  NSString *filePath = [util getDocumentsPathFileName:fileName];

  BOOL flag = [util writeFilePath:filePath data:fileData];

  return flag;
}
+ (BOOL)writeCacheString:(NSString *)fileData
                 Request:(RequestModel *)requestDic {
  return YES;
}

// delete
+ (BOOL)deleteCacheFileByPath:(NSString *)filePath {
  CacheUtil *util = [[CacheUtil alloc] init];
  NSString *filePathForDelete = [util getDocumentsPathFileName:filePath];
  if (filePathForDelete) {
    return [util deleteFile:filePathForDelete];
  }
  return NO;
}
+ (BOOL)deleteCacheFileByRequest:(RequestModel *)requestDic {
  CacheUtil *util = [[CacheUtil alloc] init];
  NSString *filePath = [self fileNameOfRequest:requestDic];
  if (filePath) {
    return [util deleteFile:filePath];
  }
  return NO;
}
+ (BOOL)deleteCacheFileByDeleteTime:(NSString *)time {
  CacheUtil *util = [[CacheUtil alloc] init];
  NSArray *files = [util getAllFileNames];
  NSDate *fileModDate;
  for (NSString *fileNameObj in files) {
    //根据文件名获取文件路径
    NSString *path = [util getFilePathByFileName:fileNameObj];
    //获取该路径下文件属性
    NSDictionary *fileAttributes = [util getFileAttributesByFilePath:path];
    if (fileAttributes) {
      //文件修改日期
      if ([fileAttributes objectForKey:NSFileModificationDate]) {
        fileModDate = [fileAttributes objectForKey:NSFileModificationDate];
        //时间戳比较,做删除
        NSString *modTimeStamp =
            [NetCacheTool getTimeStampFromTimeDate:fileModDate];
        if ([modTimeStamp integerValue] < [time integerValue]) {
          //小于传入时间的文件做删除
          [util deleteFile:path];
        }
      }

    } else {
    }
  }
  return YES;
}
#pragma mark - private
+ (NSString *)fileNameOfRequest:(RequestModel *)requsest {
  if (requsest.fileName) {
    return requsest.fileName;
  }
  return [CacheManager fileNameByRequest:requsest];
}

+ (NSString *)fileNameByRequest:(RequestModel *)request {
  NSString *pathMd5 = [NetCacheTool md5HexDigest:request.path];
  NSMutableDictionary *muDic = [request.requestParameter mutableCopy];
  if ([muDic objectForKey:@"ek"]) {
    [muDic removeObjectForKey:@"ek"];
  }
  if ([muDic objectForKey:@"et"]) {
    [muDic removeObjectForKey:@"et"];
  }

  NSString *reqsetParamterStr = [NetCacheTool dictionaryToJson:muDic];
  NSString *reqsetParamterMd5 = [NetCacheTool md5HexDigest:reqsetParamterStr];

  return [NSString stringWithFormat:@"%@%@", pathMd5, reqsetParamterMd5];
}
@end
