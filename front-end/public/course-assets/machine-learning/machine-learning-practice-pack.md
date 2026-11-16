# Machine Learning Practice Pack

Use these supplied, fictional, and low-stakes cases when a remote dataset, notebook host, account, or accelerator is unavailable. Record your own decisions before opening the verification guide. Unless a case says otherwise, use `random_state=42`, keep the final test set closed during model selection, and fit learned preprocessing on training data only.

## Environment and Data Card Case

Download [garden_growth.csv](/course-assets/machine-learning/garden_growth.csv),or open the ML0 data-card starter. The supplied 120-row table has plot_id,sun_hours,water_liters,soil_type and growth_cm. One row is one fictional plot after six weeks. Features describe daily sun,weekly water and clay/loam/sand soil; growth_cm is the measured target and plot_id is an identifier.

Implement inspect_fixture from the complete starter instructions. Record ordered columns,row count,missing cells,soil counts and SHA-256. Record the actual Python and optional package versions,including any package reported as not installed. The offline implementation uses the standard library.

Reserve 20% of raw row IDs with local seed 42 before fitting transformations. Restart the process and reproduce the record from the unchanged file. Write the data card's units,source,intended use,limitations and leakage boundary. This preparatory case fits no model.

## Evaluation Contract Case

Download [support_tickets.csv](/course-assets/machine-learning/support_tickets.csv),or open the ML7.5 evaluation-contract starter. Its 240 fictional summaries have 120 question,80 bug and 40 request labels. ticket_id traces rows; template_family groups repeated wording; summary is the prediction-time input.

Before training,implement build_contract using the complete starter instructions. Keep each template family in one partition. Sort labels and families,then shuffle each class's families with local seed 42. Reserve max(1,round(0.2*family_count)) families each for test and validation; use the remainder for training. Whole-group rounding makes the partitions approximately 60/20/20.

Record split IDs,families and class counts,a most-frequent dummy baseline,macro F1 and balanced accuracy,training-only CountVectorizer inside each candidate pipeline,and two grouped folds within training. Record short/long and error-code slices. Prefer the simpler candidate unless validation macro F1 improves by at least 0.02. Freeze preprocessing,candidates and parameters before test evaluation. Explain both vocabulary leakage and repeated-template leakage.

## Clustering Stability Case

Use these eight fictional shop points:

| ID  | visits | spend |
| --- | -----: | ----: |
| A   |      1 |    12 |
| B   |      2 |    15 |
| C   |      2 |    18 |
| D   |      8 |    78 |
| E   |      9 |    82 |
| F   |     10 |    76 |
| G   |      5 |    43 |
| H   |      5 |    47 |

First, trace one assignment and centroid-update iteration by hand for `k=3`. Then inspect a supplied manual-loop design with three defects: exact floating-point equality as the only stop rule, no maximum iteration count, and division by zero when a cluster becomes empty.

Write repairs using a tolerance, maximum iteration count, and explicit empty-cluster reseeding rule. Compare standardized `KMeans` runs for `k=2`, `k=3`, and `k=4` across at least three seeds. Record `n_init`, inertia, silhouette score when valid, and whether assignments remain stable. Do not name a cluster as a fact about a person.

## Distance Classification Case

A fictional product dataset contains:

- `material`: `paper`, `plastic`, `metal`
- `size`: `small`, `medium`, `large`
- `fragile`: `yes`, `no`
- `shipping_class`: `standard`, `careful`, `special`

Compare two proposals:

1. Map each category to `0`, `1`, or `2`, then calculate Euclidean distance.
2. Split raw rows first, then use `OneHotEncoder(handle_unknown="ignore")` and `KNeighborsClassifier` in a `Pipeline`.

Explain which proposal invents unsupported ordering and spacing. Build the second design with stratification, compare at least two values of `k` using training evidence, and evaluate it against `DummyClassifier`. Report balanced accuracy, macro F1, and a confusion matrix. Test one row containing an unseen material and record the result.

## Probabilistic Classification Case

Complete two related tasks:

### Continuous measurements

Use four continuous flower measurements and species labels. Explain why `GaussianNB` matches continuous feature distributions better than `MultinomialNB`. Compare with a stratified dummy baseline and report accuracy, macro F1, and a confusion matrix.

### Fictional text

Use twelve supplied-style messages such as “meeting moved to three,” “claim fictional prize now,” and “project notes attached.” Split raw text before fitting `CountVectorizer`. Place vectorization and `MultinomialNB` in one pipeline. Do not download stopword lists during the run.

Report precision, recall, F1, and a confusion matrix. Inspect only fictional messages. Name one failure caused by word independence or unseen vocabulary and explain why the result is not a production spam filter.

## Interpretable Tree Case

A fictional greenhouse table contains temperature band, humidity band, soil type, and a label indicating whether a supplied plant needed extra water.

Fit `DecisionTreeClassifier` candidates with maximum depths 1, 2, 3, and unrestricted. Use training-only cross-validation or a validation split to choose depth, then evaluate once on the held-out test set. Compare with `DummyClassifier`.

Produce:

- a depth-versus-training/validation table;
- a readable shallow tree or written rule trace;
- primary and secondary metrics;
- one error slice by soil type;
- one reason not to grow the tree further;
- one statement explaining why an interpretable rule is not automatically correct, fair, or causal.

## Regression Baseline Case

Use a fictional bicycle-rental table with temperature, rain flag, weekday flag, and hourly rental count.

Before fitting:

- name the unit of observation and target;
- reserve the held-out test set;
- choose MAE as the primary metric;
- fit `DummyRegressor(strategy="median")`.

Compare linear regression with one justified nonlinear candidate on the same split. Keep encoding or scaling inside pipelines. Plot or tabulate residuals for rainy and dry hours. Test one extrapolation outside the training temperature range and explain why it is unsupported.

Optional audit: describe how a country-year life-expectancy table differs from individual-level data and why aggregate association is not an individual or causal conclusion.

## Neural Network Audit Case

Trace this neuron by hand:

- inputs: `x1=0`, `x2=1`
- weights: `w1=1`, `w2=2`
- bias: `1`
- activation: sigmoid

Record the weighted sum and output. Then trace a two-neuron hidden layer and one output neuron using supplied small numeric weights. Verify the same intermediate values in transparent Python code.

For an optional trained comparison, use only a supplied low-stakes binary fixture. Set:

- fixed seeds;
- at most 500 rows;
- at most two hidden layers;
- at most 30 epochs;
- an explicit batch size;
- early stopping;
- a local CPU-time budget.

Compare against a dummy and logistic-regression baseline. Record precision, recall, F1, confusion matrix, runtime, two error slices, and whether the network earned its complexity. Do not make a health or individual-risk claim.

## Neural Regression Case

[Download synthetic_housing.csv](/course-assets/machine-learning/synthetic_housing.csv). Open the ML6 offline housing-comparison starter for all code and the same data.

Compare a training-median baseline, a least-squares linear regressor and a small neural regressor on the supplied 120-row fictional housing table. The fixed split is 72 training, 24 validation and 24 test rows. Features are area_m2 and rooms. region supports error analysis,while house_id and split identify records. value_k is a value in thousands of fictional units. This is authored numerical practice,not real property data or an appraisal.

The default neural model has two inputs,one hidden layer of three tanh units and a linear output. Feature and target means and population standard deviations are fitted on training rows only. A constant column uses scale 1. Targets are restored to original units before calculating MAE and RMSE.

The code uses Python 3.10 or later and its standard library. Each role contains all required code and data. Run python3 main.py from that role,or use an absolute script path from any directory. Run python3 main.py --output results to retain report.json,epochs.csv,residuals.csv and three SVG plots. Open training.svg,predicted-observed.svg and residuals.svg in a browser. The prediction plot includes y=x; residual means prediction minus observation.

### Implement the learner role

The starter leaves train_network unfinished. The supplied helpers implement data validation,training-only scaling,network evaluation and gradients,baselines,metrics and plotting. The solution completes the same workflow. Implement the bounded training loop:

1. Transform training and validation features with the already fitted training scaler. Initialize parameters from the declared seed.
2. Record epoch 0 training and validation MAE; retain a copy of the initial parameters.
3. Shuffle training-row indices with a local seeded generator. Iterate batches; use the provided loss_gradient and subtract learning_rate*gradient.
4. Check the CPU budget between batches. At each completed epoch,record both MAEs in original target units.
5. Copy parameters when validation MAE improves by more than 0.000001. Stop after six consecutive completed epochs without improvement.
6. Return the best validation parameters and their epoch,history,completed epochs and actual stopping reason.

The return contract below defines every required output key. The standard budget is at most 500 total rows,30 epochs,32 rows per batch,eight hidden units in one layer,and 3 CPU seconds for neural training. CLI flags can reduce the budget; enforced maxima remain 500 rows,30 epochs,32batch rows and 5 CPU seconds. The default batch is 16 and learning rate 0.04.

### Worked values

For actual targets [10,20] and predictions [12,17],MAE=(2+3)/2=2.5 and RMSE=sqrt((4+9)/2)=sqrt(6.5). A median baseline uses only training targets. For an even training count,it averages the two middle sorted targets.

With a zero-output neuron,prediction 0 and scaled target 2,the squared loss is 4 and the output derivative is -4. The output is linear; a sigmoid would constrain predictions to [0,1] and change this regression model. Hidden tanh derivatives use 1-h*h. All derivatives are averaged over the current training batch.

Model selection uses validation MAE. Prefer the simplest of median,linear and neural that lies within 1.0 fictional value unit of the best validation MAE. This rule is fixed before opening test targets. The final test scores for all three fixed candidates then explain the comparison; they cannot change the chosen model or stopping point.

### Complete the comparison

Record the data identity,feature meanings,seed,budget,training scaler and selected epoch. Compare validation and test MAE/RMSE for all three candidates. Inspect every test prediction and error slices by region and by the training-median target threshold. Use the curves and plots to explain whether the neural model earns its added complexity. Preserve the report and restart from the first command without hidden state.

Historical Boston Housing scripts remain unchanged in ML6-Predicting-House-Prices for the optional dataset and migration audit. This complete offline workspace is the assigned implementation.

[Neural regression reference](https://scikit-learn.org/stable/modules/neural_networks_supervised.html).

## Model Comparison Capstone Case

Choose one supplied low-stakes route:

- fictional support-ticket classification;
- plant-species classification;
- synthetic bicycle-demand or energy-use regression;
- non-personal clustering with a stability question.

Freeze a one-page problem card before modeling. It must include source and license, unit of observation, target or clustering goal, prediction-time features, intended use, non-goals, sensitive fields, likely leakage, sampling limits, and a resource budget.

Build a dummy baseline and two candidate pipelines. Use one fixed split or cross-validation plan, one primary and one secondary metric, and at least two meaningful error slices. Open the held-out test set once after selection.

Submit:

- environment and dataset identity;
- expected and observed run record;
- baseline and candidate comparison;
- confusion, residual, or stability evidence;
- resource use;
- model card;
- known limitations and human-review boundary;
- restart-and-rerun proof;
- a three-minute presentation outline.

Do not use the capstone for medical, financial, employment, discipline, admissions, identity, biometric, surveillance, or other consequential decisions.
