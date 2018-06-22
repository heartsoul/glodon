/**
 * 应用入口
 */
import React from 'react';
import { ActivityIndicator, View, Dimensions} from 'react-native';
import { loadStorageData } from '../../common/store/store+base';
import App from '../containers/App';

export default class extends React.Component {

  constructor() {
    super();
    this.state = {
      hasLoad: false,
    }
  }
  componentDidMount = () => {
    loadStorageData().then(() => {

      this.setState({
        hasLoad: true
      })

    }).catch((error) => {

    });
  }
  renderPage() {
    return (<App />)
  }
  onWindowResize =()=>{
    this.forceUpdate();
  }
  componentWillMount = () =>{
    window.addEventListener('resize', this.onWindowResize)
  }
  componentWillUnmount = () => {
    window.removeEventListener('resize', this.onWindowResize)
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