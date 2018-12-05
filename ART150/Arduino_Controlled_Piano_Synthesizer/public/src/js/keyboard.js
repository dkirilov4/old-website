class Piano
{
    /**
     * @member {notes}      // Array of Note Objects:
     * @member {curOctave}  // The Current Octave
     * 
     * @member {numKeys}    // Total Number of Keys
     * 
     * @member {svg}        // SVG of the Keyboard
     */

    constructor()
    {
        this.audioSynth = new AudioSynth();
        this.audioSynth.setVolume(0.5);
        this.audioSynth = Synth.createInstrument("piano");

        this.numKeys = 12;

        this.curOctave = 4;
        this.notes = [{label: "C", arduinoTarget: 0, type: "white", keyCode: 65},
                      {label: "D", arduinoTarget: 2, type: "white", keyCode: 83},
                      {label: "E", arduinoTarget: 4, type: "white", keyCode: 68},
                      {label: "F", arduinoTarget: 5, type: "white", keyCode: 70},
                      {label: "G", arduinoTarget: 7, type: "white", keyCode: 71},
                      {label: "A", arduinoTarget: 9, type: "white", keyCode: 72},
                      {label: "B", arduinoTarget: 11, type: "white", keyCode: 74},
                      {label: "Cs", arduinoTarget: 1, type: "black", keyCode: 81},
                      {label: "Ds", arduinoTarget: 3, type: "black", keyCode: 87},
                      {label: "Fs", arduinoTarget: 6, type: "black", keyCode: 69},
                      {label: "Gs", arduinoTarget: 8, type: "black", keyCode: 82},
                      {label: "As", arduinoTarget: 10, type: "black", keyCode: 84}
                     ]

        this.pitchDuration = 2;
    }

    createPiano()
    {
        this.margin = {top: 0, right: 10, bottom: 50, left: 10}
        this.pianoWidth  = d3.select("#keyboard-wrapper").node().clientWidth / 3 - this.margin.left - this.margin.right;
        this.pianoHeight = d3.select("#keyboard-wrapper").node().clientHeight - this.margin.top - this.margin.bottom;

        this.svg = d3.select("#keyboard").append("svg")
            .attr("width", this.pianoWidth)
            .attr("height", this.pianoHeight)
            .attr("transform", "translate(0, " + this.margin.top + ")")
            .style("display", "block")
            .style("margin", "auto")

        this.keyGroup = this.svg.append("g")
            .attr("class", "keys")
        
        // Create Keys
        this.createWhiteKeys();
        this.createBlackKeys();

        // Keyboard Interaction:
        d3.select("body")
            .on("keydown", () => this.pressKey())

        d3.select("body")
            .on("keyup", () => this.releaseKey())
    }

    createWhiteKeys()
    {
        this.whiteKeyWidth  = (this.pianoWidth / 7)
        this.whiteKeyHeight = this.pianoHeight;

        var whiteKeys = this.keyGroup.append("g")
            .attr("class", "white-keys")

        var keys = whiteKeys.selectAll(".white-key").data(this.notes.slice(0, 7)).enter()
            .append("g")
            .attr("class", function(d) {return "white-key " + d.label[0] + "-key"});

        this.whiteKeys = keys.append("rect")
            .attr("width", this.whiteKeyWidth)
            .attr("height", this.whiteKeyHeight)
            .attr("x", (d, i) => {return i * this.whiteKeyWidth })
            .attr("y", -15)
            .attr("rx", 6)
            .attr("ry", 6)
            .attr("fill", "#f7f7f7")

        this.labels = keys.append("text")
            .text((d) => { return d.label + this.curOctave })
            .attr("x", (d, i) => {return i * this.whiteKeyWidth + this.whiteKeyWidth / 2 })
            .attr("y", (d, i) => {return this.whiteKeyHeight - 25 })
            .attr("text-anchor", "middle")
    }
    
    createBlackKeys()
    {
        this.blackKeyWidth  = this.whiteKeyWidth * 0.8;
        this.blackKeyHeight = this.whiteKeyHeight * 0.6;

        var blackKeys = this.keyGroup.append("g")
            .attr("class", "black-keys")

        var keys = blackKeys.selectAll(".black-key").data(this.notes.slice(7, 12)).enter()
            .append("g")
            .attr("class", function(d) {return "black-key " + d.label + "-key"});
            
        keys.append("rect")
            .attr("class", "black-key-background")
            .attr("width", this.blackKeyWidth)
            .attr("height", this.blackKeyHeight)
            .attr("x", (d, i) => { return (i < 2) ? ((i + 1) * this.whiteKeyWidth - this.blackKeyWidth / 2) : ((i + 2) * this.whiteKeyWidth - this.blackKeyWidth / 2) })
            .attr("y", -15)
            .attr("rx", 6)
            .attr("ry", 6)
            .attr("fill", "#f7f7f7")

        this.blackKeys = keys.append("rect")
            .attr("class", "black-key")
            .attr("width", this.blackKeyWidth)
            .attr("height", this.blackKeyHeight)
            .attr("x", (d, i) => { return (i < 2) ? ((i + 1) * this.whiteKeyWidth - this.blackKeyWidth / 2) : ((i + 2) * this.whiteKeyWidth - this.blackKeyWidth / 2) })
            .attr("y", -15)
            .attr("rx", 6)
            .attr("ry", 6)
            .attr("fill", "#191919")
    }

    pressKey()
    {
        var keyCode = d3.event.keyCode

        if (this.isValidKey(keyCode))
        {
            var keyGroup = this.getPressedPianoKey();
            var note = keyGroup.note;
            var key = this.getPressedPianoKey().element;

            if (note[1] == 's')
                note = note[0] + '#'
    
            this.audioSynth.play(note, this.curOctave, this.pitchDuration);
            key.attr("transform", "translate(0, 10)")
        }
    }

    releaseKey()
    {
        var keyGroup = this.getPressedPianoKey();
        var key = this.getPressedPianoKey().element;

        key.attr("transform", "translate(0, 0)")
    }

    getPressedPianoKey()
    {
        var keyCode = d3.event.keyCode

        var currentNote;
        this.notes.forEach(e => {
            if (e.keyCode == keyCode)
                currentNote = e.label;
        });

        return {element: this.svg.select("." + currentNote + "-key"), note: currentNote};
    }

    isValidKey(keyCode)
    {
        var valid = false;
        this.notes.forEach(e => {
            if (e.keyCode == keyCode) {
                valid = true;
            }
                
        });

        return valid;
    }

    changeOctave(dir)
    {
        var self = this;
        this.curOctave += dir;
        this.curOctave = clamp(this.curOctave, 2, 6);

        this.labels.each(function(d, i) {
            d3.select(this).text(d.label + self.curOctave)
        })
    }

    changeInstrument(instrument)
    {
        this.audioSynth = Synth.createInstrument(instrument);

        var buttons = d3.selectAll(".instrument-btn")
            .style("color", "#b3b1b1")
            .style("background", "#313033")

        d3.select("." + instrument + "-btn")
            .style("color", "white")
            .style("background", "#2a2930")
    }

    changePitch()
    {
        var slider = d3.select("#note-slider").node();
        var value = $ (slider).val();

        this.pitchDuration = value
    }
}