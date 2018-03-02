//
//  CacheUtil.h
//  NetFramework
//
//  Created by banwj on 16/5/31.
//  Copyright © 2017年 soul. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface CacheUtil : NSObject
/**
 *  获取Documents路径下cacheFile文件夹,如果不存在自动创建
 *
 *  @return <#return value description#>
 */
- (NSString *)getDocumentsPath;
/**
 *  获取Documents路径下文件名称的路径
 *
 *  @return <#return value description#>
 */
- (NSString *)getDocumentsPathFileName:(NSString *)fileName;
/**
 *  Documents目录下创建文件夹
 *
 *  @param directoryName 文件夹名称
 *
 *  @return 是否成功
 */
- (BOOL)createDirectory:(NSString *)directoryName;
/**
 *  创建文件
 *
 *  @param filePath 文件路径(含文件名)
 *
 *  @return 是否成功
 */
- (BOOL)createFilePath:(NSString *)filePath;
/**
 *  string字符写入文件
 *
 *  @param filePath   文件路径(含文件名)
 *  @param fileString 文件内容
 *
 *  @return <#return value description#>
 */
- (BOOL)writeFilePath:(NSString *)filePath file:(NSString *)fileString;
/**
 *  data写入文件
 *
 *  @param filePath 文件路径(含文件名)
 *  @param fileData 文件内容
 *
 *  @return <#return value description#>
 */
- (BOOL)writeFilePath:(NSString *)filePath data:(NSData *)fileData;
/**
 *  从文件读取string
 *
 *  @param filePath 文件路径(含文件名)
 *
 *  @return <#return value description#>
 */
- (NSString *)readFileContentStringFilePath:(NSString *)filePath;
/**
 *  从文件读取data
 *
 *  @param filePath 文件路径(含文件名)
 *
 *  @return <#return value description#>
 */
- (NSData *)readFileContentDataFilePath:(NSString *)filePath;
/**
 *  是否存在文件
 *
 *  @param filePath 文件路径(含文件名)
 *
 *  @return <#return value description#>
 */
- (BOOL)isSxistAtPath:(NSString *)filePath;
/**
 *  文件大小
 *
 *  @param filePath 文件路径(含文件名)
 *
 *  @return <#return value description#>
 */
- (unsigned long long)fileSizeAtPath:(NSString *)filePath;
/**
 *  文件夹大小
 *
 *  @param folderPath 文件夹目录(含文件夹)
 *
 *  @return <#return value description#>
 */
- (unsigned long long)folderSizeAtPath:(NSString *)folderPath;
/**
 *  删除文件
 *
 *  @param filePath 文件路径(含文件名)
 *
 *  @return <#return value description#>
 */
- (BOOL)deleteFile:(NSString *)filePath;
/**
 *  获取Documents路径下cacheFile所有文件
 */
- (NSArray *)getAllFileNames;
/**
 *  获取文件属性(文件大小,创建日期,文件所有者,修改日期等)
 */
- (NSDictionary *)getFileAttributesByFilePath:(NSString *)filePath;
/**
 *  根据文件名获取文件路径
 */
- (NSString *)getFilePathByFileName:(NSString *)fileName;
@end
