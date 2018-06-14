import React, { Component } from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import CircleProgressView from './circlebar/CircleProgressView'
import PropTypes from 'prop-types'
import {DeviceEventEmitter} from 'app-3rd'
class UploadingProcessView extends Component {
    render() {
        const { height = 5, progress = 0} = this.props;
        return (<View style={[styles.progressViewOut, { height: height, borderRadius: height / 2, }]}>
            <View style={[styles.progressViewIn, { width: + progress + '%', height: height, borderRadius: height / 2, }]}></View>
            {this.props.children}
        </View>
        )
    }
}
UploadingProcessView.propTypes = {
    percent: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
}
class UploadingCircleProcessView extends Component {
    render() {
        <CircleProgressView progress={this.props.progress} totalNum={this.props.totalNum} raduis={this.props.raduis}>
        {this.props.children}
        </CircleProgressView>
    }
}

UploadingCircleProcessView.propTypes = {
    progress: PropTypes.number.isRequired,
    raduis: PropTypes.number.isRequired,
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

    // 这个会被任务给重写
    onCancel = () => {
        // 这里如果有任务的话，就可以取消掉任务。
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
        this.onCancel = ()=>{}; // 重置取消方法，完成了就不用了。
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
            <UploadingProcessView progress={this.state.percent} uploading={this.state.uploading} height={5} onCancel={() => {
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