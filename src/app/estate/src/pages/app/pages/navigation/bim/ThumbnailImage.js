'use strict'
import React, { Component } from 'react';
import PropTypes from 'prop-types'

import {
    StyleSheet,
    View,
    Image,
} from 'react-native';

import * as API from 'app-api';

/**
 * 缩略图
 */

export default class ThumnbnailImage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            url: null,
        }
    }

    componentDidMount() {
        if (this.props.fileId) {
            // console.log(this.props.fileId)
            API.getBluePrintThumbnail(storage.loadProject(), global.storage.projectIdVersionId, this.props.fileId)
                .then(responseData => {
                    // console.log('getBluePrintThumbnail ')
                    // console.log(responseData)
                    if (responseData) {
                        let url = responseData.data.data.thumbnailUrl;
                        this.setState({
                            url: url,
                        })
                    }
                }).catch(error=>{
                    
                });
        }
    }

    getImageSource = () => {
        if (!this.state.url) {
            let ret = require('app-images/icon_default_blueprint.png');
            return ret;
        }
        return ({ uri: this.state.url });
    }

    render() {
        return (
            <View>
                <Image style={{ width: 72, height: 48 }} source={this.getImageSource()} />
            </View>
        )
    }
}

ThumnbnailImage.propTypes = {
    fileId: PropTypes.string,
}