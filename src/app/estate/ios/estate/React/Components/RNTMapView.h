//
//  RNTMapView.h
//  estate
//
//  Created by glodon on 2018/3/20.
//  Copyright © 2018年 Glodon. All rights reserved.
//

// RNTMapView.h

#import <MapKit/MapKit.h>

#import <React/RCTComponent.h>

@interface RNTMapView: MKMapView

@property (nonatomic, copy) RCTBubblingEventBlock onRegionChange;

@end

