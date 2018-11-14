class Webcam 
{
    constructor(webcamElement, canvasElement)
    {
        this.webcamElement = webcamElement;
        this.canvasElement = canvasElement;

        this.parentWidth  = select("#player-box").width;
        this.parentHeight = select("#player-box").height;
        
        this.margin = {left: 10, right: 10, top: 10, bot: 10}
    }

    /* 1) Read a single frame from the webcam element as a tensor - [height, width, channels]. 
     * 2) Crop the returned tensor into a square image - [244, 244, 3] because the MobileNet
     * model requires this. 
     * 3) Add an extra dimension to the beginning of the image - [1, 244, 244, 3]. This 
     * represents a batch of a single image. MobileNet expects batched inputs. 
     * 4) Cast the image to a floating point and normalize it between -1 and 1 (it's how the model
     * was trained). Values from the image are between 0-255, so to normalize between -1 and 1,
     * we divide by 127 and subtract 1.
     */ 
    capture()
    {
        return tf.tidy(() => {
            const webcamImage = tf.fromPixels(this.webcamElement.elt);
            // const webcamImage = tf.fromPixels(canvas.elt);
            const croppedImage = this.cropImage(webcamImage);
            const batchedImage = croppedImage.expandDims(0);

            return batchedImage.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
        });
    }

    
    /**
    * Crops an image tensor so we get a square image with no white space.
    * @param {Tensor4D} img An input image Tensor to crop.
    */
    cropImage(img) 
    {
        const h = img.shape[0];
        const w = img.shape[1];

        const size = Math.min(h, w);

        const centerHeight = h / 2;
        const centerWidth  = w / 2;

        const beginHeight = centerHeight - (size / 2);
        const beginWidth = centerWidth - (size / 2);

        // return img.slice([beginHeight, beginWidth, 0], [size, size, 3])

        // const beginHeight = 0;
        // const beginWidth  = 0;

        return img.slice([beginHeight, beginWidth, 0], [224, 224, 3])
    }

    adjustVideoSize(parentWidth, parentHeight)
    {
        const aspectRatio = 640 / 480;

        var width = parentWidth - this.margin.left - this.margin.right;
        var height = parentHeight - this.margin.top - this.margin.bot;       

        if (width >= height) {
            width = aspectRatio * height;
               
            this.webcamElement.size(width, height);
        } else {
            height = aspectRatio * width;

            this.webcamElement.size(width, height);
        }

        // this.webcamElement.size(224, 224);
        this.adjustCanvasSize(parentWidth, parentHeight);
    }

    adjustCanvasSize(width, height)
    {
        this.canvasElement.resize(width, height);
    }

    init()
    {   
        this.canvasElement.parent("#player-box");
        this.webcamElement.parent("#player-box");
        this.webcamElement.hide();

        this.adjustVideoSize(this.parentWidth, this.parentHeight);
    }

    show()
    {
        background(255);

        var x_offset = (this.parentWidth - this.webcamElement.width) / 2;
        var y_offset = (this.parentHeight - this.webcamElement.height) / 2


        image(this.webcamElement, x_offset, y_offset, this.webcamElement.width, this.webcamElement.height);
        // image(this.webcamElement, 0, 0, this.webcamElement.width, this.webcamElement.height);

        // Draw Guiding Rectangle
        noFill();
        stroke("#f26422");
        strokeWeight(3);

        const centerWidth  = this.parentWidth / 2;
        const centerHeight = this.parentHeight / 2;

        rectMode(CENTER)
        rect(centerWidth, centerHeight, 224, 224); 

        // Text:
        fill("#f26422");
        noStroke();
        textSize(20);
        textAlign(CENTER);
        text("place hand here!", centerWidth, centerHeight - 124);
    }
}