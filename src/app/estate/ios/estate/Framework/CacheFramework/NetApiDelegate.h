//
//  NetApiDelegate.h
//  PRM
//
//  Created by soul on 2017/9/1.
//  Copyright © 2017年 Soul. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NetApiDelegate : NSObject

/**
 *  @author soul
 *  命令取消
 *  @return 是否取消成功 YES：成功，NO：失败，当前始终返回YES，
 */
- (BOOL) cancel; // 取消命令

/**
 *  @author soul
 *  命令释放已经取消
 *  @return 是否取消 YES：已经取消，NO：未取消，
 */
- (BOOL)hasCanceled;

/**
 *  @author soul
 *  实例化一个对象，用户必须要通过此函数来使用对象，否则没有入口设置delegate
 *  @return 是否取消成功 YES：成功，NO：失败，当前始终返回YES，
 */
+ (instancetype) instanceDelegate:(id)delegate;
@end
