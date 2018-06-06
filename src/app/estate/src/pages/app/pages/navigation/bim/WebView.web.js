import React from 'react'

export default class WebView extends React.Component {
  render = () =>
  (
      <iframe
        name="myFrame"
        src={this.props.url}
        height="100%"
        width="100%"
        frameBorder={0} 
      />
   )
}
