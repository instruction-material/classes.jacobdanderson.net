# Read the mechanisms used by the image model

Use these optional primary references after tracing the supplied local CNN:

- [TensorFlow's CNN tutorial](https://www.tensorflow.org/tutorials/images/cnn): trace how height, width and channels change through convolution and pooling. Its CIFAR example uses 32x32 RGB images; the course's authored fixture uses 12x12 RGB images and a smaller network.
- [Categorical cross-entropy](https://www.tensorflow.org/api_docs/python/tf/keras/losses/CategoricalCrossentropy): distinguish a vector of class probabilities from unnormalized logits. One-hot labels identify the true class.
- [scikit-learn model persistence](https://scikit-learn.org/stable/model_persistence.html): identify the fitted preprocessing and model state needed for a later prediction, together with the matching environment.

## Check the connection

For the local model, start with 12x12x3 inputs. A valid 3x3 convolution produces 10x10 positions per filter; two filters give 200 activations. A 2x2 average pool gives 5x5x2=50 flattened values.

Four equal class probabilities give cross-entropy -log(1/4), about 1.38629. For a one-hot true class, the softmax-logit derivative is -0.75 for that class and +0.25 for each other class. Explain why passing logits as if they were probabilities would use the wrong loss contract.

A reusable predictor needs the class order, preprocessing convention, learned parameters and compatible source/environment. The supplied local project keeps these together for its numerical demonstration. Loading an untrusted pickle-based model can execute code; use the recorded course source and trusted artifacts for a persistence exercise.
