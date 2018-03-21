
import PropTypes from 'prop-types';
import React from 'react';
import { requireNativeComponent } from 'react-native';

class SwitchView extends React.Component {
    _onChange = (event) => {
        if (!this.props.onChange) {
            return;
        }

        // process raw event...
        this.props.onChange(event.nativeEvent);
    }
    render() {
        return (
            <Switch
                {...this.props}
                onRegionChange={this._onChange}
            />
        );
    }
}
SwitchView.propTypes = {
    /**
     * A Boolean value that determines whether the user may use pinch
     * gestures to zoom in and out of the map.
     */
    value: PropTypes.bool,
    disabled: PropTypes.bool,
    onTintColor:PropTypes.string,
    tintColor:PropTypes.string,
    thumbTintColor:PropTypes.string,
    /**
   * Callback that is called continuously when the user is dragging the map.
   */
    onChange: PropTypes.func,
};

var Switch = requireNativeComponent('RNTSwitch', SwitchView);

module.exports = SwitchView;