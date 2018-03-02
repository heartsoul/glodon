//
//  UIImageView+Loading.h
//  meinvli8
//
//  Created by soul on 14-3-30.
//  Copyright (c) 2017年 soul. All rights reserved.
//  对于图片加载的封装，以应对第三方库的升级对于项目的影响

#import <UIKit/UIKit.h>

#import "UIImageView+WebCache.h"
/**
 * Integrates SDWebImage async downloading and caching of remote images with UIImageView.
 *
 * Usage with a UITableViewCell sub-class:
 *
 * @code
 
 #import <UIImageView+Loading.h>
 
 ...
 
 - (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
 {
 static NSString *MyIdentifier = @"MyIdentifier";
 
 UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:MyIdentifier];
 
 if (cell == nil) {
 cell = [[[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:MyIdentifier]
 autorelease];
 }
 
 // Here we use the provided setImageWithURL: method to load the web image
 // Ensure you use a placeholder image otherwise cells will be initialized with no image
 [cell.imageView loadImageWithURL:[NSURL URLWithString:@"http://example.com/image.jpg"]
 placeholderImage:[UIImage imageNamed:@"placeholder"]];
 
 cell.textLabel.text = @"My Text";
 return cell;
 }
 */
@interface UIImageView (Loading)
// 重写 UIImageView+WebCache 的方法，直接集成加载进度
/**
 * Set the imageView `image` with an `url`.
 *
 * The downloand is asynchronous and cached.
 *
 * @param url The url for the image.
 */
- (void)loadImageWithURL:(NSURL *)url;
/**
 * Set the imageView `image` with an `url`.
 *
 * The downloand is asynchronous and no cached.
 *
 * @param url The url for the image.
 */
- (void)loadImageNoCachedWithURL:(NSURL *)url;
/**
 * Set the imageView `image` with an `url` and a placeholder.
 *
 * The downloand is asynchronous and cached.
 *
 * @param url The url for the image.
 * @param placeholder The image to be set initially, until the image request finishes.
 * @see setImageWithURL:placeholderImage:options:
 */
- (void)loadImageWithURL:(NSURL *)url placeholderImage:(UIImage *)placeholder;
- (void)loadImageWithURL:(NSURL *)url placeholderImage:(UIImage *)placeholder completion:(SDExternalCompletionBlock)CompletionBlock;
@end
