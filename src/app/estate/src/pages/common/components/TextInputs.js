import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, TextInput, TouchableOpacity,View,Image } from 'react-native'
import thunk from 'redux-thunk';
const icon_login_password_delete = require("app-images/login/icon_login_password_delete.png")
const icon_login_password_hide = require("app-images/login/icon_login_password_hide.png")
const icon_login_password_show = require("app-images/login/icon_login_password_show.png")
export class TextInputNormal extends Component {
  textInput = null;
  constructor(props) {
    super(props);
    this.textInput = null;
    /*用来指示是否显示Loading提示符号*/
    this.state = {
      disabled: false,
    };
  }
  focus = () =>{
    this.textInput.focus();
  }
  render() {
    return (
      <TextInput
      ref={(ref)=>{this.textInput=ref}}
      style={styles.style_user_input}
      numberOfLines={1}
      autoFocus={true}
      returnKeyType = "next"
      enablesReturnKeyAutomatically={true}
      underlineColorAndroid={"transparent"}
      textAlign="left"
      autoCorrect={false}
      autoCapitalize='none'
      placeholder={this.props.placeholder}
      onSubmitEditing ={(text)=>{
        this.props.onChangeText('\n');
      }
      }
      onChangeText={(text)=>{
        this.props.onChangeText(text);
      }
      }
      value={this.props.value}
      onBlur={this.props.onBlur}
      onFocus={this.props.onFocus}
    />
    )
  }
}

TextInputNormal.propTypes = {
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onBlur: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onChangeText: PropTypes.func.isRequired,
}

export class TextInputPassword extends Component {

  textInput = null;
  constructor(props) {
    super(props);
    this.textInput = null;
    /*用来指示是否显示Loading提示符号*/
    this.state = {
      disabled: false,
      secureTextEntry:true,
      resetData:false,
      value:this.props.value
    };
  }
  _onClearTextEntry = () =>{
    this.setState({
      value:'',
    });
  }
  _onSecureTextEntry = () =>{
    if(this.state.secureTextEntry) {
      this.setState({
        resetData:true,
        secureTextEntry:!this.state.secureTextEntry,
      });
    } else {
      this.setState({
        secureTextEntry:!this.state.secureTextEntry,
      });
    }
    // this.textInput.setSelectionRange(0, this.textInput.value.length);
  }
  focus = () =>{
    this.textInput.focus();
  }
  render() {
    return (
      <View  style={[styles.style_input,]}>
      <TextInput ref={(ref)=>{this.textInput=ref}}
      style={[styles.style_pwd_input]}
      numberOfLines={1}
      returnKeyType = "done"
      underlineColorAndroid={"transparent"}
      secureTextEntry={this.state.secureTextEntry}
      enablesReturnKeyAutomatically={true}
      textAlign="left"
      autoCorrect={false}
      autoCapitalize='none'
      // autoFocus={true}
      placeholder={this.props.placeholder}
      onSubmitEditing ={(text)=>{
        this.props.onChangeText('\n');
      }
      }
      onChangeText={(text)=>{
        if(this.state.resetData == true) {
          text = this.state.value;
          this.setState({
            value:text,
            resetData:false
          });
        } 
        this.props.onChangeText(text);}
      }
      value={this.state.value}
      onBlur={this.props.onBlur}
      onFocus={this.props.onFocus}
    />
    <View  style={[styles.style_input_action,]}>
    <TouchableOpacity onPress={this._onSecureTextEntry}><Image style={styles.style_image} source={this.state.secureTextEntry ? icon_login_password_hide : icon_login_password_show}/></TouchableOpacity>
    </View>
    </View>
    )
  }
}
TextInputPassword.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  onBlur: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onChangeText: PropTypes.func.isRequired,
}

export class TextInputImage extends Component {

  textInput = null;
  constructor(props) {
    super(props);
    this.textInput = null;
    /*用来指示是否显示Loading提示符号*/
    this.state = {
      disabled: false,
      resetData:false,
      value:this.props.value
    };
  }
  _onClearTextEntry = () =>{
    this.setState({
      value:'',
    });
  }
 
  focus = () =>{
    this.textInput.focus();
  }
  render() {
    return (
      <View  style={[styles.style_input,]}>
      <TextInput ref={(ref)=>{this.textInput=ref}}
      style={[styles.style_pwd_input]}
      numberOfLines={1}
      returnKeyType = "done"
      underlineColorAndroid={"transparent"}
      enablesReturnKeyAutomatically={true}
      textAlign="left"
      // autoFocus={true}
      placeholder={this.props.placeholder}
      autoCorrect={false}
      autoCapitalize='none'
      onSubmitEditing ={(text)=>{
        this.props.onChangeText('\n');
      }
      }
      onChangeText={(text)=>{
        this.props.onChangeText(text);}
      }
      value={this.state.value}
      onBlur={this.props.onBlur}
      onFocus={this.props.onFocus}
    />
    <View  style={[styles.style_input_action,]}>
    <TouchableOpacity onPress={this.props.onImageClick}><Image style={styles.style_image_captcha} source={{uri:this.props.imageUrl}}/></TouchableOpacity>
    </View>
    </View>
    )
  }
}

TextInputImage.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  onBlur: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onChangeText: PropTypes.func.isRequired,
  imageUrl:PropTypes.string.isRequired,
  onImageClick:PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  style_input: {
    // width:'100%',
    // backgroundColor:'red',
    marginLeft: 20,
    marginRight: 20,
    marginTop:12,
    height:40
  },
  style_input_action: {
    flexDirection:"row",
    // backgroundColor:'blue',
    position:'absolute',
    right:0,
    top:0,
    width:60,
    height:40,
    justifyContent: "center",
    alignContent:"flex-end",
    alignItems: "center",
  },
  style_image: {
    width:27,
    height:27,
    marginRight:0
   },
   style_image_captcha: {
    width:160,
    height:40,
    marginRight:0,
    resizeMode:'center',
   },
   
   style_image_delete: {
    width:20,
    height:20,
    marginRight:10,
    // display:'none',
   },
  style_input_submit: {
    marginTop: 15,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "#333",
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    color: "#fff"
  },
  style_user_input: {
    width:'100%',
    backgroundColor: "#fff",
    marginTop: 12,
    height: 40,
    marginLeft: 20,
    marginRight: 60,
  },
  style_pwd_input: {
    backgroundColor: "#fff",
    height: 40,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 60,
    fontSize:12,
  },
});