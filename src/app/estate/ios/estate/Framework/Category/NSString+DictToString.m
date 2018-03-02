//
//  NSString+DictToString.m
//  tesn
//
//  Created by 123 on 15/7/27.
//
//

#import "NSString+DictToString.h"

@implementation NSString (DictToString)
+ (NSString*)dictionaryToJson:(NSDictionary *)dic

{
    
    NSError *parseError = nil;
    
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:dic options:NSJSONWritingPrettyPrinted error:&parseError];
    
    return [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    
}
@end
