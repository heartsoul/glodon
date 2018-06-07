import React from 'react'

export default class WebView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      html:null,
    };
  }

  injectJavaScript = (script) => {
    this.refs.webFrame.contentWindow.window.eval(script);
  }
  onMessage=(e) =>{
    this.props.onMessage(e);
  }

  componentWillMount=()=>{
    window.onMessage = this.onMessage;
    // document.addEventListener('message', this.onMessage);
  }
  componentDidMount = () => {
    if (this.refs.webFrame.attachEvent){ 
      this.refs.webFrame.attachEvent("onload", ()=>{ 
      if(this.props.injectedJavaScript) {
        this.injectJavaScript('javascript:'+this.props.injectedJavaScript);
      }
      
      }); 
      } else { 
        this.refs.webFrame.onload = ()=>{ 
          if(this.props.injectedJavaScript) {
            // alert("Local iframe is now loaded.3"); 
            this.injectJavaScript('javascript:'+this.props.injectedJavaScript);
            // alert("xx"+this.refs.webFrame.contentWindow.window.modelEvent);
          }
          if(this.props.source.html) {
            let htmlNode = this.refs.webFrame.contentWindow.document.getElementById('loadingNode');
            htmlNode.innerHTML = this.props.source.html;
          }
      // alert("Local iframe is now loaded.2"); 
      }; 
      } 
  }
  componentWillUnmount=()=>{
    delete window.onMessage;
    // document.removeEventListener('message', this.onMessage);
  }
  

  renderUrl = (url) => {
    return (
      <iframe
        ref='webFrame'
        name="myFrame"
        src={url}
        height="100%"
        width="100%"
        frameBorder={0} 
      />
    );
      }

  renderHtml = (url,html) => {
    return (
      <iframe
        ref='webFrame'
        name="myFrame"
        src={url}
        height="100%"
        width="100%"
        frameBorder={0} 
      />
    );
      }
  render = () => {
    const {uri,html} = this.props.source;
    if(html) {
      return this.renderHtml('./loading.html',html);
    }
    return this.renderUrl(uri);
  }
  
}
