//
//  UIColor+DarkAddition.m
//  tesn
//
//  Created by lsx on 15/9/23.
//
//
#import <UIKit/UIKit.h>

@implementation UIColor (DarkAddition)

- (BOOL)pc_isDarkColor
{
    CGFloat r, g, b, a;
    
    [self getRed:&r green:&g blue:&b alpha:&a];
    
    CGFloat lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    
    if ( lum < .5 )
    {
        return YES;
    }
    
    return NO;
}


- (BOOL)pc_isDistinct:(UIColor*)compareColor
{
    CGFloat r, g, b, a;
    CGFloat r1, g1, b1, a1;
    
    [self getRed:&r green:&g blue:&b alpha:&a];
    [compareColor getRed:&r1 green:&g1 blue:&b1 alpha:&a1];
    
    CGFloat threshold = .25; //.15
    
    if ( fabs(r - r1) > threshold ||
        fabs(g - g1) > threshold ||
        fabs(b - b1) > threshold ||
        fabs(a - a1) > threshold )
    {
        // check for grays, prevent multiple gray colors
        
        if ( fabs(r - g) < .03 && fabs(r - b) < .03 )
        {
            if ( fabs(r1 - g1) < .03 && fabs(r1 - b1) < .03 )
                return NO;
        }
        
        return YES;
    }
    
    return NO;
}


- (UIColor*)pc_colorWithMinimumSaturation:(CGFloat)minSaturation
{
    if ( self != nil )
    {
        CGFloat hue = 0.0;
        CGFloat saturation = 0.0;
        CGFloat brightness = 0.0;
        CGFloat alpha = 0.0;
        
        [self getHue:&hue saturation:&saturation brightness:&brightness alpha:&alpha];
        
        if ( saturation < minSaturation )
        {
            return [UIColor colorWithHue:hue saturation:saturation brightness:brightness alpha:alpha];
        }
    }
    
    return self;
}


- (BOOL)pc_isBlackOrWhite
{
    //	UIColor *tempColor = [self colorUsingColorSpaceName:NSCalibratedRGBColorSpace];
    
    if ( self != nil )
    {
        CGFloat r, g, b, a;
        
        [self getRed:&r green:&g blue:&b alpha:&a];
        
        if ( r > .91 && g > .91 && b > .91 )
            return YES; // white
        
        if ( r < .09 && g < .09 && b < .09 )
            return YES; // black
    }
    
    return NO;
}


- (BOOL)pc_isContrastingColor:(UIColor*)color
{
    if ( self != nil && color != nil )
    {
        CGFloat br, bg, bb, ba;
        CGFloat fr, fg, fb, fa;
        
        [self getRed:&br green:&bg blue:&bb alpha:&ba];
        [color getRed:&fr green:&fg blue:&fb alpha:&fa];
        
        CGFloat bLum = 0.2126 * br + 0.7152 * bg + 0.0722 * bb;
        CGFloat fLum = 0.2126 * fr + 0.7152 * fg + 0.0722 * fb;
        
        CGFloat contrast = 0.;
        
        if ( bLum > fLum )
            contrast = (bLum + 0.05) / (fLum + 0.05);
        else
            contrast = (fLum + 0.05) / (bLum + 0.05);
        
        //return contrast > 3.0; //3-4.5 W3C recommends 3:1 ratio, but that filters too many colors
        return contrast > 1.6;
    }
    
    return YES;
}


@end

