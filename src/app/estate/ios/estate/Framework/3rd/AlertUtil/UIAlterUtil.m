//
//  UIAlterUtil.m
//  tesn
//
//  Created by bwj on 15/7/24.
//
//

#import "UIAlterUtil.h"

#import <AVFoundation/AVFoundation.h>

@implementation UIAlterUtil
+ (UIAlterUtil *)sharedManager
{
    static UIAlterUtil *sharedAccountManagerInstance = nil;
    static dispatch_once_t predicate;
    dispatch_once(&predicate, ^{
        sharedAccountManagerInstance = [[self alloc] init];
    });
    return sharedAccountManagerInstance;
}
-(void)showImageAlterView
{
    UIAlertView * alter = [[UIAlertView alloc] initWithTitle:@"提示" message:@"请在iPhone的“设置－隐私－照片”选项中，允许企业空间访问你的手机相册。" delegate:self cancelButtonTitle:@"确定" otherButtonTitles:@"去设置", nil];
    alter.tag=100;
    [alter show];
    
}
-(void)showCamraAlterView
{
    UIAlertView * alter = [[UIAlertView alloc] initWithTitle:@"提示" message:@"请在iPhone的“设置－隐私－相机”选项中，允许企业空间访问你的手机相机。" delegate:self cancelButtonTitle:@"确定" otherButtonTitles:@"去设置", nil];
    alter.tag=100;
    [alter show];
    
}
-(void)showVoiceAlterView
{
    UIAlertView * alter = [[UIAlertView alloc] initWithTitle:@"提示" message:@"请在iPhone的“设置－隐私－麦克风”选项中，允许企业空间访问你的手机麦克风。" delegate:self cancelButtonTitle:@"确定" otherButtonTitles:@"去设置", nil];
    alter.tag=100;
    [alter show];
}
-(void)showAddressBookeAlterView
{
    
    UIAlertView * alter = [[UIAlertView alloc] initWithTitle:@"提示" message:@"请在iPhone的“设置－隐私－通讯录”选项中，允许企业空间访问你的手机通讯录。" delegate:self cancelButtonTitle:@"确定" otherButtonTitles:@"去设置", nil];
    alter.tag=100;
    [alter show];
    
}
-(void)showCamraAlterView:(UIViewController*)control
{
    
    UIAlertView * alter = [[UIAlertView alloc] initWithTitle:@"提示" message:@"请在iPhone的“设置－隐私－相机”选项中，允许企业空间访问你的手机相机。" delegate:control cancelButtonTitle:@"确定" otherButtonTitles:@"去设置", nil];
    alter.tag=100;
    [alter show];
    
}
- (void)showLocationAlterView
{
    
    
    UIAlertView * alter = [[UIAlertView alloc] initWithTitle:@"提示" message:@"请在iPhone的“设置－隐私－定位”选项中，允许企业空间访问你的手机定位。" delegate:self cancelButtonTitle:@"确定" otherButtonTitles:@"去设置", nil];
    alter.tag=100;
    [alter show];
    
}
-(void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex
{
    if (alertView.tag==100 && buttonIndex==1)
    {
        NSURL *url = [NSURL URLWithString:UIApplicationOpenSettingsURLString];
        if ([[UIApplication sharedApplication] canOpenURL:url]) {
            [[UIApplication sharedApplication] openURL:url];
            
        }
    }
}
- (BOOL)checkVoice {
    //检查麦克风是否开启 IOS7新增接口
    AVAudioSession *audioSession = [AVAudioSession sharedInstance];
    [audioSession setCategory:AVAudioSessionCategoryPlayAndRecord error:nil];
    
    __block BOOL ret = NO;
    if ([audioSession respondsToSelector:@selector(requestRecordPermission:)]) {
        [audioSession performSelector:@selector(requestRecordPermission:) withObject:^(BOOL granted) {
            ret = granted;
            if (!granted) {
                // Microphone disabled code
                [[UIAlterUtil sharedManager] showVoiceAlterView];
            }
        }];
    }
    return ret;
}


@end
