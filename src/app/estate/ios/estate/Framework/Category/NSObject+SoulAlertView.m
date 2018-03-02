//
//  NSObject+SoulAlertView.m
//  CKUIBaseFramework
//
//  Created by soul on 2017/2/26.
//  Copyright © 2017年 soul. All rights reserved.
//

#import "NSObject+SoulAlertView.h"
#import <UIKit/UIKit.h>
#import "UIAlertAction+Soul.h"
#import "UIAlertController+Soul.h"
@interface UIAlertAction (GLDUIAlertAction)
+ (nonnull instancetype)actionWithTitle:(nullable NSString *)title style:(UIAlertActionStyle)style color:(nullable UIColor*)color handler:(void (^ __nullable)( UIAlertAction * __nullable action))handler;

@end

@implementation UIAlertAction (GLDUIAlertAction)
+ (nonnull instancetype)actionWithTitle:(nullable NSString *)title style:(UIAlertActionStyle)style color:(nullable UIColor*)color handler:(void (^ __nullable)( UIAlertAction * __nullable action))handler {
    UIAlertAction* action = [[self class] actionWithTitle:title style:style handler:handler];
    if(style == UIAlertActionStyleCancel) {
        [action setTextColor:color];
    }
//    [action setValue:color forKey:@"_titleTextColor"];
    return action;
}

@end

@interface CustomSetting()

@end

@implementation CustomSetting

+ (instancetype)shareInstance {
    static dispatch_once_t onceToken;
    static CustomSetting* instance;
    dispatch_once(&onceToken, ^{
        instance = [CustomSetting new];
    });
    return instance;
}

/**
 设置全局弹框配置属性
 
 @param setting 设置参数
 */
- (void)configSetting:(CustomSetting*)setting {
    self.cancelColor = setting.cancelColor;
    self.buttonColor = setting.buttonColor;
    self.messageColor = setting.messageColor;
    self.messageAlignment = setting.messageAlignment;
}

@end
@interface SoulAlertView:NSObject
@end

@interface SoulAlertView()<UIAlertViewDelegate>

@property (nonatomic, copy) SoulAlertViewCompletion completion;

@end

@implementation SoulAlertView

#if __IPHONE_OS_VERSION_MIN_REQUIRED < __IPHONE_8_0

///--------------------------------------
#pragma mark - UIAlertViewDelegate
///--------------------------------------

- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex {
  if (self.completion) {
    if (buttonIndex == alertView.cancelButtonIndex) {
      //self.completion(NSNotFound);
    } else {
      self.completion(buttonIndex - 1);
    }
  }
}

#endif
@end

@implementation NSObject (SoulAlertView)
///--------------------------------------
#pragma mark - Init
///--------------------------------------
+ (void)showAlertWithTitle:(NSString *)title
                        message:(NSString *)message
              cancelButtonTitle:(NSString *)cancelButtonTitle
              otherButtonTitles:(NSArray *)otherButtonTitles
                     completion:(SoulAlertViewCompletion)completion{
  [[self class] showAlertWithTitle:title message:message cancelButtonTitle:cancelButtonTitle otherButtonTitles:otherButtonTitles viewController:nil completion:completion];
}
/**操作确认弹窗*/
+ (void)showAlertWithTitle:(NSString *)title
                   message:(NSString *)message
         cancelButtonTitle:(NSString *)cancelButtonTitle
         otherButtonTitles:(NSArray *)otherButtonTitles
            viewController:(UIViewController *)viewController
                completion:(SoulAlertViewCompletion)completion {
  CGFloat delay = 0.5f;
  if (viewController) {
    delay = 0.05f;
  }
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delay * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    [[self class] showAlertWithTitleInner:title message:message cancelButtonTitle:cancelButtonTitle otherButtonTitles:otherButtonTitles viewController:viewController completion:completion];
  });
}
+ (void)showAlertWithTitleInner:(NSString *)title
                   message:(NSString *)message
         cancelButtonTitle:(NSString *)cancelButtonTitle
         otherButtonTitles:(NSArray *)otherButtonTitles
            viewController:(UIViewController *)viewController
                completion:(SoulAlertViewCompletion)completion {
  
  if ([UIAlertController class] != nil) {
    __block UIAlertController *alertController = [UIAlertController alertControllerWithTitle:title
                                                                                     message:message
                                                                              preferredStyle:UIAlertControllerStyleAlert];
       
      if ([CustomSetting shareInstance].messageColor) {
//          /修改title
          
//          NSMutableAttributedString *alertControllerStr = [[NSMutableAttributedString alloc] initWithString:@"提示"];
//          
//          [alertControllerStr addAttribute:NSForegroundColorAttributeName value:[UIColor redColor] range:NSMakeRange(0, 2)];
//          
//          [alertControllerStr addAttribute:NSFontAttributeName value:[UIFont systemFontOfSize:17] range:NSMakeRange(0, 2)];
//          
//          [alertController setValue:alertControllerStr forKey:@"attributedTitle"];
//          
//          //修改message
          
          NSMutableAttributedString *alertControllerMessageStr = [[NSMutableAttributedString alloc] initWithString:message];
//
          [alertControllerMessageStr addAttribute:NSForegroundColorAttributeName value:[CustomSetting shareInstance].messageColor range:NSMakeRange(0, message.length)];
          [alertControllerMessageStr addAttribute:NSFontAttributeName value:[UIFont systemFontOfSize:14] range:NSMakeRange(0, message.length)];
//          NSMutableParagraphStyle *style = [[NSMutableParagraphStyle alloc] init];     //段落样式
//          NSTextAlignment align = [CustomSetting shareInstance].messageAlignment;  //对齐方式
//          style.alignment = align;
//          style.lineSpacing = 5;
//           [alertControllerMessageStr addAttribute:NSParagraphStyleAttributeName value:style range:NSMakeRange(0, message.length)];

//          [alertController setValue:alertControllerMessageStr forKey:@"_attributedMessage"];
          [alertController setMessage:alertControllerMessageStr style:nil];
          
      }
      if(title.length) {
          NSMutableAttributedString *alertControllerTitleStr = [[NSMutableAttributedString alloc] initWithString:title];
          [alertController setTitle:alertControllerTitleStr font:nil];
      }
      
    void (^alertActionHandler)(UIAlertAction *) = [^(UIAlertAction *action) {
      if (completion) {
        // This block intentionally retains alertController, and releases it afterwards.
        if (action.style == UIAlertActionStyleCancel) {
          //completion(NSNotFound);
        } else {
          NSUInteger index = [alertController.actions indexOfObject:action];
          completion(index - 1);
        }
      }
      alertController = nil;
    } copy];
    
    [alertController addAction:[UIAlertAction actionWithTitle:cancelButtonTitle
                                                        style:UIAlertActionStyleCancel
                                                        color:[CustomSetting shareInstance].cancelColor
                                                      handler:alertActionHandler]];
    
    for (NSString *buttonTitle in otherButtonTitles) {
      [alertController addAction:[UIAlertAction actionWithTitle:buttonTitle
                                                          style:UIAlertActionStyleDefault
                                                          color:[CustomSetting shareInstance].buttonColor
                                                        handler:alertActionHandler]];
    }
    if(!viewController) {
      UIWindow *keyWindow = [UIApplication sharedApplication].keyWindow;
      viewController = keyWindow.rootViewController;
      while (viewController.presentedViewController) {
        viewController = viewController.presentedViewController;
      }
    }
    NSAssert(viewController, @"没有合适的窗口用于弹出提示窗！！！！！");
    [viewController presentViewController:alertController animated:YES completion:nil];
  } else {
#if __IPHONE_OS_VERSION_MIN_REQUIRED < __IPHONE_8_0
    __block SoulAlertView *soulAlertView = [[self alloc] init];
    UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:title
                                                        message:message
                                                       delegate:nil
                                              cancelButtonTitle:cancelButtonTitle
                                              otherButtonTitles:nil];
    
    for (NSString *buttonTitle in otherButtonTitles) {
      [alertView addButtonWithTitle:buttonTitle];
    }
    
    soulAlertView.completion = ^(NSUInteger index) {
      if (completion) {
        completion(index);
      }
      
      soulAlertView = nil;
    };
    
    alertView.delegate = soulAlertView;
    [alertView show];
#endif
  }
}

+ (void)showTipWithTitle:(NSString *)title
                 message:(NSString *)message
        closeButtonTitle:(NSString *)closeButtonTitle {
  [[self class] showAlertWithTitle:title message:message cancelButtonTitle:closeButtonTitle otherButtonTitles:nil completion:nil];
}
@end




