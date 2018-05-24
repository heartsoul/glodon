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

- (IBAction)onColorBackAction:(UIButton *)sender;
@property(nonatomic, weak) SoulDrawColorPickerCollectionViewCell * selectedCell;
@end

@implementation SoulDrawColorPickerToolbar

- (void)awakeFromNib {
  [super awakeFromNib];
  [self setup];
}

- (instancetype)initWithCoder:(NSCoder *)aDecoder {
  self = [super initWithCoder:aDecoder];
  if (self) {
//    [self setup];
  }
  return self;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  self = [super initWithFrame:frame];
  if (self) {
//    [self setup];
  }
  return self;
}

- (void)setup {
  self.colorItems = @[[UIColor whiteColor],
                     [UIColor blackColor],
                     [UIColor redColor],
                      [UIColor yellowColor],
                      [UIColor greenColor],
                     [UIColor cyanColor],
                      [UIColor purpleColor],
                     [UIColor magentaColor],
                     ];
  if(!self.selectColor) {
    self.selectColor = self.colorItems[0];
  }
  self.colloectionView.delegate = self;
  self.colloectionView.dataSource = self;
  [self.colloectionView registerNib:[UINib nibWithNibName:@"SoulDrawColorPickerCollectionViewCell" bundle:nil] forCellWithReuseIdentifier:@"SoulDrawColorPickerCollectionViewCell"];
  self.backButton.hidden = YES;
}
- (void)setSelectedColor:(UIColor*)color {
  _selectColor = color;
  [self.colloectionView reloadData];
}

#pragma mark -- UICollectionViewDelegate

- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath {
  SoulDrawColorPickerCollectionViewCell * cell = (SoulDrawColorPickerCollectionViewCell*)[collectionView cellForItemAtIndexPath:indexPath];
  [cell setColorSelected:YES];
  if(cell != self.selectedCell) {
    [self.selectedCell setColorSelected:NO];
    self.selectedCell = cell;
  }
  if(self.onSelectBlock) {
    self.onSelectBlock(cell.colorButton, nil);
  }
}

- (void)collectionView:(UICollectionView *)collectionView willDeselectItemAtIndexPath:(NSIndexPath *)indexPath {
  SoulDrawColorPickerCollectionViewCell * cell = (SoulDrawColorPickerCollectionViewCell*)[collectionView cellForItemAtIndexPath:indexPath];
  [cell setColorSelected:NO];
  
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
  if(cell.colorSelected) {
    [self.selectedCell setColorSelected:NO];
    self.selectedCell = cell;
  }
  return cell;
}

- (IBAction)onColorBackAction:(UIButton *)sender {
  if(self.onUndoBlock) {
    self.onUndoBlock();
  }
}

@end

@implementation SoulDrawColorPickerCollectionViewCell

- (void)awakeFromNib {
  [super awakeFromNib];
  self.bgView.layer.cornerRadius = self.bgView.frame.size.height / 2;
  self.bgView.layer.borderColor = [UIColor whiteColor].CGColor;
  self.bgView.layer.borderWidth = 2;
  self.bgView.layer.masksToBounds = YES;
  self.colorButton.layer.cornerRadius =  self.colorButton.frame.size.height / 2;
  self.colorButton.layer.borderWidth = 2;
  self.colorButton.layer.borderColor = [UIColor whiteColor].CGColor;
  self.colorButton.layer.masksToBounds = YES;
  
}

- (void)updateData:(UIColor*)color {
  self.colorButton.backgroundColor = color;
  self.bgView.backgroundColor = color;
}

- (void)setColorSelected:(BOOL)colorSelected {
  _colorSelected = colorSelected;
  self.colorButton.hidden = colorSelected ? YES : NO;
  self.bgView.hidden = colorSelected ? NO : YES;
}

@end
