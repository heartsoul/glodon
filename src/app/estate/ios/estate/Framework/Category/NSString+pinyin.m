//
//  NSString+pinyin.m
//  tesn
//
//  Created by soul on 14-10-10.
//  Copyright (c) 2017年 soul. All rights reserved.
//

#import "NSString+pinyin.h"
#import "pinyin.h"
@implementation NSString (pinyin)

// 获取拼音
+ (ChineseString *)chineseString:(NSString*)chinese {
    if (chinese) {
        ChineseString *chineseString = [[ChineseString alloc] init];
        
        //如果是英语
        if ([chinese canBeConvertedToEncoding:NSASCIIStringEncoding]) {
            chineseString.string = [NSString stringWithString:chinese];
        }else {
            //汉子转拼音 CFStringTransform 有空格，如：中国 zhong guo
            NSMutableString *source = [chinese mutableCopy];
            CFStringTransform((__bridge CFMutableStringRef)source, NULL, kCFStringTransformMandarinLatin, NO);
            CFStringTransform((__bridge CFMutableStringRef)source, NULL, kCFStringTransformStripDiacritics, NO);
            NSString *str=[NSString stringWithFormat:@"%@",source];
            NSString *disSpace = [str stringByReplacingOccurrencesOfString:@" " withString:@""];
            chineseString.string = disSpace;
            
        }
        
        if(chineseString.string == nil){
            chineseString.string = @"";
        }
        if(![chineseString.string isEqualToString:@""]){
            NSString *pinYinResult = [NSString string];
            for(int j = 0; j < chineseString.string.length; j++){
                NSString *singlePinyinLetter = [[NSString stringWithFormat:@"%c",pinyinFirstLetter([chineseString.string characterAtIndex:j])]uppercaseString];
                
                //获取首字母大写
                if (j==0) {
                    
                    if ([[self class] isNormalLetter:singlePinyinLetter]) {
                        chineseString.shortLetter = singlePinyinLetter;
                    }else {
                        chineseString.shortLetter = @"#";
                    }
                    
                }
                
                pinYinResult = [pinYinResult stringByAppendingString:singlePinyinLetter];
            }
            chineseString.pinYin = pinYinResult;
        }else{
            chineseString.pinYin = @"";
        }
        return chineseString;
    } else {
        ChineseString *chineseString = [[ChineseString alloc] init];
        chineseString.string = @"";
        return chineseString;
    }
}

+ (BOOL)isNormalLetter:(NSString *)letter
{
    NSArray *letterArr = @[@"A",@"B",@"C",@"D",@"E",@"F",@"G",@"H",@"I",@"G",
                           @"K",@"L",@"M",@"N",@"O",@"P",@"Q",@"R",@"S",@"T",
                           @"U",@"V",@"W",@"X",@"Y",@"Z"];
    
    if ([letterArr containsObject:letter]) {
        return YES;
    }
    
    return NO;
}

@end
