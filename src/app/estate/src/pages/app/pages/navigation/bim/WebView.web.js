import React from 'react'

export default class WebView extends React.Component {
  injectJavaScript = (script) => {
    this.refs.webFrame.window.eval(script);
  }
  onMessage=(e) =>{
    this.props.onMessage(e);
  }

  componentWillMount=()=>{
    window.onMessage = this.onMessage;
    // document.addEventListener('message', this.onMessage);
  }
  componentWillUnmount=()=>{
    delete window.onMessage;
    // document.removeEventListener('message', this.onMessage);
  }
  render = () =>
  (
      <iframe
        ref='webFrame'
        name="myFrame"
        src={this.props.url}
        height="100%"
        width="100%"
        frameBorder={0} 
      />
   )
}
