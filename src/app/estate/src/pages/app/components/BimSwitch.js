import React,{Component} from 'react';
import  {PropTypes} from 'prop-types';
import{
    Image,TouchableOpacity
} from 'react-native';
const icon_switch_open = require('app-images/icon_switch_open.png');
const icon_switch_close = require('app-images/icon_switch_close.png');

//设置界面的开关按钮
export default class BimSwitch extends Component{

    constructor(){
        super();
        
        this.state={
            isOpen:false
        }
    }

    static propTypes = {
        // value: PropTypes.bool.isRequired,
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
        let {styleIn={}} = this.props;
        let path = this.state.isOpen?icon_switch_open:icon_switch_close
        return (
            <TouchableOpacity style={styleIn} onPress={(event)=>{event.preventDefault(); this._click()}}>
                <Image source={path} style={{width:36,height:18}} />
            </TouchableOpacity>
        );
    }
}