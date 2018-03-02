//
//  UIShowModalView.m
//  tesn
//
//  Created by soulimac on 15/4/22.
//  Copyright (c) 2015年 yonyouup. All rights reserved.
//

#import "UIShowModalView.h"

#define centerXY(rect,pRect) (CGRectMake((pRect.size.width - rect.size.width) / 2, (pRect.size.height - rect.size.height) / 2, rect.size.width, rect.size.height))
#define centerX(rect,pRect) (CGRectMake((pRect.size.width - rect.size.width) / 2, rect.origin.y, rect.size.width, rect.size.height))
#define centerY(rect,pRect) (CGRectMake(rect.origin.x, (pRect.size.height - rect.size.height) / 2, rect.size.width, rect.size.height))

static UIShowModalView * sharedModalView = nil;
@interface UIShowModalView()<UIGestureRecognizerDelegate>

@end
@implementation UIShowModalView
-(instancetype)initWithFrame:(CGRect)frame{
    self = [super initWithFrame:frame];
    if (self) {
        UITapGestureRecognizer *tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tappedCancel)];
        [self addGestureRecognizer:tapGesture];
        tapGesture.delegate = self;
        self.userInteractionEnabled = YES;
    }
    return self;
}
+(UIShowModalView*)showModelView:(UIView*)contentView{
    [self.class hideContentView];
    UIShowModalView * pView = [self.class sharedModalView];
    [pView addSubview:contentView];
    contentView.frame = centerXY(contentView.frame, pView.frame);
    return pView;
}
+(UIShowModalView*)showModelViewFixed:(UIView*)contentView{
    [self.class hideContentView];
    UIShowModalView * pView = [self.class sharedModalView];
    [pView addSubview:contentView];
    return pView;
}
+(void)hideContentView{
    @synchronized ([UIShowModalView class])
    {
        if (sharedModalView != nil) {
            [sharedModalView tappedCancel];
        }
        sharedModalView = nil;
    }
}
/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/
//初始化
+(UIShowModalView *)sharedModalView
{
    @synchronized ([UIShowModalView class])
    {
        if (sharedModalView != nil) {
            //            NSArray * windows = [UIApplication sharedApplication].windows;
            //            DNSLog(@"windows:%@",windows);
            [[UIApplication sharedApplication].keyWindow addSubview:sharedModalView];
        } else {
         
            sharedModalView = [[UIShowModalView alloc] initWithFrame:CGRectMake(0,0,[UIScreen mainScreen].bounds.size.width,[UIScreen mainScreen].bounds.size.height)];
            sharedModalView.backgroundColor = [UIColor colorWithWhite:0 alpha:0.5];
            [[UIApplication sharedApplication].keyWindow addSubview:sharedModalView];
            
            return sharedModalView;
        }
    }
    return sharedModalView;
}

-(void)animeData{
//       [UIView animateWithDuration:.5 animations:^{
//        [UIView animateWithDuration:.25 animations:^{
//            switch (self.menuDirectionType) {
//                case DownSheetDirectionUp:
//                    [view setFrame:CGRectMake(view.frame.origin.x,view.frame.origin.y - self.menuSize.height,  self.menuSize.width, self.menuSize.height)];
//                    break;
//                case DownSheetDirectionDown:
//                    [view setFrame:CGRectMake(view.frame.origin.x,view.frame.origin.y,  self.menuSize.width, self.menuSize.height)];
//                    break;
//                default:
//                    break;
//            }
//            
//        }];
//    } completion:^(BOOL finished) {
//    }];
}

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldReceiveTouch:(UITouch *)touch{
//    return YES;
    if([touch.view isKindOfClass:[self class]]){
        return YES;
    }
   return NO;
}

- (void)tappedCancel {
    [UIView animateWithDuration:.5 animations:^{
//        switch (self.menuDirectionType) {
//            case DownSheetDirectionUp:
//                [view setFrame:CGRectMake(view.frame.origin.x,view.frame.origin.y + self.menuSize.height,  self.menuSize.width, 0)];
//                break;
//            case DownSheetDirectionDown:
//                [view setFrame:CGRectMake(view.frame.origin.x,view.frame.origin.y,  self.menuSize.width, 0)];
//                break;
//            default:
//                break;
//        }
    } completion:^(BOOL finished) {
        if (finished) {
            [self removeFromSuperview];
        }
    }];
}

@end
