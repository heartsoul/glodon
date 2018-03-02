//
//  DownSheet.h
//  audioWriting
//
//  Created by wolf on 14-7-19.
//  Copyright (c) 2014年 wangruiyy. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "DownSheetCell.h"
/**0:指定位置，（0，0） 1: 左侧 2: 右侧 0:中间 */
typedef NS_ENUM(NSInteger, DownSheetLayoutType) {
    DownSheetLayoutTypeCenter   = 0,
    DownSheetLayoutTypeLeft = 1,
    DownSheetLayoutTypeRight  = 2,
    
};
typedef NS_ENUM(NSInteger, DownSheetDirectionType) {
    DownSheetDirectionUp = 0,
    DownSheetDirectionDown = 1,
};
@protocol DownSheetDelegate <NSObject>
@optional
-(void)didSelectIndex:(NSInteger)index;
@end

@interface DownSheet : UIView<UITableViewDataSource,UITableViewDelegate,UIGestureRecognizerDelegate>{
    UITableView *view;
    NSArray *listData;
}
-(id)initWithlist:(NSArray *)list height:(CGFloat)height;
-(void)reloadData:(NSArray *)list;
-(id)initWithlist:(NSArray *)list menuSize:(CGSize)menuSize menuLayoutType:(DownSheetLayoutType)menuLayoutType menuDirectionType:(DownSheetDirectionType)menuDirectionType menuOffsetX:(CGFloat)menuOffsetX menuOffsetY:(CGFloat)menuOffsetY;
- (void)showInView:(UIViewController *)showView;
@property(nonatomic,assign) id <DownSheetDelegate> delegate;
@property(nonatomic,assign) CGSize menuSize;
@property(nonatomic,assign) CGFloat menuOffsetX;
@property(nonatomic,assign) CGFloat menuOffsetY;
@property(nonatomic,assign) DownSheetLayoutType menuLayoutType;
@property(nonatomic,assign) DownSheetDirectionType menuDirectionType;
@property(nonatomic,strong) DownSheetModel  *cancelItemModel;
-(void)tappedCancel;
@end

// 版权属于原作者
// http://code4app.com (cn) http://code4app.net (en)
// 发布代码于最专业的源码分享网站: Code4App.com
// demo
/*
-(void)menuDemo{
    
    DownSheetModel *Model_1 = [[DownSheetModel alloc]init];
    Model_1.icon = @"icon_add";
    Model_1.icon_on = @"icon_add_hover";
    Model_1.title = @"添加";
    DownSheetModel *Model_2 = [[DownSheetModel alloc]init];
    Model_2.icon = @"icon_album";
    Model_2.icon_on = @"icon_album_hover";
    Model_2.title = @"专辑";
    DownSheetModel *Model_3 = [[DownSheetModel alloc]init];
    Model_3.icon = @"icon_buy";
    Model_3.icon_on = @"icon_buy_hover";
    Model_3.title = @"购买";
    DownSheetModel *Model_4 = [[DownSheetModel alloc]init];
    Model_4.icon = @"icon_computer";
    Model_4.icon_on = @"icon_computer_hover";
    Model_4.title = @"同步";
    DownSheetModel *Model_5 = [[DownSheetModel alloc]init];
    Model_5.icon = @"icon_down";
    Model_5.icon_on = @"icon_down_hover";
    Model_5.title = @"下载";
    DownSheetModel *Model_6 = [[DownSheetModel alloc]init];
    Model_6.icon = @"icon_del";
    Model_6.icon_on = @"icon_del_hover";
    Model_6.title = @"删除";
 
    DownSheet *sheet = [[DownSheet alloc]initWithlist:@[Model_1,Model_2,Model_3,Model_4,Model_5,Model_6] menuSize:CGSizeMake(0, 0) menuLayoutType:DownSheetLayoutTypeCenter menuDirectionType:DownSheetDirectionDown menuOffset:200];
    sheet.delegate = self;
    [sheet showInView:nil];
}
-(void)didSelectIndex:(NSInteger)index{
    UIAlertView *alert = [[UIAlertView alloc]initWithTitle:@"提示" message:[NSString stringWithFormat:@"您当前点击的是第%@个按钮",@(index)] delegate:nil cancelButtonTitle:@"确定" otherButtonTitles:nil];
    [alert show];
}
*/
