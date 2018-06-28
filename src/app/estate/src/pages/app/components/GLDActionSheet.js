
import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Overlay, } from 'app-3rd/teaset';
import GLDGrid from "./GLDGrid"
var { width, height } = Dimensions.get('window')
var { NativeModules } = require('react-native');

class GLDActionSheet extends Overlay {

    static overlayView = null;

    static show(children) {
        return super.show(
            <Overlay.View side='bottom' modal={false}
                style={styles.container}
                overlayOpacity={0.7}
                ref={v => this.overlayView = v}
            >
                <SafeAreaView>
                    <View style={styles.card}>
                        {
                            children
                        }
                    </View>
                </SafeAreaView>
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

    container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        alignContent: 'center',
    },

    card: {
        width: width,
        backgroundColor: "#fff",
        alignItems: "center",

    },
})

export default GLDActionSheet