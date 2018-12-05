var socket;

var piano;

var timelines = [];
var timelineHeight;

$('document').ready(function(){
    // Set Up Socket: 
    socket = io.connect(window.location.hostname + ':' + 8080);

    // Listen:
    socket.on("pressed", function(data){
        console.log("Pressed: " + data[0])
        pressArduinoKey(data[0])

        var timelineToRecord = null;
        for (var i = 0; i < timelines.length; i++)
        {
            if (timelines[i].recordButton.attr("class").includes("record-wait")) {
                timelineToRecord = timelines[i]
                timelines[i].recordButton.classed("record-wait", false)
            }
                
        }

        if (timelineToRecord != null && timelineToRecord.waitingForKeyPress)
        {
            _arduinoRecord(timelineToRecord);   
        }
    });

    socket.on("released", function(data){
        console.log("Released: " + data[0])
        releaseArduinoKey(data[0])
    });

    // Create Piano:
    piano = new Piano();
    piano.createPiano();

    timelineHeight = d3.select("#timeline").node().clientHeight - 20;

    var timeline0 = new Timeline();
    timeline0.createWavePanel("violet", "purple")
    timelines.push(timeline0)

    var timeline1 = new Timeline();
    timeline1.createWavePanel("steelblue", "blue")
    timelines.push(timeline1)

    var timeline2 = new Timeline();
    timeline2.createWavePanel("orange", "red")
    timelines.push(timeline2)
});

async function _arduinoRecord(timelineToRecord)
{
    timelineToRecord.waitingForKeyPress = false;

    timelineToRecord.recordButton.style("color", "red")
    const recorder = await recordAudio();
    recorder.start();
    await sleep(timelineToRecord.recordDuration)
    const audio = await recorder.stop();

    timelineToRecord.wavesurfer.load(audioURLs[audioURLs.length - 1])
    timelineToRecord.recordButton.style("color", "white")

    timelineToRecord.waitingForKeyPress = true;
}

function pressArduinoKey(target)
{
    var targetNote;
    for (var i = 0; i < piano.notes.length; i++)
    {
        if (piano.notes[i].arduinoTarget == target)
        {
            targetNote = piano.notes[i];
            break;
        }
    }

    var note = targetNote.label;
    var octave = piano.curOctave;

    d3.select("." + note + "-key").attr("transform", "translate(0, 10)");

    if (note[1] == 's')
        note = note[0] + '#'
    
    piano.audioSynth.play(note, octave, piano.pitchDuration);

}

function releaseArduinoKey(target)
{
    var targetNote;
    for (var i = 0; i < piano.notes.length; i++)
    {
        if (piano.notes[i].arduinoTarget == target)
        {
            targetNote = piano.notes[i];
            break;
        }
    }

    var note = targetNote.label;

    d3.select("." + note + "-key").attr("transform", "translate(0, 0)");
}

function clamp(num, min, max)
{
    if (num < min)
        return min;
    else if (num > max)
        return max;
    else
        return num;
}

const scale = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }