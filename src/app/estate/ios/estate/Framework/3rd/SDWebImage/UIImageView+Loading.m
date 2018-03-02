//
//  UIImageView+Loading.m
//  meinvli8
//
//  Created by soul on 14-3-30.
//  Copyright (c) 2017年 soul. All rights reserved.
//

#import "UIImageView+Loading.h"

@implementation UIImageView (Loading)
/**
 * Set the imageView `image` with an `url`.
 *
 * The downloand is asynchronous and no cached.
 *
 * @param url The url for the image.
 */
- (void)loadImageNoCachedWithURL:(NSURL *)url {
  [self sd_setImageWithURL:url placeholderImage:nil options:SDWebImageRefreshCached progress:nil completed:nil];

}

/**
 * Set the imageView `image` with an `url`.
 *
 * The downloand is asynchronous and cached.
 *
 * @param url The url for the image.
 */
- (void)loadImageWithURL:(NSURL *)url {
    [self loadImageWithURL:url placeholderImage:nil];
}

/**
 * Set the imageView `image` with an `url` and a placeholder.
 *
 * The downloand is asynchronous and cached.
 *
 * @param url The url for the image.
 * @param placeholder The image to be set initially, until the image request finishes.
 * @see setImageWithURL:placeholderImage:options:
 */
- (void)loadImageWithURL:(NSURL *)url placeholderImage:(UIImage *)placeholder{

//    [self setIndicatorStyle:UIActivityIndicatorViewStyleWhite];
//    [self setShowActivityIndicatorView:YES];

    [self sd_setImageWithURL:url
            placeholderImage:placeholder];
    
}
- (void)loadImageWithURL:(NSURL *)url placeholderImage:(UIImage *)placeholder completion:(SDExternalCompletionBlock)completionBlock {
    dispatch_main_async_safe(^{
//        [self setIndicatorStyle:UIActivityIndicatorViewStyleWhite];
//        [self setShowActivityIndicatorView:YES];
      
        [self sd_setImageWithURL:url
                placeholderImage:placeholder options:SDWebImageRetryFailed|SDWebImageAvoidAutoSetImage completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, NSURL *imageURL) {
                    if (completionBlock) {
                        completionBlock(image, error, cacheType, imageURL);
                    }
                }];
    });
   
}
@end
