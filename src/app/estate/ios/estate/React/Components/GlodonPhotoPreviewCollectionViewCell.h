//
//  GlodonPhotoPreviewCollectionViewCell.h
//  estate
//
//  Created by soul on 2018/4/15.
//  Copyright © 2018年 Glodon. All rights reserved.
//

#import <UIKit/UIKit.h>

@class LPDAssetModel,LPDProgressView;
@interface GlodonPhotoPreviewCollectionViewCell : UICollectionViewCell
@property (nonatomic, strong) LPDAssetModel *model;
@property (nonatomic, copy) void (^singleTapGestureBlock)();
@property (nonatomic, copy) void (^imageProgressUpdateBlock)(double progress);

@property (nonatomic, strong) UIImageView *imageView;
@property (nonatomic, strong) UIScrollView *scrollView;
@property (nonatomic, strong) UIView *imageContainerView;
@property (nonatomic, strong) LPDProgressView *progressView;




- (void)recoverSubviews;

@end
