import React from 'react'
import { ChatFeed } from 'react-bell-chat'
import { ReactMic } from 'react-mic'
import moment from 'moment'
import firebase from 'firebase'
import { Widget,toggleWidget,addResponseMessage,addUserMessage  } from 'react-chat-widget-mic';
import uuidv4 from 'uuid/v4'
import 'react-chat-widget-mic/lib/styles.css';
import ReactMediaRecorder from "react-media-recorder";
import AudioRecorders from 'audio-recorders'
import axios from 'axios'

axios.post("https://speech.googleapis.com/v1p1beta1/speech:recognize?key=AIzaSyC5YiTi0BHu_oPmid-NFknO_HD3edyIDbc",{
  "audio": {
    "uri": "gs://canteiro.appspot.com/audios/2bd0d5ed-60c3-41d4-92ba-389edd9feff9.wav"
  },
  "config": {
    "languageCode": "pt-BR"
  }
}).then(result => console.log(result))
const config = {
  apiKey: "AIzaSyB8P8g2_nLwMlYD3FVOAvo_YVIKiApmzX0",
  authDomain: "canteiro.firebaseapp.com",
  databaseURL: "https://canteiro.firebaseio.com",
  projectId: "canteiro",
  storageBucket: "canteiro.appspot.com",
  messagingSenderId: "173973617346"
}
firebase.initializeApp(config)
const storageRef = firebase.storage().ref('audios')
const firestore = firebase.firestore()
var mediaRecorder
class ChatComponent extends React.Component {
    constructor(props){
        super(props)
        this.state = {
          record: false,
          loading:false,
          userData:null,
            messages: [
              {
                id: 1,
                authorId: 1,
                message: "Sample message",
                createdOn: new Date(),
                isSend: true
              },
              {
                id: 2,
                authorId: 2,
                message: "Second sample message",
                createdOn: new Date(),
                isSend: false
              },
            ],
            authors: [
              {id: 0,
                name: 'You'
              },
              {
                id: 1,
                name: 'Mark',
                isTyping: true,
                lastSeenMessageId: 1,
                bgImageUrl: undefined
              },
              {
                id: 2,
                name: 'Peter',
                isTyping: false,
                lastSeenMessageId: 2,
                bgImageUrl: undefined
              }
            ]
          }
        this.onRecord = this.onRecord.bind(this)
        this.stopRecording = this.stopRecording.bind(this)
        this.onStop = this.onStop.bind(this)
        this.startRecording = this.startRecording.bind(this)
    }
    onMessageSubmit(e) {
      e.preventDefault();
      console.log(e,this.state.messageText)
      if (this.state.messageText !== '') {
        const id = Number(new Date());
        const newMessage = {
          id,
          authorId: 0,
          message: this.state.messageText,
          createdOn: new Date(),
          isSend: false
        };
        this.setState(previousState => ({
          messageText: '',
          messages: previousState.messages.concat(newMessage)
        }), () => this.chat && this.chat.onMessageSend());
        setTimeout(() => {
          this.setState(previousState => ({ messages: previousState.messages.map(m => m.id === id ? { ...m, isSend: true } : m) }));
        }, 2000);
      }
      return true;
    }
    onRecord(){
      console.log("Recording....")
    }
    _onRecordingComplete = (blob) => {
      console.log(blob)
      if(this.state.userData){
        let userData = {...this.state.userData}
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            userData.location = {
              latitude:position.coords.latitude,
              longitude:position.coords.longitude
            }
            userData.date = moment().valueOf()
            let nameFile = uuidv4()
            nameFile = nameFile + '.wav'
            const fileRef = storageRef.child(nameFile)
            fileRef.put(blob,{customMetadata:{nome:userData.nome,date:userData.date}}).then((snapshot) =>  {
              console.log('File uploaded to storage!')
              const filePath = 'gs://'+ snapshot.ref.location.bucket +'/'+snapshot.ref.location.path
              console.log('File uploaded to storage!',filePath)
              axios.post("https://speech.googleapis.com/v1p1beta1/speech:recognize?key=AIzaSyC5YiTi0BHu_oPmid-NFknO_HD3edyIDbc",{
              "audio": {
                "uri": filePath
              },
              "config": {
                "languageCode": "pt-BR"
              }
            }).then((result,err) => {
              
              console.log(result)
              userData.filePath = filePath
            
              if(Object.keys(result.data).length !== 0){
                userData.transcript = result.data.results[0].alternatives[0].transcript
                addUserMessage(userData.transcript)
              }else{
                userData.transcript = 'Erro de Transcrição'
                addResponseMessage("Não entendi...");
              }
        
                firestore.collection("teste").add(userData)
                .then(() => {
                    console.log("Document successfully written!")
                  //  this.recorder.clear()
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                }); 
            
            
            
            
            
            })
            
            });
          
          })
     
      }
    }
      
    }
  
    _onRecordingError = (err) => {
      console.log('recording error', err)
    }
    startRecording = () => {
      this.recorder.clear()
      mediaRecorder.start();
      this.recorder.startRecord()
      console.log(mediaRecorder.state);
      console.log("recorder started");


  
      this.setState(previousState => ({
        record: true,
      }))
     
      
    }
    handleNewUserMessage = (newMessage) => {
      if(this.state.userData){
        let userData = {...this.state.userData}
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            userData.location = {
              latitude:position.coords.latitude,
              longitude:position.coords.longitude
            }
            userData.text = newMessage
            userData.date = moment().valueOf()
            firestore.collection("teste").add(userData)
            .then(function() {
                console.log("Document successfully written!");
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            }); 
          
          })
     
      }
    }
      addResponseMessage("Ok. Entendi. 👍🏽");
    }
    componentDidMount(){
      this.auth()
      toggleWidget()
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log('getUserMedia supported.');
        navigator.mediaDevices.getUserMedia (
           // constraints - only audio needed for this app
           {
              audio: true
           })
     
           // Success callback
           .then((stream) => {
            const config = {
              exportAudio: 'wav'
            }
            this.recorder = new AudioRecorders(stream, config)
      
            this.recorder.onStreamProcessor = (buffer) => {}
            this.recorder.onReceiveAudioBlob = (blobs) =>     this._onRecordingComplete(blobs)

         
             mediaRecorder = new MediaRecorder(stream);
           
            var chunks = [];
            mediaRecorder.addEventListener('dataavailable', (e) =>{
              chunks.push(e.data);
              console.log(e)
              //this._onRecordingComplete(e.data)
              
            })
         

             
           })
     
           // Error callback
           .catch(function(err) {
              console.log('The following getUserMedia error occured: ' + err);
           }
        );
     } else {
        console.log('getUserMedia not supported on your browser!');
     }



    }
    onStop = (blob) => {
      // Do something with the blob file of the recording
    }
    stopRecording = () => {
      const id = Number(new Date())
     mediaRecorder.stop()
     this.recorder.stopRecord()
     console.log(this.recorder)

  console.log(mediaRecorder);
  console.log("recorder stopped");
      const newMessage = {
        id,
        authorId: 0,
        message: <h3> ICONE DE AUDIO</h3>,
        createdOn: new Date(),
        isSend: false
      };
      this.setState(previousState => ({
        messageText: '',
        record: false,
        messages: previousState.messages.concat(newMessage)
      }), () => this.chat && this.chat.onMessageSend());
   
      
    }
    auth = () => {
      let userData = {
        nome:"José Moacir",
        location:{}
      }
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          userData.location = {
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
          }
         
        })
        this.setState({userData})
      }
      console.log(userData)
      
    }
    onData(recordedBlob) {
     // console.log('chunk of real-time data is: ', recordedBlob);
    }
   
    onStop(recordedBlob) {
      
     
      console.log('recordedBlob is: ', recordedBlob);
    }
   
    customLauncher = handleToggle => {
     
      return (
        <div id="toogle"  onClick={handleToggle}>Toggle</div>
      )
    }
    render() {
     
 
        return (
       
          // Your JSX...
       <div style={{
      padding:"0px",
      height:"80vh",
      width:"100%"}}>
         
        
         
        
            <Widget
            showCloseButton={false}
            title={"Canteiro App"}
            subtitle={"Enchanced Tracking System "}
            startRecording={this.startRecording}
            stopRecording={this.stopRecording}
            handleNewUserMessage={this.handleNewUserMessage}
            
          />
        
       </div>
        )
       
      }
}

export default ChatComponent;

