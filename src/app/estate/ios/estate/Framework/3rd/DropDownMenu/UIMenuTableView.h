//
//  UIMenuTableView.h
//  tesn
//
//  Created by soul on 14/12/4.
//  Copyright (c) 2014年 yonyouup. All rights reserved.
//

#import <UIKit/UIKit.h>

// NS_ASSUME_NONNULL_BEGIN

@class UIMenuTableView;
NS_ASSUME_NONNULL_BEGIN
@protocol UIMenuTableViewDelegate
@required
/**
 选择项目选择，返回NO为不自动隐藏，返回YES为自动隐藏

 @param menuTableView 菜单表
 @param indexPath 选择项
 @return 是否自动移除菜单，YES：自动移除，会调用hideMenu，NO：不做处理
 */
- (BOOL)menuTableViewDidSelectMenuItem:(UIMenuTableView *)menuTableView
                             indexPath:(NSIndexPath *)indexPath;

/**
 项目将要隐藏
 */
- (void)menuTableViewDismissMenuItem:(UIMenuTableView *)menuTableView;
@end

@interface UIMenuViewContainner : UIView
@property(nonatomic, weak) UIMenuTableView *contentView;
- (void)showMenuPoint:(CGPoint)point height:(CGFloat)height contentView:(UIMenuTableView*)contentView alpha:(CGFloat)alpha;
- (void)hideMenu;
- (void)hideMenuAnimation;
@end

@interface UIMenuTableViewCell : UITableViewCell
@property(strong, nonatomic) UIImageView *avatarImageView;
@property(strong, nonatomic) UILabel *titleLabel;
@property(strong, nonatomic) UILabel *rightTitleLabel;
@property(strong, nonatomic) UIView *separatorView;
@property(strong, nonatomic) UIView *flagView;
@end

@interface UIMenuTableView
    : UITableView <UITableViewDataSource, UITableViewDelegate>
@property(strong, nonatomic) NSMutableArray *menuItems;
@property(strong, nonatomic) UIMenuViewContainner *menuViewContainner;
@property(weak, nonatomic) id<UIMenuTableViewDelegate> menuDelegate;
- (instancetype)initInner;
- (void)showMenuPoint:(CGPoint)point;
- (void)showMenuPoint:(CGPoint)point alpha:(CGFloat)alpha;

- (void)hideMenu;
@end

@interface UILabelTitle : UILabel

@property(nonatomic, nullable, strong) NSMutableArray *menuItems;
@property(nonatomic, nullable, strong) UIImageView *stateImageView;
@property(nonatomic, nullable, copy) void (^arrowChange)(void);
@property(nonatomic, nullable, copy) void (^selectItem)
    (NSDictionary *__nonnull itemDic);

- (void)initTitleImage:(NSString *__nonnull)title
            themeColor:(UIColor *__nonnull)themeColor
             menuItems:(NSMutableArray *__nonnull)menuItem;
- (void)showMenu:(NSMutableArray *__nonnull)menuItems;
- (void)updateTitleImageState:(BOOL)bOpen;
@end

NS_ASSUME_NONNULL_END
