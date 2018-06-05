//
//  SoulActionToolbarView.m
//  TestOC
//
//  Created by glodon on 2018/3/30.
//  Copyright © 2018年 zyyj. All rights reserved.
//

#import "SoulActionToolbarView.h"
#import "SoulDrawColorPickerToolbar.h"
@implementation SoulActionToolbarView
- (void)awakeFromNib {
    [super awakeFromNib];
  [self.topToolbar setBackgroundImage:[UIImage imageNamed:@"tansparents"] forToolbarPosition:UIBarPositionAny barMetrics:UIBarMetricsDefault];
  [self.topToolbar setShadowImage:[UIImage new] forToolbarPosition:UIBarPositionAny];
//   [self.topToolbar setBackgroundColor:[UIColor colorWithWhite:1 alpha:0.1]];
  self.topToolbar.hidden = YES;
  self.bottomDrawToolbar.hidden = YES;
  [self.bottomDrawToolbar setSelectedColor:[UIColor redColor]];
  
  self.textView.hidden = YES;
  [self.inputToolbar setOnSelectBlock:^(UIButton *selected, UIButton *prevSelected) {
    self.textView.textColor = selected.backgroundColor;
  }];
  
  [self.bottomDrawToolbar setOnSelectBlock:^(UIButton *selected, UIButton *prevSelected) {
    self.currentColor = selected.backgroundColor;
    if(self.onColorChangeBlock) {
      self.onColorChangeBlock(selected);
    }
  }];
  [self.bottomDrawToolbar setOnUndoBlock:^{
    if(self.onUndoBlock) {
      self.onUndoBlock(nil);
    }
  }];
  UIToolbar * topView = [[UIToolbar alloc]initWithFrame:CGRectMake(0, 0, 320, 44)];
  [topView setBackgroundImage:[UIImage imageNamed:@"tansparents"] forToolbarPosition:UIBarPositionAny barMetrics:UIBarMetricsDefault];
   [topView setShadowImage:[UIImage new] forToolbarPosition:UIBarPositionAny];
  //设置style
  [topView setBarStyle:UIBarStyleDefault];
//  [topView setBackgroundColor:[UIColor colorWithWhite:0 alpha:0.25]];
  //定义两个flexibleSpace的button，放在toolBar上，这样完成按钮就会在最右边
  UIBarButtonItem * button1 =[[UIBarButtonItem alloc] initWithCustomView:self.inputToolbar];

  //在toolBar上加上这些按钮
  NSArray * buttonsArray = [NSArray arrayWithObjects:button1,nil];
  [topView setItems:buttonsArray];
  // [textView setInputView:topView];
  _textToolbar = topView;
  [self.textView setInputAccessoryView:_textToolbar];
  self.inputToolbar.hidden = YES;
  
 
}
//隐藏键盘
-(void)resignKeyboard
{
  [self.textView resignFirstResponder];
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
  [self beganDraw];
}
- (IBAction)onTextAction:(UIButton*)button {
//    if (self.onTextBlock) {
//        self.onTextBlock(button);
//    }
    
    [self beganEdit:@""];
}
- (void)beganDraw {
  self.topToolbar.hidden = NO;
  self.bottomToolbar.hidden = YES;
  self.bottomDrawToolbar.hidden = NO;
//  [self.bottomDrawToolbar setSelectedColor:[UIColor redColor]];
//  [self.inputToolbar setSelectedColor:[UIColor whiteColor]];
  
}
- (void)beganEdit:(NSString*)text {
  self.topToolbar.hidden = NO;
  self.textView.hidden = NO;
  self.bottomToolbar.hidden = YES;
  self.bottomDrawToolbar.hidden = YES;
  [self.inputToolbar setSelectedColor:[UIColor whiteColor]];
  self.inputToolbar.hidden = NO;
  self.textView.text = text;
  self.textView.textColor = [UIColor whiteColor];
  [self.textView setInputAccessoryView:_textToolbar];
  [self.textView becomeFirstResponder];
  [self.textView reloadInputViews];
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
   [self endEditing:YES];
  if(self.textView.hidden == NO) {
    // 是文本编辑
    self.topToolbar.hidden = YES;
    self.textView.hidden = YES;
    self.bottomToolbar.hidden = NO;
    self.bottomDrawToolbar.hidden = YES;
  } else {
    // 是涂鸦
    self.topToolbar.hidden = YES;
    self.bottomToolbar.hidden = NO;
    self.bottomDrawToolbar.hidden = YES;
  }
  if(self.onCancelEditBlock) {
    self.onCancelEditBlock();
  }
}

- (IBAction)editDoneAction:(id)sender {
   [self endEditing:YES];
  if(self.textView.hidden == NO) {
    // 是文本编辑
    self.topToolbar.hidden = YES;
    self.textView.hidden = YES;
    self.bottomToolbar.hidden = NO;
    self.bottomDrawToolbar.hidden = YES;
    if (self.onEndTextBlock) {
      self.onEndTextBlock(self.textView.text,self.textView.textColor);
    }
  } else {
    // 是涂鸦
    self.topToolbar.hidden = YES;
    self.bottomToolbar.hidden = NO;
    self.bottomDrawToolbar.hidden = YES;
    if (self.onEndPencilBlock) {
      self.onEndPencilBlock(self.currentColor);
    }
  }
}

- (void)updateRedo:(BOOL)bNeed {
  self.bottomDrawToolbar.backButton.hidden = !bNeed;
}
@end
