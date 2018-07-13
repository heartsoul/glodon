'use strict'
import React, { Component } from 'react';
import PropTypes from 'prop-types'

import {
    StyleSheet,
    View,
    Image,
} from 'react-native';

import API from 'app-api';
const defaultImage = require('app-images/doc/icon_doc_file_drawing.png');
const pdfImage = require('app-images/doc/icon_doc_file_pdf.png');
const wordImage = require('app-images/doc/icon_doc_file_drawing.png');
const pptImage = require('app-images/doc/icon_doc_file_drawing.png');
const excelImage = require('app-images/doc/icon_doc_file_drawing.png');
const zipImage = require('app-images/doc/icon_doc_file_drawing.png');
const dwgImage = require('app-images/doc/icon_doc_file_drawing.png');
const modelImage = require('app-images/doc/icon_doc_file_rvt.png');
const picImage = require('app-images/doc/icon_doc_file_pic.png');

const extImages = {
'rvt':modelImage,
'pdf':pdfImage,
'doc':wordImage,
'docx':wordImage,
'jpg':picImage,
'jpeg':picImage,
'png':picImage,
'gif':picImage,
'ppt':pptImage,
'xls':excelImage,
'xlsx':excelImage,
'zip':zipImage,
'dwg':dwgImage,
'rar':zipImage,
'default':defaultImage,
}
function getExtImage(ext) {
    let ret1 = ext.split('.');
    let newExt = ret1.slice(-1);
    let ret = extImages[newExt] || extImages['default'] 
    return ret;
}
/**
 * 缩略图
 */

export default class DocImageView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            url: null,
        }
    }

    componentDidMount() {
        if (this.props.fileId) {
            API.getBluePrintThumbnail(storage.loadProject(), global.storage.projectIdVersionId, this.props.fileId)
            .then(responseData => {
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
        let validExt = this.props.ext;
        if(validExt) {
            validExt = ''+validExt;
            let retExt = validExt.split(".").pop();
            return getExtImage(retExt);
        }
        if (!this.state.url) {
            let ret = require('app-images/icon_default_blueprint.png');
            return ret;
        }
        return ({ uri: this.state.url });
    }

    render() {
        const {imageStyle = {}} = this.props;
        return (
            <View>
                <Image style={[{ width: 42, height: 42 },imageStyle]} source={this.getImageSource()} />
            </View>
        )
    }
}

DocImageView.propTypes = {
    fileId: PropTypes.string,
    imageStyle: PropTypes.any,
    ext:PropTypes.any
}