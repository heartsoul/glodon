import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, TouchableOpacity,View,SafeAreaView,Keyboard} from 'react-native'
import {Overlay} from 'app-3rd/teaset'


export default class ActionModal extends Component {
    static alertConfirm = (title, message, cancel, confirm) => {
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
        // let titleElement = (<Text style={styles.style_title}>{title}</Text>);
        // let messageElement = (<Text style={styles.style_message}>{message}</Text>);
        // Modal.alert(titleElement, messageElement, [{ text: cancel.text,style: [styles.style_cancel, cancel.style]}
            // ,{ text: confirm.text, style: [styles.style_confirm,confirm.style], onPress:confirm.onPress ? confirm.onPress:null}]);
            ActionModal.showView(ActionModal.buildAlertView(title,message,[cancel,confirm]));
        };
    static alertTip = (title, message, confirm) => {
        if(!confirm) {
            confirm = {};
        }
        if(!confirm.style) {
            confirm.style = styles.style_confirm
        }
        if(!confirm.text) {
            confirm.text = "确定"
        }
        // let titleElement = (<Text style={styles.style_title}>{title}</Text>);
        // let messageElement = (<Text style={styles.style_message}>{message}</Text>);
        setTimeout(() => {
            ActionModal.showView(ActionModal.buildAlertView(title,message,[{ text: confirm.text, style: [styles.style_confirm,confirm.style], onPress:confirm.onPress ? confirm.onPress:null}]));
            // Modal.alert(titleElement, messageElement, [{ text: confirm.text, style: [styles.style_confirm,confirm.style], onPress:confirm.onPress ? confirm.onPress:null}]);
        }, 100);
        
    };
    static alert = (title, message, actions) => {
        // let titleElement = (<Text style={styles.style_title}>{title}</Text>);
        // let messageElement = (<Text style={styles.style_message}>{message}</Text>);
        // Modal.alert(titleElement, messageElement, actions);
        ActionModal.showView(ActionModal.buildAlertView(title,message,actions));
    };

    static buildAlertView = (title,message,actions) => {
        let titleView = null;
        let messageView = null;
        let actionsView = null;
        let lineView = null;
        
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
            }
           
        }
        if(!actions) {
            actions = [{
                style:styles.style_confirm,
                text:'关闭'
            }];
        }
        let count = actions.length;
        let widthP = parseInt(100 / count)+'%';
        actionsView =(<View style={styles.style_actionsView}>
                {
                    actions.map((action,index)=>{
                       return (<TouchableOpacity key={'action_item'+index} style={[styles.style_actionView,{width:widthP}
                       ,index==0?{borderLeftWidth:0}:null]} onPress={(e)=>{ActionModal.close();action.onPress && action.onPress(e);}}><Text style={action.style}>{action.text}</Text></TouchableOpacity>
                        )
                    })
                }
                </View>);
        
        return (<View style={styles.style_alertView}>
            {titleView}
            {messageView}
            {actionsView}
            </View>);
    }
    static overlayViewKey = null;
    static close = () => {
        if(ActionModal.overlayViewKey) {
            Overlay.hide(ActionModal.overlayViewKey);
            ActionModal.overlayViewKey = null;
        }
    }
    static showView = (ContentView,modal=false) =>{
        ActionModal.close();
        let overlayView = (
            <Overlay.View 
                side='bottom'
                style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', alignContent: 'center', }}
                modal={modal}
                overlayOpacity={0.5}
                ref={v => this.overlayView = v}
            >
                <SafeAreaView>
                    {ContentView}
                </SafeAreaView>
            </Overlay.View>
        );
        ActionModal.overlayViewKey =  Overlay.show(overlayView);
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
    style_actionsView: {
        minHeight:44,
        width:'100%',
        marginTop: 22,
        borderTopColor:'#e7e7e7',
        borderTopWidth:0.5,
        flexDirection: 'row'
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
        paddingLeft:20,
        paddingRight:20,
        color: '#000000',
        fontSize:18,
        fontWeight:'bold',
        marginTop: 10,
    },
    style_title_center: {
        paddingTop:20,
        paddingLeft:20,
        paddingRight:20,
        color: '#000000',
        fontSize:16,
        marginTop: 10,
        width:'100%',
        textAlign:'center'
    },
    style_message: {
        paddingLeft:20,
        paddingRight:20,
        color: '#000000',
        fontSize:14,
        marginTop: 6,
        marginBottom: 10,
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
});


