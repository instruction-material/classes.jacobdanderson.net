# Trace a neuron's response to one change

Use inputs `x1=0` and `x2=1`, weights `w1=1` and `w2=2`, and bias `b=1`. The weighted sum is `z=x1*w1+x2*w2+b`. A sigmoid returns `1/(1+exp(-z))`.

Record the original sum and output. Change one value at a time, restoring the starting values before the next case:

1. Replace `w2` with 1.
2. Replace `w1` with 99.
3. Replace the bias with 2.
4. Keep the starting weights and inputs, replace the bias with -4 and record the sigmoid output. Then compare ReLU, `max(0,z)`, at that same sum.

## Worked checks

The original sum is 3 and sigmoid output is approximately 0.952574. Reducing the active weight `w2` makes the sum 2 and output about 0.880797.

Changing `w1` leaves the sum at 3 because its input is zero. Raising the bias to 2 makes the sum 4 and output about 0.982014. With bias -4, the sum is -2; ReLU returns 0.

## Explain the mechanism

Write one expression for each changed sum. Explain why a weight's effect depends on its input, while the bias is added directly. Compare ReLU and sigmoid at the same sum of -2: sigmoid is approximately 0.119203, whereas ReLU is zero.

This is a forward-pass sensitivity exercise. Changing a parameter by hand supplies a controlled numerical comparison; learning a parameter requires the declared loss, data and update rule.

The [neuron project](#machine-learning-ml4-neural-networks-curriculum-ml4-project-1-build-a-neuron-class) supplies the corresponding class and consented starter workflow. Use the same cases to check a completed `Neuron.run` implementation.
