# Wire the tiny neural network

Complete `simulate` in `main.py` using the supplied `Neuron` class and activation helpers. Create two hidden sigmoid neurons with weights `(1,2)` and `(3,1)`, then a ReLU output neuron with weights `(3,5)`. All three neurons use bias 1.

Feed the original inputs to both hidden neurons. Feed the two hidden outputs to the output neuron. Return `(hidden1_output, hidden2_output, output)`; the supplied main program prints that tuple's values on separate lines.

For default inputs `(0,1)`, expect approximately:

```text
0.9525741268224334
0.8807970779778823
8.261707770356711
```

Trace the weighted sums 3 and 2 before calculating the hidden activations. The final weighted sum is `3*hidden1+5*hidden2+1` and stays positive through ReLU.

Change `x2` to zero. Both hidden logits become 1, and the final output becomes approximately 6.848469. Compare each intermediate result, not only the last number.

Use Python 3.10+ and its standard library; run `python3 main.py` from the selected role folder. The untouched starter stops at `simulate`. This is a forward-pass simulation with fixed parameters. Compare the reference after attempting the wiring.
