//
//  SecurityTool.m
//  SecurityTool
//
//  Created by soul on 15/12/10.
//  Copyright © 2015年 Yonyou Chaoke Network Technology Co., Ltd. All rights reserved.
//

#import "SecurityTool.h"
#import <CommonCrypto/CommonDigest.h>
#import <CommonCrypto/CommonHMAC.h>

@implementation SecurityTool

+ (NSString *)hmacsha1:(NSString *)data secret:(NSString *)key {
    
    const char *cKey  = [key cStringUsingEncoding:NSUTF8StringEncoding];
    const char *cData = [data cStringUsingEncoding:NSUTF8StringEncoding];
    
    unsigned char cHMAC[CC_SHA1_DIGEST_LENGTH];
    
    CCHmac(kCCHmacAlgSHA1, cKey, strlen(cKey), cData, strlen(cData), cHMAC);
    
  return [self.class  chars2String:cHMAC length:CC_SHA1_DIGEST_LENGTH];
}
+(NSString*)chars2String:(const unsigned char*)cHMAC length:(NSUInteger)length {
    NSMutableString *ret = [NSMutableString stringWithCapacity:length];
    
    for(int i = 0; i<length; i++) {
        [ret appendFormat:@"%02X",cHMAC[i]];
    }
    return ret;
}
+ (NSString *)hmacsha256:(NSString *)data secret:(NSString *)key {
    
    const char *cKey  = [key cStringUsingEncoding:NSUTF8StringEncoding];
    const char *cData = [data cStringUsingEncoding:NSUTF8StringEncoding];
    
    unsigned char cHMAC[CC_SHA256_DIGEST_LENGTH];
    
    CCHmac(kCCHmacAlgSHA256, cKey, strlen(cKey), cData, strlen(cData), cHMAC);
    return [self.class  chars2String:cHMAC length:CC_SHA256_DIGEST_LENGTH];
    
}
+ (NSString *)hmacsha512:(NSString *)data secret:(NSString *)key {
  
  const char *cKey  = [key cStringUsingEncoding:NSUTF8StringEncoding];
  const char *cData = [data cStringUsingEncoding:NSUTF8StringEncoding];
  
  unsigned char cHMAC[CC_SHA512_DIGEST_LENGTH];
  
  CCHmac(kCCHmacAlgSHA512, cKey, strlen(cKey), cData, strlen(cData), cHMAC);
  return [self.class  chars2String:cHMAC length:CC_SHA512_DIGEST_LENGTH];
  
}
+ (NSString*)sha512:(NSString *)dataStr {
  const char *cData = [dataStr cStringUsingEncoding:NSUTF8StringEncoding];
  NSData *data = [NSData dataWithBytes:cData length:dataStr.length];
  
  uint8_t digest[CC_SHA512_DIGEST_LENGTH];
  
  CC_SHA512(data.bytes, (CC_LONG)data.length, digest);
  return [self.class  chars2String:digest length:CC_SHA512_DIGEST_LENGTH];
}
+ (NSString*)addSlat:(NSString*)slat data:(NSString*)data {
    //    return data;
    if (!slat) {
        //@"abcdefghigklmnopqrstuvwxyz01234567890ABCDEFGHIJKLMNOPQRSTUVWXY~!@#$%^&*()_+`-=[]{}|?<>,.";
//#ifdef PRODUCT_DEBUG_LIB
//        slat = @"DEfg34567RSTLMNOPQ()_+`-=[]stuvUVWXY~!@#$a%^&*8{higklmnFGHIJKbcd}|?<>,.eopqr90ABCwxyz012";
//#else
        slat = @"Da%^&*8{higklmnHIJKbcd}|?<>,.eopqr90ABCwxyz01Efg34567RSTLMNOPQ()_+`-=[]stuvUVWXY~!@#$2FG";
//#endif
    }
    return [data stringByAppendingString:slat];
}

+ (NSString *)ccMD5:(NSString *)data{
    
    //    const char *cKey  = [key cStringUsingEncoding:NSASCIIStringEncoding];
    const char *cData = [data cStringUsingEncoding:NSUTF8StringEncoding];
    
    unsigned char cHMAC[CC_MD5_DIGEST_LENGTH];
    CC_MD5(cData, (uint)strlen(cData), cHMAC);
    //    CCHmac(kCCHmacAlgMD5, cKey, strlen(cKey), cData, strlen(cData), cHMAC);
    return [self.class  chars2String:cHMAC length:CC_MD5_DIGEST_LENGTH];
    
}
+(NSString*) encrypt:(NSString*)data key:(NSString*)key salt:(NSString*)salt {
    NSString * ss = [self addSlat:salt data:data];
    NSString * sn = key;
    if (sn && sn.length > 0) {
        ss = [ss stringByAppendingString:sn];
    }
    //    DNSLog(@"%@",ss);
    return [self ccMD5:ss];
}
+ (void)parameterVarification:(NSMutableDictionary*)parameterDic key:(NSString*)key  salt:(NSString*)salt {
    NSString * t = [NSString stringWithFormat:@"%.0f",[NSDate date].timeIntervalSince1970*1000.0f];
    [parameterDic setObject:t forKey:@"et"];
    NSArray * sortedArray = [parameterDic.allKeys sortedArrayUsingComparator:^NSComparisonResult(id  _Nonnull obj1, id  _Nonnull obj2) {
        NSString * s1 = obj1;
        NSString * s2 = obj2;
        return [s1 compare:s2];
    }];
    NSMutableArray * paramererArray = [NSMutableArray array];
    for (NSString * key in sortedArray) {
        if ([key componentsSeparatedByString:@"["].count > 1) {
            continue;
        }
        [paramererArray addObject:[NSString stringWithFormat:@"%@=%@",key, [parameterDic objectForKey:key]]];
    }
    NSString * pv = [paramererArray componentsJoinedByString:@""];
    
    NSString * ek = [self encrypt:pv key:key salt:salt];
//    DNSLog(@"%@\n%@",pv,ek);
    [parameterDic setObject:[ek lowercaseString] forKey:@"ek"];
}

+ (NSString *)substring:(NSString*)str fromIndex:(NSUInteger)index length:(NSUInteger)len {
  return [str substringWithRange:NSMakeRange(index, len)];
}
+ (NSString* )encryptByTs:(NSString* __nonnull)ts
                     salt:(NSString* __nullable)salt {
//  测试数据
//  ts = @"asefddeee111sss2233333";
//  salt = @"DEfg34567RSTLMNOPQ()_+`-=[]stuvUVWXY~!@#$a%^&*8{higklmnFGHIJKbcd}|?<>,.eopqr90ABCwxyz012";
  NSString * data = [self addSlat:salt data:@""];
  NSString * dataSha512 = [self sha512:data];
  if (dataSha512.length != CC_SHA512_BLOCK_BYTES) {
    return @"";
  }
  NSString * ret = [NSString stringWithFormat:@"%@%@%@%@", [self substring:dataSha512  fromIndex: 110 length:12], [self substring:dataSha512  fromIndex: 5 length:10], ts, [self substring:dataSha512  fromIndex: 50 length:10]];
  
//  NSLog(@"结果比对1：%@,%@", [ret lowercaseString], @"8e538ad6248bb544e311b5asefddeee111sss223333338667d7eb7");
  NSString * md5Ret = [[self ccMD5:[ret lowercaseString]] lowercaseString];
//  NSLog(@"结果比对2：%@,%@", md5Ret, @"e28d35a9ddc72009b9c7fe856c9d884c");
  return md5Ret;
//  服务器端算法
//   $ek = 'asefddeee111sss2233333'; // 原ek参数
//   $salt = 'DEfg34567RSTLMNOPQ()_+`-=[]stuvUVWXY~!@#$a%^&*8{higklmnFGHIJKbcd}|?<>,.eopqr90ABCwxyz012'; // 客户端固定盐: 同原ek加密所使用的固定盐,线上和本地不一样。
//   $enstr = openssl_digest($salt, 'sha512'); // openssl sha512加密串128位
//   $len = strlen($enstr);
//   echo "\nssl.encode: ".$enstr."\n";
//   echo "len:".$len."\n";
//   echo "source: ".substr($enstr, 110, 12). " ". substr($enstr, 5, 10). " ". $ek. " ". substr($enstr, 50, 10)."\n"; // 序号: [110,121][5,14]ek[50,59]
//   $es = md5(substr($enstr, 110, 12).substr($enstr, 5, 10).$ek.substr($enstr, 50, 10)); // 序号([110,121][5,14]ek[50,59])串, md5
//   echo "\nresult: ".$es,"\n";
//   
//   /**
//   ssl.encode: 8f8e0b544e311b5306a21f51d3ab51d290a6ea3f4a2d075b4638667d7eb70c03e3fa4239733a940a9e3f46605eb1b8dc2b17f74a3cf3188e538ad6248b4b8a03
//   len:128
//   source: 8e538ad6248b b544e311b5 asefddeee111sss2233333 38667d7eb7
//   result: e28d35a9ddc72009b9c7fe856c9d884c
//   */
  
}
@end
