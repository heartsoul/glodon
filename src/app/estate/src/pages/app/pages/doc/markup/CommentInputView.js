import React, { Component } from 'react';
import {
    TouchableWithoutFeedback,
    StyleSheet,
    Dimensions,
    SafeAreaView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'app-3rd/index';
import { Overlay, } from 'app-3rd/teaset';
import ComponentInputChild from './ComponentInputChild'

var { width, height } = Dimensions.get('window')

class CommentInputView extends Overlay {
    static overlayView;
    static content;
    static show(addModelMarkupComment, modelInfo) {
        return super.show(
            <Overlay.View side='bottom' modal={false}
                style={styles.container}
                overlayOpacity={0.7}
                ref={v => this.overlayView = v}
            >
                <KeyboardAwareScrollView style={{ width: '100%' }} scrollEnabled={false}>
                    <TouchableWithoutFeedback onPress={() => {
                        CommentInputView.close();
                    }}>
                        <SafeAreaView style={styles.inputBg}>
                            <ComponentInputChild
                                addModelMarkupComment={addModelMarkupComment}
                                onChangeText={(value) => { this.content = value }}
                                content={this.content}
                                modelInfo={modelInfo}
                            />
                        </SafeAreaView>
                    </TouchableWithoutFeedback>
                </KeyboardAwareScrollView>

            </Overlay.View>
        )
    }

    static clear() {
        this.content = '';
    }

    static close() {
        if (this.overlayView) {
            this.overlayView.close()
        }
    }


}

export default CommentInputView;

const styles = StyleSheet.create({

    inputBg: {
        height: height,
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
    },
})
