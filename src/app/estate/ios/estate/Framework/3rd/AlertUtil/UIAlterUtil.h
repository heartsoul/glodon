//
//  UIAlterUtil.h
//  tesn
//
//  Created by bwj on 15/7/24.
//
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface UIAlterUtil : NSObject<UIAlertViewDelegate>
+ (UIAlterUtil *)sharedManager;
-(void)showImageAlterView;//提示图片权限
-(BOOL)checkVoice;//是否有麦克风权限
-(void)showVoiceAlterView;//提示麦克风权限
-(void)showCamraAlterView;//提示相机权限
-(void)showAddressBookeAlterView;//提示通讯录权限
-(void)showCamraAlterView:(UIViewController*)control;//提示相机权限  代理控制器
- (void)showLocationAlterView;//提示未定位
@end
