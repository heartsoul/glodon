import React,{Component} from 'react';
import  {PropTypes} from 'prop-types';
import{
    Image,TouchableOpacity
} from 'react-native';
//设置界面的开关按钮
export default class BimSwitch extends Component{

    constructor(){
        super();
        
        this.state={
            isOpen:false
        }
    }

    static propTypes = {
        value: PropTypes.bool.isRequired,
        onValueChange: PropTypes.func.isRequired,
      }
    
    _click = ()=>{
        const {onValueChange } = this.props;
        this.setState((pre)=>{
            onValueChange(!pre.isOpen);
            return {
                isOpen:!pre.isOpen,
            }
        })
    }

    componentDidMount=()=>{
        const{value} = this.props;
        this.setState((pre)=>{
            return {
                isOpen:value,
            }
        })
    }
    render(){
        
        let path = this.state.isOpen?require('app-images/icon_switch_open.png'):require('app-images/icon_switch_close.png')
        // let path = value?require('app-images/icon_switch_open.png'):require('app-images/icon_switch_close.png')
        return (
            <TouchableOpacity onPress={()=>{this._click()}}>
                <Image source={path} style={{width:36,height:18,marginRight:21}} />
            </TouchableOpacity>
        );
    }
}