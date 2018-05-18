//
//  SoulActionToolbarView.m
//  TestOC
//
//  Created by glodon on 2018/3/30.
//  Copyright © 2018年 zyyj. All rights reserved.
//

#import "SoulActionToolbarView.h"

@implementation SoulActionToolbarView
- (void)awakeFromNib {
    [super awakeFromNib];
    [self.topToolbar setBackgroundImage:[UIImage imageNamed:@"tansparents"] forToolbarPosition:UIBarPositionAny barMetrics:UIBarMetricsDefault];
    [self.bottomDrawToolbar setBackgroundImage:[UIImage imageNamed:@"tansparents"] forToolbarPosition:UIBarPositionAny barMetrics:UIBarMetricsDefault];
  
  [self.bottomDrawToolbar setItems:@[
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
}
- (void)changeColor:(UIButton*)button {
  
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
//    if (self.onTextBlock) {
//        self.onTextBlock(button);
//    }
    
    [self beganEdit:@""];
}
- (void)beganEdit:(NSString*)text {
    self.topToolbar.hidden = NO;
    self.textView.hidden = NO;
    self.bottomToolbar.hidden = YES;
    [self.textView becomeFirstResponder];
    self.textView.text = text;
    self.textView.inputView = self.bottomToolbar;
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
- (IBAction)editCancelAction:(id)sender {
    self.topToolbar.hidden = YES;
    self.textView.hidden = YES;
    self.bottomToolbar.hidden = NO;
    [self endEditing:YES];
}

- (IBAction)editDoneAction:(id)sender {
    [self endEditing:YES];
    self.topToolbar.hidden = YES;
    self.textView.hidden = YES;
    self.bottomToolbar.hidden = NO;
    if (self.onTextBlock) {
        self.onTextBlock(self.textButton);
    }
}
@end
