//
//  GLDImagePickerManager.m
//  estate
//
//  Created by glodon on 2018/3/22.
//  Copyright © 2018年 Glodon. All rights reserved.
//

#import "GLDImagePickerManager.h"
#import <LPDQuoteImagesView.h>
@interface GLDImagePickerManager()<LPDImagePickerControllerDelegate,UIImagePickerControllerDelegate,UINavigationControllerDelegate>
@property (nonatomic, strong) UIImagePickerController *picker;
@property (nonatomic, strong) RNAPICompletedBlock callback;
@end
@implementation GLDImagePickerManager
+ (void)api_takePhoto:(NSDictionary *)dictionary finishBlock:(RNAPICompletedBlock) finishBlock {
  
}
+ (void)api_selectPhotoLibrary:(NSDictionary *)dictionary finishBlock:(RNAPICompletedBlock) finishBlock {
  
}
@end
