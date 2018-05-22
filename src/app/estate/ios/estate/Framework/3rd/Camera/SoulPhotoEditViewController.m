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
  [_editView enableDraw:NO];
 
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
//          [strongself.editView storePoint];
          [strongself.editView enableDraw:NO];
//          [strongself.editView reset];
          [strongself onFinish];
          
        }];
      [self.toolbarView setOnEndPencilBlock:^(UIColor *color) {
        __strong typeof (weakself) strongself = weakself;
        strongself.editView.lineColor = color;
        [strongself.editView savePoint];
        [strongself.editView enableDraw:NO];
//        [strongself.editView reset];
      }];
      [self.toolbarView setOnEndTextBlock:^(NSString *text, UIColor *color) {
        __strong typeof (weakself) strongself = weakself;
        [strongself.editView addTextDraw:text color:color];
        [strongself.editView savePoint];
        [strongself.editView enableDraw:NO];
//        [strongself.editView reset];
      }];
      [self.toolbarView setOnUndoBlock:^(UIButton *button) {
        __strong typeof (weakself) strongself = weakself;
        [strongself.editView undo];
      }];
      [self.toolbarView setOnColorChangeBlock:^(UIButton *button) {
         __strong typeof (weakself) strongself = weakself;
        [strongself.editView updateLineColor:button.backgroundColor];
      }];
        [self.toolbarView setOnPencilBlock:^(UIButton *button) {
            __strong typeof (weakself) strongself = weakself;
            
            [strongself onPencil];
          [strongself.editView enableDraw:YES];
//             button.selected = !button.selected;
        }];
        [self.toolbarView setOnTextBlock:^(UIButton *button) {
            __strong typeof (weakself) strongself = weakself;
            
            [strongself onText];
          [strongself.editView enableDraw:NO];
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
      [self.toolbarView setOnCancelEditBlock:^(void) {
        __strong typeof (weakself) strongself = weakself;
        [strongself.editView enableDraw:NO];
        [strongself.editView reset];
        
      }];
        [self.view addSubview:self.toolbarView];
      [_editView setNoticeDataSizeBlock:^(NSInteger size) {
         __strong typeof (weakself) strongself = weakself;
        [strongself.toolbarView updateRedo:size > 0];
      }];
    }
    // Do any additional setup after loading the view.
}

- (void)disMiss
{
    [self dismissViewControllerAnimated:NO completion:nil];
    if(self.didCancelBlock) {
      self.didCancelBlock();
    }
}


- (void)onFinish {
    [self dismissViewControllerAnimated:YES completion:nil];
    [self.editView saveImage:^(NSString *assetId) {
      if(self.didFinishPickingBlock) {
        self.didFinishPickingBlock(assetId);
      }
    }];
}

- (void)onPencil {
    [self.editView setBDrawText:NO];
//    self.toolbarView.textButton.selected = NO;
//    self.toolbarView.pencilButton.selected = YES;
}

- (void)onText {
    [self.editView setBDrawText:YES];
//    self.toolbarView.textButton.selected = YES;
//    self.toolbarView.pencilButton.selected = NO;
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
+(void)test:(UIViewController*)navcDelegate image:(UIImage*)image  callback:(void(^)(NSArray * files))callback {
  SoulPhotoEditViewController * vc1 = [[SoulPhotoEditViewController alloc] initWithNibName:nil bundle:nil];
  vc1.inputImageBlock = ^UIImage * _Nonnull{
    return image;
  };
  
  [vc1 setDidFinishPickingBlock:^(NSString *localIdentifier) {
    if (localIdentifier) {
        callback(@[]);
    } else {
      callback(@[]);
    }
  }];
  [vc1 setDidCancelBlock:^{
    callback(@[]);
  }];
  [navcDelegate presentViewController:vc1 animated:NO completion:nil];
}
@end
