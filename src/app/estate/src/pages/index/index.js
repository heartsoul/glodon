/**
 * 应用入口
 */
import React from 'react'
import { View, ActivityIndicator } from 'react-native'

import App from '../containers/App'
import {loadStorageData} from '../../common/store/store+base'

export default class extends React.Component {

    constructor() {
      super();
      this.state = {
        hasLoad: false,
      }
     loadStorageData(() => {
        this.setState({
          hasLoad: true
        })
      });
    }
     initData = () =>{

    }
    componentDidMount() {
    }
    renderPage() {
      return (<App />)
    }
    render() {
      if (this.state.hasLoad) {
        return this.renderPage();
      }
      return <View style={{ backgroundColor: '#FFFFFF', justifyContent: 'center', flex: 1, alignItems: 'center', alignContent: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    }
  }