//
//  SoulDrawColorPickerToolbar.h
//  estate
//
//  Created by glodon on 2018/5/21.
//  Copyright © 2018年 Glodon. All rights reserved.
//

#import <UIKit/UIKit.h>
@interface SoulDrawColorPickerToolbar : UIView
@property(nonatomic, strong) NSArray<UIColor*> * colorItems;
@property(nonatomic, copy) void(^onSelectBlock)(UIButton * selected,UIButton * prevSelected);
@property(nonatomic, copy) void(^onUndoBlock)();
@property(nonatomic, strong) IBOutlet UIButton * backButton;
@property(nonatomic, weak) UIColor * selectColor;
- (void)setSelectedColor:(UIColor*)color;
@end
