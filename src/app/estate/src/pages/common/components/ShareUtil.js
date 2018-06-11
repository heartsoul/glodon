/**
 * Created by wangfei on 17/8/28.
 */
var { NativeModules } = require('react-native');
// module.exports = NativeModules.UMShareModule;
// platform
// case 0: // QQ
// return UMSocialPlatformType_QQ;
// case 1: // Sina
// return UMSocialPlatformType_Sina;
// case 2: // wechat
// return UMSocialPlatformType_WechatSession;
// case 3:
// return UMSocialPlatformType_WechatTimeLine;
// case 4:
// return UMSocialPlatformType_Qzone;
// case 5:
// return UMSocialPlatformType_Email;
// case 6:
// return UMSocialPlatformType_Sms;
// case 7:
// return UMSocialPlatformType_Facebook;
// case 8:
// return UMSocialPlatformType_Twitter;
// case 9:
// return UMSocialPlatformType_WechatFavorite;
// case 33:
//       return UMSocialPlatformType_UnKnown; // more
// default:
//       return UMSocialPlatformType_QQ;
export function share(text = '', icon='', link='', title='', platform=0, completion=(a,b)=>{}) {
    NativeModules.UMShareModule.share(text,icon,link,title,platform,completion);
}
export function shareboard(text = '', icon='', link='', title='', platforms=[0,1,2,3,4,5,6,9,33], completion=(a,b)=>{}) {
    
    NativeModules.UMShareModule.shareboard(text,icon,link,title,platforms,completion);
    // NativeModules.UMShareModule.share(text,icon,link,title,33,completion);
}

