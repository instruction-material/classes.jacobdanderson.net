# Build a two-input neuron

Complete `Neuron.__init__` and `Neuron.run` in `main.py`. Store `w1`, `w2` and the activation callable on each instance. Return the activation of `x1*w1+x2*w2+b` from `run(x1,x2,b)`. The stable sigmoid helper is supplied.

Run `python3 main.py`. The untouched starter stops at its named task. With inputs `(0,1)`, weights `(1,2)` and bias 1, the completed program prints approximately `0.9525741268224334`.

Change only the active weight `w2` to 1: expect approximately `0.8807970779778823`. Changing only `w1` leaves this example unchanged because `x1=0`. Then change the bias and explain its separate effect.

Pass a ReLU callable through the same constructor. For weighted sum -2, its output must be zero. Compare the worked reference after attempting the class.

Use Python 3.10+ and its standard library. Each role contains its own code and task notes; the two-input neuron reading supplies the formula and hand calculations.
