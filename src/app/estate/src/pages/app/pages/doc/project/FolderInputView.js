import React, { Component } from 'react';
import {
    TouchableWithoutFeedback,
    StyleSheet,
    Dimensions,
    SafeAreaView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'app-3rd/index';
import { Overlay, } from 'app-3rd/teaset';
import DocEditInputView from './DocEditInputView'

var { width, height } = Dimensions.get('window')

export default class FolderInputView extends Overlay {
    static overlayView;
    static show(editInfo,title) {
        return super.show(
            <Overlay.View side='bottom' modal={false}
                style={styles.container}
                overlayOpacity={0.7}
                ref={v => this.overlayView = v}
            >
                <KeyboardAwareScrollView style={{ width: '100%' }} scrollEnabled={false}>
                    <TouchableWithoutFeedback onPress={() => {
                        FolderInputView.close();
                    }}>
                        <SafeAreaView style={styles.inputBg}>
                            <DocEditInputView editInfo={editInfo}
                                title={this.title}
                            />
                        </SafeAreaView>
                    </TouchableWithoutFeedback>
                </KeyboardAwareScrollView>

            </Overlay.View>
        )
    }
    static close() {
        if (this.overlayView) {
            this.overlayView.close()
        }
    }


}

const styles = StyleSheet.create({

    inputBg: {
        height: height,
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
    },
})
