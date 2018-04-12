import React from 'react'

export default class WebView extends React.Component {
  onChange = () => {
    alert(1)
  }
  onChange = () => {
    myFrame.window.webfun = this.onChange
  }
  call = () => {
    myFrame.window.webfun()
  }

  render = () => (
    <div height="100%" width="100%">
      <span>WebView</span>
      <iframe
        name="myFrame"
        src="http://www.baidu.com"
        height="100%"
        width="100%"
      />
    </div>
  )
}
