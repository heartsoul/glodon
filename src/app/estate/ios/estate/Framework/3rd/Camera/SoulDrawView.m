//
//  SoulDrawView.m
//  TestOC
//
//  Created by glodon on 2018/3/27.
//  Copyright © 2018年 zyyj. All rights reserved.
//

#import "SoulDrawView.h"
#import <Photos/Photos.h>

#import "SoulDrawData.h"
@interface SoulImageDrawView:UIView
@property(nonatomic,nonnull,strong) NSMutableArray<SoulDrawData*> * dataArray;
@property(nonatomic,nonnull,strong) NSMutableArray<SoulDrawData*> * lastPoint;

@property (nonatomic,strong) SoulDrawData  *currentDraw;
@property (nonatomic,strong) SoulDrawDataSelect  *selectDraw;
@property (nonatomic,assign) BOOL bCanDraw;
@property (nonatomic, strong) UIView * inputView;
@property (nonatomic, strong) UITextView * editTextView;
@property (nonatomic, assign) BOOL bScale; // 是否是缩放。
@property (nonatomic, assign) BOOL bMove; // 是否是移动。
@property (nonatomic, assign) BOOL bDrawText;// 是否在绘制文字

@property (nonatomic, assign) SoulDrawDataChangeType currentChangeType;

@property(nonatomic, copy) void(^noticeDataSizeBlock)(NSInteger dataSize);
@property(nonatomic, copy) void(^noticeDataSelectBlock)(void);
//画笔的颜色
@property (nonatomic,copy) UIColor *lineColor;
- (UIImage *)captureImageFromView:(UIView *)view;
- (void)saveImage:(void (^)(PHObject*phAsset))finisdBlock;
- (UIImage*)storePoint;
- (void)savePoint;
- (BOOL)undo;
- (void)reset;
- (void)addTextDraw:(NSString*)drawText color:(UIColor*)color;
@end
@implementation SoulImageDrawView

- (instancetype)init {
    self = [super init];
    if (self) {
        [self initInner];
    }
    return self;
}

- (instancetype)initWithCoder:(NSCoder *)aDecoder {
    self = [super initWithCoder:aDecoder];
    if (self) {
        [self initInner];
    }
    return self;
}

- (instancetype)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        [self initInner];
    }
    return self;
}

- (void)initInner {
    self.userInteractionEnabled = TRUE;
    self.backgroundColor = [UIColor blackColor];
    self.dataArray = [NSMutableArray array];
    self.contentMode = UIViewContentModeScaleAspectFit;
    // 移动手势
    UIPanGestureRecognizer *panGesture = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(handlePan:)];
    panGesture.minimumNumberOfTouches = 1;
    panGesture.maximumNumberOfTouches = 1;
    [self addGestureRecognizer:panGesture];
    //组件选择/取消手势
    UITapGestureRecognizer *drawTapGesture = [[UITapGestureRecognizer alloc]initWithTarget:self action:@selector(handleSelect:)];
    drawTapGesture.numberOfTapsRequired = 1;
    drawTapGesture.numberOfTouchesRequired = 1;
    
    [self addGestureRecognizer:drawTapGesture];
    
    self.lineColor = [UIColor redColor];
    
}

- (void)drawRect:(CGRect)rect {
   
    if (self.dataArray.count) {
        for (SoulDrawData *path in self.dataArray) {
            [path draw];
        }
    }
    if (self.selectDraw) {
        [self.selectDraw draw];
    } else {
        if(self.isFirstResponder) {
            [self resignFirstResponder];
            // 获得菜单
            UIMenuController *menu = [UIMenuController sharedMenuController];
            [menu setMenuVisible:NO animated:YES];
        }
        
    }
  if(self.noticeDataSizeBlock) {
    self.noticeDataSizeBlock(self.dataArray.count);
  }
     [super drawRect:rect];
}

- (SoulDrawData*) findItemByPoint:(CGPoint)currentPoint {
    if (self.dataArray.count) {
        // 按照控件的层次关系进行优先匹配查找
        // 先进行点精确匹配，更贴近控件
        for (SoulDrawData *path in self.dataArray.reverseObjectEnumerator) {
            if([path containsPoint:currentPoint]) {
                return path;
            }
        }
        // 再进行区域匹配，更容易选择控件
        for (SoulDrawData *path in self.dataArray.reverseObjectEnumerator) {
            if(CGRectContainsPoint(path.bounds, currentPoint)) {
                return path;
            }
        }
        if (self.selectDraw) {
            if ([self.selectDraw containsPoint:currentPoint]) {
                return self.selectDraw.selectDrawData;
            }
        }
        
    }
    return nil; // 没有找到，点击到了空白区
}
- (void)setLineColor:(UIColor *)lineColor {
    _lineColor = lineColor;
}

- (void)setBDrawText:(BOOL)bDrawText {
    _bDrawText = bDrawText;
}

- (void)updateLineColor:(UIColor *)lineColor {
  if(_selectDraw) {
    [self.selectDraw.selectDrawData setColor:lineColor];
    if(self.editTextView) {
      [self.editTextView setTextColor:lineColor];
    }
  }
  self.lineColor = lineColor;
  [self setNeedsDisplay];
}
- (void)savePoint {
  self.lastPoint = [self.dataArray copy];
}
- (BOOL)undo {
  if(self.selectDraw) {
    [self cancelSelect];
  }
  if(self.currentDraw) {
    self.currentDraw = nil;
  }
  if(self.dataArray.count > 0) {
    [self.dataArray removeLastObject];
    [self setNeedsDisplay];
  }
  return self.dataArray.count > 0;
}
- (void)reset {
  if(self.selectDraw) {
    [self cancelSelect];
  }
  if(self.currentDraw) {
    self.currentDraw = nil;
  }
  if(!self.lastPoint) {
    self.lastPoint = [NSMutableArray array];
  }
  self.dataArray = [NSMutableArray arrayWithArray:self.lastPoint];
  [self setNeedsDisplay];
}
- (void)addTextDraw:(NSString*)drawText color:(UIColor*)color {
  SoulDrawDataText * text = [[SoulDrawDataText alloc] init];
  text.drawText = drawText;
  text.font = [UIFont systemFontOfSize:26];
  text.color = color;
  CGSize size = [text calcSize:120];
  text.size = CGSizeMake(size.width, MAX(26,size.height));
  text.center = CGPointMake(40 + text.size.width / 2, 60 + text.size.height / 2);
  [self.dataArray addObject:text];
  [self setNeedsDisplay];

}
#pragma mark -- 手势处理
- (void)handleSelect:(UITapGestureRecognizer *)tapGesture {
    if (self.editTextView) {
        [self endEdit];
        return;
    }
    if (tapGesture.state == UIGestureRecognizerStateEnded) {
        
        UIView *view = tapGesture.view;
        CGPoint currentPoint = [tapGesture locationInView:view];
        SoulDrawData *path = [self findItemByPoint:currentPoint];
        if (path == nil) {
            // 没有找到
            if(self.selectDraw) {
                [self cancelSelect];
                return;
            }
            // 如果已经有选择的控件，那就取消选择。
            if (self.bDrawText) {
                SoulDrawDataText * text = [[SoulDrawDataText alloc] init];
                text.center = currentPoint;
                text.size = CGSizeMake(60, 26);
                text.drawText = @"文本内容";
                text.font = [UIFont systemFontOfSize:26];
                
                self.currentDraw = text;
                self.currentDraw.color = self.lineColor;
                [self.dataArray addObject:self.currentDraw];
                
                [self startSelect:self.currentDraw view:view];
                [self beginEdit];
            }
            return;
        }
        [self startSelect:path view:view];
        return;
    }
    
}

- (BOOL)handleSelectDrawPanScale:(UIPanGestureRecognizer *)panGesture {
    UIView *view = panGesture.view;
    CGPoint currentPoint = [panGesture locationInView:view];
    if (panGesture.state == UIGestureRecognizerStateBegan) {
        self.currentChangeType = [self.selectDraw getChangeType:currentPoint];
        if (self.currentChangeType == SoulDrawDataChangeTypeNone) {
            self.bScale = NO;
            return NO;
        }
        [panGesture setTranslation:CGPointZero inView:view.superview];
        self.bScale = YES;
        return self.bScale;
    }
 
    if (panGesture.state == UIGestureRecognizerStateChanged) {
        CGPoint point = [panGesture translationInView:view.superview];;
        [self.selectDraw doChangeType:self.currentChangeType size:CGSizeMake(point.x, point.y)];
        [panGesture setTranslation:CGPointZero inView:view.superview];
        [self setNeedsDisplay];
        return self.bScale;
    }
    if (panGesture.state == UIGestureRecognizerStateEnded) {
        CGPoint point = [panGesture translationInView:view.superview];
        [self.selectDraw doChangeType:self.currentChangeType size:CGSizeMake(point.x, point.y)];
        [panGesture setTranslation:CGPointZero inView:view.superview];
      if (self.currentChangeType == SoulDrawDataChangeTypeNone) {
         [self endMove:self.selectDraw.selectDrawData];
      }
    }
    if (panGesture.state == UIGestureRecognizerStateFailed) {
        [self setNeedsDisplay];
    }
    if (panGesture.state == UIGestureRecognizerStateCancelled) {
        [self setNeedsDisplay];
    }
    [panGesture setTranslation:CGPointZero inView:view.superview];
    self.bScale = NO;
    return self.bScale;
}

- (BOOL)handleSelectDrawPanMove:(UIPanGestureRecognizer *)panGesture {
    UIView *view = panGesture.view;
    if (panGesture.state == UIGestureRecognizerStateBegan) {
        [panGesture setTranslation:CGPointZero inView:view.superview];
        self.bMove = YES;
//      CGPoint point = [panGesture translationInView:view.superview];
//      NSLog(@"\n>>>>move start:%@",NSStringFromCGPoint(point));
    }
    
    if (panGesture.state == UIGestureRecognizerStateChanged) {
        CGPoint point = [panGesture translationInView:view.superview];
        [self.selectDraw setTrans:CGSizeMake(point.x, point.y)];
        [panGesture setTranslation:CGPointZero inView:view.superview];
        [self setNeedsDisplay];
        return self.bMove;
    }
    if (panGesture.state == UIGestureRecognizerStateEnded) {
        CGPoint point = [panGesture translationInView:view.superview];
//      NSLog(@"\n>>>>move end:%@",NSStringFromCGPoint(point));
        [self.selectDraw setTrans:CGSizeMake(point.x, point.y)];
        [panGesture setTranslation:CGPointZero inView:view.superview];
        [self endMove:self.selectDraw.selectDrawData];
        
    }
    if (panGesture.state == UIGestureRecognizerStateFailed) {
        [self setNeedsDisplay];
    }
    if (panGesture.state == UIGestureRecognizerStateCancelled) {
        [self setNeedsDisplay];
    }
    [panGesture setTranslation:CGPointZero inView:view.superview];
    self.bMove = NO;
    return self.bMove;
}

- (void)handleSelectDrawPan:(UIPanGestureRecognizer *)panGesture
{
    [self resignFirstResponder];
    
    // 获得菜单
    UIMenuController *menu = [UIMenuController sharedMenuController];
    // 显示菜单
    [menu setMenuVisible:NO animated:YES];
   // 处理取消
    UIView *view = panGesture.view;
    CGPoint currentPoint = [panGesture locationInView:view];
    if (panGesture.state == UIGestureRecognizerStateBegan) {
        SoulDrawData * path = [self findItemByPoint:currentPoint];
        if(path == nil || path != self.selectDraw.selectDrawData) {
            [panGesture cancelsTouchesInView];
            [self endEdit];
            return ;
        }
    }
    // 处理缩放
    if([self handleSelectDrawPanScale:panGesture]) {
        return;
    }
//    // 处理移动
//    if([self handleSelectDrawPanMove:panGesture]) {
//        return;
//    }
//   
    return;
}

- (void)handleDrawLine:(UIPanGestureRecognizer *)panGesture {
  if(!self.bCanDraw) {
    return;
  }
    UIView *view = panGesture.view;
    CGPoint currentPoint = [panGesture locationInView:view];
  
    if (panGesture.state == UIGestureRecognizerStateBegan) {
        
        self.currentDraw = [[SoulDrawDataBezierPath alloc] init];
        self.currentDraw.color = self.lineColor;
        [self.currentDraw moveToPoint:currentPoint];
        [self.dataArray addObject:self.currentDraw];
        //        [panGesture setTranslation:CGPointZero inView:view.superview];
        return ;
    }
    
    if (panGesture.state == UIGestureRecognizerStateChanged) {
        
        CGPoint previousPoint = self.currentDraw.currentPoint;
        CGPoint midP = midpoint(previousPoint,currentPoint);
        //        NSLog(@"touchesMoved:%@,%@",NSStringFromCGPoint(currentPoint),NSStringFromCGPoint(previousPoint));
        if (currentPoint.x == previousPoint.x && currentPoint.y ==  previousPoint.y) {
            return;
        }
        //  这样写不会有尖头
        [self.currentDraw addQuadCurveToPoint:currentPoint controlPoint:midP];
        //        [panGesture setTranslation:CGPointZero inView:view.superview];
        //        [self setNeedsDisplay];
        //        return ;
        [self setNeedsDisplay];
    }
    if (panGesture.state == UIGestureRecognizerStateEnded) {
        CGPoint previousPoint = self.currentDraw.currentPoint;
        CGPoint midP = midpoint(previousPoint,currentPoint);
        [self.currentDraw addQuadCurveToPoint:currentPoint   controlPoint:midP];
        self.currentDraw = nil;
        [self setNeedsDisplay];
        
    }
    if (panGesture.state == UIGestureRecognizerStateFailed) {
        [self setNeedsDisplay];
    }
    if (panGesture.state == UIGestureRecognizerStateCancelled) {
        [self setNeedsDisplay];
    }
    [panGesture setTranslation:CGPointZero inView:view.superview];
    return ;
}

- (void)handleDrawText:(UIPanGestureRecognizer *)panGesture {
    
}

- (void)handlePan:(UIPanGestureRecognizer *)panGesture {
    if (self.editTextView) {
        [self endEdit];
        return;
    }
    
    if (self.selectDraw) {
        // 处理选择控件移动，缩放。
        return [self handleSelectDrawPan:panGesture];
    }
    
    if (self.bDrawText) {
        return [self handleDrawText:panGesture];
    }
    
    return [self handleDrawLine:panGesture] ;
}

static CGPoint midpoint(CGPoint p0, CGPoint p1) {
    return (CGPoint) {
        (p0.x + p1.x) / 2.0,
        (p0.y + p1.y) / 2.0
    };
}

- (BOOL)canBecomeFirstResponder
{
    return YES;
}

- (BOOL)becomeFirstResponder {
    [self beginInput];
    BOOL ret = [super becomeFirstResponder];
    return ret;
}

- (void)changeColor:(UIButton*)button {
    [self.selectDraw.selectDrawData setColor:button.backgroundColor];
    if(self.editTextView) {
        [self.editTextView setTextColor:button.backgroundColor];
    }
    self.lineColor = button.backgroundColor;
    [self setNeedsDisplay];
    
}

- (UIBarButtonItem*)createButton:(UIColor *)color {
    UIButton *button= [UIButton buttonWithType:UIButtonTypeCustom];
    button.frame=CGRectMake(0,0,20,20);
    [button setBackgroundColor:color];
    button.layer.cornerRadius = 10;
    button.layer.masksToBounds = YES;
    [button addTarget:self action:@selector(changeColor:) forControlEvents:UIControlEventTouchUpInside];
    return [[UIBarButtonItem alloc]initWithCustomView:button];
}

- (void)beginInput {
//    + (UIColor *)blackColor;      // 0.0 white
//    + (UIColor *)darkGrayColor;   // 0.333 white
//    + (UIColor *)lightGrayColor;  // 0.667 white
//    + (UIColor *)whiteColor;      // 1.0 white
//    + (UIColor *)grayColor;       // 0.5 white
//    + (UIColor *)redColor;        // 1.0, 0.0, 0.0 RGB
//    + (UIColor *)greenColor;      // 0.0, 1.0, 0.0 RGB
//    + (UIColor *)blueColor;       // 0.0, 0.0, 1.0 RGB
//    + (UIColor *)cyanColor;       // 0.0, 1.0, 1.0 RGB
//    + (UIColor *)yellowColor;     // 1.0, 1.0, 0.0 RGB
//    + (UIColor *)magentaColor;    // 1.0, 0.0, 1.0 RGB
//    + (UIColor *)orangeColor;     // 1.0, 0.5, 0.0 RGB
//    + (UIColor *)purpleColor;     // 0.5, 0.0, 0.5 RGB
//    + (UIColor *)brownColor;      // 0.6, 0.4, 0.2 RGB
//    + (UIColor *)clearColor;      // 0.0 white, 0.0 alpha
    UIToolbar * toobbarView =  [[UIToolbar alloc] initWithFrame:CGRectMake(0, 0, self.frame.size.width, 20)];
    [toobbarView setItems:@[
                            [self createButton:[UIColor blackColor]],
                            [self createButton:[UIColor darkGrayColor]],
                            [self createButton:[UIColor whiteColor]],
                            [self createButton:[UIColor grayColor]],
                            [self createButton:[UIColor redColor]],
                            [self createButton:[UIColor greenColor]],
                            [self createButton:[UIColor blueColor]],
                            [self createButton:[UIColor cyanColor]],
                            [self createButton:[UIColor yellowColor]],
                            [self createButton:[UIColor magentaColor]],
                            [self createButton:[UIColor orangeColor]],
                            [self createButton:[UIColor purpleColor]],
                            [self createButton:[UIColor brownColor]]
                            ]];
//    self.inputView = toobbarView;
}
/**
 * 通过第一响应者的这个方法告诉UIMenuController可以显示什么内容
 */
- (BOOL)canPerformAction:(SEL)action withSender:(id)sender
{
    if (action == @selector(remove:)
//        ||action == @selector(savePic:)
//        ||action == @selector(editContent:)
        ) {
        return YES;
    }
//    if ( (action == @selector(delete:) && self.text) // 需要有文字才能支持复制
//        || (action == @selector(cut:) && self.text) // 需要有文字才能支持剪切
//        || action == @selector(paste:)
//        || action == @selector(ding:)
//        || action == @selector(reply:)
//        || action == @selector(warn:)) return YES;
    
    return NO;
}

#pragma mark - 监听MenuItem的点击事件
- (void)cut:(UIMenuController *)menu
{
    // 将label的文字存储到粘贴板
//    [UIPasteboard generalPasteboard].string = self.text;
//    // 清空文字
//    self.text = nil;
}

- (void)copy:(UIMenuController *)menu
{
    // 将label的文字存储到粘贴板
//    [UIPasteboard generalPasteboard].string = self.text;
}

- (void)paste:(UIMenuController *)menu
{
    // 将粘贴板的文字赋值给label
//    self.text = [UIPasteboard generalPasteboard].string;
}

- (void)remove:(UIMenuController *)menu
{
    [self.dataArray removeObject:self.selectDraw.selectDrawData];
    self.selectDraw = nil;
    [self setNeedsDisplay];
}

- (void)savePic:(UIMenuController *)menu
{
    self.selectDraw = nil;
    [self setNeedsDisplay];
    
    UIImage *currentImg = [self captureImageFromView:self];
    UIImageWriteToSavedPhotosAlbum(currentImg, self, @selector(imageSavedToPhotosAlbum:didFinishSavingWithError:contextInfo:),nil);
}

- (void)saveImage:(void (^)(
                            PHObject*phAsset))finisdBlock {
    self.selectDraw = nil;
  self.currentDraw = nil;
    [self setNeedsDisplay];
    
   __block UIImage *image = [self captureImageFromView:self];
    
    // 判断授权状态
    [PHPhotoLibrary requestAuthorization:^(PHAuthorizationStatus status) {
        if (status != PHAuthorizationStatusAuthorized) {
            finisdBlock(nil);
            return;
        }
        
        dispatch_async(dispatch_get_main_queue(), ^{
            NSError *error = nil;
            
            // 保存相片到相机胶卷
            __block PHObjectPlaceholder *createdAsset = nil;
            [[PHPhotoLibrary sharedPhotoLibrary] performChangesAndWait:^{
                createdAsset = [PHAssetCreationRequest creationRequestForAssetFromImage:image].placeholderForCreatedAsset;
                
            } error:&error];
            
            if (error) {
                finisdBlock(nil);
                NSLog(@"保存失败：%@", error);
                return;
            }
            finisdBlock(createdAsset);
        });
    }];
}

- (UIImage*)storePoint {
  self.selectDraw = nil;
  self.currentDraw = nil;
  [self setNeedsDisplay];
   UIImage *image = [self captureImageFromView:self];
  return image;
}
- (void)editContent:(UIMenuController *)menu
{
    [self beginEdit];
}

- (void)endMove:(SoulDrawData *)path {
  if ([path isKindOfClass:[SoulDrawDataText class]]) {
    self.selectDraw = [[SoulDrawDataSelectText alloc] initWithFrame:[((SoulDrawDataText*)path) getBounds]];
    self.selectDraw.selectDrawData = path;
    [self setNeedsDisplay];
  } else {
    self.selectDraw = [[SoulDrawDataSelectBezierPath alloc] initWithFrame:path.bounds];
    self.selectDraw.selectDrawData = path;
    [self setNeedsDisplay];
  }
}

- (void)startSelect:(SoulDrawData *)path view:(UIView*)view {
    if (self.selectDraw && self.selectDraw.selectDrawData == path) {
        return; // 点击了自己，不处理
    }
    
    if ([path isKindOfClass:[SoulDrawDataText class]]) {
        self.selectDraw = [[SoulDrawDataSelectText alloc] initWithFrame:[((SoulDrawDataText*)path) getBounds]];
        self.selectDraw.selectDrawData = path;
        [self setNeedsDisplay];
//      UILabel * toolbar = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, 320, 120)];
//      toolbar.text = @"移入删除";
//      self.inputView = toolbar;
        // 让label成为第一响应者
        [self becomeFirstResponder];
     
      
        // 获得菜单
        UIMenuController *menu = [UIMenuController sharedMenuController];

        // 设置菜单内容，显示中文，所以要手动设置app支持中文
        menu.menuItems = @[
                           [[UIMenuItem alloc] initWithTitle:@"删除" action:@selector(remove:)],
//                           [[UIMenuItem alloc] initWithTitle:@"编辑" action:@selector(editContent:)],
//                           [[UIMenuItem alloc] initWithTitle:@"保存" action:@selector(savePic:)],
                           ];

        // 菜单最终显示的位置
        [menu setTargetRect:[((SoulDrawDataText*)path) getBounds] inView:view];

        // 显示菜单
        [menu setMenuVisible:YES animated:YES];
    } else {
        self.selectDraw = [[SoulDrawDataSelectBezierPath alloc] initWithFrame:path.bounds];
        self.selectDraw.selectDrawData = path;
        [self setNeedsDisplay];
        // 让label成为第一响应者
        [self becomeFirstResponder];
        
        // 获得菜单
        UIMenuController *menu = [UIMenuController sharedMenuController];

        // 设置菜单内容，显示中文，所以要手动设置app支持中文
        menu.menuItems = @[
                           [[UIMenuItem alloc] initWithTitle:@"删除" action:@selector(remove:)],
//                           [[UIMenuItem alloc] initWithTitle:@"保存" action:@selector(savePic:)],
                           ];

        // 菜单最终显示的位置
        [menu setTargetRect:path.bounds inView:view];

        // 显示菜单
        [menu setMenuVisible:YES animated:YES];
    }
}

- (void)cancelSelect {
    self.selectDraw = nil;
    [self setNeedsDisplay];
}

- (void)beginEdit {
    [self.selectDraw setBEdit:YES];
    [self setNeedsDisplay];
    if (self.editTextView) {
        [self.editTextView removeFromSuperview];
        self.editTextView = nil;
    }
    self.editTextView = [self.selectDraw.selectDrawData getTextView];
    [self addSubview:self.editTextView];
    UIToolbar * toobbarView =  [[UIToolbar alloc] initWithFrame:CGRectMake(0, 0, self.frame.size.width, 40)];
    [toobbarView setItems:@[
                            [self createButton:[UIColor blackColor]],
                            [self createButton:[UIColor darkGrayColor]],
                            [self createButton:[UIColor whiteColor]],
                            [self createButton:[UIColor grayColor]],
                            [self createButton:[UIColor redColor]],
                            [self createButton:[UIColor greenColor]],
                            [self createButton:[UIColor blueColor]],
                            [self createButton:[UIColor cyanColor]],
                            [self createButton:[UIColor yellowColor]],
                            [self createButton:[UIColor magentaColor]],
                            [self createButton:[UIColor orangeColor]],
                            [self createButton:[UIColor purpleColor]],
                            [self createButton:[UIColor brownColor]]
                            ]];
    self.editTextView.inputAccessoryView = toobbarView;
    [self.editTextView becomeFirstResponder];
}

- (void)endEdit {
    [self.selectDraw setBEdit:NO];
    [self cancelSelect];
    if (self.editTextView) {
        [self.editTextView removeFromSuperview];
        self.editTextView = nil;
    }
}

- (void)imageSavedToPhotosAlbum:(UIImage *)image didFinishSavingWithError:(NSError *)error contextInfo:(void *)contextInfo
{
    NSString *message = @"保存失败";
    if (!error) {
        message = @"成功保存到相册";
    }else
    {
        message = [error description];
    }
    NSLog(@"message is %@",message);
}

-(UIImage *)captureImageFromView:(UIView *)view
{
    CGRect screenRect = view.bounds;////CGRectMake(0, 108, KScreenWidth, KScreenHeight - 108 - 49);
    
    UIGraphicsBeginImageContextWithOptions(screenRect.size, YES, 0.0f);
    
    CGContextRef ctx = UIGraphicsGetCurrentContext();
    
    [view.layer renderInContext:ctx];
    
    UIImage * image = UIGraphicsGetImageFromCurrentImageContext();
    
    UIGraphicsEndImageContext();
    
    return image;
    
}
@end

@interface SoulDrawView()<UIScrollViewDelegate>
@property (nonatomic,strong) SoulImageDrawView  *drawView;
@end
@implementation SoulDrawView

- (instancetype)init {
    self = [super init];
    if (self) {
        [self initInner];
    }
    return self;
}

- (instancetype)initWithCoder:(NSCoder *)aDecoder {
    self = [super initWithCoder:aDecoder];
    if (self) {
        [self initInner];
    }
    return self;
}

- (void)initInner {
    self.userInteractionEnabled = YES;
    self.backgroundColor = [UIColor whiteColor];
    self.drawView = [[SoulImageDrawView alloc] initWithFrame:self.bounds];
    [self addSubview:self.drawView];
    [self setLineColor:[UIColor redColor]];
    [self.drawView setLineColor:self.lineColor];
    self.contentSize=self.frame.size;
    //设置实现缩放
    //设置代理scrollview的代理对象
    self.delegate=self;
    //设置最大伸缩比例
    self.maximumZoomScale=3;
    //设置最小伸缩比例
    self.minimumZoomScale=1;
    [self setZoomScale:1 animated:NO];
    self.scrollsToTop =NO;
    self.scrollEnabled =NO;
    self.showsHorizontalScrollIndicator=NO;
    self.showsVerticalScrollIndicator=NO;
    //双击手势
    UITapGestureRecognizer *doubleTapGesture = [[UITapGestureRecognizer alloc]initWithTarget:self action:@selector(handleDoubleTap:)];
    doubleTapGesture.numberOfTapsRequired = 2;
    doubleTapGesture.numberOfTouchesRequired =1;
    [self addGestureRecognizer:doubleTapGesture];
}

- (instancetype)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        [self initInner];
    }
    return self;
}

- (void)drawRect:(CGRect)rect {
    [super drawRect:rect];
}

- (void)setBackgroundImage:(UIImage*)image {
    UIGraphicsBeginImageContextWithOptions(self.frame.size, YES, 0.f);
    [image drawInRect:self.bounds];
    UIImage *lastImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    self.drawView.backgroundColor = [UIColor colorWithPatternImage:lastImage];
}

- (void)setLineColor:(UIColor *)lineColor {
    _lineColor = lineColor;
    self.drawView.lineColor = lineColor;
}

- (void)setBDrawText:(BOOL)bDrawText {
    _bDrawText = bDrawText;
    self.drawView.bDrawText = bDrawText;
}

#pragma mark 处理拖拉
- (void)panView:(UIPanGestureRecognizer *)panGesture
{
    UIView *view = panGesture.view;
    if (panGesture.state == UIGestureRecognizerStateBegan || panGesture.state == UIGestureRecognizerStateChanged) {
        CGPoint translation = [panGesture translationInView:view.superview];
        [view setCenter:(CGPoint){view.center.x + translation.x, view.center.y + translation.y}];
        [panGesture setTranslation:CGPointZero inView:view.superview];
    }
}

#pragma mark - 处理双击手势
- (void)handleDoubleTap:(UITapGestureRecognizer *)sender{
    CGFloat scaleNum = self.zoomScale;
    if (scaleNum < 3) {
        scaleNum = 3;
    }else{
        scaleNum=1;
    }
    [self setZoomScale:scaleNum animated:YES];
}


#pragma mark -- UIScrollViewDelegate
- (UIView *)viewForZoomingInScrollView:(UIScrollView *)scrollView{
    return self.drawView;
}

//- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldReceiveTouch:(UITouch *)touch{
//    if (_drawView.currentDraw == nil)    {
//        return NO;
//    }
//    return YES;
//}

-(BOOL)gestureRecognizer:(UIGestureRecognizer*)gestureRecognizer shouldRecognizeSimultaneouslyWithGestureRecognizer:(UIGestureRecognizer*)otherGestureRecognizer
{
//     NSLog(@"shouldRecognizeSimultaneouslyWithGestureRecognizer:%@,%@",gestureRecognizer,otherGestureRecognizer);
//    if ([gestureRecognizer.view isKindOfClass:[UIScrollView class]]) {
//        return NO;
//    }
//    else {
        return YES;
//    }

}

/**
 * 保存图片到相册
 */
- (void)saveImageWithImage:(UIImage *)image {
    // 判断授权状态
    [PHPhotoLibrary requestAuthorization:^(PHAuthorizationStatus status) {
        if (status != PHAuthorizationStatusAuthorized) return;
        
        dispatch_async(dispatch_get_main_queue(), ^{
            NSError *error = nil;
            
            // 保存相片到相机胶卷
            __block PHObjectPlaceholder *createdAsset = nil;
            [[PHPhotoLibrary sharedPhotoLibrary] performChangesAndWait:^{
                createdAsset = [PHAssetCreationRequest creationRequestForAssetFromImage:image].placeholderForCreatedAsset;
            } error:&error];
            
            if (error) {
                NSLog(@"保存失败：%@", error);
                return;
            }
        });
    }];
}
- (void)saveImage:(void (^)(NSString*assetId))finisdBlock {
    [self.drawView saveImage:^(PHObject *phAsset) {
        if (phAsset) {
            finisdBlock(phAsset.localIdentifier);
        } else {
            finisdBlock(nil);
        }
    }];
}

- (void)enableDraw:(BOOL)enable {
//  self.userInteractionEnabled = enable;
  self.bCanDraw = enable;
//  self.drawView.userInteractionEnabled = enable;
  self.drawView.bCanDraw = enable;
}

- (void)updateLineColor:(UIColor*)lineColor {
  self.lineColor = lineColor;
  [self.drawView updateLineColor:lineColor];
}
- (void)storePoint {
  UIImage * lastImage = [self.drawView storePoint];
  self.drawView.backgroundColor = [UIColor colorWithPatternImage:lastImage];
}
- (BOOL)undo {
 return [self.drawView undo];
}

-(void)setNoticeDataSizeBlock:(void (^)(NSInteger))noticeDataSizeBlock {
  [self.drawView setNoticeDataSizeBlock:noticeDataSizeBlock];
}

- (void)setNoticeDataSelectBlock:(void (^)(void))noticeDataSelectBlock {
  [self.drawView setNoticeDataSelectBlock:noticeDataSelectBlock];
}

- (void)addTextDraw:(NSString*)drawText color:(UIColor*)color {
  return [self.drawView addTextDraw:drawText color:color];
}

- (void)reset {
  [self.drawView reset];
}
- (void)savePoint {
  [self.drawView savePoint];
}
@end
