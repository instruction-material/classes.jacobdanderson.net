# Neurons, forward passes and one learning step

A neuron computes a weighted sum, then applies an activation. For two inputs, `z = x1*w1 + x2*w2 + b`. The weights multiply their respective inputs; the bias shifts the sum even when both inputs are zero.

Two activations used in these projects are sigmoid, `sigmoid(z) = 1/(1+exp(-z))`, and ReLU, `relu(z) = max(0,z)`. Sigmoid maps finite real logits into (0,1); floating-point arithmetic can round extreme values to an endpoint. ReLU returns zero for negative inputs and preserves positive inputs. Nonlinear activations let composed layers represent more than a single affine transformation.

## Calculate a neuron

Use `x1=0`, `x2=1`, weights `w1=1` and `w2=2`, and bias `b=1`. The weighted sum is `0*1 + 1*2 + 1 = 3`; sigmoid gives approximately `0.952574`.

Change only `w2` to 1: the sum becomes 2 and the output is approximately `0.880797`. Changing `w1` alone has no effect while `x1=0`. Increasing the bias from 1 to 2 instead raises the original sum from 3 to 4. A weight's effect depends on its input; a bias acts independently of that input.

The supplied implementation uses two branches to avoid evaluating an exponentially large intermediate:

```python
import math

def sigmoid(z):
    if z >= 0:
        return 1 / (1 + math.exp(-z))
    exp_z = math.exp(z)
    return exp_z / (1 + exp_z)
```

For example, `sigmoid(-1000)` returns 0.0 at machine precision, without an overflow exception. The neuron class stores both weights and the activation callable; its `run(x1,x2,b)` method applies that callable to the weighted sum.

## Trace the tiny network

Both hidden neurons receive the same two inputs. Their outputs become the two inputs of a third neuron. The project's fixed inputs are `(0,1)`, and every neuron uses bias 1.

| Neuron | Weighted sum | Activation | Output |
| --- | --- | --- | --- |
| First hidden | `0*1+1*2+1 = 3` | Sigmoid | 0.9525741268 |
| Second hidden | `0*3+1*1+1 = 2` | Sigmoid | 0.8807970780 |
| Output | `3*hidden1+5*hidden2+1` | ReLU | 8.2617077704 |

The output neuron consumes the hidden activations, not the original inputs again. Its positive weighted sum passes unchanged through ReLU. These are fixed forward-pass results; this program has no loss calculation or parameter-update loop.

With `x2=0` and all other values unchanged, both hidden logits are 1. Each hidden activation is approximately 0.731059, and the final output becomes `8*sigmoid(1)+1`, approximately 6.848469. Trace those intermediate values before running the changed case.

## Turn loss into an update

Training adds labelled examples, a loss and a rule for changing parameters. Consider just the first sigmoid neuron, its original inputs and a target label `y=1`. Binary cross-entropy for this one example is `-log(p)`, where `p=sigmoid(3)`. The loss is approximately 0.048587.

For sigmoid followed by binary cross-entropy, the derivative with respect to the logit is `p-y`, approximately -0.047426. The weight derivatives are `(p-y)*x1` and `(p-y)*x2`; the bias derivative is `p-y`. Thus the first weight derivative is zero, while the second weight and bias derivatives are both negative.

Gradient descent subtracts `learning_rate*derivative`. At rate 0.5, `w1` remains 1, `w2` becomes approximately 2.023713, and `b` becomes approximately 1.023713. The new logit is approximately 3.047426, moving the probability toward the target 1. Backpropagation obtains such derivatives through the computation graph using the chain rule; an optimizer applies the updates. For a mean batch loss, average the per-example derivatives before updating.

One successful training example does not establish performance on new data. Model selection uses training/validation evidence; the held-out test remains separate.

## Map an output to a class

A binary sigmoid classifier needs an explicit decision rule, for example `p >= 0.5` gives class 1, otherwise class 0. This makes `p=0.5` class 1; Python's `round` is a different operation. The fixed network above has a ReLU output of about 8.26, so its output is not a class probability.

A multiclass output often uses softmax: `p_i = exp(z_i)/sum_j(exp(z_j))`. It produces one probability per class, summing to 1. The architecture, loss and interpretation must agree with the task.

Complete the neuron-class project before wiring the tiny simulation. The later OR and XOR practice supplies actual bounded training loops and gradient checks.
