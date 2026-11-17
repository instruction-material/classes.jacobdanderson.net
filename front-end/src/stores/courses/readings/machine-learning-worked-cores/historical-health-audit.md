# Read the historical health-data neural-network source

This optional activity audits the preserved scripts and notebooks as source documents. Use the fictional OR/XOR and neuron workspaces for executable neural-network practice.

Read `Diabetes-Neural-Net-Starter.py`, `Diabetes-Neural-Net.py`, `DiabetesNeuralNetStarter.ipynb` and `DiabetesNeuralNet.ipynb` in the linked repository folder. Record the file and statement supporting each observation. Historical stored notebook outputs are records of earlier execution; distinguish them from a result reproduced in a current environment.

## Follow the actual data path

The scripts load a remote CSV from the classes media host. The notebooks name an older Juni-hosted CSV. A local `diabetes.csv` is retained in the folder, but those source loaders do not read that file. Record all three identities rather than assuming that a nearby filename determines the executed input.

The retained CSV has 768 rows and eight measurement columns plus Outcome. The label counts are 500 zeros and 268 ones. Glucose, BloodPressure, SkinThickness, Insulin and BMI contain zeros; counting them identifies a representation question. The file alone does not establish whether every zero is a measurement or a missing-value code. Identify what a data dictionary would need to resolve before proposing a transformation.

## Trace the supplied architecture

The starter forms the feature matrix and target vector and leaves the modeling work open. The worked source requests a 25% test split with random_state=42 and no explicit stratification. It constructs dense layers of widths 20,12,1 with ReLU,ReLU,sigmoid activations, uses binary cross-entropy with Adam, and requests 300 epochs with batch size 10.

The training call includes validation_split=0.2. Validation is therefore requested. The source does not provide an early-stopping callback or use a saved best-validation checkpoint. Keep the existence of validation data separate from the rule for choosing when to stop.

Only the split's random state is explicit. Locate the absence of an initialization seed, training-only scaler, dummy or logistic baseline, CPU cap and class-level metric report. Treat these as source observations; current package compatibility and actual model behavior require separate execution evidence.

The final label condition is probability>0.5, so equality maps to zero in this historical program. Trace the outputs for 0.49,0.50 and 0.51: 0,0,1. A threshold changes false-positive and false-negative counts, and a sigmoid output alone does not establish calibrated probabilities.

## Complete the source comparison

Submit a compact table with the inspected file, observed statement, its consequence and the additional evidence a revised experiment would need. Compare the historical source with the fictional neural exercises' declared seeds, bounded training, validation checkpoint and explicit numeric checks.

Conclude with the dataset's source and representation limits and the scope of the observations actually made. The audit supports a source-level explanation of an educational artifact. It does not estimate an individual's health risk.
