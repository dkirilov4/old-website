class Timeline
{
    /**
     * @member {infoDiv}
     * @member {contentDiv}
     * @member {contentId}
     * 
     * @member {wavesurfer}
     * 
     * Settings:
     * @member {loop}
     */

    constructor() {
        this.loop = false;
    }

    createWavePanel(_waveColor, _progressColor)
    {
        this.createDivs();
        this.createWaveSurfer(_waveColor, _progressColor);
        this.waitingForKeyPress = true;
        this.recordDuration = 3000;
    }

    createDivs()
    {
        this.timelineDiv = d3.select("#timeline").append("div")
            .attr("id", "timeline" + timelines.length);

        this.infoDiv = this.timelineDiv.append("div")
            .attr("id", "timeline" + timelines.length + "-info")
            .attr("class", "timeline-info")

        this.infoDivButtons = this.infoDiv.append("div")
            .attr("class", "info-buttons")

        this.infoDivVolumeSlider = this.infoDiv.append("div")
            .attr("class", "info-slider")

        this.infoDivRecordDurationSlider = this.infoDiv.append("div")
            .attr("class", "info-record-slider")

        this.recordButton = this.infoDivButtons.append("button")
            .attr("class", "record-btn")
            .on("mousedown", () => { this.startRecording() })
            .append("i")
            .attr("class", "fa fa-circle")

        this.playButton = this.infoDivButtons.append("button")
            .attr("class", "play-btn")
            .on("mousedown", () => { this.togglePlayPause() });
        
        this.playButton
            .append("i")
            .attr("class", "fa fa-play")

        this.pauseButton = this.infoDivButtons.append("button")
            .attr("class", "pause-btn")
            .style("display", "none")
            .on("mousedown", () => { this.togglePlayPause() })
        
        this.pauseButton
            .append("i")
            .attr("class", "fa fa-pause")

        this.loopButton = this.infoDivButtons.append("button")
            .attr("class", "loop-btn")
            .on("mousedown", () => { this.toggleLoop() })
            .append("i")
            .attr("class", "fa fa-repeat")

        this.infoDivVolumeSlider.append("text")
            .text("Volume")
            .style("color", "white")
            .style("font-size", "12px")

        this.volumeSlider = this.infoDivVolumeSlider.append("input")
            .attr("type", "range")
            .attr("min", 0)
            .attr("max", 1)
            .attr("step", 0.01)
            .attr("value", 0.75)
            .attr("class", "slider")
            .attr("id", "volume-slider")
            .on("change", () => { this.adjustVolume() })

        this.infoDivRecordDurationSlider.append("text")
            .text("Recording Duration (0-60)")
            .style("color", "white")
            .style("font-size", "12px")

        this.durationSlider = this.infoDivRecordDurationSlider.append("input")
            .attr("type", "range")
            .attr("min", 1)
            .attr("max", 60)
            .attr("step", 1)
            .attr("value", 3)
            .attr("class", "slider")
            .attr("id", "duration-slider")
            .on("change", () => { this.adjustRecordDuration() })

        this.contentId = "timeline" + timelines.length + "-content";
        this.contentDiv = this.timelineDiv.append("div")
            .attr("id", this.contentId)
            .attr("class", "timeline-content")
    }

    createWaveSurfer(_waveColor, _progressColor)
    {
        this.wavesurfer = WaveSurfer.create({
            container: ("#" + this.contentId),
            waveColor: _waveColor,
            progressColor: _progressColor,
            barHeight: 1,
            barWidth: 2,
            height: timelineHeight / 3,
            maxCanvasWidth: this.contentDiv.node().clientWidth - 20
        });

        this.wavesurfer.setVolume(0.75);

        var self = this;
        this.wavesurfer.on('finish', function () {
            if (self.loop)
                self.wavesurfer.play();
            else {
                self.pauseButton.style("display", "none");
                self.playButton.style("display", "inline-block");
            }
        });
    }

    adjustRecordDuration()
    {
        var slider = this.durationSlider.node();
        var value = $ (slider).val();

        this.recordDuration = value * 1000;
    }

    startRecording()
    {
        var self = this;
        self.recordButton.style("color", "orange")
        self.recordButton.classed("record-wait", true)
        $(window).on("keypress", function(event) { self._startRecordingHandler(event, self) });
    }

    async _startRecordingHandler(event, self)
    {
        var keyLower = (event.key).toUpperCase();
        var keyUpper = (event.key).toLowerCase();
        
        var keyCodeLower = keyLower.charCodeAt(0);
        var keyCodeUpper = keyUpper.charCodeAt(0);

        if ((piano.isValidKey(keyCodeLower) || piano.isValidKey(keyCodeUpper)) && self.waitingForKeyPress)
        {
            self.waitingForKeyPress = false;

            self.recordButton.style("color", "red")
            const recorder = await recordAudio();
            recorder.start();
            await sleep(self.recordDuration)
            const audio = await recorder.stop();
    
            self.wavesurfer.load(audioURLs[audioURLs.length - 1])
            self.recordButton.style("color", "white")

            self.waitingForKeyPress = true;
            $(window).off();
        }
    }

    async _arduinoStartRecordingHandler()
    {
        if (this.waitingForKeyPress)
        {
            this.waitingForKeyPress = false;

            this.recordButton.style("color", "red")
            const recorder = await recordAudio();
            recorder.start();
            await sleep(3000)
            const audio = await recorder.stop();
    
            this.wavesurfer.load(audioURLs[audioURLs.length - 1])
            this.recordButton.style("color", "white")

            this.waitingForKeyPress = true;
        }
    }

    togglePlayPause()
    {
        this.wavesurfer.playPause();

        if (this.wavesurfer.isPlaying())
        {
            this.pauseButton.style("display", "inline-block");
            this.playButton.style("display", "none");
        }
        else
        {
            this.pauseButton.style("display", "none");
            this.playButton.style("display", "inline-block");
        }

    }

    toggleLoop()
    {
        this.loop = !this.loop;

        if (this.loop)
            this.loopButton.style("color", "greenyellow")
        else
            this.loopButton.style("color", "grey")
    }

    adjustVolume(event)
    {
        var slider = this.volumeSlider.node();
        var value = $ (slider).val();

        this.wavesurfer.setVolume(value);
    }
}