import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    Switch,
    View
} from 'react-native';
import PropTypes from 'prop-types'
import { ListRow } from 'app-3rd/teaset';

export default class RectificationView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            switchValue: false,//需要整改
        };
    }

    onChangeSwitch = (switchValue) => {
        this.setState({
            switchValue: switchValue,
        })
    }

    renderSwitchView = () => {
        return (
            <Switch value={this.state.switchValue} onValueChange={(value) => { this.onChangeSwitch(value) }} />
        );
    }

    /**
     * 
     */
    getSwitchValue = () => {
        return {
            value: this.state.switchValue,
            date: '',
        };
    }

    render() {

        return (
            <View style={styles.container}>
                <ListRow title='需要整改' bottomSeparator='indent' detail={this.renderSwitchView()} />
                {
                    (this.state.switchValue) ? (
                        <ListRow title='整改期限' accessory='indicator' bottomSeparator='indent' detail={'2018-04-08'} />
                    ) : (null)
                }
            </View>
        )
    }
}

RectificationView.propTypes = {
    /**
   * 默认的日期
   */
    date: PropTypes.string
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginBottom: 11
    },
})
