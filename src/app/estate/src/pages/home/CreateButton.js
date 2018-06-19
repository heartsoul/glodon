import React from 'react'

import {Platform, View, Image} from 'react-native'

export default class CreateButton extends React.Component {
    renderIOS() {
        return <View style={{
            width: 70,
            height: 70,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Image
              style={[{ width: 61, height: 61,resizeMode:'contain',position:'absolute'},{top:20,left:4.5}]}
              source={require('app-images/home/icon_main_create.png')}
            />
          </View>
    }
    renderAndroid() {
        return <View style={{
            width: 70,
            height: 70,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Image
                style={[{ width: 61, height: 61,resizeMode:'contain',position:'absolute'},{top:10,left:4.5}]}
              source={require('app-images/home/icon_main_create.png')}
            />
          </View>
    }
    renderWeb() {
        return <View style={{
            width: 70,
            height: 44,
            alignItems: 'center',
          }}>
            <Image
              style={[{ width: 61, height: 61,resizeMode:'contain',position:'absolute',bottom:0,left:4.5}]}
              source={require('app-images/home/icon_main_create.png')}
            />
          </View>
    }
    render () {
        if(Platform.OS === 'ios') {
            return this.renderIOS();
        }
        if(Platform.OS === 'android') {
            return this.renderAndroid();
        }
        if(Platform.OS === 'web') {
            return this.renderWeb();
        }
    
    }
}

