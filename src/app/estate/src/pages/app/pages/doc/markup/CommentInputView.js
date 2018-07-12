import React from 'react';
import {
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Overlay, } from 'app-3rd/teaset';
import ComponentInputChild from './ComponentInputChild'

class CommentInputView extends Overlay {
    static overlayView;
    static show(addModelMarkupComment, onChangeText, modelInfo, content, cacheUserMap) {
        return super.show(
            <Overlay.View
                side='bottom'
                modal={false}
                style={{ justifyContent: 'flex-end' }}
                overlayOpacity={0.7}
                ref={v => this.overlayView = v}
            >
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <ComponentInputChild
                        ref={(ref) => { this.inputRef = ref }}
                        addModelMarkupComment={addModelMarkupComment}
                        onChangeText={(value) => { onChangeText(value) }}
                        content={content}
                        modelInfo={modelInfo}
                        cacheUserMap={cacheUserMap}
                    />
                </KeyboardAvoidingView>


            </Overlay.View>
        )
    }


    static close() {
        if (this.overlayView) {
            this.inputRef = null;
            this.overlayView.close()
        }
    }


}

export default CommentInputView;

const styles = StyleSheet.create({
})
