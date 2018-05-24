//
//  SoulDrawData.m
//  TestOC
//
//  Created by glodon on 2018/3/27.
//  Copyright © 2018年 zyyj. All rights reserved.
//

#import "SoulDrawData.h"
#import <CoreText/CoreText.h>

@interface SoulDrawData()
@end

@implementation SoulDrawData

- (instancetype)init {
    self = [super init];
    if (self) {
        self.scaleFactor = 1.0f;
        self.transform = CGAffineTransformIdentity;
        self.lineWidth = 4.0f;
        self.color = [UIColor blueColor];
    }
    return self;
}

- (instancetype)initWithCoder:(NSCoder *)aDecoder {
    self = [super initWithCoder:aDecoder];
    if (self) {
        self.scaleFactor = 1.0f;
        self.lineWidth = 4.0f;
        self.transform = CGAffineTransformIdentity;
        self.color = [UIColor blueColor];
    }
    return self;
}

- (void)setColor:(UIColor *)color {
    _color = color;
    if (_selectColor == nil) {
        _selectColor = color;
    }
}

- (void)setTrans:(CGSize)trans {
    _trans = trans;
    if (self.trans.width || self.trans.height) {
        CGAffineTransform transform = CGAffineTransformTranslate(CGAffineTransformIdentity,self.trans.width, self.trans.height);
        _transform = transform;
    }
}

- (void)setScaleFactor:(CGFloat)scaleFactor {
    _scaleFactor = scaleFactor;
    if (self.scaleFactor != 1.0f) {
        CGAffineTransform transform = CGAffineTransformScale(CGAffineTransformIdentity,scaleFactor, scaleFactor);
        transform = CGAffineTransformTranslate(transform,[self getBounds].size.width * scaleFactor / 2,[self getBounds].size.height * scaleFactor / 2);
        _transform = transform;
    }
}

- (void)setTransform:(CGAffineTransform)transform {
    _transform = transform;
}
- (void)moveBySize:(CGSize)size scale:(CGFloat)scale {
    
}
#pragma mark -- 绘制
- (void)draw {
}
- (void)doTrans {
    if (CGAffineTransformEqualToTransform(self.transform,CGAffineTransformIdentity)) {
        return;
    }
    [self applyTransform:self.transform];
    self.transform = CGAffineTransformIdentity;
}

- (CGRect)getBounds {
    return self.bounds;
}
@end

@interface SoulDrawDataBezierPath()
@end

@implementation SoulDrawDataBezierPath
#pragma mark -- 绘制路径
- (void)draw {
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextSaveGState(UIGraphicsGetCurrentContext());
    [self.color setStroke];
    self.lineCapStyle = kCGLineCapRound;
    self.lineJoinStyle = kCGLineCapRound;
    [self strokeWithBlendMode:kCGBlendModeNormal alpha:1.0];
    [self stroke];
    [self doTrans];
    CGContextRestoreGState(context);
}
- (void)setTrans:(CGSize)trans {
    [super setTrans:trans];
}
- (void)doTrans {
    [super doTrans];
}
- (nullable UITextView*)getTextView {
    return nil;
}

@end

@interface SoulDrawDataText()<UITextViewDelegate>
@end

@implementation SoulDrawDataText

- (instancetype)init {
    self = [super init];
    if (self) {
        [self initInner];
    }
    return self;
}

- (void)initInner {
    self.font = [UIFont systemFontOfSize:16];
    self.center = CGPointMake(30, 100);
    self.size = CGSizeMake(100, 40);
    self.drawText = @"文本内容";
    
}

- (instancetype)initWithCoder:(NSCoder *)aDecoder {
    self = [super initWithCoder:aDecoder];
    if (self) {
        [self initInner];
    }
    return self;
}

- (nullable UITextView*)getTextView {
    UITextView * ret = [[UITextView alloc] initWithFrame:[self getBounds]];
    ret.font = self.font;
    ret.text = self.drawText;
    ret.textColor = self.color;
    ret.backgroundColor = [UIColor clearColor];
    ret.delegate = self;
    ret.layer.borderColor = [UIColor lightGrayColor].CGColor;
    ret.layer.borderWidth = 1.f;
    ret.autoresizingMask = UIViewAutoresizingFlexibleHeight;
    ret.textContainerInset = UIEdgeInsetsZero;
    ret.textContainer.lineFragmentPadding = 0;
    return ret;
}

//- (BOOL)textView:(UITextView *)textView shouldChangeTextInRange:(NSRange)range replacementText:(NSString *)text {
//
//}
- (void)textViewDidChange:(UITextView *)textView {
    CGPoint center = textView.center;
    self.drawText = textView.text;
    if (self.size.width < 200) {
        CGRect rc = CGRectMake(textView.frame.origin.x, textView.frame.origin.y, 200, textView.frame.size.height);
        textView.frame = rc;
//       textView.autoresizingMask = UIViewAutoresizingFlexibleHeight;
    } else {
//      textView.autoresizingMask = UIViewAutoresizingFlexibleWidth;
    }

    [textView sizeToFit];
    textView.center = center;
    CGRect rc = textView.frame;
    self.size = rc.size;
}

- (void)setDrawText:(NSString *)drawText {
    _drawText = drawText;
    [self removeAllPoints];
}

- (CGRect) getBounds {
    CGRect rc =  CGRectMake(self.center.x - self.size.width / 2, self.center.y - self.size.height / 2,  self.size.width, self.size.height);
    return rc;
}

- (void)setTrans:(CGSize)trans {
    [super setTrans:trans];
    if (self.trans.width || self.trans.height) {
        CGPoint center = self.center;
        [self setCenter:CGPointMake(center.x + self.trans.width, center.y + self.trans.height)];
        
    }
}

- (void)setScaleFactor:(CGFloat)scaleFactor {
    [super setScaleFactor:1.0];
}

- (BOOL)containsPoint:(CGPoint)point {
    
//    CGRect rc =  CGRectMake(self.center.x - self.size.width / 2, self.center.y - self.size.height / 2,  self.size.width, self.size.height);
    return CGRectContainsPoint([self getBounds], point);
}
- (void)transformToBezierPath:(NSString *)string
{
    [self removeAllPoints];
    CGMutablePathRef paths = CGPathCreateMutable();
    NSAttributedString *attrString = [[NSAttributedString alloc] initWithString:self.drawText
                                                                    attributes:@{NSFontAttributeName : self.font,
                                                                                 NSForegroundColorAttributeName : self.color}];
    CTLineRef lineRef = CTLineCreateWithAttributedString((CFAttributedStringRef)attrString);
    CFArrayRef runArrRef = CTLineGetGlyphRuns(lineRef);
    
    for (int runIndex = 0; runIndex < CFArrayGetCount(runArrRef); runIndex++) {
        const void *run = CFArrayGetValueAtIndex(runArrRef, runIndex);
        CTRunRef runb = (CTRunRef)run;
        
        const void *CTFontName = kCTFontAttributeName;
        
        const void *runFontC = CFDictionaryGetValue(CTRunGetAttributes(runb), CTFontName);
        CTFontRef runFontS = (CTFontRef)runFontC;
        
        CGFloat width = [UIScreen mainScreen].bounds.size.width;
        
        int temp = 0;
        CGFloat offset = .0;
        
        for (int i = 0; i < CTRunGetGlyphCount(runb); i++) {
            CFRange range = CFRangeMake(i, 1);
            CGGlyph glyph = 0;
            CTRunGetGlyphs(runb, range, &glyph);
            CGPoint position = CGPointZero;
            CTRunGetPositions(runb, range, &position);
            
            CGFloat temp3 = position.x;
            int temp2 = (int)temp3/width;
            CGFloat temp1 = 0;
            
            if (temp2 > temp1) {
                temp = temp2;
                offset = position.x - (CGFloat)temp;
            }
            
            CGPathRef path = CTFontCreatePathForGlyph(runFontS, glyph, nil);
            CGFloat x = position.x - (CGFloat)temp*width - offset;
            CGFloat y = position.y - (CGFloat)temp * 80;
            CGAffineTransform transform = CGAffineTransformMakeTranslation(x, y);
            CGPathAddPath(paths, &transform, path);
            
            CGPathRelease(path);
        }
        CFRelease(runb);
        CFRelease(runFontS);
    }
    
    UIBezierPath *bezierPath = self;
    [bezierPath moveToPoint:CGPointZero];
    [bezierPath appendPath:[UIBezierPath bezierPathWithCGPath:paths]];
    
    CGPathRelease(paths);
}

- (CGSize)calcSize:(CGFloat)width {
    CGSize size = [self.drawText boundingRectWithSize:CGSizeMake(width,MAXFLOAT) options:NSStringDrawingUsesLineFragmentOrigin attributes:@{NSFontAttributeName : self.font,NSForegroundColorAttributeName : self.color} context:nil].size;
    return size;
}
#pragma mark -- 绘制文字
- (void)draw {
    if (self.bEdit) {
        return;
    }
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextSaveGState(UIGraphicsGetCurrentContext());
    NSAttributedString *paramText = [[NSAttributedString alloc] initWithString:self.drawText
                                                                    attributes:@{NSFontAttributeName : self.font,
                                                                                 NSForegroundColorAttributeName : self.color}];
    [paramText drawInRect:[self getBounds]];
    CGContextRestoreGState(context);
}

@end

@interface SoulDrawDataSelectLine()
@end

@interface SoulDrawDataSelectDot()
@end

@implementation SoulDrawDataSelectLine
- (void)draw {
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextSaveGState(UIGraphicsGetCurrentContext());
    [[UIColor grayColor] setStroke];
    [self strokeWithBlendMode:kCGBlendModeNormal alpha:0.75];
    [self stroke];
    [self doTrans];
    CGContextRestoreGState(context);
}
@end

@implementation SoulDrawDataSelectDot
- (void)draw {
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextSaveGState(UIGraphicsGetCurrentContext());
    [[UIColor whiteColor] setStroke];
    [[UIColor colorWithRed:0x33/255.f green:0x7a/255.f blue:0xb7/255.f alpha:1.0f] setFill];
    
    [self strokeWithBlendMode:kCGBlendModeNormal alpha:1.0];
    [self stroke];
    [self fill];
    [self doTrans];
    CGContextRestoreGState(context);
}

- (CGRect)getBounds {
    
    CGFloat w2 = self.bounds.size.width / 2;
    CGFloat h2 = self.bounds.size.height / 2;
    CGFloat cx = self.bounds.origin.x + w2;
    CGFloat cy = self.bounds.origin.y + h2;
    CGFloat r = 20;
    return CGRectMake(cx - r, cy - r, 2*r, 2*r);
}

- (BOOL)containsPoint:(CGPoint)point {
    return CGRectContainsPoint([self getBounds], point);
}

- (void)moveBySize:(CGSize)size scale:(CGFloat)scale {
    if (size.width) {
        [self setTrans:CGSizeMake(size.width * (scale - 1), 0)];
        [self doTrans];
    }
    if (size.height) {
        [self setTrans:CGSizeMake(0, size.height * (scale - 1))];
        [self doTrans];
    }
}
@end

@interface SoulDrawDataSelect()
@property(nonatomic,nonnull,strong) NSMutableArray<id<SoulDrawDataDelegate>> * dataArray;
@end

@interface SoulDrawDataSelectBezierPath()
@end

@interface SoulDrawDataSelectText()

@end

@implementation SoulDrawDataSelect

- (id<SoulDrawDataDelegate>)buildCircle:(CGPoint)center changeType:(SoulDrawDataChangeType)changeType {
    SoulDrawDataSelectDot *path = [[SoulDrawDataSelectDot alloc] init];
    // 添加圆到path
    [path addArcWithCenter:center radius:3 startAngle:0.0 endAngle:M_PI*2 clockwise:YES];
    // 设置描边宽度（为了让描边看上去更清楚）
    [path setLineWidth:2.0];
    path.changeType = changeType;
    return path;
}

- (CGRect)getBounds {
   return [self.selectDrawData getBounds];
}

- (BOOL)containsPoint:(CGPoint)point {
    for (SoulDrawData *item in self.dataArray) {
        if ([item containsPoint:point]) {
            return YES;
        }
    }
    return NO;
}

// 检查当前的变更类型
- (SoulDrawDataChangeType)getChangeType:(CGPoint)point {
    for (SoulDrawDataSelectDot * item in self.dataArray.reverseObjectEnumerator) {
        if([item containsPoint:point]) {
            if (([item isKindOfClass:[SoulDrawDataSelectDot class]])) {
                return item.changeType;
            }
        }
    }
    return SoulDrawDataChangeTypeNone;
}

// 执行变更，YES：变更了，NO未改变
- (BOOL)doChangeType:(SoulDrawDataChangeType)changeType size:(CGSize)size {
    if (size.width == 0 && size.height == 0) {
        return NO;
    }
    if (changeType == SoulDrawDataChangeTypeNone) {
        // 控件移动
        [self setTrans:size];
        return YES;
    }
    // 右下脚
    if (changeType == SoulDrawDataChangeTypeBottomRight) {
        
        CGSize sizeOld = [self getBounds].size;
        
        CGFloat s = 1;
        if (fabs(size.width) > fabs(size.height)) {
            // x 方向偏移量大
            s =  (sizeOld.width - size.width) / sizeOld.width;
        } else {
            // y 方向上偏移量大
            s =  (sizeOld.height + size.height) / sizeOld.height;
        }
        
        if (sizeOld.height < 15 && sizeOld.width < 15 && s < 1) {
            return YES;
        }
        
        CGAffineTransform transform = CGAffineTransformIdentity;
        
        transform = CGAffineTransformScale(CGAffineTransformIdentity,s, s);
        [self.selectDrawData setTransform:transform];
        [self.selectDrawData doTrans];
        CGPoint p2 = [self getBounds].origin;
        SoulDrawData * pathTopLeft = (SoulDrawData *)self.dataArray[0];
        SoulDrawData * pathTopRight = (SoulDrawData *)self.dataArray[1];
        SoulDrawData * pathBottomLeft = (SoulDrawData *)self.dataArray[2];
        SoulDrawData * pathBottomRight = (SoulDrawData *)self.dataArray[3];
        CGPoint p0 = [pathTopLeft getBounds].origin;
        CGFloat r = [pathTopLeft getBounds].size.width / 2;
        CGPoint p3 = CGPointMake(p0.x + r, p0.y + r);
        transform = CGAffineTransformTranslate(CGAffineTransformIdentity,p3.x - p2.x,p3.y - p2.y);
        [self.selectDrawData setTransform:transform];
        [self.selectDrawData doTrans];
//        CGFloat lw = self.selectDrawData.lineWidth;
//        lw *=s;
//        self.selectDrawData.lineWidth = MIN(MAX(lw, 0.1f), 20);
        [pathTopRight moveBySize:CGSizeMake(sizeOld.width, 0) scale:s];
        [pathBottomLeft moveBySize:CGSizeMake(0, sizeOld.height) scale:s];
        [pathBottomRight moveBySize:CGSizeMake(sizeOld.width, sizeOld.height) scale:s];
        return YES;
    }
    
    // 左下脚
    if (changeType == SoulDrawDataChangeTypeBottomLeft) {
        CGSize sizeOld = [self getBounds].size;
        CGFloat s = 1;
        if (fabs(size.width) > fabs(size.height)) {
            // x 方向偏移量大
            s =  (sizeOld.width + size.width) / sizeOld.width;
        } else {
            // y 方向上偏移量大
            s =  (sizeOld.height + size.height) / sizeOld.height;
        }
        
        if (sizeOld.height < 15 && sizeOld.width < 15 && s < 1) {
            return YES;
        }
        CGAffineTransform transform = CGAffineTransformIdentity;
        
        transform = CGAffineTransformScale(CGAffineTransformIdentity,s, s);
        [self.selectDrawData setTransform:transform];
        [self.selectDrawData doTrans];
        CGPoint p2 = [self getBounds].origin;
        SoulDrawData * pathTopLeft = (SoulDrawData *)self.dataArray[0];
        SoulDrawData * pathTopRight = (SoulDrawData *)self.dataArray[1];
        SoulDrawData * pathBottomLeft = (SoulDrawData *)self.dataArray[2];
        SoulDrawData * pathBottomRight = (SoulDrawData *)self.dataArray[3];
        CGPoint p0 = [pathTopRight getBounds].origin;
        CGFloat r = [pathTopRight getBounds].size.width / 2;
        
        CGPoint p3 = CGPointMake(p0.x + r - [self getBounds].size.width, p0.y + r);
        transform = CGAffineTransformTranslate(CGAffineTransformIdentity, p3.x - p2.x, p3.y - p2.y);
        [self.selectDrawData setTransform:transform];
        [self.selectDrawData doTrans];
//        self.selectDrawData.lineWidth *=s;
        [pathTopLeft moveBySize:CGSizeMake(-sizeOld.width, 0) scale:s];
        [pathBottomRight moveBySize:CGSizeMake(0, sizeOld.height) scale:s];
        [pathBottomLeft moveBySize:CGSizeMake(-sizeOld.width, sizeOld.height) scale:s];
        return YES;
    }
    
    // 右上脚
    if (changeType == SoulDrawDataChangeTypeTopRight) {
        CGSize sizeOld = [self getBounds].size;
        CGFloat s = 1;
        if (fabs(size.width) > fabs(size.height)) {
            // x 方向偏移量大
            s =  (sizeOld.width + size.width) / sizeOld.width;
        } else {
            // y 方向上偏移量大
            s =  (sizeOld.height - size.height) / sizeOld.height;
        }
        
        if (sizeOld.height < 15 && sizeOld.width < 15 && s < 1) {
            return YES;
        }
        CGAffineTransform transform = CGAffineTransformIdentity;
        
        transform = CGAffineTransformScale(CGAffineTransformIdentity,s, s);
        [self.selectDrawData setTransform:transform];
        [self.selectDrawData doTrans];
        CGPoint p2 = [self getBounds].origin;
        SoulDrawData * pathTopLeft = (SoulDrawData *)self.dataArray[0];
        SoulDrawData * pathTopRight = (SoulDrawData *)self.dataArray[1];
        SoulDrawData * pathBottomLeft = (SoulDrawData *)self.dataArray[2];
        SoulDrawData * pathBottomRight = (SoulDrawData *)self.dataArray[3];
        CGPoint p0 = [pathBottomLeft getBounds].origin;
        CGFloat r = [pathBottomLeft getBounds].size.width / 2;
        
        CGPoint p3 = CGPointMake(p0.x + r, p0.y + r  - [self getBounds].size.height);
        transform = CGAffineTransformTranslate(CGAffineTransformIdentity,p3.x - p2.x,p3.y - p2.y);
        [self.selectDrawData setTransform:transform];
        [self.selectDrawData doTrans];
//        self.selectDrawData.lineWidth *=s;
        [pathBottomRight moveBySize:CGSizeMake(sizeOld.width, 0) scale:s];
        [pathTopLeft moveBySize:CGSizeMake(0, -sizeOld.height) scale:s];
        [pathTopRight moveBySize:CGSizeMake(sizeOld.width, -sizeOld.height) scale:s];
        return YES;
    }
    
    // 左上脚
    if (changeType == SoulDrawDataChangeTypeTopLeft) {
        CGSize sizeOld = [self getBounds].size;
        CGFloat s = 1;
        if (fabs(size.width) > fabs(size.height)) {
            // x 方向偏移量大
            s =  (sizeOld.width - size.width) / sizeOld.width;
        } else {
            // y 方向上偏移量大
            s =  (sizeOld.height - size.height) / sizeOld.height;
        }

        if (sizeOld.height < 15 && sizeOld.width < 15 && s < 1) {
            return YES;
        }        CGAffineTransform transform = CGAffineTransformIdentity;
        
        transform = CGAffineTransformScale(CGAffineTransformIdentity,s, s);
        [self.selectDrawData setTransform:transform];
        [self.selectDrawData doTrans];
        CGPoint p2 = [self getBounds].origin;
        SoulDrawData * pathTopLeft = (SoulDrawData *)self.dataArray[0];
        SoulDrawData * pathTopRight = (SoulDrawData *)self.dataArray[1];
        SoulDrawData * pathBottomLeft = (SoulDrawData *)self.dataArray[2];
        SoulDrawData * pathBottomRight = (SoulDrawData *)self.dataArray[3];
        CGPoint p0 = [pathBottomRight getBounds].origin;
        CGFloat r = [pathBottomRight getBounds].size.width / 2;
        
        CGPoint p3 = CGPointMake(p0.x + r - [self getBounds].size.width, p0.y + r - [self getBounds].size.height);
        transform = CGAffineTransformTranslate(CGAffineTransformIdentity,p3.x - p2.x,p3.y - p2.y);
        [self.selectDrawData setTransform:transform];
        [self.selectDrawData doTrans];
//        self.selectDrawData.lineWidth *=s;
        [pathBottomLeft moveBySize:CGSizeMake(-sizeOld.width, 0) scale:s];
        [pathTopRight moveBySize:CGSizeMake(0, -sizeOld.height) scale:s];
        [pathTopLeft moveBySize:CGSizeMake(-sizeOld.width, -sizeOld.height) scale:s];
        
        return YES;
    }
    
    // 右
    if (changeType == SoulDrawDataChangeTypeRight) {
        CGSize sizeOld = [self getBounds].size;
        CGFloat wOff = size.width;
        if([self getBounds].size.width + wOff < 20) {
            return YES;
        }
        SoulDrawDataText * dataText = (SoulDrawDataText*)self.selectDrawData;
        CGRect rcNew = CGRectMake([self getBounds].origin.x, [self getBounds].origin.y, [self getBounds].size.width + wOff,[self getBounds].size.height);
        CGSize newSize = [dataText calcSize:rcNew.size.width];
        rcNew = CGRectMake(rcNew.origin.x, rcNew.origin.y +(newSize.height / 2 - rcNew.size.height / 2), rcNew.size.width, newSize.height);
        self.frame = rcNew;
        
        CGFloat s =  (sizeOld.width + size.width) / sizeOld.width;
        SoulDrawData *right = (SoulDrawData *)self.dataArray[1];
        [right moveBySize:CGSizeMake(sizeOld.width, 0) scale:s];
        
        [self removeAllPoints];
        CGPoint origin = self.frame.origin;
        CGSize size = self.frame.size;
        dataText.size = size;
        CGPoint center = dataText.center;
        dataText.center = CGPointMake(center.x + wOff / 2, center.y);
        [self moveToPoint:CGPointMake(origin.x, origin.y)];
        [self addLineToPoint:CGPointMake(origin.x + size.width, origin.y)];
        [self addLineToPoint:CGPointMake(origin.x + size.width , origin.y + size.height)];
        [self addLineToPoint:CGPointMake(origin.x, origin.y + size.height)];
        [self addLineToPoint:CGPointMake(origin.x, origin.y)];
        return YES;
    }
    
    // 左
    if (changeType == SoulDrawDataChangeTypeLeft) {
        CGSize sizeOld = [self getBounds].size;
        CGFloat wOff = -size.width;
        if([self getBounds].size.width + wOff < 10) {
            return YES;
        }
        
        SoulDrawDataText * dataText = (SoulDrawDataText*)self.selectDrawData;
        CGRect rcNew = CGRectMake([self getBounds].origin.x, [self getBounds].origin.y, [self getBounds].size.width + wOff,[self getBounds].size.height);
        CGSize newSize = [dataText calcSize:rcNew.size.width];
        rcNew = CGRectMake(rcNew.origin.x, rcNew.origin.y +(newSize.height / 2 - rcNew.size.height / 2), rcNew.size.width, newSize.height);
        self.frame = rcNew;
        
        CGFloat s = (sizeOld.width + size.width) / sizeOld.width;
        
        SoulDrawData * pathLeft = (SoulDrawData *)self.dataArray[0];
        [pathLeft moveBySize:CGSizeMake(sizeOld.width, 0) scale:s];
        
        [self removeAllPoints];
        CGPoint origin = self.frame.origin;
        CGSize size = self.frame.size;
        dataText.size = size;
        CGPoint center = dataText.center;
        dataText.center = CGPointMake(center.x - wOff / 2, center.y);
        [self moveToPoint:CGPointMake(origin.x, origin.y)];
        [self addLineToPoint:CGPointMake(origin.x + size.width, origin.y)];
        [self addLineToPoint:CGPointMake(origin.x + size.width , origin.y + size.height)];
        [self addLineToPoint:CGPointMake(origin.x, origin.y + size.height)];
        [self addLineToPoint:CGPointMake(origin.x, origin.y)];
        return YES;
    }
    return YES;
}

- (void)setTrans:(CGSize)trans {
    [super setTrans: trans];
    for (SoulDrawData * item in self.dataArray) {
        [item setTrans:trans];
    }
    [self.selectDrawData setTrans:trans];
}
- (instancetype)initWithFrame:(CGRect)frame {
    self = [super init];
    _dataArray = [NSMutableArray array];
    CGPoint origin = frame.origin;
    CGSize size = frame.size;
    id<SoulDrawDataDelegate> pathTopLeft = [self buildCircle:CGPointMake(origin.x, origin.y) changeType:SoulDrawDataChangeTypeTopLeft];
    id<SoulDrawDataDelegate> pathTopRight = [self buildCircle:CGPointMake(origin.x + size.width, origin.y) changeType:SoulDrawDataChangeTypeTopRight];
    id<SoulDrawDataDelegate> pathBottomLeft = [self buildCircle:CGPointMake(origin.x, origin.y + size.height) changeType:SoulDrawDataChangeTypeBottomLeft];
    id<SoulDrawDataDelegate> pathBottomRight = [self buildCircle:CGPointMake(origin.x + size.width, origin.y + size.height) changeType:SoulDrawDataChangeTypeBottomRight];
    [self.dataArray addObject:pathTopLeft];
    [self.dataArray addObject:pathTopRight];
    [self.dataArray addObject:pathBottomLeft];
    [self.dataArray addObject:pathBottomRight];
    return self;
}

#pragma mark -- 绘制路径
- (void)draw {
//    CGContextRef context = UIGraphicsGetCurrentContext();
//    CGContextSaveGState(UIGraphicsGetCurrentContext());
//    [[UIColor whiteColor] setStroke];
//    [[UIColor colorWithRed:0x33/255.f green:0x7a/255.f blue:0xb7/255.f alpha:0.75f] setFill];
//
//    [self strokeWithBlendMode:kCGBlendModeNormal alpha:1.0];
//    [self stroke];
//    [self fill];
//    CGContextRestoreGState(context);
}
@end

@implementation SoulDrawDataSelectBezierPath
#pragma mark -- 绘制路径
- (void)draw {
    for (id<SoulDrawDataDelegate> item in self.dataArray) {
        [item draw];
    }
}
@end

@implementation SoulDrawDataSelectText

- (instancetype)initWithFrame:(CGRect)frame {
    self.frame = frame;
    self = [super init];
    if (self) {
        [self setup];
    }
    return self;
}

- (void) setup {
    if (self.dataArray.count) {
        return;
    }
    
    [self removeAllPoints];
    self.dataArray = [NSMutableArray array];
    CGPoint origin = self.frame.origin;
    CGSize size = self.frame.size;
    [self moveToPoint:CGPointMake(origin.x, origin.y)];
    [self addLineToPoint:CGPointMake(origin.x + size.width, origin.y)];
    [self addLineToPoint:CGPointMake(origin.x + size.width , origin.y + size.height)];
    [self addLineToPoint:CGPointMake(origin.x, origin.y + size.height)];
    [self addLineToPoint:CGPointMake(origin.x, origin.y)];
    
    id<SoulDrawDataDelegate> pathCenterLeft = [self buildCircle:CGPointMake(origin.x, origin.y + size.height / 2) changeType:SoulDrawDataChangeTypeLeft];
    id<SoulDrawDataDelegate> pathCenterRight = [self buildCircle:CGPointMake(origin.x + size.width, origin.y + size.height / 2) changeType:SoulDrawDataChangeTypeRight];
    [self.dataArray addObject:pathCenterLeft];
    [self.dataArray addObject:pathCenterRight];
}

- (void)setBEdit:(BOOL)bEdit {
    [super setBEdit:bEdit];
    [self.selectDrawData setBEdit:bEdit];
}

#pragma mark -- 绘制路径
- (void)draw {
    if (self.bEdit) {
        return;
    }
   [self setup];
//  NSLog(@"TextMoveCurrentPoint:%@", NSStringFromCGPoint(self.currentPoint));
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextSaveGState(UIGraphicsGetCurrentContext());
    [[UIColor whiteColor] setStroke];
    self.lineWidth = 1.0f;
    [self strokeWithBlendMode:kCGBlendModeNormal alpha:1.0];
    [self stroke];
  
    [self doTrans];
    CGContextRestoreGState(context);
    
    for (id<SoulDrawDataDelegate> item in self.dataArray) {
        [item draw];
    }
}

@end
