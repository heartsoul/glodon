//
//  SoulCameraViewController.h
//  estate
//
//  Created by glodon on 2018/3/30.
//  Copyright © 2018年 Glodon. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "SoulPhotoEditViewController.h"
@protocol SoulCameraViewControllerDelegate;
@interface SoulCameraViewController : UIViewController
@property(nonatomic,weak,nullable) id<SoulCameraViewControllerDelegate> delegate;
@property(nonatomic,copy,nullable) void(^didFinishPickingBlock)(UIImage* _Nonnull);
@property(nonatomic,copy,nullable) void (^didCancelBlock)();

+(void)saveImage:(UIImage *)image finishBlock:(void(^)(NSString *localIdentifier))finishBlock;
@end

@protocol SoulCameraViewControllerDelegate<NSObject>
@optional
- (void)imagePickerController:(nonnull SoulCameraViewController *)picker didFinishPickingMediaWithInfo:(nonnull NSDictionary<NSString *,id> *)info;
- (void)imagePickerControllerDidCancel:(nonnull SoulCameraViewController *)picker;
@end
@interface SoulCameraViewControllerOrigin : UIImagePickerController<UIImagePickerControllerDelegate,UINavigationControllerDelegate>

@property(nonatomic,copy,nullable) void(^didFinishPickingBlock)(UIImage* _Nonnull);
@property(nonatomic,copy,nullable) void (^didCancelBlock)();
@end

