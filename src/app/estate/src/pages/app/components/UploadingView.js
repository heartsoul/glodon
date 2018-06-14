import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    StyleSheet,
    DeviceEventEmitter,
} from 'react-native';
import PropTypes from 'prop-types'
const icon_login_password_delete = require('app-images/login/icon_login_password_delete.png')
class UploadingProcessView extends Component {
    render() {
        const { height = 5, percent = 0, uploading = false } = this.props;
        return (<View style={[styles.progressViewOut, { height: height, borderRadius: height / 2, }]}>
            <View style={[styles.progressViewIn, { width: + percent + '%', height: height, borderRadius: height / 2, }]}></View>
            {
                uploading ?
                    <TouchableOpacity style={{ position: 'absolute', top: 0, right: 0 }} onPress={this.props.onCancel}>
                        <Image style={{ width: height, height: height, backgroundColor: 'transparent', resizeMode: 'contain' }} source={icon_login_password_delete} />
                    </TouchableOpacity>
                    : null
            }
        </View>

        )
    }
}
UploadingProcessView.propTypes = {
    percent: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    onCancel: PropTypes.func,
    uploading: PropTypes.bool,
}
class UploadingCircleProcessView extends Component {

}
export default class UploadingView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            percent: 0,
            uploading: false,
            uploadKey: props.uploadKey,
        }
    }
    static UploadingProcessView = UploadingProcessView;
    static UploadingCircleProcessView = UploadingCircleProcessView;
    uploadProcessStart = (key, task, onCancel) => {
        let uv = this;
        if (key && key === uv.state.uploadKey && task) {
            uv.onCancel = () => {
                onCancel && onCancel();
            }
            task.onProgress = uv.onProgress;
            task.onFinish = uv.onFinish;
            this.setState({
                percent: 0,
                uploading: true,
            });
        }
    }

    componentWillMount = () => {
        if (!this.state.uploadKey) {
            return;
        }
        DeviceEventEmitter.addListener('uploadProcessStart',this.uploadProcessStart);
    }

    componentWillUnmount = () => {
        try {
            if (!this.state.uploadKey) {
                return;
            }
            DeviceEventEmitter.removeListener('uploadProcessStart',this.uploadProcessStart);
        } catch (error) {

        }

    }

    onProgress = (written, total) => {
        let percent = parseInt(written * 100 / total / 100);
        this.setState({
            percent: percent
        });
    }

    onFinish = () => {
        let percent = 100;
        this.setState(
            {
                percent: percent,
            });
        setTimeout(()=>{
            this.setState(
                {
                    uploading: false,
                });
        }, 500
        );
    }

    render = () => {
        if(!this.state.uploading) {
            return null;
        }
        if (this.props.children) {
            return
            (<View style={[this.props.style]}>
                {this.props.children}
            </View>);

        }
        return (<View style={[this.props.style]}>
            <UploadingProcessView percent={this.state.percent} uploading={this.state.uploading} height={5} onCancel={() => {
                this.onCancel && this.onCancel();
            }} />
        </View>);
    }
}
UploadingView.propTypes = {
    uploadKey: PropTypes.string.isRequired,
}
const styles = StyleSheet.create({
    progressViewOut: {
        width: '100%',
        backgroundColor: '#666666',
        opacity: 0.75,

    },
    progressViewIn: {
        width: '100%',
        height: '100%',
        backgroundColor: '#00baf3',
    },
})