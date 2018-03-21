
import PropTypes from 'prop-types';
import React from 'react';
import { requireNativeComponent, processColor } from 'react-native';

class PhotoView extends React.Component {
    _onChange = (event) => {
        if (!this.props.onChange) {
            return;
        }

        // process raw event...
        this.props.onChange(event.nativeEvent);
    }
    render() {
        return (
            <GLDRCTPhotoView
                {...this.props}
                onChange={(e)=>{this._onChange(e);}} title={this.props.title ? {title:this.props.title.title,color:processColor(this.props.color)}:{title:"按钮"}}
                backgroudColor={processColor(this.props.backgroudColor)}
            />
        );
    }
}
PhotoView.propTypes = {
    /**
     * A Boolean value that determines whether the user may use pinch
     * gestures to zoom in and out of the map.
     */
    //  title: PropTypes.string,
    //  tintColor:PropTypes.string,
//     /**
//      * The region to be displayed by the map.
//      *
//      * The region is defined by the center coordinates and the span of
//      * coordinates to display.
//      */
        backgroudColor:PropTypes.oneOfType(PropTypes.number,PropTypes.string),
        title: PropTypes.shape({
        /**
         * Coordinates for the center of the map.
         */
        title: PropTypes.string.isRequired,
        color: PropTypes.number | PropTypes.string,

        // /**
        //  * Distance between the minimum and the maximum latitude/longitude
        //  * to be displayed.
        //  */
        // latitudeDelta: PropTypes.number.isRequired,
        // longitudeDelta: PropTypes.number.isRequired,
    }),
//     /**
//    * Callback that is called continuously when the user is dragging the map.
//    */
     onChange: PropTypes.func,
};

var GLDRCTPhotoView = requireNativeComponent('GLDRCTPhotoView', PhotoView);

module.exports = PhotoView;