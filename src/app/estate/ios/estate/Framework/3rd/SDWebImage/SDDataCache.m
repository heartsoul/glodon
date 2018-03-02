//
//  SDDataCache.m
//  tesn
//
//  Created by soul on 15/9/19.
//
//

#import "SDDataCache.h"
@interface SDDataCache ()

@property (strong, nonatomic) NSCache *memCache;
@property (strong, nonatomic) NSString *diskCachePath;
@property (strong, nonatomic) NSMutableArray *customPaths;
@property (SDDispatchQueueSetterSementics, nonatomic) dispatch_queue_t ioQueue;

@end
@implementation SDDataCache
{
    SDImageCache *_sdCache;
    NSFileManager *_fileManager;
}
- (void)dealloc {
    SDDispatchQueueRelease(_ioQueue);
}
+(SDDataCache*) taskDataCache {
    static dispatch_once_t onceTask;
    static id instanceTask;
    dispatch_once(&onceTask, ^{
        instanceTask = [[self new] initWithNamespace:@"task"];
        [[NSNotificationCenter defaultCenter] removeObserver:[instanceTask imageCache]]; // 不清理
    });
    return instanceTask;
}
+(SDDataCache*) settingDataCache {
    static dispatch_once_t onceSetting;
    static id instanceSetting;
    dispatch_once(&onceSetting, ^{
        instanceSetting = [[self new] initWithNamespace:@"setting"];
        [[NSNotificationCenter defaultCenter] removeObserver:[instanceSetting imageCache]]; // 不清理
    });
    return instanceSetting;
}
+(SDDataCache*) networkDataCache {
    static dispatch_once_t onceNetwork;
    static id instanceNetwork;
    dispatch_once(&onceNetwork, ^{
        instanceNetwork = [[self new] initWithNamespace:@"network"];
    });
    return instanceNetwork;
}
+(SDDataCache*) fileDataCache {
    static dispatch_once_t onceFile;
    static id fileNetwork;
    dispatch_once(&onceFile, ^{
        fileNetwork = [[self new] initWithNamespace:@"file"];
    });
    return fileNetwork;
}

- (id)initWithNamespace:(NSString *)ns {
    self = [super init];
    _sdCache  = [[SDImageCache alloc] initWithNamespace:ns];
    // Create IO serial queue
    _ioQueue = dispatch_queue_create("com.hackemist.SDWebImageCache.data", DISPATCH_QUEUE_SERIAL);
    dispatch_sync(_ioQueue, ^{
        _fileManager = [NSFileManager new];
        NSString * path = [_sdCache defaultCachePathForKey:@""];
        if (![_fileManager fileExistsAtPath:path]) {
            [_fileManager createDirectoryAtPath:path withIntermediateDirectories:YES attributes:nil error:NULL];
        }
    });
    return self;
}
- (SDImageCache*)imageCache {
    return _sdCache;
}
- (void)addReadOnlyCachePath:(NSString *)path {
    if (!self.customPaths) {
        self.customPaths = [NSMutableArray new];
    }
    
    if (![self.customPaths containsObject:path]) {
        [self.customPaths addObject:path];
    }
}
// 直接存储数据 add 2014-03-29
- (void)storeData:(NSData *)dataIn forKey:(NSString *)key {
    if (!dataIn || !key) {
        return;
    }
    // 同步存储数据，这样就能保证后续读取能够成功读取，否则可能导致存储返回，但还未完成存储就进行读取，当然就时nil了
    dispatch_sync(self.ioQueue, ^{
        NSData *data = dataIn;
        if (data) {
            NSString * path = [_sdCache defaultCachePathForKey:@""];
            if (![_fileManager fileExistsAtPath:path]) {
                [_fileManager createDirectoryAtPath:path withIntermediateDirectories:YES attributes:nil error:NULL];
            }
            if (key) {
                [_fileManager createFileAtPath:[_sdCache defaultCachePathForKey:key] contents:data attributes:nil];
            }
            
        }
    });
}
// 直接读取数据
- (NSData *)diskDataForKey:(NSString *)key {
    NSString *defaultPath = [_sdCache defaultCachePathForKey:key];
    NSData *data = [NSData dataWithContentsOfFile:defaultPath];
    return data;
}

-(void)removeCacheForKey :(NSString *)key {
  [_fileManager removeItemAtPath:[_sdCache defaultCachePathForKey:key] error:nil];
}

- (BOOL)existInCachePathForKey :(NSString *)key{
  return ([_fileManager fileExistsAtPath:[_sdCache defaultCachePathForKey:key]]);
}
@end
