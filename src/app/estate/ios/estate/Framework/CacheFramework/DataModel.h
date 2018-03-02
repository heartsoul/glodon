//
//  DataModel.h
//  NetFramework
//
//  Created by banwj on 16/6/1.
//  Copyright © 2017年 soul. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface DataModel : NSObject
@property(nonatomic, strong) NSData *data;
@property(nonatomic, strong) NSString *name;
@end
@interface FileDataModel : DataModel
@property(nonatomic, strong) NSString *fileName;
@property(nonatomic, strong) NSString *mimeType;
@end
