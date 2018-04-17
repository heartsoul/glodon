
import PropTypes from 'prop-types';
import React from 'react';
import {View, StyleSheet,Text as Label} from 'react-native';
// import {Label} from 'app-3rd/teaset';
export default class QualityInfoItem extends React.Component {
    _onChange = (event) => {
        if (!this.props.onChange) {
            return;
        }
    }
    render() {
        return (
            <View 
                {...this.props}
                style={styles.containerView}
                onChange={(e) => { this._onChange(e); }}
            >
            {/* <Label style={styles.leftTitle}>{this.props.leftTitle}</Label> */}
            <Label style={styles.content}>{this.props.content}</Label>
            </View>
        );
    }
}

QualityInfoItem.propTypes = {
   
    /**
     * 左侧标题
     */
    leftTitle: PropTypes.string,

    /**
     * 内容
     */
    content: PropTypes.string,
};

const styles = StyleSheet.create({

    containerView:{
        // flex: 1,
        // marginTop: 10,
        // marginBottom: 10,
        // marginLeft: 10,
        // marginRight: 10,
        // backgroundColor: '#FFF',
        // alignItems: "center",
        // alignContent: "center",
        flexDirection:'row',
        width:'100%',
    },
    content: {
        // width:200,
        // height:300,
        color:'#666666'
    },
    leftTitle: {
        width:100,
    },
});