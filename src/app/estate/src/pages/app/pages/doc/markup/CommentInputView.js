import React from 'react';
import {
    StyleSheet,
    KeyboardAvoidingView,
} from 'react-native';
import { Overlay, } from 'app-3rd/teaset';
import ComponentInputChild from './ComponentInputChild'

class CommentInputView extends Overlay {
    static overlayView;
    static content;
    static show(addModelMarkupComment, modelInfo) {
        return super.show(
            <Overlay.View
                side='bottom'
                modal={false}
                style={{ justifyContent: 'flex-end' }}
                overlayOpacity={0.7}
                ref={v => this.overlayView = v}
            >
                <KeyboardAvoidingView behavior='padding'>
                    <ComponentInputChild
                        addModelMarkupComment={addModelMarkupComment}
                        onChangeText={(value) => { this.content = value }}
                        content={this.content}
                        modelInfo={modelInfo}
                    />
                </KeyboardAvoidingView>
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
})
