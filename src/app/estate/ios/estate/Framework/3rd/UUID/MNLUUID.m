//
//  MNLUUID.m
//  meinvli8
//
//  Created by soul on 14-6-6.
//  Copyright (c) 2017年 soul. All rights reserved.
//
#import <sys/socket.h> // Per msqr
#import <sys/sysctl.h>
#import <net/if.h>
#import <net/if_dl.h>
#import <AdSupport/AdSupport.h>
#import "MNLUUID.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/ioctl.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#include <arpa/inet.h>
#include <sys/sockio.h>
#include <net/if.h>
#include <errno.h>
#include <arpa/inet.h>
#include <netdb.h>
#include <ifaddrs.h>
#import <dlfcn.h>
#import <SystemConfiguration/SystemConfiguration.h>
#include <net/ethernet.h>
#import <UIKit/UIKit.h>

#define min(a,b)    ((a) < (b) ? (a) : (b))
#define max(a,b)    ((a) > (b) ? (a) : (b))

#define BUFFERSIZE  4000
#define MAXADDRS 256
char *if_names[MAXADDRS];
char *ip_names[MAXADDRS];
char *hw_addrs[MAXADDRS];
unsigned long ip_addrs[MAXADDRS];

static int   nextAddr = 0;

void InitAddresses()
{
    int i;
    for (i=0; i<MAXADDRS; ++i)
    {
        if_names[i] = ip_names[i] = hw_addrs[i] = NULL;
        ip_addrs[i] = 0;
    }
}

void FreeAddresses()
{
    int i;
    for (i=0; i<MAXADDRS; ++i)
    {
        if (if_names[i] != 0) free(if_names[i]);
        if (ip_names[i] != 0) free(ip_names[i]);
        if (hw_addrs[i] != 0) free(hw_addrs[i]);
        ip_addrs[i] = 0;
    }
    InitAddresses();
}

void GetIPAddresses()
{
    int                 i, len, flags;
    char                buffer[BUFFERSIZE], *ptr, lastname[IFNAMSIZ], *cptr;
    struct ifconf       ifc;
    struct ifreq        *ifr, ifrcopy;
    struct sockaddr_in  *sin;
    
    char temp[80];
    
    int sockfd;
    
    for (i=0; i<MAXADDRS; ++i)
    {
        if_names[i] = ip_names[i] = NULL;
        ip_addrs[i] = 0;
    }
    
    sockfd = socket(AF_INET, SOCK_DGRAM, 0);
    if (sockfd < 0)
    {
        perror("socket failed");
        return;
    }
    
    ifc.ifc_len = BUFFERSIZE;
    ifc.ifc_buf = buffer;
    
    if (ioctl(sockfd, SIOCGIFCONF, &ifc) < 0)
    {
        perror("ioctl error");
        return;
    }
    
    lastname[0] = 0;
    
    for (ptr = buffer; ptr < buffer + ifc.ifc_len; )
    {
        ifr = (struct ifreq *)ptr;
        len = max(sizeof(struct sockaddr), ifr->ifr_addr.sa_len);
        ptr += sizeof(ifr->ifr_name) + len;  // for next one in buffer
        
        if (ifr->ifr_addr.sa_family != AF_INET)
        {
            continue;   // ignore if not desired address family
        }
        
        if ((cptr = (char *)strchr(ifr->ifr_name, ':')) != NULL)
        {
            *cptr = 0;      // replace colon will null
        }
        
        if (strncmp(lastname, ifr->ifr_name, IFNAMSIZ) == 0)
        {
            continue;   /* already processed this interface */
        }
        
        memcpy(lastname, ifr->ifr_name, IFNAMSIZ);
        
        ifrcopy = *ifr;
        ioctl(sockfd, SIOCGIFFLAGS, &ifrcopy);
        flags = ifrcopy.ifr_flags;
        if ((flags & IFF_UP) == 0)
        {
            continue;   // ignore if interface not up
        }
        
        if_names[nextAddr] = (char *)malloc(strlen(ifr->ifr_name)+1);
        if (if_names[nextAddr] == NULL)
        {
            return;
        }
        strcpy(if_names[nextAddr], ifr->ifr_name);
        
        sin = (struct sockaddr_in *)&ifr->ifr_addr;
        strcpy(temp, inet_ntoa(sin->sin_addr));
        
        ip_names[nextAddr] = (char *)malloc(strlen(temp)+1);
        if (ip_names[nextAddr] == NULL)
        {
            return;
        }
        strcpy(ip_names[nextAddr], temp);
        
        ip_addrs[nextAddr] = sin->sin_addr.s_addr;
        
        ++nextAddr;
    }
    
    close(sockfd);
}

void GetHWAddresses()
{
    struct ifconf ifc;
    struct ifreq *ifr;
    int i, sockfd;
    char buffer[BUFFERSIZE], *cp, *cplim;
    char temp[80];
    
    for (i=0; i<MAXADDRS; ++i)
    {
        hw_addrs[i] = NULL;
    }
    
    sockfd = socket(AF_INET, SOCK_DGRAM, 0);
    if (sockfd < 0)
    {
        perror("socket failed");
        return;
    }
    
    ifc.ifc_len = BUFFERSIZE;
    ifc.ifc_buf = buffer;
    
    if (ioctl(sockfd, SIOCGIFCONF, (char *)&ifc) < 0)
    {
        perror("ioctl error");
        close(sockfd);
        return;
    }
    
//    ifr = ifc.ifc_req;
    
    cplim = buffer + ifc.ifc_len;
    
    for (cp=buffer; cp < cplim; )
    {
        ifr = (struct ifreq *)cp;
        if (ifr->ifr_addr.sa_family == AF_LINK)
        {
            struct sockaddr_dl *sdl = (struct sockaddr_dl *)&ifr->ifr_addr;
            int a,b,c,d,e,f;
            int i;
            
            strcpy(temp, (char *)ether_ntoa((void *)LLADDR(sdl)));
            sscanf(temp, "%x:%x:%x:%x:%x:%x", &a, &b, &c, &d, &e, &f);
            sprintf(temp, "%02X:%02X:%02X:%02X:%02X:%02X",a,b,c,d,e,f);
            
            for (i=0; i<MAXADDRS; ++i)
            {
                if ((if_names[i] != NULL) && (strcmp(ifr->ifr_name, if_names[i]) == 0))
                {
                    if (hw_addrs[i] == NULL)
                    {
                        hw_addrs[i] = (char *)malloc(strlen(temp)+1);
                        strcpy(hw_addrs[i], temp);
                        break;
                    }
                }
            }
        }
        cp += sizeof(ifr->ifr_name) + max(sizeof(ifr->ifr_addr), ifr->ifr_addr.sa_len);
    }
    
    close(sockfd);
}
@implementation MNLUUID
- (NSString *) whatismyipdotcom
{
    NSError *error;
    NSURL *ipURL = [NSURL URLWithString:@"http://www.whatismyip.com/automation/n09230945.asp"];
    NSString *ip = [NSString stringWithContentsOfURL:ipURL encoding:1 error:&error];
    return ip ? ip : [error localizedDescription];
}
+ (NSString *) localWiFiIPAddress
{
    BOOL success;
    struct ifaddrs * addrs;
    const struct ifaddrs * cursor;
    
    success = getifaddrs(&addrs) == 0;
    if (success) {
        cursor = addrs;
        while (cursor != NULL) {
            // the second test keeps from picking up the loopback address
            if (cursor->ifa_addr->sa_family == AF_INET && (cursor->ifa_flags & IFF_LOOPBACK) == 0)
            {
                NSString *name = [NSString stringWithUTF8String:cursor->ifa_name];
                if ([name isEqualToString:@"en0"])  // Wi-Fi adapter
                    return [NSString stringWithUTF8String:inet_ntoa(((struct sockaddr_in *)cursor->ifa_addr)->sin_addr)];
            }
            cursor = cursor->ifa_next;
        }
        freeifaddrs(addrs);
    }
    return nil;
}
// 1.open uuid
// 2.mac address
#pragma mark MAC addy
//Return the local MAC addy
//Courtesy of FreeBSD hackers email list
//Accidentally munged during previous update. Fixed thanks to mlamb.
+ (NSString *) macaddress{
    
    int                 mib[6];
    size_t              len;
    char                *buf;
    unsigned char       *ptr;
    struct if_msghdr    *ifm;
    struct sockaddr_dl  *sdl;
    
    mib[0] = CTL_NET;
    mib[1] = AF_ROUTE;
    mib[2] = 0;
    mib[3] = AF_LINK;
    mib[4] = NET_RT_IFLIST;
    
    if ((mib[5] = if_nametoindex("en0")) == 0) {
        printf("Error: if_nametoindex errorn");
        return NULL;
    }
    
    if (sysctl(mib, 6, NULL, &len, NULL, 0) < 0) {
        printf("Error: sysctl, take 1n");
        return NULL;
    }
    
    if ((buf = malloc(len)) == NULL) {
        printf("Could not allocate memory. error!n");
        return NULL;
    }
    
    if (sysctl(mib, 6, buf, &len, NULL, 0) < 0) {
        printf("Error: sysctl, take 2");
        free(buf);
        return NULL;
    }
    
    ifm = (struct if_msghdr *)buf;
    sdl = (struct sockaddr_dl *)(ifm + 1);
    ptr = (unsigned char *)LLADDR(sdl);
    NSString *outstring = [NSString stringWithFormat:@"%X:%X:%X:%X:%X:%X",
                           *ptr, *(ptr+1), *(ptr+2), *(ptr+3), *(ptr+4), *(ptr+5)];
    free(buf);
    
    return outstring;
}
+ (NSString *)getMacAddress
{
    int                 mgmtInfoBase[6];
    char                *msgBuffer = NULL;
    size_t              length;
    unsigned char       macAddress[6];
    struct if_msghdr    *interfaceMsgStruct;
    struct sockaddr_dl  *socketStruct;
    NSString            *errorFlag = NULL;
    
    // Setup the management Information Base (mib)
    mgmtInfoBase[0] = CTL_NET;        // Request network subsystem
    mgmtInfoBase[1] = AF_ROUTE;       // Routing table info
    mgmtInfoBase[2] = 0;
    mgmtInfoBase[3] = AF_LINK;        // Request link layer information
    mgmtInfoBase[4] = NET_RT_IFLIST;  // Request all configured interfaces
    
    // With all configured interfaces requested, get handle index
    if ((mgmtInfoBase[5] = if_nametoindex("en0")) == 0)
        errorFlag = @"if_nametoindex failure";
    else
    {
        // Get the size of the data available (store in len)
        if (sysctl(mgmtInfoBase, 6, NULL, &length, NULL, 0) < 0)
            errorFlag = @"sysctl mgmtInfoBase failure";
        else
        {
            // Alloc memory based on above call
            if ((msgBuffer = malloc(length)) == NULL)
                errorFlag = @"buffer allocation failure";
            else
            {
                // Get system information, store in buffer
                if (sysctl(mgmtInfoBase, 6, msgBuffer, &length, NULL, 0) < 0)
                    errorFlag = @"sysctl msgBuffer failure";
            }
        }
    }
    
    // Befor going any further...
    if (errorFlag != NULL)
    {
        free(msgBuffer);
        NSLog(@"Error: %@", errorFlag);
        return errorFlag;
    }
    
    // Map msgbuffer to interface message structure
    interfaceMsgStruct = (struct if_msghdr *) msgBuffer;
    
    // Map to link-level socket structure
    socketStruct = (struct sockaddr_dl *) (interfaceMsgStruct + 1);
    if (socketStruct) {
        // Copy link layer address data in socket structure to an array
        memcpy(&macAddress, socketStruct->sdl_data + socketStruct->sdl_nlen, 6);
        
        // Read from char array into a string object, into traditional Mac address format
        NSString *macAddressString = [NSString stringWithFormat:@"%X:%X:%X:%X:%X:%X",
                                      macAddress[0], macAddress[1], macAddress[2],
                                      macAddress[3], macAddress[4], macAddress[5]];
        NSLog(@"Mac Address: %@", macAddressString);
        free(msgBuffer);
         return macAddressString;
    }
    
    // Release the buffer memory
    free(msgBuffer);
    
    return @"";
}
// 3.IDFA
+(NSString*)IDFA{
    return [self.class uuid];
    
}

// 5.PUSH ID
// 6.device model
+(NSString*)model{
    return [[UIDevice currentDevice] model];
}
+(NSString*)systemName{
    return [[UIDevice currentDevice] systemName];
}
+(NSString*)systemVersion{
    return [[UIDevice currentDevice] systemVersion];
}
// 7.vender(bound id)
#define IOS_VERSION_6 (([[[UIDevice currentDevice] systemVersion] floatValue] >= 6.0)? (YES):(NO))
+(NSString*)vender{
    if (IOS_VERSION_6) {
        return [[[UIDevice currentDevice] identifierForVendor] UUIDString];
    }
    return [self.class uuid];
}
// 8.system version
// 9.uuid
+(NSString*)uuid{
    
    CFUUIDRef puuid = CFUUIDCreate(nil);
    CFStringRef uuidString = CFUUIDCreateString(nil, puuid);
    NSString * result = (NSString *)CFBridgingRelease(CFStringCreateCopy(NULL, uuidString));
    CFRelease(puuid);
    CFRelease(uuidString);
    return result;
}

+ (NSString *) platform{
    
    size_t size;
    
    sysctlbyname("hw.machine", NULL, &size, NULL, 0);
    
    char *machine = malloc(size);
    
    sysctlbyname("hw.machine", machine, &size, NULL, 0);
    
    NSString *platform = [NSString stringWithCString:machine encoding:NSUTF8StringEncoding];
    
    free(machine);
    
    return platform;
    
}


+ (NSString *) platformString {
  NSString *platform = [self platform];
  return [self.class platformStringInner:platform];
}

+ (NSString *) platformStringInner:(NSString*)platform {
  
  if ([platform isEqualToString:@"iPod1,1"])      return @"iPod Touch 1G";
  
  if ([platform isEqualToString:@"iPod2,1"])      return @"iPod Touch 2G";
  
  if ([platform isEqualToString:@"iPod3,1"])      return @"iPod Touch 3G";
  
  if ([platform isEqualToString:@"iPod4,1"])      return @"iPod Touch 4G";
  
  if ([platform isEqualToString:@"iPad1,1"])      return @"iPad";
  
  if ([platform isEqualToString:@"i386"] || [platform isEqualToString:@"x86_64"])         return @"iPhone Simulator";
  
  if ([platform isEqualToString:@"iPhone1,1"]) return @"iPhone 2G";
  if ([platform isEqualToString:@"iPhone1,2"]) return @"iPhone 3G";
  if ([platform isEqualToString:@"iPhone2,1"]) return @"iPhone 3GS";
  if ([platform isEqualToString:@"iPhone3,1"]) return @"iPhone 4";
  if ([platform isEqualToString:@"iPhone3,2"]) return @"iPhone 4";
  if ([platform isEqualToString:@"iPhone3,3"]) return @"iPhone 4";
  if ([platform isEqualToString:@"iPhone4,1"]) return @"iPhone 4S";
  if ([platform isEqualToString:@"iPhone5,1"]) return @"iPhone 5";
  if ([platform isEqualToString:@"iPhone5,2"]) return @"iPhone 5";
  if ([platform isEqualToString:@"iPhone5,3"]) return @"iPhone 5c";
  if ([platform isEqualToString:@"iPhone5,4"]) return @"iPhone 5c";
  if ([platform isEqualToString:@"iPhone6,1"]) return @"iPhone 5s";
  if ([platform isEqualToString:@"iPhone6,2"]) return @"iPhone 5s";
  if ([platform isEqualToString:@"iPhone7,1"]) return @"iPhone 6 Plus";
  if ([platform isEqualToString:@"iPhone7,2"]) return @"iPhone 6";
  if ([platform isEqualToString:@"iPhone8,1"]) return @"iPhone 6S";
  if ([platform isEqualToString:@"iPhone8,2"]) return @"iPhone 6S Plus";
  if ([platform isEqualToString:@"iPhone8,4"]) return @"iPhone 5SE";
  return platform;
}

@end

/*
 苹果设备 iphone,ipad,itouch
 
 这些移动设备都可以叫手持移动设备，作为一个app开发者，或者是一个app广告推广者，都想知道我的app,我推广的advisement有多少设备安装和使用了。
 
 这就引出了想要知道这个设备的唯一标识，app是安装在设备上的，所以准确定位设备变成的很重要的需求。
 
 因为没开发过 ios4之前的app,所以这里讨论的年代最早从ios4开始。
 
 先介绍唯一标识界的老大哥。
 
 网卡MAC地址
 
 0A-FC-A0-00-FD-8A
 这种12位英数字标识代表了一块网卡的物理地址，在网络通讯层它有现实的意义，保证每个发包能准确的发送到对应的网卡上。
 
 对于安装了网卡的设备来说也唯一标识了这个设备，它是最容易被想到来做唯一标识的数据。当然在android山寨手机上同一批次的手机用了同一个mac地址的也大大存在，但是针对ios系统来说 MAC 无疑是牢靠的，谁叫只有苹果一家出苹果呢。:) — 阉割版 就是没有wifi模块的3gs 没wifi 网卡，取不到MAC很正常
 
 很可惜在ios 7中 ，它将会获取不到，或者获取错误的为 02-00-00-00-00-00, 具体的可以参看 ios7的更新说明。
 
 ios4 ~ ios6
 
 设备唯一标识
 
 [[UIDevice currentDevice] uniqueIdentifier]
 很熟悉的使用方式，也是最准确的，这个参数返回32位的英数字作为设备的唯一标识，不管你的设备是重装系统了，还是越狱了，不管是抹掉数据了，还是不小心摔了，返回的都是牢靠的一个唯一标识 不和任何其他苹果设备的标识重复。
 
 但是，但是，但是因为它太牢靠了，有人告诉苹果，这个标识泄露了个人隐私，因为它太精准定位了。
 
 所以，所以，所以它被苹果废了。从ios5开始，就废了，当然它最终的被苹果kill掉和拒绝上架，是在 2013年初的申明中，实际操作是在2013年4月开始，所有调用了这个API的APP都无法上架。
 
 ios2~ ios4
 
 OPENUDID
 
 在苹果废掉了 uniqueIdentifier之后，聪明的开发者用自己的聪明才智开发了类uniqueIdentifier的库，它叫 OpenUDID,不赘述了，它的性能几乎和前辈 uniqueIdentifier一致，之所以说是几乎，是因为，如果你重装os,恢复出厂设置等等操作之后，这个值它会变化。
 
 ios2 ~ ios7
 
 双生侠IDFA & IDFV
 
 在黑暗的只能使用mac和openudid的 ios5过去之后，苹果终于良心发现，它发现不行，如果没有了 uniqueIdentifier好多事情都很不方便。
 
 所以他重新申明了2个API.
 
 IDFA
 
 对所有的开发者供应商，它都返回同一个值，但是它有openudid同样的缺点，它可能会变。
 
 参考使用：ASIdentifierManager/advertisingIdentifier
 
 IDFV
 
 对同一个开发者供应商开发的所有APPs,它返回的是同一个值。 如果是另外一个开发商的APP中去取这个值返回的是另外一个值。
 
 参考使用：UIDevice/identifierForVendor
 
 ios6 ~ ios7
 */
