import React, { Component } from 'react';
import './App.css';
import { peer } from '.';

class App extends Component {
  state = {
    peerID : "",
    otherID: ""
  }

  handleChange(e){
    e.preventDefault();
    
    this.setState({
      otherID: e.target.value
    })
  }

  handleClick = async () => {
    if (this.hasUserMedia()) { 
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
         || navigator.mozGetUserMedia; 
      const stream = await navigator.mediaDevices.getUserMedia({
           audio: false,
           video: true
      }) 
      let call = peer.call(this.state.otherID, stream)
      call.on("stream", async remoteStream => {
        // local
        var local = document.getElementById('local');  
        local.srcObject = stream;
        // remote
        var video = document.getElementById('video');  
        video.srcObject = remoteStream;
      })
    } else { 
        alert("WebRTC is not supported"); 
    }
  }

  async componentDidMount(){
    peer.on("open", id =>{
      this.setState({
        peerID: id
      })
    })
    if (this.hasUserMedia()) { 
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
         || navigator.mozGetUserMedia; 

      peer.on("call", async call => {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video:true
        }) 
        call.answer(stream)
        
        call.on("stream", remoteStream => {
          // local
          var local = document.getElementById('local');  
          local.srcObject = stream;
          // remote
          var video = document.getElementById('video');  
          video.srcObject = remoteStream;
        })
      })
    } else { 
        alert("WebRTC is not supported"); 
    }
  }
  componentDidUpdate(){}
  hasUserMedia() { 
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || 
       navigator.mozGetUserMedia); 
  } 
  render() {
    return (
      <div className="App">
        <video id="video" width="480px" height="480px" autoPlay></video>
        <video id="local" width="200px" height="200px" autoPlay></video>
        <div>
          <h1>PeerID: {this.state.peerID}</h1>
        </div>
        <input onChange={this.handleChange.bind(this)} value={this.state.otherID}/>
        <button onClick={this.handleClick}>Call TO</button>
      </div>
    );
  }
}

export default App;
