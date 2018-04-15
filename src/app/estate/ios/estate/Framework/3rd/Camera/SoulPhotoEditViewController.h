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
@property(nonatomic,copy,nullable) void(^didFinishPickingBlock)(UIImage* _Nonnull);
@property(nonatomic,copy,nullable) void (^didCancelBlock)();
@property(nonatomic,copy,nullable) UIImage* _Nonnull (^inputImageBlock)();
@end

@protocol SoulPhotoEditViewControllerDelegate<NSObject>
@optional
- (void)imagePickerController:(nonnull SoulPhotoEditViewController *)picker didFinishPickingMediaWithInfo:(nonnull NSDictionary<NSString *,id> *)info;
- (void)imagePickerControllerDidCancel:(nonnull SoulPhotoEditViewController *)picker;
@end
