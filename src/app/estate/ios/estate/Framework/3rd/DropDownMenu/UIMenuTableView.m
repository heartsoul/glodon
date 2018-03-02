//
//  UIMenuTableView.m
//  tesn
//
//  Created by soul on 14/12/4.
//  Copyright (c) 2014年 yonyouup. All rights reserved.
//

#import "UIMenuTableView.h"

@implementation UIMenuViewContainner
-(void)dealloc{
  self.contentView = nil;
}

- (void)showMenuPoint:(CGPoint)point height:(CGFloat)height contentView:(UIMenuTableView*)contentView alpha:(CGFloat)alpha {
    CGFloat yOff = point.y;
    CGFloat xOff = point.x;
    self.contentView = contentView;
  self.backgroundColor = [UIColor colorWithWhite:1 alpha:0.05];
  UIWindow * window = [UIApplication sharedApplication].keyWindow;
  self.frame = CGRectMake(0,0,window.frame.size.width,window.frame.size.height);
  
  UIView *bgView = [[UIView alloc] initWithFrame:self.frame];
  bgView.tag = 999;
  bgView.frame = CGRectMake(0,0,window.frame.size.width,0);
  bgView.backgroundColor = [UIColor clearColor];
  bgView.userInteractionEnabled = YES;
  
  [self addSubview:bgView];
  
  UIView *coverView= [[UIView alloc] initWithFrame:CGRectMake(0, yOff, self.frame.size.width, self.frame.size.height)];
  coverView.backgroundColor = [UIColor colorWithWhite:0 alpha:alpha];
  [bgView addSubview:coverView];
  
  // 防止超出一屏幕table高度越界, 并留出44的高度，有个点击取消的区域
  height = MIN(self.frame.size.height-yOff - 0, height);

  contentView.bounces = NO;
  contentView.frame = CGRectMake(xOff, yOff, [self contentViewWidth], 0);
//  contentView.backgroundColor = [UIColor clearColor];
  [self addSubview:contentView];
  
  UITapGestureRecognizer * tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(hideMenuAnimation:)];
  [bgView addGestureRecognizer:tap];
  
  [window addSubview:self];
  
  bgView.frame = self.frame;
  
  [UIView animateWithDuration:0.2 animations:^{
    contentView.frame = CGRectMake(xOff, yOff, [self contentViewWidth], height);
    coverView.frame = CGRectMake(0, yOff, self.frame.size.width, self.frame.size.height);
  }];
}

- (CGFloat)contentViewWidth {
   return self.contentView.frame.size.width < 1 ? self.frame.size.width : self.contentView.frame.size.width;
}

- (void)hideMenuAnimation {
  self.contentView.backgroundColor = [UIColor clearColor];
  UIView * bgView = [self viewWithTag:999];
  [UIView animateWithDuration:0.05 animations:^{
    self.contentView.frame = CGRectMake(self.contentView.frame.origin.x, self.contentView.frame.origin.y, self.contentView.frame.size.width, 0);
    bgView.frame = CGRectMake(0, bgView.frame.origin.y, bgView.frame.size.width, bgView.frame.size.height);
  } completion:^(BOOL finished) {

    [self hideMenu];
  }];
}
-(void) hideMenuAnimation:(UITapGestureRecognizer*)tap{
    UIView * tapView = tap.view;
    UIView * contentView = self.subviews[1];
    if ([tapView isEqual:contentView] ) {
        return;
    }
    [self hideMenuAnimation];
}

-(void) hideMenu{
  if (self.contentView) {
    [self.contentView.menuDelegate menuTableViewDismissMenuItem:self.contentView];
    [self.contentView removeFromSuperview];
  }
  [self removeFromSuperview];
}
@end
@implementation UIMenuTableViewCell
- (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    int kContentGap = 10;
    if (self) {
        CGRect frame = self.contentView.frame;
        self.avatarImageView =  [[UIImageView alloc] initWithFrame:CGRectMake([UIScreen mainScreen].bounds.size.width - self.avatarImageView.frame.size.width -3*kContentGap,kContentGap, frame.size.height - 2* kContentGap, frame.size.height - 2* kContentGap)];
        self.avatarImageView.contentMode = UIViewContentModeCenter;
        [self.avatarImageView setImage:[UIImage imageNamed:@"icon_menu_check"]];
        [self.avatarImageView setHighlightedImage:[UIImage imageNamed:@"icon_menu_check_s"]];
       self.titleLabel = [[UILabel alloc] initWithFrame:CGRectMake(0 + 1*kContentGap, 0, [UIScreen mainScreen].bounds.size.width - self.avatarImageView.frame.size.width - 20 - 120, 40)];
        self.titleLabel.lineBreakMode = NSLineBreakByTruncatingTail;
        self.titleLabel.numberOfLines = 0;
      self.titleLabel.font = [UIFont systemFontOfSize:14];
      self.textLabel.textColor = [UIColor blackColor];
//        self.titleLabel.frame = (self.titleLabel.frame.origin.y + frame.origin.y) / 2;
      
      self.accessoryView = self.avatarImageView;
      self.accessoryType = UITableViewCellAccessoryDisclosureIndicator;
//        self.flagView=[[UIView alloc]initWithFrame:CGRectMake(G_Width-20, kContentGap + 3,6, 6)];
        self.flagView.backgroundColor=[UIColor redColor];
        self.flagView.layer.cornerRadius=3;
        self.flagView.clipsToBounds=YES;
        self.flagView.hidden=YES;
        
      self.separatorView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, 0.5)];
//        self.separatorView.backgroundColor = [UIColor colorWithHexStringToColor:@"#EDEDED"];
        [self.contentView addSubview:self.avatarImageView];
        [self.contentView addSubview:self.titleLabel];
        [self.contentView addSubview:self.separatorView];
        [self.contentView addSubview:self.flagView];
    }
    return self;
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];
    
    // Configure the view for the selected state
}
-(void)layoutSubviews{
    [super layoutSubviews];
//  self.titleLabel.centerY = self.contentView.height / 2;
}

@end

@implementation UIMenuTableView
-(instancetype)init{
    self = [super init];
    if (self) {
        self = [self initInner];
    }
    return self;
}
-(instancetype)initWithCoder:(NSCoder *)aDecoder{
    self = [super initWithCoder:aDecoder];
    if (self) {
        self = [self initInner];
    }
    return self;
}
-(instancetype)initWithFrame:(CGRect)frame{
    self = [super initWithFrame:frame];
    if (self) {
        self = [self initInner];
    }
    return self;
}
-(instancetype)initInner{
    self.delegate = self;
    self.dataSource = self;
  self.separatorStyle = UITableViewCellSeparatorStyleNone;
    self.separatorColor = [UIColor clearColor];
//    self.header = [MJRefreshNormalHeader headerWithRefreshingBlock:^{
//    }];
    if ([self respondsToSelector:@selector(setSeparatorInset:)]) {
        [self setSeparatorInset:UIEdgeInsetsMake(0,0,0,0)];
    }
    
    if ([self respondsToSelector:@selector(setLayoutMargins:)]) {
        [self setLayoutMargins:UIEdgeInsetsMake(0,0,0,0)];
    }
  self.tableFooterView = [UIView new];
    return self;
}
-(instancetype)initWithFrame:(CGRect)frame style:(UITableViewStyle)style{
    self = [super initWithFrame:frame style:style];
    if (self) {
        self = [self initInner];
    }
    return self;
}

-(void)dealloc{
    self.delegate = nil;
    self.dataSource = nil;
}
- (void)showMenuPoint:(CGPoint)point alpha:(CGFloat)alpha {
    self.menuViewContainner = [[UIMenuViewContainner alloc] init];
    self.separatorInset = UIEdgeInsetsZero;
    NSInteger count = 0;
    for (NSArray *arr in self.menuItems) {
        if ([arr isKindOfClass:[NSArray class]]) {
            count += arr.count;
        } else {
            count += 1;
        }
        
    }
    [self.menuViewContainner showMenuPoint:point height:(count * 44) contentView:self alpha:alpha];
}

- (void)showMenuPoint:(CGPoint)point {
  
    [self showMenuPoint:point alpha:0.5f];
}
-(void) hideMenu{
    if (!self.menuViewContainner) {
        return;
    }
    [self.menuViewContainner hideMenuAnimation];
}
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    return self.menuItems.count;
}

// Row display. Implementers should *always* try to reuse cells by setting each cell's reuseIdentifier and querying for available reusable cells with dequeueReusableCellWithIdentifier:
// Cell gets various attributes set automatically based on table (separators) and data source (accessory views, editing controls)

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    static NSString * cellIdentifier = @"menucell";
    UIMenuTableViewCell * cell = (UIMenuTableViewCell*) [tableView dequeueReusableCellWithIdentifier:cellIdentifier];
    if (cell == nil) {
        cell = [[UIMenuTableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellIdentifier];
    }
    NSMutableDictionary * dicItem = (NSMutableDictionary*)[self.menuItems objectAtIndex:indexPath.row];
    NSString * selected = [dicItem objectForKey:@"selected"];
    if (selected == nil) {
        [dicItem setObject:@(NO) forKey:@"selected"];
    }
    [cell.avatarImageView setHighlighted:selected.boolValue];
    cell.titleLabel.text = [dicItem objectForKey:@"title"];
    cell.titleLabel.backgroundColor = [UIColor clearColor];
  //  [cell.titleLabel sizeToFit];
    return cell;
}
// Called after the user changes the selection.
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    UIMenuTableViewCell * cell = (UIMenuTableViewCell*) [tableView cellForRowAtIndexPath:indexPath];
    [cell.avatarImageView setHighlighted:YES];
    NSMutableDictionary * dicItem = (NSMutableDictionary*)[self.menuItems objectAtIndex:indexPath.row];
    [dicItem setObject:@(YES) forKey:@"selected"];
    
    if (self.menuDelegate) {
        if(![self.menuDelegate menuTableViewDidSelectMenuItem:self indexPath:indexPath]) {
            return;
        }
    }
    [self hideMenu];
}
- (void)tableView:(UITableView *)tableView didDeselectRowAtIndexPath:(NSIndexPath *)indexPath NS_AVAILABLE_IOS(3_0){
    UIMenuTableViewCell * cell = (UIMenuTableViewCell*) [tableView cellForRowAtIndexPath:indexPath];
    NSMutableDictionary * dicItem = (NSMutableDictionary*)[self.menuItems objectAtIndex:indexPath.row];
    [dicItem setObject:@(NO) forKey:@"selected"];

    [cell.avatarImageView setHighlighted:NO];
}

- (void) tableView:(UITableView *)tableView willDisplayCell:(UITableViewCell *)cell forRowAtIndexPath:(NSIndexPath *)indexPath {
    NSMutableDictionary * dicItem = (NSMutableDictionary*)[self.menuItems objectAtIndex:indexPath.row];
    NSString * selected = [dicItem objectForKey:@"selected"];
    if (selected.boolValue) {
        [tableView selectRowAtIndexPath:indexPath animated:NO scrollPosition:UITableViewScrollPositionNone];
    }
    if ([cell respondsToSelector:@selector(setSeparatorInset:)]) {
        [cell setSeparatorInset:UIEdgeInsetsZero];
    }
    
    if ([cell respondsToSelector:@selector(setLayoutMargins:)]) {
        [cell setLayoutMargins:UIEdgeInsetsZero];
    }
}

//- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldReceiveTouch:(UITouch *)touch{
//    // 若为UITableViewCellContentView（即点击了tableViewCell），则不截获Touch事件
//    if ([NSStringFromClass([touch.view class]) isEqualToString:@"UITableViewCellContentView"]) {
//        return NO;
//    }
//    return NO;
//}
@end

@interface UILabelTitle()<UIMenuTableViewDelegate>
@end
@implementation UILabelTitle
-(instancetype)init{
    self = [super init];
    if (self) {
        [self setup];
    }
    return self;
}
-(instancetype)initWithFrame:(CGRect)frame{
    self = [super initWithFrame:frame];
    if (self) {
        [self setup];
    }
    return self;
}
-(void)setup{
    self.font = [UIFont systemFontOfSize:17];
    self.stateImageView = [[UIImageView alloc] init];
    self.stateImageView.tag = 1;
//    self.stateImageView.image=[[UIImage imageNamed:@"icon_menu_arrow_down"] imageWithTintColor:COLOR_BAR_BACKGROUND];  //白色
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(switchType:)];
    [self addGestureRecognizer:tap];
    
    [self addSubview:self.stateImageView];
}
////////////////////////////////////////////////////////////////////////////////
#pragma mark 初始化
- (void)initTitleImage:(NSString*)title themeColor:(UIColor*)themeColor menuItems:(NSMutableArray*)menuItem
{
    self.userInteractionEnabled = YES;
    self.text = [NSString stringWithFormat:@"%@     ",title];
    self.textColor = themeColor;
    [self sizeToFit];
    self.clipsToBounds = NO;
    self.menuItems = menuItem;
    self.stateImageView.frame = CGRectMake(self.frame.size.width - 20, (self.frame.size.height - 20) / 2, 20, 20);
}
-(void)menuTableViewDismissMenuItem:(UIMenuTableView*) menuTableView{
    [self updateTitleImageState:NO];
}

- (void)switchType:(UITapGestureRecognizer*)ges
{
    //    NSMutableArray * menuItems = [NSMutableArray array];
    //    [menuItems addObject:[NSMutableDictionary dictionaryWithDictionary:@{@"title":@"新闻",@"type":@"1",@"selected":selected}]];
    //    selected = self.column_id == 2 ? @"1" : @"0";
    
    //    [self showMenu:menuItems];
    self.arrowChange();
//    [self updateTitleImageState:YES];
}
-(void) showMenu:(NSMutableArray*)menuItems{
    UIMenuTableView * menu = [[UIMenuTableView alloc] init];
    menu.menuDelegate = self;
    [menu setMenuItems:menuItems];
    [menu showMenuPoint:CGPointMake(0, 64)];
    [self updateTitleImageState:YES];
}
- (void)updateTitleImageState:(BOOL)bOpen{
    NSTimeInterval animationDuration = 0.3f;
    [UIView beginAnimations:@"changeHeight"context:nil];
    [UIView setAnimationDuration:animationDuration];
    
//    [self.stateImageView setImage:[[UIImage imageNamed:bOpen ? @"icon_menu_arrow_up" : @"icon_menu_arrow_down"] imageWithTintColor:self.textColor]];
    
    [UIView commitAnimations];
}
-(BOOL)menuTableViewDidSelectMenuItem:(UIMenuTableView*) menuTableView indexPath:(NSIndexPath*)indexPath{
    [self updateTitleImageState:NO];
    NSDictionary*dic = [menuTableView.menuItems objectAtIndex:indexPath.row];
    self.selectItem(dic);
    return YES;
}
@end
