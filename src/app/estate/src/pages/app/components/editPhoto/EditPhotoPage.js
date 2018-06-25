import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import GLDCanvas from "./GLDCanvas";
/**
 * 图片编辑
 */
class EditPhotoPage extends Component {

    static navigationOptions = {
        headerTitle: <Text />,
        headerRight: <View />,
        header: null
    };

    constructor(props) {
        super(props);
        const { url, callback } = this.props.navigation.state.params;
        this.state = {
            url: url,
            callback: callback
        };
    }

    _close = () => {
        this.props.navigation.goBack();
    }
    _useImage = (imageData) => {
        this.state.callback(imageData)
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View style={styles.container}>
                <GLDCanvas
                    close={this._close}
                    useImage={this._useImage}
                    url={this.state.url} />
            </View>
        );
    }
}

export default EditPhotoPage;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#000",
        height: "100%"
    }
})