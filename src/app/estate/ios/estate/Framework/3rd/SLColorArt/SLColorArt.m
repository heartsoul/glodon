#import "SLColorArt.h"

#import "UIColor+DarkAddition.h"

#define kColorThresholdMinimumPercentage 0.01

UIColor* CGImageColorAtXY(CGImageRef image, NSInteger x, NSInteger y) {

    return [UIColor blackColor];
}

typedef struct gs_pixel {
    uint8_t a;
    uint8_t r;
    uint8_t g;
    uint8_t b;
} gs_pixel;

uint8_t gs_pixel_avg (gs_pixel * p) {
    int16_t a = (p->r + p->g + p->b)/3;
    //clip result to 0xFF to avoid wraparound
    return (uint8_t)(a > 0xFF)?0xFF:a;
}

UIColor *dataColorAtXY(const gs_pixel *imgData, int pixelsPerRow, int x, int y)
{
    gs_pixel pixel = imgData[y*pixelsPerRow + x];
    UIColor *color = [UIColor colorWithRed:pixel.r/255.f green:pixel.g/255.f blue:pixel.b/255.f alpha:pixel.a/255.f];
    return color;
}



@interface PCCountedColor : NSObject

@property (assign) NSUInteger count;
@property (strong) UIColor *color;

- (id)initWithColor:(UIColor *)color count:(NSUInteger)count;

@end



@interface SLColorArt ()

@property CGSize scaledSize;
@property(retain,readwrite) UIColor *backgroundColor;
@property(retain,readwrite) UIColor *primaryColor;
@property(retain,readwrite) UIColor *secondaryColor;
@property(retain,readwrite) UIColor *detailColor;
@property(strong) NSData *imgData;

@end

@implementation SLColorArt

// 新的快速算法，未验证
static void RGBtoHSV( float r, float g, float b, float *h, float *s, float *v )
{
    float min, max, delta;
    min = MIN( r, MIN( g, b ));
    max = MAX( r, MAX( g, b ));
    *v = max;               // v
    delta = max - min;
    if( max != 0 )
        *s = delta / max;       // s
    else {
        // r = g = b = 0        // s = 0, v is undefined
        *s = 0;
        *h = -1;
        return;
    }
    if( r == max )
        *h = ( g - b ) / delta;     // between yellow & magenta
    else if( g == max )
        *h = 2 + ( b - r ) / delta; // between cyan & yellow
    else
        *h = 4 + ( r - g ) / delta; // between magenta & cyan
    *h *= 60;               // degrees
    if( *h < 0 )
        *h += 360;
}

+(UIColor*)mostColor:(UIImage*)image{
    
    
#if __IPHONE_OS_VERSION_MAX_ALLOWED > __IPHONE_6_1
    int bitmapInfo = kCGBitmapByteOrderDefault | kCGImageAlphaPremultipliedLast;
#else
    int bitmapInfo = kCGImageAlphaPremultipliedLast;
#endif
    
    //第一步 先把图片缩小 加快计算速度. 但越小结果误差可能越大
    CGSize thumbSize=CGSizeMake(40, 40);
    
    CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
    CGContextRef context = CGBitmapContextCreate(NULL,
                                                 thumbSize.width,
                                                 thumbSize.height,
                                                 8,//bits per component
                                                 thumbSize.width*4,
                                                 colorSpace,
                                                 bitmapInfo);
    
    CGRect drawRect = CGRectMake(0, 0, thumbSize.width, thumbSize.height);
    CGContextDrawImage(context, drawRect, image.CGImage);
    CGColorSpaceRelease(colorSpace);
    
    
    
    //第二步 取每个点的像素值
    unsigned char* data = CGBitmapContextGetData (context);
    
    if (data == NULL) {
        CGContextRelease(context);
      return nil;
    }
    NSArray *MaxColor=nil;
    // NSCountedSet *cls=[NSCountedSet setWithCapacity:thumbSize.width*thumbSize.height];
    float maxScore=0;
    for (int x=0; x<thumbSize.width*thumbSize.height; x++) {
        
        
        int offset = 4*x;
        
        int red = data[offset];
        int green = data[offset+1];
        int blue = data[offset+2];
        int alpha =  data[offset+3];
        
        if (alpha<25)continue;
        
        float h,s,v;
        RGBtoHSV(red, green, blue, &h, &s, &v);
        
        float y = MIN(abs(red*2104+green*4130+blue*802+4096+131072)>>13, 235);
        y= (y-16)/(235-16);
        if (y>0.9) continue;
        
        float score = (s+0.1)*x;
        if (score>maxScore) {
            maxScore = score;
        }
        MaxColor=@[@(red),@(green),@(blue),@(alpha)];
        //[cls addObject:clr];
        
    }
    
    CGContextRelease(context);
    
    return [UIColor colorWithRed:([MaxColor[0] intValue]/255.0f) green:([MaxColor[1] intValue]/255.0f) blue:([MaxColor[2] intValue]/255.0f) alpha:([MaxColor[3] intValue]/255.0f)];
}

+ (UIImage*) buttonImageFromColors:(NSArray*)colors gradientType:(GradientType)gradientType view:(UIView*)view
{
    NSMutableArray *ar = [NSMutableArray array];
    for(UIColor *c in colors) {
        [ar addObject:(id)c.CGColor];
    }
    UIGraphicsBeginImageContextWithOptions(view.frame.size, YES, 0);
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextSaveGState(context);
    CGColorSpaceRef colorSpace = CGColorGetColorSpace([[colors lastObject] CGColor]);
    CGGradientRef gradient = CGGradientCreateWithColors(colorSpace, (CFArrayRef)ar, NULL);
    CGPoint start;
    CGPoint end;
    switch (gradientType) {
        case 0:
            start = CGPointMake(0.0, 0.0);
            end = CGPointMake(0.0, view.frame.size.height);
            break;
        case 1:
            start = CGPointMake(0.0, 0.0);
            end = CGPointMake(view.frame.size.width, 0.0);
            break;
        case 2:
            start = CGPointMake(0.0, 0.0);
            end = CGPointMake(view.frame.size.width, view.frame.size.height);
            break;
        case 3:
            start = CGPointMake(view.frame.size.width, 0.0);
            end = CGPointMake(0.0, view.frame.size.height);
            break;
        default:
            break;
    }
    
    CGContextDrawLinearGradient(context, gradient, start, end, kCGGradientDrawsBeforeStartLocation | kCGGradientDrawsAfterEndLocation);
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    CGGradientRelease(gradient);
    CGContextRestoreGState(context);
    // CGColorSpaceRelease(colorSpace);
    UIGraphicsEndImageContext();
    return image;
}

- (id)initWithImage:(UIImage *)image
{
    return [self initWithImage:image scaledSize:CGSizeZero];
}

- (id)initWithImage:(UIImage *)image scaledSize:(CGSize)size
{
    if (!image) return nil;
    self = [super init];
    if (self)
    {
        
        if (CGSizeEqualToSize(size, CGSizeZero) || CGSizeEqualToSize(size, image.size)) {
            self.scaledSize = image.size;
            self.scaledImage = image;
        } else {
            self.scaledSize = size;
            UIImage *finalImage = [self scaleImage:image size:size];
            self.scaledImage = finalImage;
        }

        [self extractDataFromImage:self.scaledImage];
        [self analyzeImage:image];
    }

    return self;
}


- (void)extractDataFromImage:(UIImage *)image {
    CGColorSpaceRef d_colorSpace = CGColorSpaceCreateDeviceRGB();
    size_t bytesPerRow = image.size.width * 4;
    NSUInteger len = image.size.height*bytesPerRow;
    gs_pixel *data = malloc(len);
    self.imgData = [NSData dataWithBytesNoCopy:data length:len freeWhenDone:YES];

    CGContextRef context =  CGBitmapContextCreate(data, image.size.width,
                                                  image.size.height,
                                                  8, bytesPerRow,
                                                  d_colorSpace,
                                                  kCGImageAlphaNoneSkipFirst);

    UIGraphicsPushContext(context);
    CGContextTranslateCTM(context, 0.0, image.size.height);
    CGContextScaleCTM(context, 1.0, -1.0);
    [image drawInRect:CGRectMake(0.0, 0.0, image.size.width, image.size.height)];
    UIGraphicsPopContext();

    CGContextRelease(context);
    CGColorSpaceRelease(d_colorSpace);
}


- (UIImage *)scaleImage:(UIImage *)image size:(CGSize)targetSize
{
    UIImage *sourceImage = image;
    UIImage *newImage = nil;
    CGSize imageSize = sourceImage.size;
    CGFloat width = imageSize.width;
    CGFloat height = imageSize.height;
    CGFloat targetWidth = targetSize.width;
    CGFloat targetHeight = targetSize.height;
    CGFloat scaleFactor = 0.0;
    CGFloat scaledWidth = targetWidth;
    CGFloat scaledHeight = targetHeight;
    CGPoint thumbnailPoint = CGPointMake(0.0,0.0);

    if (CGSizeEqualToSize(imageSize, targetSize) == NO)
    {
        CGFloat widthFactor = targetWidth / width;
        CGFloat heightFactor = targetHeight / height;

        if (widthFactor > heightFactor)
        {
            scaleFactor = widthFactor; // scale to fit height
        }
        else
        {
            scaleFactor = heightFactor; // scale to fit width
        }

        scaledWidth  = width * scaleFactor;
        scaledHeight = height * scaleFactor;

        // center the image
        if (widthFactor > heightFactor)
        {
            thumbnailPoint.y = (targetHeight - scaledHeight) * 0.5;
        }
        else
        {
            if (widthFactor < heightFactor)
            {
                thumbnailPoint.x = (targetWidth - scaledWidth) * 0.5;
            }
        }
    }
  UIGraphicsBeginImageContextWithOptions(targetSize, NO,[UIScreen mainScreen].scale);
//    UIGraphicsBeginImageContext(targetSize); // this will crop

    CGRect thumbnailRect = CGRectZero;
    thumbnailRect.origin = thumbnailPoint;
    thumbnailRect.size.width  = scaledWidth;
    thumbnailRect.size.height = scaledHeight;

    [sourceImage drawInRect:thumbnailRect];

    newImage = UIGraphicsGetImageFromCurrentImageContext();

    if(newImage == nil)
    {
        NSLog(@"could not scale image");
    }

    //pop the context to get back to the default
    UIGraphicsEndImageContext();
    
    return newImage;
}


- (void)analyzeImage:(UIImage *)anImage
{
    NSCountedSet *imageColors = nil;
	UIColor *backgroundColor = [self imageColors:&imageColors];
	UIColor *primaryColor = nil;
	UIColor *secondaryColor = nil;
	UIColor *detailColor = nil;
	BOOL darkBackground = [backgroundColor pc_isDarkColor];

    CGFloat red, green, blue, alpha;
    [backgroundColor getRed:&red green:&green blue:&blue alpha:&alpha];

	[self findTextColors:imageColors primaryColor:&primaryColor secondaryColor:&secondaryColor detailColor:&detailColor backgroundColor:backgroundColor];

	if ( primaryColor == nil )
	{
		NSLog(@"missed primary");
		if ( darkBackground )
			primaryColor = [UIColor whiteColor];
		else
			primaryColor = [UIColor blackColor];
	}

	if ( secondaryColor == nil )
	{
		NSLog(@"missed secondary");
		if ( darkBackground )
			secondaryColor = [UIColor whiteColor];
		else
			secondaryColor = [UIColor blackColor];
	}

	if ( detailColor == nil )
	{
		NSLog(@"missed detail");
		if ( darkBackground )
			detailColor = [UIColor whiteColor];
		else
			detailColor = [UIColor blackColor];
	}

    self.backgroundColor = backgroundColor;
    self.primaryColor = primaryColor;
	self.secondaryColor = secondaryColor;
    self.detailColor = detailColor;
}

- (UIColor*)imageColors:(NSCountedSet**)colors
{
	NSInteger pixelsWide = self.scaledImage.size.width;
	NSInteger pixelsHigh = self.scaledImage.size.height;

	NSCountedSet *imageColors = [[NSCountedSet alloc] initWithCapacity:pixelsWide * pixelsHigh];
	NSCountedSet *leftEdgeColors = [[NSCountedSet alloc] initWithCapacity:pixelsHigh];

    NSUInteger x, y;
    x = y = 0;
    while (x < pixelsWide)
	{
        while (y < pixelsHigh)
		{
			UIColor *color = dataColorAtXY(self.imgData.bytes, self.scaledSize.width, (int)x, (int)y);

			if ( x == 0 )
			{
				[leftEdgeColors addObject:color];
			}

			[imageColors addObject:color];
            y += 2;
		}
        x += 2;
	}

	*colors = imageColors;


	NSEnumerator *enumerator = [leftEdgeColors objectEnumerator];
	UIColor *curColor = nil;
	NSMutableArray *sortedColors = [NSMutableArray arrayWithCapacity:[leftEdgeColors count]];

	while ( (curColor = [enumerator nextObject]) != nil )
	{
		NSUInteger colorCount = [leftEdgeColors countForObject:curColor];

        NSInteger randomColorsThreshold = (NSInteger)(pixelsHigh * kColorThresholdMinimumPercentage);
        
		if ( colorCount <= randomColorsThreshold ) // prevent using random colors, threshold based on input image height
			continue;

		PCCountedColor *container = [[PCCountedColor alloc] initWithColor:curColor count:colorCount];

		[sortedColors addObject:container];
	}

	[sortedColors sortUsingSelector:@selector(compare:)];


	PCCountedColor *proposedEdgeColor = nil;

	if ( [sortedColors count] > 0 )
	{
		proposedEdgeColor = [sortedColors objectAtIndex:0];

		if ( [proposedEdgeColor.color pc_isBlackOrWhite] ) // want to choose color over black/white so we keep looking
		{
			for ( NSInteger i = 1; i < [sortedColors count]; i++ )
			{
				PCCountedColor *nextProposedColor = [sortedColors objectAtIndex:i];

				if (((double)nextProposedColor.count / (double)proposedEdgeColor.count) > .3 ) // make sure the second choice color is 30% as common as the first choice
				{
					if ( ![nextProposedColor.color pc_isBlackOrWhite] )
					{
						proposedEdgeColor = nextProposedColor;
						break;
					}
				}
				else
				{
					// reached color threshold less than 40% of the original proposed edge color so bail
					break;
				}
			}
		}
	}

	return proposedEdgeColor.color;
}


- (void)findTextColors:(NSCountedSet*)colors primaryColor:(UIColor**)primaryColor secondaryColor:(UIColor**)secondaryColor detailColor:(UIColor**)detailColor backgroundColor:(UIColor*)backgroundColor
{
	NSEnumerator *enumerator = [colors objectEnumerator];
	UIColor *curColor = nil;
	NSMutableArray *sortedColors = [NSMutableArray arrayWithCapacity:[colors count]];
	BOOL findDarkTextColor = ![backgroundColor pc_isDarkColor];

	while ( (curColor = [enumerator nextObject]) != nil )
	{
		curColor = [curColor pc_colorWithMinimumSaturation:.15];

		if ( [curColor pc_isDarkColor] == findDarkTextColor )
		{
			NSUInteger colorCount = [colors countForObject:curColor];

			PCCountedColor *container = [[PCCountedColor alloc] initWithColor:curColor count:colorCount];

			[sortedColors addObject:container];
		}
	}

	[sortedColors sortUsingSelector:@selector(compare:)];

	for ( PCCountedColor *curContainer in sortedColors )
	{
		curColor = curContainer.color;

		if ( *primaryColor == nil )
		{
			if ( [curColor pc_isContrastingColor:backgroundColor] )
				*primaryColor = curColor;
		}
		else if ( *secondaryColor == nil )
		{
			if ( ![*primaryColor pc_isDistinct:curColor] || ![curColor pc_isContrastingColor:backgroundColor] )
				continue;

			*secondaryColor = curColor;
		}
		else if ( *detailColor == nil )
		{
			if ( ![*secondaryColor pc_isDistinct:curColor] || ![*primaryColor pc_isDistinct:curColor] || ![curColor pc_isContrastingColor:backgroundColor] )
				continue;
            
			*detailColor = curColor;
			break;
		}
	}
}

@end



@implementation PCCountedColor

- (id)initWithColor:(UIColor*)color count:(NSUInteger)count
{
	self = [super init];

	if ( self )
	{
		self.color = color;
		self.count = count;
	}

	return self;
}

- (NSComparisonResult)compare:(PCCountedColor*)object
{
	if ( [object isKindOfClass:[PCCountedColor class]] )
	{
		if ( self.count < object.count )
		{
			return NSOrderedDescending;
		}
		else if ( self.count == object.count )
		{
			return NSOrderedSame;
		}
	}
    
	return NSOrderedAscending;
}
@end
