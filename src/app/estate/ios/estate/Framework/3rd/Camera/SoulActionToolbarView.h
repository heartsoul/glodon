//
//  SoulActionToolbarView.h
//  TestOC
//
//  Created by glodon on 2018/3/30.
//  Copyright © 2018年 zyyj. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface SoulActionToolbarView : UIView
@property (weak, nonatomic) IBOutlet UIView *bottomToolbar;
@property (weak, nonatomic) IBOutlet UIToolbar *bottomDrawToolbar;
@property (weak, nonatomic) IBOutlet UIBarButtonItem *confirmEditButton;
@property (weak, nonatomic) IBOutlet UIBarButtonItem *cancelEditButton;
@property (weak, nonatomic) IBOutlet UIToolbar *topToolbar;
@property (weak, nonatomic) IBOutlet UITextView *textView;
- (IBAction)editCancelAction:(id)sender;
- (IBAction)editDoneAction:(id)sender;
// 拍照按钮
@property(nonatomic, weak) IBOutlet UIButton *photoButton;
// 闪光灯按钮
@property(nonatomic, weak) IBOutlet UIButton *flashButton;
// 前后摄像头转换按钮
@property(nonatomic, weak) IBOutlet UIButton *cameraButton;
// 选择完成按钮
@property(nonatomic, weak) IBOutlet UIButton *finishButton;
// 取消按钮
@property(nonatomic, weak) IBOutlet UIButton *cancelButton;

// 涂鸦按钮
@property(nonatomic, weak) IBOutlet UIButton *pencilButton;
// 文本输入按钮
@property(nonatomic, weak) IBOutlet UIButton *textButton;

// 颜色选择按钮
@property(nonatomic, weak) UIButton *colorButton;
// 撤销按钮
@property(nonatomic, weak) IBOutlet UIButton *undoButton;

// 颜色变更
@property(nonatomic, copy) void(^onColorChangeBlock)(UIButton * button);

// 执行撤销
@property(nonatomic, copy) void(^onUndoBlock)(UIButton * button);

// 执行取消
@property(nonatomic, copy) void(^onCancelBlock)(UIButton * button);
// 完成
@property(nonatomic, copy) void(^onFinishBlock)(UIButton * button);
@property(nonatomic, copy) void(^onPhotoBlock)(UIButton * button);
@property(nonatomic, copy) void(^onFlashBlock)(UIButton * button);
@property(nonatomic, copy) void(^onChangeCameraBlock)(UIButton * button);
@property(nonatomic, copy) void(^onPencilBlock)(UIButton * button);
@property(nonatomic, copy) void(^onTextBlock)(UIButton * button);

- (IBAction)onPhotoAction:(UIButton*)button;
- (IBAction)onFlashAction:(UIButton*)button;
- (IBAction)onCameraAction:(UIButton*)button;
- (IBAction)onFinishAction:(UIButton*)button;
- (IBAction)onCancelAction:(UIButton*)button;
- (IBAction)onPencilAction:(UIButton*)button;
- (IBAction)onTextAction:(UIButton*)button;
- (IBAction)onColorAction:(UIButton*)button;
- (IBAction)onUndoAction:(UIButton*)button;
@end
