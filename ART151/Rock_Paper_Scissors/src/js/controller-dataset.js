class ControllerDataset
{
    constructor(numClasses) {
        this.numClasses = numClasses;
    }

    /**
     * @param {Tensor} example a tensor representing the image to be added in the sample 
     * pool for the specific gesture
     * @param {number} label the label corresponding to the image (ASCII code)
     */
    addExample(example, label)
    {
        // One-hot encoding of the label:
        const newLabel = tf.tidy(
            () => tf.oneHot(tf.tensor1d([label]).toInt(), this.numClasses));

        // If no examples exist, create one:
        if (this.activations == null)
        {
            this.activations = tf.keep(example);
            this.labels = tf.keep(newLabel);
        } // Else concatenate to the currently existing set:
        else
        {
            const oldActivations = this.activations;
            this.activations = tf.keep(oldActivations.concat(example, 0));

            const oldLabels = this.labels;
            this.labels = tf.keep(oldLabels.concat(newLabel, 0));

            oldActivations.dispose();
            oldLabels.dispose();
            newLabel.dispose();
        }
    }
}