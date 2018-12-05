// class Recorder
// {
//     /**
//      * @member {audioURLs}      - Array of URLs for all recordings
//      * 
//      * @member {stream}         - Audio Stream
//      * @member {mediaRecorder}  - Media Recorder Object
//      * @member {audioChunks}
//      * 
//      */
//     constructor() {
//         this.audioURLs = [];
//     }

//     record()
//     {
//         var self = this;
//         new Promise(async resolve => {
//             self.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             self.mediaRecorder = new MediaRecorder(self.stream);
//             self.audioChunks = [];
    
//             self.mediaRecorder.addEventListener("dataavailable", event => {
//                 self.audioChunks.push(event.data);
//             });

//             resolve({ self:start, self:stop });
//         });
//     }

//     start()
//     {
//         var self = this;
//         self.mediaRecorder.start();
//     }

//     stop()
//     {
//         var self = this;
//         self.mediaRecorder.addEventListener("stop", () => {
//             const audioBlob = new Blob(self.audioChunks);

//             const audioURL = URL.createObjectURL(audioBlob);
//             self.audioURLs.push(audioURL)
//         });

//         self.mediaRecorder.stop();
//     }

//     sleep(time)
//     {
//         new Promise(resolve => setTimeout(resolve, time));
//     }
// }

var audioURLs = [];

const recordAudio = () =>
  new Promise(async resolve => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];
    console.log("@recordAudio")

    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });

    const start = () => {console.log("@start"); mediaRecorder.start(); }

    const stop = () =>
      new Promise(resolve => {
          console.log("@stop")
          mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          audioURLs.push(audioUrl);
          const audio = new Audio(audioUrl);
          const play = () => audio.play();
          resolve({ audioBlob, audioUrl, play });
        });

        mediaRecorder.stop();
      });

    resolve({ start, stop });
  });

const sleep = time => new Promise(resolve => setTimeout(resolve, time));
