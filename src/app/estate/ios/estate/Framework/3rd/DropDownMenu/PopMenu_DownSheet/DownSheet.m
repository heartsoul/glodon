//
//  DownSheet.m
//  audioWriting
//
//  Created by wolf on 14-7-19.
//  Copyright (c) 2014年 wangruiyy. All rights reserved.
//

#import "DownSheet.h"
@implementation DownSheet

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        self.clipsToBounds = YES;
        // Initialization code
    }
    return self;
}
-(void)reloadData:(NSArray *)list{
    listData = list;
    [view reloadData];
}
-(id)initWithlist:(NSArray *)list menuSize:(CGSize)menuSize menuLayoutType:(DownSheetLayoutType)menuLayoutType menuDirectionType:(DownSheetDirectionType)menuDirectionType  menuOffsetX:(CGFloat)menuOffsetX menuOffsetY:(CGFloat)menuOffsetY{
    self = [super init];
    if(self){
        
        if (menuSize.width == 0) {
            menuSize.width = ScreenWidth;
        }
        if (menuSize.height == 0) {
            menuSize.height = 44*[list count];
        }
        self.menuSize = menuSize;
        self.menuLayoutType = menuLayoutType;
        self.menuDirectionType = menuDirectionType;
        self.menuOffsetX = menuOffsetX;
        self.menuOffsetY = menuOffsetY;
        self.frame = CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, [UIScreen mainScreen].bounds.size.height);
        [UIView animateWithDuration:.5 animations:^{
        self.backgroundColor = [UIColor colorWithWhite:0 alpha:0.25];
        }];
        
        CGRect menuFrame = CGRectMake(0, 0, menuSize.width, 0);
        
        switch (menuLayoutType) {
            case DownSheetLayoutTypeCenter:
                menuFrame.origin.x = (self.frame.size.width - menuSize.width) / 2 + self.menuOffsetX;
                break;
            case DownSheetLayoutTypeLeft:
                menuFrame.origin.x = 0 + self.menuOffsetX;
                break;
            case DownSheetLayoutTypeRight:
                menuFrame.origin.x = self.frame.size.width - menuSize.width + self.menuOffsetX;
                break;
            default:
                break;
        }
        switch (menuDirectionType) {
            case DownSheetDirectionUp:
                menuFrame.origin.y = self.frame.size.height - self.menuOffsetY;
                break;
            case DownSheetDirectionDown:
                menuFrame.origin.y = 0 + self.menuOffsetY;
                break;
            default:
                break;
        }
        view = [[UITableView alloc]initWithFrame:menuFrame style:UITableViewStylePlain];
        view.dataSource = self;
        view.delegate = self;
        [view setSeparatorStyle:UITableViewCellSeparatorStyleNone];
        
        listData = list;
        view.scrollEnabled = NO;
        view.backgroundColor = [UIColor clearColor];
        view.layer.borderColor = [UIColor clearColor].CGColor;
        view.layer.cornerRadius = 5.0f;
        view.clipsToBounds = YES;
        [self addSubview:view];
        [self animeData];
    }
    return self;
}

-(id)initWithlist:(NSArray *)list height:(CGFloat)height{
    
    self = [self initWithlist:list menuSize:CGSizeMake(ScreenWidth, height) menuLayoutType:DownSheetLayoutTypeLeft menuDirectionType:DownSheetDirectionUp menuOffsetX:0 menuOffsetY:0];
    if(self){
    }
    return self;
}

-(void)animeData{
    //self.userInteractionEnabled = YES;
    UITapGestureRecognizer *tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tappedCancel)];
    [self addGestureRecognizer:tapGesture];
    tapGesture.delegate = self;
    [UIView animateWithDuration:.5 animations:^{
        [UIView animateWithDuration:.25 animations:^{
            switch (self.menuDirectionType) {
                case DownSheetDirectionUp:
                    [view setFrame:CGRectMake(view.frame.origin.x,view.frame.origin.y - self.menuSize.height,  self.menuSize.width, self.menuSize.height)];
                    break;
                case DownSheetDirectionDown:
                   [view setFrame:CGRectMake(view.frame.origin.x,view.frame.origin.y,  self.menuSize.width, self.menuSize.height)];
                    break;
                default:
                    break;
            }
            
        }];
    } completion:^(BOOL finished) {
    }];
}

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldReceiveTouch:(UITouch *)touch{
    if([touch.view isKindOfClass:[self class]]){
        return YES;
    }
    CGPoint p = [touch locationInView:self];
    if (p.x < 30 || p.y < 64) {
        return YES;
    }
    return NO;
}

-(void)tappedCancel{
    [UIView animateWithDuration:.5 animations:^{
        switch (self.menuDirectionType) {
            case DownSheetDirectionUp:
                [view setFrame:CGRectMake(view.frame.origin.x,view.frame.origin.y + self.menuSize.height,  self.menuSize.width, 0)];
                break;
            case DownSheetDirectionDown:
                [view setFrame:CGRectMake(view.frame.origin.x,view.frame.origin.y,  self.menuSize.width, 0)];
                break;
            default:
                break;
        }
    } completion:^(BOOL finished) {
        if (finished) {
            [self removeFromSuperview];
        }
    }];
}

- (void)showInView:(UIViewController *)showView
{
//    if(showView==nil){
////        DNSLog(@"%@",[UIApplication sharedApplication].windows.firstObject);
//        [[UIApplication sharedApplication].windows.firstObject addSubview:self];
////        self.window.windowLevel = UIWindowLevelAlert;
//    }else{
//        [showView.view addSubview:self];
//    }
    [[UIApplication sharedApplication].windows.firstObject addSubview:self];

}


- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    // Return the number of sections.
    return 2;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    if (section == 1) {
        return 1;
    }
    // Return the number of rows in the section.
    return [listData count];
}
-(CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    if (indexPath.section == 0) {
        return 54;
    }
    return 64;
}
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    static NSString *CellIdentifier = @"Cell";
    DownSheetCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    if(cell==nil){
        cell = [[DownSheetCell alloc]initWithStyle:UITableViewCellStyleDefault reuseIdentifier:CellIdentifier];
    }
    if(indexPath.section ==1){
        [cell setData:self.cancelItemModel];
    } else {
        [cell setData:[listData objectAtIndex:indexPath.row]];
    }
    cell.alpha = 0.5;
    // Configure the cell...
    return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    [self tappedCancel];
    if(_delegate!=nil && [_delegate respondsToSelector:@selector(didSelectIndex:)]){
        [_delegate didSelectIndex:(indexPath.section == 1 ? -1 : indexPath.row)];
        return;
    }
}

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect
{
    // Drawing code
}
*/

@end

// 版权属于原作者
// http://code4app.com (cn) http://code4app.net (en)
// 发布代码于最专业的源码分享网站: Code4App.com 
