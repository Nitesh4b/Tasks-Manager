import { createTask } from "./main.js";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const microphoneIcon = document.querySelector("#microphoneIcon");

//checking availability of speech recognition in browser
if (SpeechRecognition) {
  const recObj = new SpeechRecognition();//speech recognizier object eg like car obj
  let isRecordingStarted = false;

  //set the 3 attrributes
  recObj.continuous = true; // keep listening until we stop
  recObj.interimResults = false; //Dont send text in between of speech
  recObj.lang = "en-US";

  // handle event for 2 methods
  microphoneIcon.addEventListener("click", function recording() {
    if (!isRecordingStarted) {
      recObj.start();
      isRecordingStarted = true;
      microphoneIcon.src=`images/microphoneStop.png`
    } else {
      recObj.stop();
      isRecordingStarted = false;
      microphoneIcon.src=`images/microphoneStart.png`
    }
  });

  // Asynchronous task
  recObj.addEventListener("result", function speechtoText(e) {
    try {
      //e.result wull give you result matrix list
      const lastSpeechIndex = e.results.length - 1;
      const lastPhrase = e.results[lastSpeechIndex];
      const text = lastPhrase[0].transcript; // ERROR if lastPhrase is undefine
      createTask(text);
    }
    catch (error) {
      console.error("Speech recognition error:", error);
    }
  });

} 
else {
  alert("Speech recognition not supported in this browser.");
}
