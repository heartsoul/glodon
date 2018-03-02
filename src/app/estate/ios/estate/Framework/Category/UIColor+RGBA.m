//
//  UIColor+RGBA.m
//  meinvli8
//
//  Created by soul on 14-4-3.
//  Copyright (c) 2017年 soul. All rights reserved.
//

#import "UIColor+RGBA.h"

@implementation UIColor (RGBA)
CGFloat covert(CGFloat data) {
    return data / 255.0f;
}
+ (UIColor *)colorWith255Red:(CGFloat)red green:(CGFloat)green blue:(CGFloat)blue alpha:(CGFloat)alpha {
    red = covert(red);
    green = covert(green);
    blue = covert(blue);
    return [UIColor colorWithRed:red green:green blue:blue alpha:alpha];
}
+ (UIColor *)colorWith255White:(CGFloat)white alpha:(CGFloat)alpha {
    white = covert(white);
    return [UIColor colorWithWhite:white alpha:alpha];
}
+(UIColor *)colorWithHexStringToColor: (NSString *) hexColor
{
    NSString *cString = [[hexColor stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]] uppercaseString];
    // String should be 6 or 8 characters
    
  if ([cString length] < 6) return [UIColor clearColor];
  // strip 0X if it appears
  if ([cString hasPrefix:@"0X"]) cString = [cString substringFromIndex:2];
  if ([cString hasPrefix:@"#"]) cString = [cString substringFromIndex:1];
  if ([cString length] != 6) return [UIColor clearColor];
  
  // Separate into r, g, b substrings
  
    // Separate into r, g, b substrings
    
    NSRange range;
    range.location = 0;
    range.length = 2;
    NSString *rString = [cString substringWithRange:range];
    range.location = 2;
    NSString *gString = [cString substringWithRange:range];
    range.location = 4;
    NSString *bString = [cString substringWithRange:range];
    // Scan values
    unsigned int r, g, b;
    
    [[NSScanner scannerWithString:rString] scanHexInt:&r];
    [[NSScanner scannerWithString:gString] scanHexInt:&g];
    [[NSScanner scannerWithString:bString] scanHexInt:&b];
    
    return [UIColor colorWithRed:((float) r / 255.0f)
                           green:((float) g / 255.0f)
                            blue:((float) b / 255.0f)
                           alpha:1.0f];
}
@end
