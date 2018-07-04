import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native'

import { Drawer } from 'app-3rd/teaset';
import RelevantModelAttribution from './RelevantModelAttribution'

const { width, height } = Dimensions.get("window");

export default class RelevantModelDrawerPaneView {
    static drawer = null
    static open(navigation,projectId,projectVersionId,fileId,elementId) {
        const view = (
            <View style={{ backgroundColor: "#3a3a3a", height: '100%', width: width * 0.667 }}>
                <RelevantModelAttribution projectId={projectId} projectVersionId={projectVersionId} fileId={fileId} elementId={elementId}/>
            </View>
        );
        RelevantModelDrawerPaneView.drawer = Drawer.open(view, 'left','translate');
    }
    static close() {
        if (RelevantModelDrawerPaneView.drawer) {
            RelevantModelDrawerPaneView.drawer.close();
        }
    }
    
  
}

