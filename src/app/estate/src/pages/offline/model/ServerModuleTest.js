import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
  } from 'react-native';
//   import ModelServer from './ServerModule';
import BimSwitch from '../../app/components/BimSwitch'
  
  export default class App extends Component {
    
    
    startServer = ()=>{
        // ModelServer.startServer();
    }
 
    stopServer = ()=>{
        // ModelServer.stopServer();
    }

    onValueChange = (value)=>{
        console.log(value);
    }
    render() {
      return (
          <View>
            <TouchableOpacity onPress={this.startServer}>
                <View >
                    <Text style={{marginTop:40}}>
                    startServer
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.stopServer}>
                <View >
                    <Text style={{marginTop:40}}>
                    stopServer
                    </Text>
                </View>
            </TouchableOpacity>

            <BimSwitch value={true} onValueChange={this.onValueChange} />
        </View>
      );
    }
  }