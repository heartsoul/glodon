//
//  SoulPhotoEditViewController.m
//  TestOC
//
//  Created by glodon on 2018/3/30.
//  Copyright © 2018年 zyyj. All rights reserved.
//

#import "SoulPhotoEditViewController.h"
#import "SoulDrawView.h"
#import "SoulActionToolbarView.h"
@interface SoulPhotoEditViewController ()
@property (nonatomic)SoulDrawView *editView;
@property (nonatomic) SoulActionToolbarView * toolbarView;
@end

@implementation SoulPhotoEditViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    _editView = [[SoulDrawView alloc] initWithFrame:self.view.bounds];
    [self.view addSubview:_editView];
    if (self.inputImageBlock) {
        UIImage * image = self.inputImageBlock();
        if(image) {
            [_editView setBackgroundImage:image];
        }
        self.toolbarView = [[NSBundle mainBundle] loadNibNamed:@"SoulCameraEditView" owner:nil options:nil][0];
        self.toolbarView.frame = self.view.frame;
        __weak typeof(self) weakself = self;
        [self.toolbarView setOnFinishBlock:^(UIButton *button) {
            __strong typeof (weakself) strongself = weakself;
            [strongself onFinish];
        }];
        [self.toolbarView setOnPencilBlock:^(UIButton *button) {
            __strong typeof (weakself) strongself = weakself;
            
            [strongself onPencil];
//             button.selected = !button.selected;
        }];
        [self.toolbarView setOnTextBlock:^(UIButton *button) {
            __strong typeof (weakself) strongself = weakself;
            
            [strongself onText];
//            button.selected = !button.selected;
        }];
        
        UIImage * imageText = self.toolbarView.textButton.currentImage;
        
        UIImage * image1 = [imageText imageWithRenderingMode:(UIImageRenderingModeAlwaysTemplate)];

        [self.toolbarView.textButton setImage:image1 forState:UIControlStateSelected];
        self.toolbarView.textButton.tintColor = [UIColor greenColor];
        [self.toolbarView setOnCancelBlock:^(UIButton *button) {
            __strong typeof (weakself) strongself = weakself;
            [strongself disMiss];
            
        }];
        [self.view addSubview:self.toolbarView];
    }
    // Do any additional setup after loading the view.
}

- (void)disMiss
{
    [self dismissViewControllerAnimated:YES completion:nil];
}


- (void)onFinish {
    [self dismissViewControllerAnimated:YES completion:nil];
    [self.editView saveImage:^(NSString *assetId) {
        
    }];
}

- (void)onPencil {
    [self.editView setBDrawText:NO];
    self.toolbarView.textButton.selected = NO;
    self.toolbarView.pencilButton.selected = YES;
}

- (void)onText {
    [self.editView setBDrawText:YES];
    self.toolbarView.textButton.selected = YES;
    self.toolbarView.pencilButton.selected = NO;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
