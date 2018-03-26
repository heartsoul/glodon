# React Native 开发指南

## 简介
### 1.RN是什么？
<pre>
React Native (简称RN)是Facebook于2015年4月开源的跨平台移动应用开发框架，是Facebook早先开源的UI框架 React 在原生移动应用平台的衍生产物，目前支持iOS和安卓两大平台。RN使用Javascript语言，类似于HTML的JSX，以及CSS来开发移动应用，因此熟悉Web前端开发的技术人员只需很少的学习就可以进入移动应用开发领域。
React Native使你能够在Javascript和React的基础上获得完全一致的开发体验，构建世界一流的原生APP。
React Native着力于提高多平台开发的开发效率 —— 仅需学习一次，编写任何平台。(Learn once, write anywhere)
Facebook已经在多项产品中使用了React Native，并且将持续地投入建设React Native。
React Native主要特性如下：
原生的iOS组件
React Native主张“Learn once, write everywhere”而非其他跨平台工具一直宣扬的“Write once, run everywhere”。通过React Native，开发者可以使用UITabBar、UINavigationController等标准的iOS平台组件，让应用界面在其他平台上亦能保持始终如一的外观、风格。
异步执行
JavaScript应用代码和原生平台之间所有的操作都采用异步执行模式，原生模块使用额外线程，开发者可以解码主线程图像、后台保存至磁盘、无须顾忌UI等诸多因素直接度量文本设计布局。
触摸处理
React Native引入了一个类似于iOS上Responder Chain响应链事件处理机制的响应体系，并基于此为开发者提供了诸如TouchableHighlight等更高级的组件。
</pre>

### [都谁在用](https://reactnative.cn/cases.html)

```
https://reactnative.cn/cases.html
```

## 开发环境
### 基本开发环境安装
### Homebrew

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

```

### Node, Watchman

We recommend installing Node and Watchman using [Homebrew](http://brew.sh/). Run the following commands in a Terminal after installing Homebrew:

```
brew install node
brew install watchman
```

If you have already installed Node on your system, make sure it is version 6 or newer.

[Watchman](https://facebook.github.io/watchman) is a tool by Facebook for watching changes in the filesystem. It is highly recommended you install it for better performance.

<block class="native linux android" />

### Node

Follow the [installation instructions for your Linux distribution](https://nodejs.org/en/download/package-manager/) to install Node 6 or newer.

<block class='native windows android' />

### Node, Python2, JDK

We recommend installing Node and Python2 via [Chocolatey](https://chocolatey.org), a popular package manager for Windows.

React Native also requires a recent version of the [Java SE Development Kit (JDK)](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html), as well as Python 2. Both can be installed using Chocolatey.

Open an Administrator Command Prompt (right click Command Prompt and select "Run as Administrator"), then run the following command:

```powershell
choco install -y nodejs.install python2 jdk8
```

If you have already installed Node on your system, make sure it is version 6 or newer. If you already have a JDK on your system, make sure it is version 8 or newer.

> You can find additional installation options on [Node's Downloads page](https://nodejs.org/en/download/).

<block class="native mac ios android" />

### The React Native CLI

Node comes with npm, which lets you install the React Native command line interface.

Run the following command in a Terminal:

```
npm install -g react-native-cli
```

> If you get an error like `Cannot find module 'npmlog'`, try installing npm directly: `curl -0 -L https://npmjs.org/install.sh | sudo sh`.

<block class="native windows linux android" />

### The React Native CLI

Node comes with npm, which lets you install the React Native command line interface.

Run the following command in a Command Prompt or shell:

```powershell
npm install -g react-native-cli
```

> If you get an error like `Cannot find module 'npmlog'`, try installing npm directly: `curl -0 -L https://npmjs.org/install.sh | sudo sh`.

<block class="native mac ios" />

### Xcode

The easiest way to install Xcode is via the [Mac App Store](https://itunes.apple.com/us/app/xcode/id497799835?mt=12). Installing Xcode will also install the iOS Simulator and all the necessary tools to build your iOS app.

If you have already installed Xcode on your system, make sure it is version 8 or higher.

#### Command Line Tools

You will also need to install the Xcode Command Line Tools. Open Xcode, then choose "Preferences..." from the Xcode menu. Go to the Locations panel and install the tools by selecting the most recent version in the Command Line Tools dropdown.

![Xcode Command Line Tools](https://facebook.github.io/react-native/docs/assets/GettingStartedXcodeCommandLineTools.png)

<block class="native mac linux android" />

### Java Development Kit

React Native requires a recent version of the Java SE Development Kit (JDK). [Download and install JDK 8 or newer](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) if needed.

<block class="native mac linux windows android" />

### Android development environment

Setting up your development environment can be somewhat tedious if you're new to Android development. If you're already familiar with Android development, there are a few things you may need to configure. In either case, please make sure to carefully follow the next few steps.

<block class="native mac windows linux android" />

#### 1. Install Android Studio

[Download and install Android Studio](https://developer.android.com/studio/index.html). Choose a "Custom" setup when prompted to select an installation type. Make sure the boxes next to all of the following are checked:

<block class="native mac windows android" />

* `Android SDK`
* `Android SDK Platform`
* `Performance (Intel ® HAXM)`
* `Android Virtual Device`

<block class="native linux android" />

* `Android SDK`
* `Android SDK Platform`
* `Android Virtual Device`

<block class="native mac windows linux android" />

Then, click "Next" to install all of these components.

> If the checkboxes are grayed out, you will have a chance to install these components later on.

Once setup has finalized and you're presented with the Welcome screen, proceed to the next step.

#### 2. Install the Android SDK

Android Studio installs the latest Android SDK by default. Building a React Native app with native code, however, requires the `Android 6.0 (Marshmallow)` SDK in particular. Additional Android SDKs can be installed through the SDK Manager in Android Studio.

The SDK Manager can be accessed from the "Welcome to Android Studio" screen. Click on "Configure", then select "SDK Manager".

<block class="native mac android" />

![Android Studio Welcome](https://facebook.github.io/react-native/docs/assets/GettingStartedAndroidStudioWelcomeMacOS.png)

<block class="native windows android" />

![Android Studio Welcome](https://facebook.github.io/react-native/docs/assets/GettingStartedAndroidStudioWelcomeWindows.png)

<block class="native mac windows linux android" />

> The SDK Manager can also be found within the Android Studio "Preferences" dialog, under **Appearance & Behavior** → **System Settings** → **Android SDK**.

Select the "SDK Platforms" tab from within the SDK Manager, then check the box next to "Show Package Details" in the bottom right corner. Look for and expand the `Android 6.0 (Marshmallow)` entry, then make sure the following items are all checked:

* `Google APIs`
* `Android SDK Platform 23`
* `Intel x86 Atom_64 System Image`
* `Google APIs Intel x86 Atom_64 System Image`

<block class="native mac android" />

![Android SDK Manager](https://facebook.github.io/react-native/docs/assets/GettingStartedAndroidSDKManagerMacOS.png)

<block class="native windows android" />

![Android SDK Manager](https://facebook.github.io/react-native/docs/assets/GettingStartedAndroidSDKManagerWindows.png)

<block class="native windows mac linux android" />

Next, select the "SDK Tools" tab and check the box next to "Show Package Details" here as well. Look for and expand the "Android SDK Build-Tools" entry, then make sure that `23.0.1` is selected.

<block class="native mac android" />

![Android SDK Manager - 23.0.1 Build Tools](https://facebook.github.io/react-native/docs/assets/GettingStartedAndroidSDKManagerSDKToolsMacOS.png)

<block class="native windows android" />

![Android SDK Manager - 23.0.1 Build Tools](https://facebook.github.io/react-native/docs/assets/GettingStartedAndroidSDKManagerSDKToolsWindows.png)

<block class="native windows mac linux android" />

Finally, click "Apply" to download and install the Android SDK and related build tools.

<block class="native mac android" />

![Android SDK Manager - Installs](https://facebook.github.io/react-native/docs/assets/GettingStartedAndroidSDKManagerInstallsMacOS.png)

<block class="native windows android" />

![Android SDK Manager - Installs](https://facebook.github.io/react-native/docs/assets/GettingStartedAndroidSDKManagerInstallsWindows.png)

<block class="native mac windows linux android" />

#### 3. Configure the ANDROID_HOME environment variable

The React Native tools require some environment variables to be set up in order to build apps with native code.

<block class="native mac linux android" />

Add the following lines to your `$HOME/.bash_profile` config file:

<block class="native mac android" />

```
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

<block class="native linux android" />

```
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

<block class="native mac linux android" />

> `.bash_profile` is specific to `bash`. If you're using another shell, you will need to edit the appropriate shell-specific config file.

Type `source $HOME/.bash_profile` to load the config into your current shell. Verify that ANDROID_HOME has been added to your path by running `echo $PATH`.

> Please make sure you use the correct Android SDK path. You can find the actual location of the SDK in the Android Studio "Preferences" dialog, under **Appearance & Behavior** → **System Settings** → **Android SDK**.

<block class="native windows android" />

Open the System pane under **System and Security** in the Control Panel, then click on **Change settings...**. Open the **Advanced** tab and click on **Environment Variables...**. Click on **New...** to create a new `ANDROID_HOME` user variable that points to the path to your Android SDK:

![ANDROID_HOME Environment Variable](https://facebook.github.io/react-native/docs/assets/GettingStartedAndroidEnvironmentVariableANDROID_HOME.png)

The SDK is installed, by default, at the following location:

```powershell
c:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk
```

You can find the actual location of the SDK in the Android Studio "Preferences" dialog, under **Appearance & Behavior** → **System Settings** → **Android SDK**.

Open a new Command Prompt window to ensure the new environment variable is loaded before proceeding to the next step.

<block class="native linux android" />

### Watchman (optional)

Follow the [Watchman installation guide](https://facebook.github.io/watchman/docs/install.html#buildinstall) to compile and install Watchman from source.

> [Watchman](https://facebook.github.io/watchman/docs/install.html) is a tool by Facebook for watching changes in the filesystem. It is highly recommended you install it for better performance, but it's alright to skip this if you find the process to be tedious.

<block class="native mac ios" />

## Creating a new application

Use the React Native command line interface to generate a new React Native project called "AwesomeProject":

```
react-native init AwesomeProject
```

This is not necessary if you are integrating React Native into an existing application, if you "ejected" from Create React Native App, or if you're adding iOS support to an existing React Native project (see [Platform Specific Code](platform-specific-code.md)).

<block class="native mac windows linux android" />

## Creating a new application

Use the React Native command line interface to generate a new React Native project called "AwesomeProject":

```
react-native init AwesomeProject
```

### 2.运行

创建RN项目

```
react-native init demo1
//  视情况而定，总之进入项目根目录
cd demo1

//  运行iOS项目
react-native run-ios
//  运行安卓项目
react-native run-android
```

### 3. 学习 [React Native](https://facebook.github.io/react-native/docs/tutorial.html)
```
https://facebook.github.io/react-native/docs/tutorial.html
<pre>
这些内容是需要了解的基础
Props
State
Style
Height and Width
Layout with Flexbox
Handling Text Input
Handling Touches
Using a ScrollView
Using List Views
Networking
```

#### [组件和API](https://facebook.github.io/react-native/docs/components-and-apis.html)

```
https://facebook.github.io/react-native/docs/components-and-apis.html
```


### 4.调试
---
id: debugging
title: Debugging
---

## Enabling Keyboard Shortcuts

React Native supports a few keyboard shortcuts in the iOS Simulator. They are described below. To enable them, open the Hardware menu, select Keyboard, and make sure that "Connect Hardware Keyboard" is checked.

## Accessing the In-App Developer Menu

You can access the developer menu by shaking your device or by selecting "Shake Gesture" inside the Hardware menu in the iOS Simulator. You can also use the `⌘D` keyboard shortcut when your app is running in the iOS Simulator, or `⌘M` when running in an Android emulator. Alternatively for Android, you can run the command `adb shell input keyevent 82` to open the dev menu (82 being the Menu key code).

![Developer Menu](https://facebook.github.io/react-native/docs/assets/DeveloperMenu.png)

> The Developer Menu is disabled in release (production) builds.

## Reloading JavaScript

Instead of recompiling your app every time you make a change, you can reload your app's JavaScript code instantly. To do so, select "Reload" from the Developer Menu. You can also press `⌘R` in the iOS Simulator, or tap `R` twice on Android emulators.

### Automatic reloading

You can speed up your development times by having your app reload automatically any time your code changes. Automatic reloading can be enabled by selecting "Enable Live Reload" from the Developer Menu.

You may even go a step further and keep your app running as new versions of your files are injected into the JavaScript bundle automatically by enabling [Hot Reloading](https://facebook.github.io/react-native/blog/2016/03/24/introducing-hot-reloading.html) from the Developer Menu. This will allow you to persist the app's state through reloads.

> There are some instances where hot reloading cannot be implemented perfectly. If you run into any issues, use a full reload to reset your app.

You will need to rebuild your app for changes to take effect in certain situations:

* You have added new resources to your native app's bundle, such as an image in `Images.xcassets` on iOS or the `res/drawable` folder on Android.
* You have modified native code (Objective-C/Swift on iOS or Java/C++ on Android).

## In-app Errors and Warnings

Errors and warnings are displayed inside your app in development builds.

### Errors

In-app errors are displayed in a full screen alert with a red background inside your app. This screen is known as a RedBox. You can use `console.error()` to manually trigger one.

### Warnings

Warnings will be displayed on screen with a yellow background. These alerts are known as YellowBoxes. Click on the alerts to show more information or to dismiss them.

As with a RedBox, you can use `console.warn()` to trigger a YellowBox.

YellowBoxes can be disabled during development by using `console.disableYellowBox = true;`. Specific warnings can be ignored programmatically by setting an array of prefixes that should be ignored:

```javascript
import {YellowBox} from 'react-native';
YellowBox.ignoreWarnings(['Warning: ...']);
```

In CI/Xcode, YellowBoxes can also be disabled by setting the `IS_TESTING` environment variable.

> RedBoxes and YellowBoxes are automatically disabled in release (production) builds.

## Chrome Developer Tools

To debug the JavaScript code in Chrome, select "Debug JS Remotely" from the Developer Menu. This will open a new tab at [http://localhost:8081/debugger-ui](http://localhost:8081/debugger-ui).

Select `Tools → Developer Tools` from the Chrome Menu to open the [Developer Tools](https://developer.chrome.com/devtools). You may also access the DevTools using keyboard shortcuts (`⌘⌥I` on macOS, `Ctrl` `Shift` `I` on Windows). You may also want to enable [Pause On Caught Exceptions](http://stackoverflow.com/questions/2233339/javascript-is-there-a-way-to-get-chrome-to-break-on-all-errors/17324511#17324511) for a better debugging experience.

> Note: the React Developer Tools Chrome extension does not work with React Native, but you can use its standalone version instead. Read [this section](debugging.md#react-developer-tools) to learn how.

### Debugging using a custom JavaScript debugger

To use a custom JavaScript debugger in place of Chrome Developer Tools, set the `REACT_DEBUGGER` environment variable to a command that will start your custom debugger. You can then select "Debug JS Remotely" from the Developer Menu to start debugging.

The debugger will receive a list of all project roots, separated by a space. For example, if you set `REACT_DEBUGGER="node /path/to/launchDebugger.js --port 2345 --type ReactNative"`, then the command `node /path/to/launchDebugger.js --port 2345 --type ReactNative /path/to/reactNative/app` will be used to start your debugger.

> Custom debugger commands executed this way should be short-lived processes, and they shouldn't produce more than 200 kilobytes of output.

## React Developer Tools

You can use [the standalone version of React Developer Tools](https://github.com/facebook/react-devtools/tree/master/packages/react-devtools) to debug the React component hierarchy. To use it, install the `react-devtools` package globally:

```
npm install -g react-devtools
```

Now run `react-devtools` from the terminal to launch the standalone DevTools app:

```
react-devtools
```

![React DevTools](https://facebook.github.io/react-native/docs/assets/ReactDevTools.png)

It should connect to your simulator within a few seconds.

> Note: if you prefer to avoid global installations, you can add `react-devtools` as a project dependency. Add the `react-devtools` package to your project using `npm install --save-dev react-devtools`, then add `"react-devtools": "react-devtools"` to the `scripts` section in your `package.json`, and then run `npm run react-devtools` from your project folder to open the DevTools.

### Integration with React Native Inspector

Open the in-app developer menu and choose "Show Inspector". It will bring up an overlay that lets you tap on any UI element and see information about it:

![React Native Inspector](https://facebook.github.io/react-native/docs/assets/Inspector.gif)

However, when `react-devtools` is running, Inspector will enter a special collapsed mode, and instead use the DevTools as primary UI. In this mode, clicking on something in the simulator will bring up the relevant components in the DevTools:

![React DevTools Inspector Integration](https://facebook.github.io/react-native/docs/assets/ReactDevToolsInspector.gif)

You can choose "Hide Inspector" in the same menu to exit this mode.

### Inspecting Component Instances

When debugging JavaScript in Chrome, you can inspect the props and state of the React components in the browser console.

First, follow the instructions for debugging in Chrome to open the Chrome console.

Make sure that the dropdown in the top left corner of the Chrome console says `debuggerWorker.js`. **This step is essential.**

Then select a React component in React DevTools. There is a search box at the top that helps you find one by name. As soon as you select it, it will be available as `$r` in the Chrome console, letting you inspect its props, state, and instance properties.

![React DevTools Chrome Console Integration](https://facebook.github.io/react-native/docs/assets/ReactDevToolsDollarR.gif)

## Performance Monitor

You can enable a performance overlay to help you debug performance problems by selecting "Perf Monitor" in the Developer Menu.

<hr style="margin-top:25px; margin-bottom:25px;"/>

# Debugging in Ejected Apps

<div class="banner-crna-ejected" style="margin-top:25px">
  <h3>Projects with Native Code Only</h3>
  <p>
    The remainder of this guide only applies to projects made with <code>react-native init</code>
    or to those made with Create React Native App which have since ejected. For
    more information about ejecting, please see
    the <a href="https://github.com/react-community/create-react-native-app/blob/master/EJECTING.md" target="_blank">guide</a> on
    the Create React Native App repository.
  </p>
</div>

## Accessing console logs

You can display the console logs for an iOS or Android app by using the following commands in a terminal while the app is running:

```
$ react-native log-ios
$ react-native log-android
```

You may also access these through `Debug → Open System Log...` in the iOS Simulator or by running `adb logcat *:S ReactNative:V ReactNativeJS:V` in a terminal while an Android app is running on a device or emulator.

> If you're using Create React Native App, console logs already appear in the same terminal output as the packager.

## Debugging on a device with Chrome Developer Tools

> If you're using Create React Native App, this is configured for you already.

On iOS devices, open the file [`RCTWebSocketExecutor.m`](https://github.com/facebook/react-native/blob/master/Libraries/WebSocket/RCTWebSocketExecutor.m) and change "localhost" to the IP address of your computer, then select "Debug JS Remotely" from the Developer Menu.

On Android 5.0+ devices connected via USB, you can use the [`adb` command line tool](http://developer.android.com/tools/help/adb.html) to setup port forwarding from the device to your computer:

`adb reverse tcp:8081 tcp:8081`

Alternatively, select "Dev Settings" from the Developer Menu, then update the "Debug server host for device" setting to match the IP address of your computer.

> If you run into any issues, it may be possible that one of your Chrome extensions is interacting in unexpected ways with the debugger. Try disabling all of your extensions and re-enabling them one-by-one until you find the problematic extension.

### Debugging with [Stetho](http://facebook.github.io/stetho/) on Android

Follow this guide to enable Stetho for Debug mode:

1. In `android/app/build.gradle`, add these lines in the `dependencies` section:

   ```gradle
    debugCompile 'com.facebook.stetho:stetho:1.5.0'
    debugCompile 'com.facebook.stetho:stetho-okhttp3:1.5.0'
   ```

> The above will configure Stetho v1.5.0. You can check at http://facebook.github.io/stetho/ if a newer version is available.

2. Create the following Java classes to wrap the Stetho call, one for release and one for debug:

   ```java
   // android/app/src/release/java/com/{yourAppName}/StethoWrapper.java

   public class StethoWrapper {

       public static void initialize(Context context) {
           // NO_OP
       }

       public static void addInterceptor() {
           // NO_OP
       }
   }
   ```

   ```java
   // android/app/src/debug/java/com/{yourAppName}/StethoWrapper.java

   public class StethoWrapper {
       public static void initialize(Context context) {
         Stetho.initializeWithDefaults(context);
       }

       public static void addInterceptor() {
         OkHttpClient client = OkHttpClientProvider.getOkHttpClient()
                .newBuilder()
                .addNetworkInterceptor(new StethoInterceptor())
                .build();

         OkHttpClientProvider.replaceOkHttpClient(client);
       }
   }
   ```

3. Open `android/app/src/main/java/com/{yourAppName}/MainApplication.java` and replace the original `onCreate` function:

```java
  public void onCreate() {
      super.onCreate();

      if (BuildConfig.DEBUG) {
          StethoWrapper.initialize(this);
          StethoWrapper.addInterceptor();
      }

      SoLoader.init(this, /* native exopackage */ false);
    }
```

4. Open the project in Android Studio and resolve any dependency issues. The IDE should guide you through this steps after hovering your pointer over the red lines.

5. Run `react-native run-android`.

6. In a new Chrome tab, open: `chrome://inspect`, then click on the 'Inspect device' item next to "Powered by Stetho".

## Debugging native code

When working with native code, such as when writing native modules, you can launch the app from Android Studio or Xcode and take advantage of the native debugging features (setting up breakpoints, etc.) as you would in case of building a standard native app.

## 相关技术
### 自定义组件

>Exposing a view is simple:
<li> Subclass RCTViewManager to create a manager for your component.
<li> 
Add the `RCT_EXPORT_MODULE() `marker macro.
<li> Implement the `-(UIView *)view` method.

```
// RNTMapManager.m
#import <MapKit/MapKit.h>

#import <React/RCTViewManager.h>

@interface RNTMapManager : RCTViewManager
@end

@implementation RNTMapManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [[MKMapView alloc] init];
}

@end
```

>Then you just need a little bit of JavaScript to make this a usable React component:

```
// MapView.js

import { requireNativeComponent } from 'react-native';

// requireNativeComponent automatically resolves 'RNTMap' to 'RNTMapManager'
module.exports = requireNativeComponent('RNTMap', null);

// MyApp.js

import MapView from './MapView.js';

...

render() {
  return <MapView style={{ flex: 1 }} />;
}

```

#### 运行demo

##### iOS 部分

```
//
//  GLDDemoManager.h
//  estate
//
//  Created by glodon on 2018/3/19.
//  Copyright © 2018年 Facebook. All rights reserved.
//
#import <React/RCTViewManager.h>

// 整理需要有遵循一个命名规则， 前缀+组件名+Manager ，其中前者建议用三个大写字母，比如RCT就是ReaCT组件 
@interface GLDDemoManager : RCTViewManager

@end

```
```
//
//  GLDDemoManager.m
//  estate
//
//  Created by glodon on 2018/3/19.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "GLDDemoManager.h"

// 数据转换
@interface RCTConvert (Button)

+ (NSString*)buttonTitle:(id)json;
+ (UIColor*)buttonColor:(id)json;

@end

@implementation RCTConvert(Button)
+ (NSString*)buttonTitle:(id)json {
   json = [self NSDictionary:json];
  return json[@"title"];
}
+ (UIColor*)buttonColor:(id)json {
  json = [self NSDictionary:json];
  return [RCTConvert UIColor: json[@"color"]];
}
@end

// 控件定义
@interface RNTButtonView: UIButton

@property (nonatomic, copy) RCTBubblingEventBlock onChange;// 响应事件定义

@end

@implementation RNTButtonView

@end

@implementation GLDDemoManager
// 组件导出，这里导出给js组件使用的名字就是 GLDDemo，Manager会被处理掉
RCT_EXPORT_MODULE()
// 响应事件绑定
RCT_EXPORT_VIEW_PROPERTY(onChange, RCTBubblingEventBlock)
// 属性绑定
RCT_EXPORT_VIEW_PROPERTY(backgroundColor, UIColor)
// 自定义属性绑定
RCT_CUSTOM_VIEW_PROPERTY(title, NSString, UIButton)
{
  // 设置相关属性
  [view setTitle:json ? [RCTConvert buttonTitle:json] : @"button" forState:UIControlStateNormal];
  [view setTitleColor:json ? [RCTConvert buttonColor:json] : nil forState:UIControlStateNormal];
}
// 组件构建
- (UIView *)view
{
  RNTButtonView * ret = [[RNTButtonView alloc] initWithFrame:CGRectMake(0, 0, 0, 0)];
  [ret setTitle:@"组件测试" forState:UIControlStateNormal];
  [ret addTarget:self action:@selector(onClick:) forControlEvents:UIControlEventTouchUpInside];
  return ret;
}

// 点击事件
- (void)onClick:(RNTButtonView*) button{
  NSLog(@"onClick");
  if (button.onChange) {
    button.onChange(@{});
  }
  
}
@end
```

##### Android部分

```
public class GLDDemoManager extends SimpleViewManager<Button> {

    public static final String REACT_CLASS = "GLDDemo";
    public static final String NATIVE_METHOD_NAME = "onNativeChange";
    public static final String JS_METHOD_NAME = "onChange";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected Button createViewInstance(ThemedReactContext reactContext) {
        Button button = new Button(reactContext);
        button.setText("组件测试");
        return button;
    }

    @ReactProp(name = "backgroundColor")
    public void setColor(Button button, String color) {
        button.setBackgroundColor(Color.parseColor(color));
    }

    @ReactProp(name = "title")
    public void setTitle(Button button, ReadableMap title) {
        parseTitle(button, title);

        parseColor(button, title);
    }

    private void parseTitle(Button button, ReadableMap title) {
        String text = null;
        if (title.hasKey("title")) {
            text = title.getString("title");
        }
        if (!TextUtils.isEmpty(text)) {
            button.setText(text);
        }
    }

    private void parseColor(Button button, ReadableMap title) {
        int color = 0;
        if (title.hasKey("color")) {
            color = title.getInt("color");
        }
        if (color != 0) {
            button.setTextColor(color);
        }
    }
    /**
     * 将原生模块中的onNativeChange方法映射为 JS模块的onChange属性
     */
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put(NATIVE_METHOD_NAME, MapBuilder.of("registrationName", JS_METHOD_NAME))
                .build();
    }

    @Override
    protected void addEventEmitters(final ThemedReactContext reactContext, final Button view) {
        super.addEventEmitters(reactContext, view);
        //为view绑定事件
        view.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //触发js中的onChange方法
                reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher()
                        .dispatchEvent(new SampleButtonEvent(view.getId()));
            }
        });

    }

    class SampleButtonEvent extends Event {


        public SampleButtonEvent(int viewTag) {
            super(viewTag);
        }

        @Override
        public String getEventName() {
            return NATIVE_METHOD_NAME;
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), null);
        }
    }
}
```

js部分

```
//DemoView.js

import PropTypes from 'prop-types';
import React from 'react';
import { requireNativeComponent, processColor } from 'react-native';

class DemoView extends React.Component {
    _onChange = (event) => {
        if (!this.props.onChange) {
            return;
        }

        // process raw event...
        this.props.onChange(event.nativeEvent);
    }
    render() {
        return (
            <GLDDemo
                {...this.props}
                onChange={(e) => { this._onChange(e); }} title={this.props.title ? { title: this.props.title.title, color: processColor(this.props.color) } : { title: "按钮" }}
                backgroudColor={processColor(this.props.backgroudColor)}
            />
        );
    }
}
DemoView.propTypes = {
    /**
     * 背景色
     */

    backgroudColor: PropTypes.string,
    /**
    * 标题相关属性
    */
    title: PropTypes.shape({
        /**
         * 标题
         */
        title: PropTypes.string.isRequired,
        /**
         * 标题颜色
         */
        color: PropTypes.string,
    }),
    /**
    * 响应事件
    */
    onChange: PropTypes.func,
};

var GLDDemo = requireNativeComponent('GLDDemo', DemoView);

module.exports = DemoView;
```

```
// Demo.js
'use strict';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
} from 'react-native';
import DemoView from './DemoView';
export default class extends React.Component {

  constructor() {
      super();
    };
  
  render() {
    return (
      <View>
        <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
      <Text> 自定义组件使用demo  </Text>
        <DemoView style={{ top:10,left:20,width:200,height:30 }} backgroundColor="#00baf3" onChange={()=>alert('收到')} />
      </View>
      
    );
  }
};

var styles = StyleSheet.create({
    
});
```

## 相关学习

### [html教程](http://www.runoob.com/html/html-tutorial.html)
### [js教程](http://www.runoob.com/js/js-tutorial.html)
### [css教程](http://www.runoob.com/css/css-tutorial.html)
### [java教程](http://www.runoob.com/java/java-tutorial.html)
### [sqlit教程](http://www.runoob.com/sqlite/sqlite-tutorial.html)
### [redux教程](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html)

### [在react-native中使用redux](https://www.jianshu.com/p/2c43860b0532)

redux是什么?

redux是一个用于管理js应用状态的容器。redux出现时间并不是很长，在它出现之前也有类似功能的模块出现，诸如flux等等。redux设计的理念很简单，似乎最初这个开发团队就有让redux可以方便融入在server, browser, mobile client端的打算。目前在github上redux-*的第三方中间件、插件越来越多。如果react项目中想使用redux，那么就有react-redux插件来完成配合


### [ES6](http://es6.ruanyifeng.com) [新特性](http://www.cnblogs.com/Wayou/p/es6_new_features.html)

<pre>
ES6的新特性
(1)箭头操作符=>
(2)类的支持--class关键字
(3)增强的对象字面量
(4)字符串模板
(5)解构
(6)参数默认值，不定参数，拓展参数
(7)let与const 关键字
(8)for of 值遍历
(9)iterator, generator
(10)模块
(11)Proxies
(12)Symbols
(13)Math，Number，String，Object 的新API
(14)Promises
</pre>

```
https://github.com/azat-co/cheatsheets/tree/master/es6
http://www.cnblogs.com/Wayou/p/es6_new_features.html
```


### NODE [教程](http://nodejs.cn/api/globals.html)
```
http://nodejs.cn/api/globals.html
```

### REACT [简易教程](https://m.runoob.com/react/)
```
https://m.runoob.com/react/
```


### [npm](https://docs.npmjs.com/files/package.json)  

```
https://www.npmjs.com/get-npm?utm_source=house&utm_medium=homepage&utm_campaign=free%20orgs&utm_term=Install%20npm
https://docs.npmjs.com/files/package.json
```

### [package](http://blog.csdn.net/zmrdlb/article/details/53190696)

```
 http://blog.csdn.net/zmrdlb/article/details/53190696
```

### [RN](http://facebook.github.io/react-native/docs/getting-started.html) 

```
http://facebook.github.io/react-native/docs/getting-started.html
https://reactnative.cn
http://facebook.github.io/react-native/

```

### [iOS入门](https://blog.csdn.net/csdn_aiyang/article/details/77480907)


### [android入门](https://blog.csdn.net/anddlecn/article/details/51461965)

#### [布局](https://blog.csdn.net/qq_26849491/article/details/51638757)
#### [Activity](https://blog.csdn.net/wxj1018/article/details/51540931)
<pre>讲活动的生命周期，就要先介绍活动的四种状态：
1.运行状态：活动位于返回栈的栈顶。
2.暂停状态：不处于返回栈的栈顶，但仍然可见。
3.停止状态：不处于返回栈的栈顶，并且完全不可见。
4.销毁状态：从返回栈中移除并被系统回收。

Activity类定义了七个回调方法，覆盖了活动的生命周期的每个环节：
1.onCreate：活动第一次创建被调用
2.onStart：活动由不可见变为可见的时候调用
3.onResume：活动处于与用户交互状态时候调用
4.onPause：系统准备启动或恢复另一个活动时候调用
5.onStop：活动完全不可见的时候调用（如果新活动是一个对话框式的活动，onPause会执行，而onStop不会执行）
6.onDestroy：在活动被销毁之前调用
7.onRestart：由停止状态变为运行状态之前调用
</pre>

#### [BroadcastReceiver](https://blog.csdn.net/wxj1018/article/details/51546829)
#### [service](https://blog.csdn.net/wxj1018/article/details/51553256)
#### [ContentResolver](https://blog.csdn.net/wxj1018/article/details/51564102)




### RN渲染过程解析
```
https://www.jianshu.com/p/eaa818a9931f
```
### React Native通讯原理
```
https://www.jianshu.com/p/17d6f6c57a5c
```
### React Native的极简手册
```
https://www.jianshu.com/p/318342e139c7?utm_campaign=maleskine&utm_content=note&utm_medium=seo_notes&utm_source=recommendation
```

### react-native框架源码学习(iOS)

```
http://szuwest.github.io/react-nativekuang-jia-yuan-ma-xue-xi-iosshang.html
http://szuwest.github.io/react-nativekuang-jia-yuan-ma-xue-xi-iosxia.html
```

### React Native通信机制详解
```
http://blog.cnbang.net/tech/2698/
```

### [RN导航](https://reactnavigation.org/docs/getting-started.html)

```
https://reactnavigation.org/docs/getting-started.html
```

### RN [热更新](https://github.com/reactnativecn/react-native-pushy/blob/master/docs/guide2.m)
```
https://github.com/reactnativecn/react-native-pushy/blob/master/docs/guide2.md
https://www.jianshu.com/p/6254ee9863f7
```

### RN [第三方组件库集合](https://github.com/jondot/awesome-react-native)
```
https://github.com/jondot/awesome-react-native
```
