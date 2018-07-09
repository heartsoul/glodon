import React, { Component } from 'react'
import { StyleSheet, Text, TouchableOpacity,View,SafeAreaView,Keyboard, TextInput,KeyboardAvoidingView} from 'react-native'
import {Overlay} from 'app-3rd/teaset'


export default class ActionInputModal extends Component {
    static showConfirm = (title, message, cancel, confirm,inputValue,errorMessage) => {
        if(!cancel) {
            cancel = {};
        }
        if(!confirm) {
            confirm = {};
        }
        if(!cancel.style) {
            cancel.style = styles.style_cancel
        }
        if(!cancel.text) {
            cancel.text = "取消"
        }
        if(!confirm.style) {
            confirm.style = styles.style_confirm
        }
        if(!confirm.text) {
            confirm.text = "确定" 
        }
       return ActionInputModal.showView(ActionInputModal.buildInputView(title,message,[cancel,confirm],inputValue,errorMessage),true);
    };
    static show = (title, message, actions,inputValue,errorMessage) => {
        // let titleElement = (<Text style={styles.style_title}>{title}</Text>);
        // let messageElement = (<Text style={styles.style_message}>{message}</Text>);
        // Modal.alert(titleElement, messageElement, actions);
       return  ActionInputModal.showView(ActionInputModal.buildAlertView(title,message,actions,inputValue,errorMessage),true);
    };

    static buildInputView = (title,message,actions,inputValue,errorValue) => {
        let titleView = null;
        let messageView = null;
        let inputView = null;
        let errorMessageView = null;
        let actionsView = null;
        let bCenter = false;
        
        if(message) {
            messageView = (
                <Text style={styles.style_message}>{message}</Text>
            );
        }

        if(title) {
            if(message) {
                titleView = (
                    <Text style={styles.style_title}>{title}</Text>
                );
            } else {
                titleView = (
                    <Text style={styles.style_title_center}>{title}</Text>
                );
                bCenter = true;
            }
           
        }
        if(!actions) {
            actions = [{
                style:styles.style_confirm,
                text:'关闭'
            }];
        }
        let textValue = inputValue;
        inputView = (<TextInput onChangeText={(text)=>{textValue = text;}} style={[styles.style_textInput,(errorValue&&errorValue.length) ? styles.style_textInputError : {}]} defaultValue={inputValue} /> )
       
        errorMessageView = (<Text style={styles.style_error}>{errorValue}</Text>)
        let count = actions.length;
        let widthP = parseInt(100 / count)+'%';
        actionsView =(<View style={styles.style_actionsView}>
                {
                    actions.map((action,index)=>{
                       return (<TouchableOpacity key={'action_item'+index} style={[styles.style_actionView,{width:widthP}
                       ,index==0?{borderLeftWidth:0}:null]} onPress={(e)=>{
                           e.preventDefault();
                           ActionInputModal.close();
                           action.onPress && action.onPress(e,textValue);
                        }}><Text style={action.style}>{action.text}</Text></TouchableOpacity>
                        )
                    })
                }
                </View>);
        
        return (<View style={styles.style_alertView}>
            <View style={bCenter?styles.style_contentView_center:styles.style_contentView}>
                {titleView}
                {messageView}
                {inputView}
                {errorMessageView}
            </View>
            {actionsView}
            </View>);
    }
    static overlayViewKey = null;
    static close = () => {
        if(ActionInputModal.overlayViewKey) {
            Overlay.hide(ActionInputModal.overlayViewKey);
            ActionInputModal.overlayViewKey = null;
        }
    }
    static showView = (ContentView,modal=false) =>{
        ActionInputModal.close();
        let overlayView = (
            <Overlay.View 
                side='bottom'
                style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', alignContent: 'center', }}
                modal={modal}
                overlayOpacity={0.5}
                ref={v => this.overlayView = v}
            >
                
                <KeyboardAvoidingView behavior='padding'>
                <SafeAreaView>
                    {ContentView}
                </SafeAreaView>
                </KeyboardAvoidingView>   
                
            </Overlay.View>
        );
        ActionInputModal.overlayViewKey =  Overlay.show(overlayView);
        return ContentView;
    }

}

const styles = StyleSheet.create({
    style_alertView: {
        minHeight:60,
        minWidth:180,
        backgroundColor:'white',
        borderRadius: 6,
        marginTop: 40,
        marginBottom: 40,
        marginLeft: 40,
        marginRight: 40,
    },
    style_contentView_center: {
        minHeight:88,
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'center', 
        justifyContent: 'center', 
        alignContent: 'center',
    },
    style_contentView: {
        minHeight:88,
        paddingLeft: 20,
        paddingRight: 20,
    },
    style_actionsView: {
        minHeight:44,
        width:'100%',
        marginTop: 22,
        borderTopColor:'#e7e7e7',
        borderTopWidth:0.5,
        flexDirection: 'row',
    },
    style_actionView: {
        minHeight:44,
        minWidth:60,
        // backgroundColor:'orange', 
        borderLeftWidth:0.5,
        borderLeftColor:'#e7e7e7',
        alignItems: 'center', 
        justifyContent: 'center', 
        alignContent: 'center',
    },
    style_lineView: {
        height:1,
        width:'100%',
        backgroundColor:'#e7e7e7', 
        marginTop: 10,
    },
    style_title: {
        paddingTop:20,
        color: '#000000',
        fontSize:18,
        fontWeight:'bold',
        marginTop: 10,
    },
    style_title_center: {
        paddingTop:20,
        color: '#000000',
        fontSize:16,
        marginTop: 10,
        lineHeight:20,
    },
    style_message: {
        color: '#000000',
        fontSize:14,
        marginTop: 6,
        marginBottom: 10,
        lineHeight:18,
    },
    style_cancel: {
        color: '#000000',
        fontSize:18,
        marginTop: 10,
        marginBottom: 10,
    },
    style_close: {
        color: '#00baf3',
        fontSize:18,
        marginTop: 10,
        marginBottom: 10,
    },
    style_confirm: {
        color: '#00baf3',
        fontSize:18,
    },
    style_delete: {
        color: '#FF0000',
        fontSize:18,
    },
    style_textInput: {
        marginTop:20,
        paddingLeft:10,
        paddingRight:10,
        height: 36,
        width:'100%',
        color: '#000000',
        fontSize:17,
        borderColor:'#E9E9E9',
        borderWidth:1,
        borderRadius:3,
        width:'100%',
        maxWidth:'100%',
        backgroundColor:'#F7F7F7'
    },
    style_textInputError: {
        color: '#F55353',
        borderColor:'#F55353',
        backgroundColor:'#FFF3F3',
    },
    style_error: {
        marginTop:5,
        width:'100%',
        color: '#FF0000',
        fontSize:12,
        minHeight:23,
    },
});


