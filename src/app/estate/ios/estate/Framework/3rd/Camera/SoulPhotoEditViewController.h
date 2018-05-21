//
//  SoulPhotoEditViewController.h
//  TestOC
//
//  Created by glodon on 2018/3/30.
//  Copyright © 2018年 zyyj. All rights reserved.
//

#import <UIKit/UIKit.h>

@protocol SoulPhotoEditViewControllerDelegate;
@interface SoulPhotoEditViewController : UIViewController
@property(nonatomic,weak,nullable) id<SoulPhotoEditViewControllerDelegate> delegate;
@property(nonatomic,copy,nullable) void(^didFinishPickingBlock)(NSString* _Nonnull assetId);
@property(nonatomic,copy,nullable) void (^didCancelBlock)();
@property(nonatomic,copy,nullable) UIImage* _Nonnull (^inputImageBlock)();
+(void)test:(UIViewController*)navcDelegate image:(UIImage*)image  callback:(void(^)(NSArray * files))callback;
@end

@protocol SoulPhotoEditViewControllerDelegate<NSObject>
@optional
- (void)imagePickerController:(nonnull SoulPhotoEditViewController *)picker didFinishPickingMediaWithInfo:(nonnull NSDictionary<NSString *,id> *)info;
- (void)imagePickerControllerDidCancel:(nonnull SoulPhotoEditViewController *)picker;
@end
