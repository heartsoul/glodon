//
//  SoulActionToolbarView.m
//  TestOC
//
//  Created by glodon on 2018/3/30.
//  Copyright © 2018年 zyyj. All rights reserved.
//

#import "SoulActionToolbarView.h"

@implementation SoulActionToolbarView

- (IBAction)onPhotoAction:(UIButton*)button {
    if (self.onPhotoBlock) {
        self.onPhotoBlock(button);
    }
}
- (IBAction)onFlashAction:(UIButton*)button {
    if (self.onFlashBlock) {
        self.onFlashBlock(button);
    }
}
- (IBAction)onCameraAction:(UIButton*)button {
    if (self.onChangeCameraBlock) {
        self.onChangeCameraBlock(button);
    }
}
- (IBAction)onFinishAction:(UIButton*)button {
    if (self.onFinishBlock) {
        self.onFinishBlock(button);
    }
}
- (IBAction)onCancelAction:(UIButton*)button {
    if (self.onCancelBlock) {
        self.onCancelBlock(button);
    }
}
- (IBAction)onPencilAction:(UIButton*)button {
    if (self.onPencilBlock) {
        self.onPencilBlock(button);
    }
}
- (IBAction)onTextAction:(UIButton*)button {
    if (self.onTextBlock) {
        self.onTextBlock(button);
    }
}
- (IBAction)onColorAction:(UIButton*)button {
    if (self.onColorChangeBlock) {
        self.onColorChangeBlock(button);
    }
}
- (IBAction)onUndoAction:(UIButton*)button {
    if (self.onUndoBlock) {
        self.onUndoBlock(button);
    }
}

-(BOOL)gestureRecognizer:(UIGestureRecognizer*)gestureRecognizer shouldRecognizeSimultaneouslyWithGestureRecognizer:(UIGestureRecognizer*)otherGestureRecognizer
{
    return YES;
}

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
    UIView *hitView = [super hitTest:point withEvent:event];
    if (hitView == self)
    {
        return nil;
    }
    else
    {
        return hitView;
    }
    
} 
@end
