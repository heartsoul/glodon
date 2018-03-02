//
//  DownSheetCell.m
//  audioWriting
//
//  Created by wolf on 14-7-19.
//  Copyright (c) 2014年 wangruiyy. All rights reserved.
//
#import "DownSheetCell.h"
#import <QuartzCore/QuartzCore.h>

@interface DownSheetCell ()
@property(nonatomic, strong) CAShapeLayer *shapLayer;
@end
@implementation DownSheetCell

- (id)initWithStyle:(UITableViewCellStyle)style
    reuseIdentifier:(NSString *)reuseIdentifier {
  self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
  if (self) {
    // Initialization code
    leftView = [[UIImageView alloc] init];
    InfoLabel = [[UILabel alloc] init];
    self.backgroundView = [[UIView alloc] init];
    [self.contentView addSubview:leftView];
    [self.contentView addSubview:InfoLabel];
    self.selectionStyle = UITableViewCellSelectionStyleNone;
  }
  return self;
}

- (void)layoutSubviews {
  [super layoutSubviews];
  leftView.frame = CGRectMake(20, (self.frame.size.height - 20) / 2, 20, 20);
  //    InfoLabel.frame =
  //    CGRectMake(leftView.frame.size.width+leftView.frame.origin.x+15,
  //    (self.frame.size.height-20)/2, 140, 20);
  //    InfoLabel.frame = CGRectMake(0, 0, self.bounds.size.width,
  //    self.bounds.size.height - 10);
  self.backgroundView.frame = CGRectMake(
      0, cellData.topOff, self.bounds.size.width,
      self.bounds.size.height - cellData.bottomOff - cellData.bottomOff);
  InfoLabel.frame = self.bounds;
  if (cellData.bottomOff < 0) {
    UIView *sv = [self.contentView viewWithTag:8881];
    if (sv) {
      [sv removeFromSuperview];
    }
    sv = [[UIView alloc]
        initWithFrame:CGRectMake(0, self.bounds.size.height - 1.0f,
                                 self.bounds.size.width, 1.0f)];
    sv.tag = 8881;
    [self.contentView addSubview:sv];
  }
  self.backgroundColor = [UIColor clearColor];
  self.clipsToBounds = YES;
  self.backgroundView.layer.cornerRadius = 5.0f;
  self.backgroundView.clipsToBounds = YES;
  //调整分割线
  if (cellData.bottomOff > 0) {
    [self.shapLayer removeFromSuperlayer];
  } else {
    self.shapLayer.frame =
        CGRectMake(0, CGRectGetMaxY(self.contentView.frame) - 1,
                   CGRectGetWidth(self.backgroundView.frame), 1);
  }
}

- (void)setData:(DownSheetModel *)dicdata {
  cellData = dicdata;
  if (dicdata.icon) {
    leftView.image = [UIImage imageNamed:dicdata.icon];
  }
  if (dicdata.title) {
    InfoLabel.text = dicdata.title;
  }
  if (dicdata.bgColor) {
    self.backgroundView.backgroundColor = dicdata.bgColor;
  }
  if (dicdata.titleColor) {
    InfoLabel.textColor = dicdata.titleColor;
  }
  if (dicdata.titleFont) {
    InfoLabel.font = dicdata.titleFont;
  }
  if (dicdata.showSeparatorLine) {
    [self createShapeLayer];
  }
  self.backgroundView.frame =
      CGRectMake(0, dicdata.topOff, self.bounds.size.width,
                 self.bounds.size.height - dicdata.bottomOff - dicdata.topOff);
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
  [super setSelected:selected animated:animated];
  if (selected) {
    if (!cellData.selectBgColor) {
      cellData.selectBgColor = [UIColor grayColor];
    }
    self.backgroundView.backgroundColor = cellData.selectBgColor;
    if (cellData.icon_on) {
      leftView.image = [UIImage imageNamed:cellData.icon_on];
    }
    InfoLabel.textColor = [UIColor whiteColor];
  } else {
    if (cellData.bgColor) {
      self.backgroundView.backgroundColor = cellData.bgColor;
    } else {
      self.backgroundView.backgroundColor = [UIColor clearColor];
    }

    if (cellData.icon) {
      leftView.image = [UIImage imageNamed:cellData.icon];
    }
    self.contentView.clipsToBounds = YES;
    InfoLabel.clipsToBounds = YES;
    InfoLabel.textColor = cellData.titleColor;
    InfoLabel.textAlignment = NSTextAlignmentCenter;
  }
  // Configure the view for the selected state
}

- (void)createShapeLayer{
  if (self.shapLayer) {
    return;
  }
  self.shapLayer = [[CAShapeLayer alloc] init];
  self.shapLayer.backgroundColor = [UIColor colorWithRed:230 / 255.0
                                                   green:230.0 / 255.0
                                                    blue:230.0 / 255.0
                                                   alpha:1]
  .CGColor;
  [self.layer addSublayer:self.shapLayer];

}

@end

// 版权属于原作者
// http://code4app.com (cn) http://code4app.net (en)
// 发布代码于最专业的源码分享网站: Code4App.com
