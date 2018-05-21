//
//  SoulDrawColorPickerToolbar.m
//  estate
//
//  Created by glodon on 2018/5/21.
//  Copyright © 2018年 Glodon. All rights reserved.
//

#import "SoulDrawColorPickerToolbar.h"

@interface SoulDrawColorPickerCollectionViewCell:UICollectionViewCell
@property(nonatomic, strong) IBOutlet UIView * bgView;
@property(nonatomic, strong) IBOutlet UIButton * colorButton;
@property(nonatomic, assign) BOOL colorSelected;
- (void)updateData:(UIColor*)color;
@end

@interface SoulDrawColorPickerToolbar()<UICollectionViewDelegate,UICollectionViewDataSource,UICollectionViewDelegateFlowLayout>
@property(nonatomic, strong) IBOutlet UICollectionView * colloectionView;
@property(nonatomic, strong) IBOutlet UIButton * backButton;
- (IBAction)onColorBackAction:(UIButton *)sender;
@property(nonatomic, weak) UIColor * selectColor;
@end

@implementation SoulDrawColorPickerToolbar

- (void)awakeFromNib {
  [super awakeFromNib];
  [self setup];
}

- (instancetype)initWithCoder:(NSCoder *)aDecoder {
  self = [super initWithCoder:aDecoder];
  if (self) {
    [self setup];
  }
  return self;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  self = [super initWithFrame:frame];
  if (self) {
    [self setup];
  }
  return self;
}

- (void)setup {
  self.colorItems = @[[UIColor blackColor],
                     [UIColor darkGrayColor],
                     [UIColor whiteColor],
                     [UIColor grayColor],
                     [UIColor redColor],
                     [UIColor greenColor],
                     [UIColor blueColor],
                     [UIColor cyanColor],
                     [UIColor yellowColor],
                     [UIColor magentaColor],
                     [UIColor orangeColor],
                     [UIColor purpleColor],
                     [UIColor brownColor]
                     ];
  self.colloectionView.delegate = self;
  self.colloectionView.dataSource = self;
  [self.colloectionView registerNib:[UINib nibWithNibName:@"SoulDrawColorPickerCollectionViewCell" bundle:nil] forCellWithReuseIdentifier:@"SoulDrawColorPickerCollectionViewCell"];
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

#pragma mark -- UICollectionViewDelegate

- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath {
  
}

#pragma mark -- UICollectionViewDataSource

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
  return self.colorItems.count;
}

// The cell that is returned must be retrieved from a call to -dequeueReusableCellWithReuseIdentifier:forIndexPath:
- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath {
  SoulDrawColorPickerCollectionViewCell * cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"SoulDrawColorPickerCollectionViewCell" forIndexPath:indexPath];
  [cell updateData:self.colorItems[indexPath.row]];
  [cell setColorSelected:self.selectColor == self.colorItems[indexPath.row]];
  return cell;
}

- (IBAction)onColorBackAction:(UIButton *)sender {
}
@end

@implementation SoulDrawColorPickerCollectionViewCell

- (void)awakeFromNib {
  [super awakeFromNib];
  self.bgView.layer.cornerRadius = self.bgView.frame.size.height / 2;
  self.bgView.layer.borderColor = self.backgroundColor.CGColor;
  self.bgView.backgroundColor = [UIColor whiteColor];
//  self.bgView.layer.borderWidth = 7.5;
  self.bgView.layer.borderWidth = 10;
  self.colorButton.layer.cornerRadius =  self.colorButton.frame.size.height / 2;
//   self.colorButton.layer.borderWidth = 9.5;
  self.colorButton.layer.borderWidth = 7;
  self.colorButton.layer.borderColor = self.backgroundColor.CGColor;
}

- (void)updateData:(UIColor*)color {
  self.colorButton.backgroundColor = color;
}

- (void)setColorSelected:(BOOL)colorSelected {
  self.bgView.layer.borderWidth = colorSelected ? 7.5 : 10;
  self.colorButton.layer.borderWidth =  colorSelected ? 4.5 : 7;
}

@end
