# Image classification: from pixels to a class score

The optional image workspace uses 32 authored 12x12 RGB patterns in four named classes: cloudy, rainy, sunny and sunrise. An RGB pixel has three channel values. Dividing an 8-bit channel by 255 puts its value in [0,1]; it does not learn a statistic from the held-out images.

## Calculate a local feature

A convolution filter multiplies a small input patch by shared weights, sums the products and adds a bias. The same filter slides across the image. The course implementation uses the usual unflipped kernel operation common in neural-network libraries.

For a separate one-channel illustration, take a 2x2 patch [[1,2],[3,4]], kernel [[1,0],[0,-1]] and bias 1. The result is 1×1+2×0+3×0+4×(-1)+1=-2. Applying tanh gives approximately -0.964028. Changing the last pixel from 4 to 3 changes the preactivation to -1 and the activation to about -0.761594. This small calculation explains how a learned local contrast can change a feature.

The assigned RGB filter uses all three channels of a 3x3 patch. Two filters with stride 1 and no padding turn 12x12x3 inputs into 10x10x2 activations. Each filter has 3×3×3 weights and one bias: 2×(27+1)=56 parameters.

A 2x2 average-pooling step with stride 2 produces 5x5x2 values. For example, averaging activations 0,2,4,6 gives 3. Flattening preserves these 50 values in a fixed order. A four-output dense layer adds 50×4+4=204 parameters, giving 260 trainable parameters in the complete small CNN. The separate flattened-pixel classifier has 432×4+4=1,732.

## Turn scores into a loss

The dense outputs are four logits. Softmax converts them to normalized nonnegative values. Compute exp(logit-max_logit) and normalize by their sum to avoid exponentiating an unnecessarily large number.

With logits (0,0,0,0), every class receives 1/4. If the first class is the observed class, cross-entropy loss is -log(1/4)=log(4), about 1.386294. The derivative with respect to each logit is probability minus its one-hot target: (-0.75,0.25,0.25,0.25).

For an input feature equal to 2, its dense weight into the true-class logit therefore has derivative -0.75×2=-1.5. The corresponding output-bias derivative is -0.75. Gradient descent subtracts learning rate times these derivatives.

Backpropagate the dense derivative into the flattened pooled values. An average of four activations sends one fourth of its upstream derivative to each input; an upstream derivative 0.8 becomes 0.2 each. Through tanh, multiply by 1-activation^2. Each shared kernel weight accumulates contributions from every spatial location where it was used, then the minibatch averages the row contributions.

Check a selected kernel coefficient against a central difference with epsilon=1e-6, restoring it before the next check. Output weights and both layer biases need their own checks. A correct derivative is one condition for training, not evidence of successful recognition.

## Keep related images together

The supplied metadata contains two variants in each source family. Whole families stay within one partition: 16 images train, 8 validate and 8 test. Every class appears in every set. Apply the seeded horizontal flip and brightness variation to training batches only. Preserve validation and test pixels and labels.

Related variants are separated by family, but all images still share the same small renderer. Compare the training-majority and mean-color baselines with the flattened and convolutional models under the declared seeds and CPU/epoch budget. Save from validation evidence before opening test labels.

Report class supports, the actual-row/predicted-column confusion matrix, macro F1 and actual error filenames. A class with no observed errors has no error example to inspect. These synthetic symbols demonstrate an image-model workflow; success on them does not establish performance on photographs.

[Convolutional architecture reference](https://www.tensorflow.org/tutorials/images/cnn).
