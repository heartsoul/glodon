//
//  NetApiDelegate.m
//  PRM
//
//  Created by soul on 2017/9/1.
//  Copyright © 2017年 Soul. All rights reserved.
//

#import "NetApiDelegate.h"

NSString* const SoulNetApiDelegate = @"net_api_delegate";

NSString* const _KEY_KVO_DELEGATE = @"netApiDelegate";
NSString* const SoulNetApiDelegateUpdateNotice = @"net_api_delegate_update_notice";

@interface NetApiDelegate()

@property(atomic, weak) id netApiDelegate; // 发起命令的对象
@property(atomic, weak) NSURLSessionTask *netApiRequest; // 网络对象，网络请求一旦建立，就会设置
@property(atomic, assign) BOOL canceled; // 命令已经取消，设置此对象，防止操作时差导致的错误执行
@property(atomic, assign) BOOL hasDelegateKVO; // 是否建立了KVO对象，用于释放KVO
@property(atomic, assign) NSUInteger netApiId; // 当前命令id
- (BOOL) hasCanceled;
@end

static NSUInteger __netApiIdQuene = 0;
@implementation NetApiDelegate

+ (instancetype) instanceDelegate:(id)delegate{
    NetApiDelegate * ret = [[NetApiDelegate alloc] init];
    ret.netApiDelegate = delegate;
    [ret addDelegateKVO];
    [self cleanOnIdel];
    return  ret;
}

+ (void) cleanOnIdel{
    [[NSNotificationCenter defaultCenter] postNotificationName: SoulNetApiDelegateUpdateNotice object:nil];
}

- (instancetype)init {
    self = [super init];
    if (self) {
        _netApiId = __netApiIdQuene ++;
    }
    
    return self;
}

- (void)dealloc {
    self.canceled = YES;
    [self removeDelegateKVO];
}

- (BOOL)hasCanceled {
    return (self.canceled || self.netApiDelegate == nil);
}

- (BOOL)cancel {
    [self removeDelegateKVO];
    self.canceled = YES;
    self.netApiDelegate = nil;
    [self.netApiRequest cancel];
    self.netApiRequest = nil;
    return YES;
}

- (void) clean:(id)sender {
    @synchronized (self) {
        if (self.canceled) {
            return;
        }
        if (self.netApiDelegate == nil) {
            [self cancel];
        }
    }
}
- (void)addDelegateKVO {
    [self removeDelegateKVO];
    [self addObserver:self forKeyPath:_KEY_KVO_DELEGATE options:NSKeyValueObservingOptionNew|NSKeyValueObservingOptionOld context:(void*)self];
    self.hasDelegateKVO = YES;
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(clean:) name:SoulNetApiDelegateUpdateNotice object:nil];
    
}

- (void)removeDelegateKVO {
    [[NSNotificationCenter defaultCenter] removeObserver:self name:SoulNetApiDelegateUpdateNotice object:nil];
    if (self.hasDelegateKVO) {
        [self removeObserver:self forKeyPath:_KEY_KVO_DELEGATE context:(void*)self];
    }
    self.hasDelegateKVO = NO;
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary<NSKeyValueChangeKey,id> *)change context:(void *)context {
    
    if ([keyPath isEqualToString:_KEY_KVO_DELEGATE]) {
        if (context != (__bridge void*)self) {
            return;
        }
        // 对宿主进行判定，如果宿主提前释放了，或者取消了，就不要继续处理了
        if([self hasCanceled]) {
            [self removeDelegateKVO];
            return;
        }
        NSObject * newValue = [change valueForKey:NSKeyValueChangeNewKey];
        if (newValue == nil) {
            [self cancel];
        }
        return;
    }
    return [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
}

@end
