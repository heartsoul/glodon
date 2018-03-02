//
//  CacheUtil.m
//  NetFramework
//
//  Created by banwj on 16/5/31.
//  Copyright © 2017年 soul. All rights reserved.
//

#import "CacheUtil.h"

@implementation CacheUtil
//获取Documents路径下cacheFile文件夹
- (NSString *)getDocumentsPath {
  //获取Documents路径
  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,
                                                       NSUserDomainMask, YES);
  NSString *path = [paths objectAtIndex:0];

  NSFileManager *fileManager = [NSFileManager defaultManager];
  NSString *iOSDirectory = [path stringByAppendingPathComponent:@"cacheFile"];

  if (![fileManager fileExistsAtPath:iOSDirectory]) {
    [fileManager createDirectoryAtPath:iOSDirectory
           withIntermediateDirectories:YES
                            attributes:nil
                                 error:nil];
  }
  return iOSDirectory;
}
- (NSString *)getDocumentsPathFileName:(NSString *)fileName {
  NSAssert(fileName, @"fileName can't be nil");

  NSString *documentsPath = [self getDocumentsPath];
  NSString *filePath = [documentsPath stringByAppendingPathComponent:fileName];
  return filePath;
}
//创建文件夹
- (BOOL)createDirectory:(NSString *)directoryName {
  NSAssert(directoryName, @"directoryName can't be nil");

  NSString *documentsPath = [self getDocumentsPath];
  NSFileManager *fileManager = [NSFileManager defaultManager];
  NSString *iOSDirectory =
      [documentsPath stringByAppendingPathComponent:directoryName];
  BOOL isSuccess = [fileManager createDirectoryAtPath:iOSDirectory
                          withIntermediateDirectories:YES
                                           attributes:nil
                                                error:nil];
  return isSuccess;
}
//创建文件
- (BOOL)createFilePath:(NSString *)filePath {
  NSAssert(filePath, @"filePath can't be nil");

  NSFileManager *fileManager = [NSFileManager defaultManager];
  NSString *iOSPath = filePath;
  BOOL isSuccess =
      [fileManager createFileAtPath:iOSPath contents:nil attributes:nil];
  return isSuccess;
}
//写文件
- (BOOL)writeFilePath:(NSString *)filePath file:(NSString *)fileString {
  NSAssert(filePath, @"filePath can't be nil");

  NSString *iOSPath = filePath;
  NSString *content = fileString;
  BOOL isSuccess = [content writeToFile:iOSPath
                             atomically:YES
                               encoding:NSUTF8StringEncoding
                                  error:nil];
  return isSuccess;
}
//写文件
- (BOOL)writeFilePath:(NSString *)filePath data:(NSData *)fileData {
  NSAssert(filePath, @"filePath can't be nil");

  NSString *iOSPath = filePath;
  NSData *content = fileData;
  BOOL isSuccess = [content writeToFile:iOSPath atomically:YES];
  return isSuccess;
}
//读取文件内容
- (NSString *)readFileContentStringFilePath:(NSString *)filePath {
  NSAssert(filePath, @"filePath can't be nil");

  NSString *iOSPath = filePath;
  NSString *content = [NSString stringWithContentsOfFile:iOSPath
                                                encoding:NSUTF8StringEncoding
                                                   error:nil];
  return content;
}
//读取文件内容
- (NSData *)readFileContentDataFilePath:(NSString *)filePath {
  NSAssert(filePath, @"filePath can't be nil");

  NSString *iOSPath = filePath;
  NSData *content = [NSData dataWithContentsOfFile:iOSPath];
  return content;
}

//判断文件是否存在
- (BOOL)isSxistAtPath:(NSString *)filePath {
  NSAssert(filePath, @"filePath can't be nil");

  NSFileManager *fileManager = [NSFileManager defaultManager];
  BOOL isExist = [fileManager fileExistsAtPath:filePath];
  return isExist;
}
//计算文件大小
- (unsigned long long)fileSizeAtPath:(NSString *)filePath {
  NSAssert(filePath, @"filePath can't be nil");

  NSFileManager *fileManager = [NSFileManager defaultManager];
  BOOL isExist = [fileManager fileExistsAtPath:filePath];
  if (isExist) {
    unsigned long long fileSize =
        [[fileManager attributesOfItemAtPath:filePath error:nil] fileSize];
    return fileSize;
  } else {
    return 0;
  }
}
//计算整个文件夹中所有文件大小
- (unsigned long long)folderSizeAtPath:(NSString *)folderPath {
  NSAssert(folderPath, @"folderPath can't be nil");

  NSFileManager *fileManager = [NSFileManager defaultManager];
  BOOL isExist = [fileManager fileExistsAtPath:folderPath];
  if (isExist) {
    NSEnumerator *childFileEnumerator =
        [[fileManager subpathsAtPath:folderPath] objectEnumerator];
    unsigned long long folderSize = 0;
    NSString *fileName = @"";
    while ((fileName = [childFileEnumerator nextObject]) != nil) {
      NSString *fileAbsolutePath =
          [folderPath stringByAppendingPathComponent:fileName];
      folderSize += [self fileSizeAtPath:fileAbsolutePath];
    }
    return folderSize / (1024.0 * 1024.0);
  } else {
    return 0;
  }
}
//删除文件
- (BOOL)deleteFile:(NSString *)filePath {
  NSAssert(filePath, @"filePath can't be nil");

  NSFileManager *fileManager = [NSFileManager defaultManager];
  NSString *iOSPath = filePath;
  BOOL isSuccess = [fileManager removeItemAtPath:iOSPath error:nil];
  return isSuccess;
}
- (NSDictionary *)getFileAttributesByFilePath:(NSString *)filePath {
  NSFileManager *fileManager = [NSFileManager defaultManager];
  NSError *error = nil;
  NSDictionary *fileAttributes =
      [fileManager attributesOfItemAtPath:filePath error:&error];
  return fileAttributes;
}
- (NSArray *)getAllFileNames {
  NSString *fileDirectory = [self getDocumentsPath];
  NSArray *files =
      [[NSFileManager defaultManager] subpathsOfDirectoryAtPath:fileDirectory
                                                          error:nil];
  return files;
}
- (NSString *)getFilePathByFileName:(NSString *)fileName {
  NSString *documentDirectory = [self getDocumentsPath];
  return [documentDirectory stringByAppendingPathComponent:fileName];
}

@end
