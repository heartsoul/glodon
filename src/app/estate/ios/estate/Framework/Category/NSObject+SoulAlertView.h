//
//  NSObject+SoulAlertView.h
//  CKUIBaseFramework
//
//  Created by soul on 2017/2/26.
//  Copyright © 2017年 soul. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
typedef void(^SoulAlertViewCompletion)(NSUInteger selectedOtherButtonIndex);

@interface CustomSetting : NSObject
@property(nonatomic, strong) UIColor * cancelColor; // 取消按钮颜色
@property(nonatomic, strong) UIColor * buttonColor; // 其它按钮颜色
@property(nonatomic, strong) UIColor * messageColor; // 提示文字颜色
@property(nonatomic, assign) NSTextAlignment messageAlignment; // 提示文字对齐方式 Default NSTextAlignmentCenter

/**
 共享实例

 @return 唯一的配置对象
 */
+ (instancetype)shareInstance;
/**
 设置全局弹框配置属性

 @param setting 设置参数
 */
- (void)configSetting:(CustomSetting*)setting;
@end

@interface NSObject (SoulAlertView)
/**操作确认弹窗*/
+ (void)showAlertWithTitle:(NSString *)title
                   message:(NSString *)message
         cancelButtonTitle:(NSString *)cancelButtonTitle
         otherButtonTitles:(NSArray *)otherButtonTitles
                completion:(SoulAlertViewCompletion)completion;
/**操作确认弹窗*/
+ (void)showAlertWithTitle:(NSString *)title
                   message:(NSString *)message
         cancelButtonTitle:(NSString *)cancelButtonTitle
         otherButtonTitles:(NSArray *)otherButtonTitles
            viewController:(UIViewController *)viewController
                completion:(SoulAlertViewCompletion)completion;

/**操作提示弹窗，只有一个操作项目，仅仅是提示用户，然后由用户主动关闭*/
+ (void)showTipWithTitle:(NSString *)title
                   message:(NSString *)message
         closeButtonTitle:(NSString *)closeButtonTitle;
@end
