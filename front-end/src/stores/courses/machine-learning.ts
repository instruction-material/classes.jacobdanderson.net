import type { RawCourse } from "./types";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { buildProjectGuidance } from "./projectGuidance";
import { pendingStaticMediaNotice, staticMediaUrl } from "./staticMedia";
import { buildSupportSectionGuidance } from "./supportSectionGuidance";

const machineLearningHostedSourceVideos = [
	"ml1_project_1.mp4",
	"ml1_project_2.mp4",
	"ml1_supplemental_project_1.mp4",
	"ml2_project_1.mp4",
	"ml2_project_2.mp4",
	"ml3_project_1.mp4",
	"ml3_project_2.mp4",
	"ml4_project_1.mp4",
	"ml4_project_2.mp4",
	"ml4_project_3.mp4",
	"ml5_project_1.mp4",
	"ml5_project_2.mp4",
	"ml5_project_3.mp4",
	"ml6_project_1.mp4",
	"ml7_project_1.mp4"
] as const;

const machineLearningPendingSourceImages = ["ml3_1.png", "ml3_2.png"] as const;

const MACHINE_LEARNING_PRACTICE_PACK =
	"/course-assets/machine-learning/machine-learning-practice-pack.md";
const MACHINE_LEARNING_VERIFICATION_GUIDE =
	"/course-assets/machine-learning/machine-learning-verification-guide.md";

function hostedMachineLearningAssetList(filenames: readonly string[]) {
	return filenames
		.map(filename => `- ${staticMediaUrl(filename)}`)
		.join("\n");
}

function pendingMachineLearningAssetList(filenames: readonly string[]) {
	return filenames
		.map(
			filename =>
				`- ${staticMediaUrl(filename)}\n\n${pendingStaticMediaNotice(filename)}`
		)
		.join("\n\n");
}

const machineLearningSourceCourse: RawCourse = {
	name: "Machine Learning",
	modules: [
		{
			title: "ML0 Setup, Tooling, and Data Workflow",
			curriculum: [
				{
					title: "Preferred Tools and Environment",
					content:
						"Use Python 3.14 with a recorded isolated environment, scikit-learn 1.9, pandas, NumPy, matplotlib, seaborn, and local Jupyter or VS Code as the complete course workflow. Run a supplied import-and-version check, restart the kernel, and rerun from the first cell before the first model. Google Colab remains an optional convenience when a learner knowingly chooses an account-based notebook host; it is never the only way to complete a lesson."
				},
				{
					title: "Notebook Cells vs. Reusable Python Modules",
					content:
						"Keep notebooks useful for quick exploration while still organizing reusable helpers, cleaning steps, and plotting logic into functions that can move into `.py` files later. This keeps the course from feeling like one long sequence of disconnected notebook cells."
				},
				{
					title: "Data Cleaning and Visualization First",
					content:
						"Before any model is trained, write a data-and-problem card, inspect columns, missing values, units, scales, target balance, and possible leakage. Split supervised data before fitting any learned transformation. Basic plotting, a dummy baseline, and train/test thinking belong in the baseline workflow, not as optional polish after the algorithm appears."
				},
				{
					title: "Model Comparison as the Course Habit",
					content:
						"Most serious datasets are tested with a task-appropriate dummy baseline and at least two plausible approaches on the same split. One model run or one accuracy value is only a starting point, not the end of the reasoning."
				},
				{
					title: "ML0 Setup, Tooling, and Data Workflow: Core Project",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML0 Setup, Tooling, and Data Workflow",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML2-KNN-Customer-Segmentation-Classification"
				}
			],
			supplementalProjects: [
				{
					title: "ML0 Setup, Tooling, and Data Workflow: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML0 Setup, Tooling, and Data Workflow",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML2-KNN-Customer-Segmentation-Classification"
				}
			]
		},
		{
			title: "ML1 K-Means Clustering",
			curriculum: [
				{
					title: "Introduction to Machine Learning",
					content:
						"AI is about building intelligent systems, and machine learning (ML) is the subset where systems learn patterns from data. Everyday examples include spam filters learning what emails to block and Netflix learning what shows to recommend based on viewing history. The four main ML types are reinforcement learning (learning by reward and punishment), unsupervised learning (finding patterns without labels), supervised learning (learning from labeled examples), and semi-supervised learning (mix of labeled and unlabeled data). This course focuses mainly on unsupervised and supervised learning."
				},
				{
					title: "Unsupervised Learning & Clustering",
					content:
						"Unsupervised learning takes a dataset without labels and tries to find patterns or groupings in it. Customer segmentation is a motivating example: a store owner can group customers by characteristics like age, income, or spending behavior to better target marketing. Clustering is the process of finding distinct groups (clusters) of similar data points. A simple 2D example uses points A(1,1), B(2,1), C(3,3), and D(4,3). After plotting them, {A,B} visually form one cluster and {C,D} form another. Algorithms become necessary when there are hundreds or thousands of points instead of just four."
				},
				{
					title: "K-Means Clustering Algorithm",
					content:
						"K-means clustering is a popular algorithm that partitions data into k clusters. A centroid is the mean of all points in a cluster, thought of as the cluster's center. Each point is assigned to the cluster whose centroid it is closest to, usually using Euclidean distance sqrt((y2 - y1)^2 + (x2 - x1)^2). In a four-point example using A, B, C, and D with k = 2, the steps are: choose k, pick initial centroids such as A and B, assign each point to the nearest centroid, recompute centroids by averaging point coordinates in each cluster, and repeat until centroids stop changing. One or two computed iterations make the distance calculations visible and show that results can depend on the initial random centroids."
				},
				{
					title: "Optional Google Colab Orientation",
					content:
						"Google Colab is an optional notebook host that requires a separate Google account and its own privacy decision. If selected, open a new notebook, inspect code and text cells, upload only the supplied non-personal fixture, record the active Python and package versions, then use Runtime → Restart session and run all. The same notebook steps must also work locally, and no learner is required to mount Drive or upload personal files."
				},
				{
					title: "ML1 Project 1: Customer Segmentation",
					content: `**Goal:** Build k-means clustering from scratch to group customers by annual income and spending score.

**Setup:**
- Create a local project folder and record Python, scikit-learn, pandas, and NumPy versions.
- Download or open the linked customer segmentation CSV from the course source repository.
- Read the local CSV with pandas and record its row count, columns, units, and checksum or source version.
- Inspect the columns and select annual income plus spending score as the two clustering features.
- Standardize both numeric features so one unit does not dominate Euclidean distance.

**Exploration:**
- Create a scatterplot of income versus spending score before clustering.
- Estimate how many groups appear visually and record why that estimate might be uncertain.

**Algorithm steps:**
1. Choose \`k\`, such as \`k = 5\`.
2. Store the data points in a list or array.
3. Choose \`k\` initial centroids from a seeded random generator.
4. Store current centroids, previous centroids, and each customer's assigned cluster index.
5. Repeat until centroid movement is below a written tolerance or a maximum iteration count is reached:
   - Compute Euclidean distance from each point to each centroid.
   - Assign each point to the nearest centroid.
   - Copy current centroids to previous centroids with \`deepcopy\`.
   - Recompute each centroid by averaging all points assigned to that cluster.
   - Handle an empty cluster with a documented reseeding rule instead of dividing by zero.

**Checkpoints:**
- The final plot uses different colors for different clusters.
- The algorithm is run more than once so random initialization is visible.
- At least two \`k\` values are compared.
- The manual result is compared with scikit-learn \`KMeans\` using a fixed \`random_state\`, explicit \`n_init\`, and the same scaled features.
- The written summary explains the dataset, the clustering goal, stability across seeds, the final groups, and one surprising or uncertain pattern. Cluster numbers are arbitrary labels, not discovered facts about people.`,
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Customer-Segmentation-Starter-Updated",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Customer-Segmentation-Updated",
					datasetLink:
						"https://github.com/instruction-material/AI-Level-2/blob/main/ML1-Customer-Segmentation-Starter-Updated/customers.csv",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml1_project_1.mp4"
				},
				{
					title: "ML1 Project 2: Disney Movie Clustering",
					content: `**Goal:** Use scikit-learn k-means to cluster Disney movies by release year and inflation-adjusted revenue.

**Data preparation:**
- Load the Disney movie dataset from the local course source.
- Extract the release date and inflation-adjusted revenue columns.
- Convert the release date string into a numeric release year.
- Build a two-column feature matrix using year and inflation-adjusted revenue.
- Use a \`Pipeline\` with \`StandardScaler\` and \`KMeans\` so revenue scale does not silently dominate year.

**Model steps:**
1. Plot the raw data before clustering.
2. Choose a starting value for \`k\`.
3. Use scikit-learn's k-means implementation with fixed \`random_state\` and explicit \`n_init\`, then call \`fit_predict()\`.
4. Inspect \`cluster_centers_\` so the centroid locations are not treated as hidden magic.
5. Plot the clustered scatterplot.

**Comparison checks:**
- Try multiple \`k\` values.
- Compare how the cluster shapes, boundaries, and centroid positions change.
- Compare inertia and silhouette score cautiously, and inspect stability across at least three seeds.
- Explain whether the clusters reveal a useful descriptive pattern or mainly reflect selected features and scaling. Do not treat a cluster as a causal movie-era category.`,
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Disney-Movie-Clustering-Starter-Updated",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Disney-Movie-Clustering-Updated",
					datasetLink:
						"https://github.com/instruction-material/AI-Level-2/blob/main/ML1-Disney-Movie-Clustering-Starter-Updated/disney.csv",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml1_project_2.mp4"
				}
			],
			supplementalProjects: [
				{
					title: "ML1 Supplemental Project 1: Flower Clustering",
					content: `**Goal:** Cluster iris flowers by petal length and petal width.

**Core workflow:**
- Load the \`iris.csv\` file into a notebook.
- Use either scikit-learn k-means or a from-scratch implementation based on the customer segmentation project.
- Plot the raw data before clustering.
- Plot the clustered data with a different color for each cluster.

**Reflection checks:**
- Compare the visually estimated number of groups with the chosen value of \`k\`.
- Explain how the clusters relate to the three iris species.
- Name one limitation of clustering flowers without using the species labels during training.`,
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Flower-Clustering-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Flower-Clustering",
					datasetLink:
						"https://gist.githubusercontent.com/curran/a08a1080b88344b0c8a7/raw/639388c2cbc2120a14dcf466e85730eb8be498bb/iris.csv",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml1_supplemental_project_1.mp4"
				}
			]
		},
		{
			title: "ML2 K-Nearest Neighbors",
			curriculum: [
				{
					title: "Introduction to Supervised Learning",
					content:
						"Supervised learning trains on a dataset where both inputs and outputs (labels) are known. The algorithm learns a mapping from inputs to outputs, then uses that mapping to predict labels on new inputs where the output is unknown. The core steps are building feature vectors from the raw data, associating each vector with a label, training on these input-output pairs, and then evaluating the model on new data."
				},
				{
					title: "Classification Basics",
					content:
						"Classification is a supervised learning task where the output is a discrete category. Spam vs. non-spam email is a simple example. Classification also connects back to customer segmentation: the clusters discovered with k-means can be treated as categories or labels, such as cluster 0, cluster 1, and cluster 2. Once each customer's cluster is known, a classifier can take a customer's income and spending score and predict the correct cluster for new customers."
				},
				{
					title: "K-Nearest Neighbors Algorithm",
					content:
						"K-nearest neighbors (KNN) is a simple classification method that labels a new input based on the majority label among its k closest neighbors in the training data. Use the sample dataset with points A(1,1; Cluster 1), B(2,1; Cluster 1), C(3,3; Cluster 2), D(4,3; Cluster 2), and an unlabeled point E(4,4). Plot the dataset and predict E's cluster visually. Then trace the KNN algorithm: choose k, such as k = 2, compute Euclidean distance from E to each point, identify the k closest neighbors, and assign E to the cluster appearing most often among those neighbors. The distance table shows that E is closest to C and D, both in Cluster 2, so KNN classifies E as Cluster 2."
				},
				{
					title: "Training, Validation, and Testing Data",
					content:
						"To evaluate a classifier properly, split before fitting a scaler, encoder, vectorizer, imputer, feature selector, or model. Training data fits the pipeline; validation data or cross-validation selects settings such as k; and the held-out test set is used once for final evaluation. Use a fixed random state, stratification when labels allow it, a dummy baseline, and at least one metric beyond accuracy."
				},
				{
					title: "ML2 Project 1: KNN Customer Segment Classification",
					content: `**Goal:** Predict a customer's cluster segment from annual income and spending score using K-nearest neighbors.

**Inputs:**
- Start from saved customer segmentation work, or reload the dataset and recreate the feature columns.
- Use the cluster assignments from k-means as labels.
- Build feature vectors in the form \`[income, spendingScore]\`.
- State clearly that these labels were generated by k-means rather than supplied as ground truth; the classifier is learning to imitate a previous clustering pipeline.

**Model steps:**
1. Choose a KNN value such as \`k = 3\` or \`k = 5\`.
2. Split with a fixed random state and stratification when each generated cluster has enough examples.
3. Fit \`StandardScaler\` and \`KNeighborsClassifier\` together in a \`Pipeline\`.
4. Compare against \`DummyClassifier\` and report accuracy plus macro F1 and a confusion matrix.
5. Compare predicted labels with the generated cluster labels without describing them as real customer types.

**Transfer check:**
- Create at least one hypothetical customer feature vector.
- Predict that customer's segment.
- Check the result visually against the cluster plot and explain whether the prediction makes sense.

**Reflection:** Explain how \`k\` was chosen, how well the classifier reproduced the clustering labels, and what happens when the previous clustering is unstable or noisy. Do not use the result to target or make decisions about real people.`,
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML2-KNN-Customer-Segmentation-Classification-Updated",
					datasetLink:
						"https://github.com/instruction-material/AI-Level-2/blob/main/ML2-KNN-Customer-Segmentation-Classification-Updated/customers.csv",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml2_project_1.mp4"
				},
				{
					title: "ML2 Project 2: KNN Car Classification",
					content: `**Goal:** Build a KNN classifier that predicts car acceptability from categorical car features.

**Data setup:**
- Download the classic car evaluation dataset.
- Identify the target label: acceptability.
- Identify the features: buying price, maintenance cost, doors, passengers, luggage boot, and safety.
- Read the dataset documentation before encoding values.

**Encoding task:**
- Keep category values as strings until the split is created.
- Use \`OneHotEncoder(handle_unknown="ignore")\` inside a \`ColumnTransformer\` and \`Pipeline\`.
- Explain why arbitrary integer codes would make Euclidean distance treat category order and spacing as meaningful.

**Model steps:**
1. Construct raw categorical feature rows and target labels.
2. Store labels from the acceptability column: \`unacc\`, \`acc\`, \`good\`, or \`vgood\`.
3. Split with a fixed random state and stratification.
4. Fit one-hot encoding and scikit-learn's \`KNeighborsClassifier\` inside one pipeline.
5. Compare with \`DummyClassifier\`; report balanced accuracy, macro F1, and a confusion matrix.

**Checkpoints:**
- Classify one hypothetical car feature vector.
- Explain whether the result seems reasonable.
- Verify that an unseen category is handled predictably.
- Summarize encoding choices, metrics, class imbalance, and one surprising result or limitation.`,
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML2-KNN-Car-Classification-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML2-KNN-Car-Classification",
					datasetLink:
						"https://sci2s.ugr.es/keel/dataset.php?cod=56#sub2",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml2_project_2.mp4"
				}
			],
			supplementalProjects: [
				{
					title: "K Nearest Neighbors: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "machine learning",
						moduleTitle: "K Nearest Neighbors",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML2-KNN-Customer-Segmentation-Classification-Updated"
				},
				{
					title: "K Nearest Neighbors Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML2 K-Nearest Neighbors",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-01-ml2-k-nearest-neighbors-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-01-ml2-k-nearest-neighbors-supplemental-2/solution"
				},
				{
					title: "K Nearest Neighbors Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML2 K-Nearest Neighbors",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-02-ml2-k-nearest-neighbors-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-02-ml2-k-nearest-neighbors-supplemental-3/solution"
				}
			]
		},
		{
			title: "ML3 Naive Bayes",
			curriculum: [
				{
					title: "Naive Bayes Overview",
					content:
						"Naive Bayes is a supervised classification method based on probability rules. It models the probability of each possible label given the input features and chooses the label with the highest probability. The word naive refers to the simplifying assumption that features are conditionally independent given the label, which makes the math easier and still works surprisingly well in many real-world problems."
				},
				{
					title: "Naive Bayes with the Iris Dataset",
					content:
						"The iris flower dataset (sepal length, sepal width, petal length, petal width, species) is a practical Naive Bayes classification example. The labels are the three species setosa, versicolor, and virginica, and the feature vector is [sepal_length, sepal_width, petal_length, petal_width]. Feature order is fixed. The process is: split the data into training and testing sets, use the training data to estimate probabilities for each species, and classify new feature vectors by choosing the label with the highest conditional probability. Accuracy improves when features are informative and when there is enough training data."
				},
				{
					title: "ML3 Project 1: Iris Dataset Classification",
					content: `**Goal:** Build a Naive Bayes classifier for the iris dataset.

**Data preparation:**
- Load the CSV from the provided URL.
- Separate the data into \`X\` feature vectors and \`y\` labels.
- Use \`pandas.drop()\` to remove the species column when constructing \`X\`.
- Print the first few rows of \`X\` and \`y\` with \`head()\` to verify that features and labels still align.

**Model steps:**
1. Split the data into training and testing sets.
2. Use \`GaussianNB\` for these continuous measurements and explain why the preserved legacy \`MultinomialNB\` source is an implementation to audit rather than the current route.
3. Call \`fit()\` on the training data.
4. Call \`predict()\` on the test data.
5. Compare with \`DummyClassifier\`; report accuracy, macro F1, and a confusion matrix.

**Transfer check:** Create a few custom feature vectors, predict their species, and note that these examples may not exist in the original dataset.

**Reflection:** Summarize the dataset, model accuracy, and any classifications that seemed surprising or uncertain.`,
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML3-Naive-Bayes-Iris-Flowers-Classification",
					datasetLink:
						"https://gist.githubusercontent.com/curran/a08a1080b88344b0c8a7/raw/639388c2cbc2120a14dcf466e85730eb8be498bb/iris.csv",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml3_project_1.mp4"
				},
				{
					title: "ML3 Project 2: Email Spam Classification",
					content: `**Goal:** Use Naive Bayes to classify emails as spam or not spam.

**Data cleaning:**
- Load the supplied fictional or sanitized email fixture locally; do not use personal inbox messages.
- Drop irrelevant columns such as message IDs or duplicate label columns.
- Remove duplicate rows.
- Confirm which column contains the email text and which column contains the spam/ham label.

**Text preprocessing:**
- Split raw message text before fitting the vectorizer.
- Use scikit-learn's \`CountVectorizer\` defaults first, then test one documented preprocessing change.
- Keep vectorization and \`MultinomialNB\` together in a \`Pipeline\`; no package or stopword download occurs during a normal run.

**Model steps:**
1. Build the label list for spam or ham.
2. Split raw messages with a fixed random state and stratification.
3. Train \`MultinomialNB\` through the text pipeline.
4. Compare with \`DummyClassifier\`; report precision, recall, F1, and a confusion matrix in addition to accuracy.
5. Inspect redacted or fictional misclassified examples without printing private message text.

**Reflection checks:**
- Record training time and model accuracy.
- Explain why Naive Bayes is a useful baseline for text classification.
- Name one risk of relying only on accuracy or only on word counts.
- State that the model is a classroom demonstration, not a production spam filter.`,
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML3-Email-Spam-Classification",
					datasetLink:
						"https://github.com/instruction-material/AI-Level-2/blob/main/ML3-Email-Spam-Classification/emails.csv",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml3_project_2.mp4"
				}
			],
			supplementalProjects: [
				{
					title: "Naive Bayes: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Naive Bayes",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML3-Naive-Bayes-Iris-Flowers-Classification"
				},
				{
					title: "Naive Bayes Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML3 Naive Bayes",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-03-ml3-naive-bayes-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-03-ml3-naive-bayes-supplemental-2/solution"
				},
				{
					title: "Naive Bayes Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML3 Naive Bayes",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-04-ml3-naive-bayes-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-04-ml3-naive-bayes-supplemental-3/solution"
				}
			]
		},
		{
			title: "ML3.5 Decision Trees and Interpretable Models",
			curriculum: [
				{
					title: "Decision Trees as Split-Based Reasoning",
					content:
						"Decision trees are supervised models that repeatedly ask the most informative question available at each split. This connects to interpretable rule-based classification, not just to another library call."
				},
				{
					title: "Entropy, Gini, and Overfitting at an Intuitive Level",
					content:
						"Keep the math light but honest: a good split reduces uncertainty, and a tree that grows without restraint can memorize noise. This is the best place in the course to make bias-variance tradeoffs visible through an inspectable model."
				},
				{
					title: "Tree Models as a Bridge between Rules and Learned Models",
					content:
						"Trees connect early rule-based intuition with later statistical models. A tree is often easier to explain than a neural net, which makes it useful for comparison and for building confidence in model behavior."
				},
				{
					title: "Decision Tree Lab",
					content:
						"Build a decision tree classifier on the supplied low-stakes fixture or Iris, compare it with a dummy baseline on one fixed split, visualize only the most useful shallow tree, and compare validation behavior as maximum depth changes. Titanic and customer churn are optional historical examples, not required datasets."
				},
				{
					title: "ML3.5 Decision Trees and Interpretable Models: Core Project",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"ML3.5 Decision Trees and Interpretable Models",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"/course-assets/machine-learning/machine-learning-practice-pack.md#interpretable-tree-case",
					solutionLink:
						"/course-assets/machine-learning/machine-learning-verification-guide.md#interpretable-tree-key"
				}
			],
			supplementalProjects: [
				{
					title: "ML3.5 Decision Trees and Interpretable Models: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"ML3.5 Decision Trees and Interpretable Models",
						section: "extension"
					}),
					projectLink:
						"/course-assets/machine-learning/machine-learning-practice-pack.md#interpretable-tree-case",
					solutionLink:
						"/course-assets/machine-learning/machine-learning-verification-guide.md#interpretable-tree-key"
				},
				{
					title: "ML3.5 Decision Trees and Interpretable Models Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"ML3.5 Decision Trees and Interpretable Models",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-05-ml3-5-decision-trees-and-interpretable-models-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-05-ml3-5-decision-trees-and-interpretable-models-supplemental-2/solution"
				},
				{
					title: "ML3.5 Decision Trees and Interpretable Models Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"ML3.5 Decision Trees and Interpretable Models",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-06-ml3-5-decision-trees-and-interpretable-models-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-06-ml3-5-decision-trees-and-interpretable-models-supplemental-3/solution"
				}
			]
		},
		{
			title: "ML4 Neural Networks",
			curriculum: [
				{
					title: "Neurons and Activation Functions",
					content: `A neural network is another technique for classification and regression. The smallest useful unit is a neuron.

**Neuron model:**
- A neuron takes a fixed number of inputs and produces one output.
- Each input has a corresponding weight.
- The neuron also has a bias value.
- The weighted sum is passed through an activation function.

**Details:**
- If a neuron has two inputs, it needs two weights: \`w1\` and \`w2\`.
- The weighted input terms are \`x1*w1\` and \`x2*w2\`.
- The bias is added after the weighted terms: \`x1*w1 + x2*w2 + b\`.
- A sigmoid graph is useful here because the sigmoid function always returns a value between 0 and 1.
- Common activation functions include sigmoid and ReLU.

**Output formula:** \`y = f(x1*w1 + x2*w2 + b)\`

**Worked example:**
1. Let \`x1 = 0\`, \`x2 = 1\`, \`w1 = 1\`, \`w2 = 2\`, and \`b = 1\`.
2. Use sigmoid as the activation function.
3. Compute the weighted sum: \`(0)(1) + (1)(2) + 1 = 3\`.
4. Apply the activation function: \`f(3) = 0.953\` using a sigmoid calculator.

**Checkpoints:** Explain what changes when a weight changes, what changes when the bias changes, and why an activation function is needed at all.`
				},
				{
					title: "ML4 Project 1: Build a Neuron Class",
					content: `**Goal:** Build a small \`Neuron\` class so the neuron formula becomes executable code.

**Class design:**
- Store the weights as instance attributes.
- Store the activation function as an instance attribute.
- Pass the activation function into the constructor so different functions can be tested later.

**Method contract:**
- The \`run()\` method receives the two inputs, \`x1\` and \`x2\`.
- It also receives or uses the bias value.
- It computes the weighted sum and returns the activated output.

**Support function:** Write a standalone sigmoid function that takes one numeric input and returns the sigmoid output.

**Checkpoints:**
- Create at least one \`Neuron\` instance.
- Run the worked example from the lesson.
- Change one weight and explain why the output changes.`,
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML4-Neuron-Implementation",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml4_project_1.mp4"
				},
				{
					title: "Neural Network Structure",
					content:
						"A neural network is a collection of neurons organized in layers. A typical structure includes an input layer that passes in feature values, one or more hidden layers where neurons compute intermediate representations, and an output layer that produces the final prediction. In a small network with two inputs, a hidden layer of two neurons, and a single output neuron, the inputs go into both hidden neurons; each hidden neuron computes its output; then the output neuron takes those two hidden outputs as inputs, applies its own weights and activation, and produces the final output. A worked numeric example makes the continuous result traceable instead of treating the network as a black box."
				},
				{
					title: "ML4 Project 2: Simple Neural Network Simulation",
					content: `**Goal:** Use the \`Neuron\` class to simulate a tiny neural network.

**Network shape:**
- Two numeric inputs.
- One hidden layer with two neurons.
- One output neuron.
- A bias value used in each neuron calculation.

**Build steps:**
1. Initialize \`x1\`, \`x2\`, and \`b\`.
2. Create two \`Neuron\` objects for the hidden layer, each with its own weights and activation function.
3. Create a third \`Neuron\` object for the output layer.
4. Feed the original inputs into the hidden neurons.
5. Feed the hidden-neuron outputs into the output neuron.
6. Print each intermediate output so the data flow is visible.

**Experiments:**
- Change one hidden-layer weight and compare the final output.
- Change the output activation function and compare the final output.
- Explain why this network is still a simulation, not a trained model.`,
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML4-Simple-Neural-Network",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml4_project_2.mp4"
				},
				{
					title: "Neural Networks for Classification",
					content: `Neural networks can be used for classification tasks.

**Feature connection:**
- Each feature becomes an input value in the input layer.
- During training, each feature vector is fed forward through the network.
- The network produces an output that is compared to the true label.

**Training idea:**
- A loss function measures how far the prediction is from the true label.
- Backpropagation computes how much each weight contributed to that error.
- The optimizer updates weights to reduce loss over many examples.
- Training is the search for weights and biases that generalize, not just weights that memorize the training set.

**Classification output:** Neural-network outputs are continuous, so classification needs a mapping from output values to categories. A binary classifier might round a value between 0 and 1, while a multi-class classifier often uses softmax.

**Tooling note:** Keras is a high-level library that handles many implementation details for building and training neural networks.`
				},
				{
					title: "ML4 Choice Audit: Historical Diabetes-Risk Dataset",
					content: `**Goal:** Audit a bounded neural-network example that predicts the label in a historical diabetes-risk dataset. This is not a diagnosis, treatment recommendation, screening tool, or clinical decision system.

**Data setup:**
- Read the source and representation notes for the preserved Pima Indians Diabetes dataset.
- Identify which columns are features and which column is the label.
- Read the course-owned CSV locally; do not upload health or personal records.
- Separate the feature matrix \`X\` from the label vector \`y\`.
- Split before fitting preprocessing and use a fixed random state.

**Model steps:**
1. Establish a stratified \`DummyClassifier\` and a simple logistic-regression baseline.
2. Standardize numeric features inside a pipeline.
3. Optionally build a small Keras model with one or two bounded dense hidden layers.
4. Use a final sigmoid output layer for the binary label probability.
5. Fix seeds and cap samples, epochs, batch size, and CPU time.
6. Report precision, recall, F1, confusion matrix, and calibration or threshold behavior on held-out data.

**Experiments:**
- Compare the neural model with the simpler baseline, not only different epoch counts.
- Inspect at least two error slices and explain why subgroup results may be unstable.
- Record training time and stop when the stated compute budget is reached.

**Reflection:** Summarize provenance, representation limits, model structure, baseline comparison, uncertainty, and why this classroom audit cannot support a claim about an individual person's health.`,
					projectLink:
						"https://colab.research.google.com/drive/1CLK1xyg-6rvgj2Z8KtTkt2y4sGYL-dTG",
					solutionLink:
						"https://colab.research.google.com/drive/1tlWrkVmPQC3KPPgfLXAz6l9pk70jkS5b",
					datasetLink:
						"https://github.com/instruction-material/AI-Level-2/blob/main/ML4-Diabetes-Diagnosis-With-Neural-Networks/diabetes.csv",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml4_project_3.mp4"
				}
			],
			supplementalProjects: [
				{
					title: "Neural Networks: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Neural Networks",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML4-Neuron-Implementation"
				},
				{
					title: "Neural Networks Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML4 Neural Networks",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-07-ml4-neural-networks-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-07-ml4-neural-networks-supplemental-2/solution"
				},
				{
					title: "Neural Networks Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML4 Neural Networks",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-08-ml4-neural-networks-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-08-ml4-neural-networks-supplemental-3/solution"
				}
			]
		},
		{
			title: "ML5 Introduction to Regression",
			curriculum: [
				{
					title: "Regression vs. Classification",
					content:
						"Regression and classification both use supervised learning and labeled datasets, but regression predicts a continuous numeric value rather than a discrete category. Predicting house prices is a common example because outputs can take many possible numeric values. In regression, it is acceptable and expected to be off by some margin; the goal is to minimize average error rather than be exactly correct on every example."
				},
				{
					title: "Linear Regression Basics",
					content:
						"Linear regression models the relationship between an input x and an output y using a straight line: y = m x + b. Example data points can be graphed against several potential lines to compare which line better fits the data and why. In practice, libraries compute m (slope) and b (intercept) to minimize error over the whole dataset. Correlation describes the direction and strength of a relationship: a positive correlation means y tends to increase as x increases, a negative correlation means y tends to decrease as x increases, and the magnitude (close to 1 vs. close to 0) indicates strength."
				},
				{
					title: "ML5 Project 1: Simple Linear Regression",
					content: `**Goal:** Fit and interpret a simple linear regression model.

**Graph first:**
- Open the starter code in the local notebook or Python environment.
- Plot the given \`x\` and \`y\` data as a scatterplot.
- Decide whether the data appears to follow a roughly straight-line trend.

**Model steps:**
1. Use scikit-learn's \`LinearRegression\` class.
2. Fit the model to the data.
3. Print the slope and y-intercept.
4. Print the \`R^2\` score.
5. Use the model to predict \`y\` for a chosen \`x\`.
6. Plot the line of best fit on top of the scatterplot.

**Interpretation checks:**
- Describe whether the relationship is positive or negative.
- Use both the graph and \`R^2\` to decide whether the relationship looks strong, weak, or moderate.
- Try predictions for \`x\` values outside the original dataset and discuss whether those extrapolations seem reasonable.`,
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML5-Simple-Linear-Regression-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-Simple-Linear-Regression-Updated",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml5_project_1.mp4"
				},
				{
					title: "Polynomial Regression",
					content:
						"Not all relationships are linear; some are better modeled with curves. Data that follows a U-shaped or curved pattern can be modeled with polynomial regression, which fits equations like y = a x^2 + b x + c (or higher-degree polynomials) to the data. Polynomial regression adds terms with higher powers of x to capture curvature, and scikit-learn can generate polynomial features and fit these models similarly to linear regression."
				},
				{
					title: "ML5 Project 2: Simple Polynomial Regression",
					content: `**Goal:** Compare linear regression with polynomial regression on curved data.

**Initial inspection:**
- Plot the given \`x\` and \`y\` data.
- Decide whether a straight line looks appropriate or whether the trend appears curved.

**Linear baseline:**
- Fit a linear regression model.
- Plot the line over the data.
- Examine residuals and average error.

**Polynomial model:**
1. Use scikit-learn's \`PolynomialFeatures\` with \`LinearRegression\`.
2. Start with a quadratic model unless the data clearly needs another degree.
3. Print the learned coefficients and intercept.
4. Plot the curve on top of the data.

**Comparison checks:**
- Compare typical error for the linear and polynomial models.
- Predict the same chosen \`x\` value with both models.
- Explain which model captures the trend better and whether the extra complexity is justified.`,
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-Simple-Polynomial-Regression-Starter-Updated",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-Simple-Polynomial-Regression-Updated",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml5_project_2.mp4"
				},
				{
					title: "ML5 Choice Audit: Country-Year Life-Expectancy Estimates",
					content: `**Goal:** Use historical country-year aggregate records to compare regression models for the dataset's life-expectancy field. This does not predict an individual person's lifespan and does not establish causal effects.

**Data setup:**
- Read the course-owned CSV locally and record its source, years, countries, missingness, and unit of observation.
- Identify input features, such as health, economic, and demographic variables.
- Use the country-year life-expectancy field as the target output.
- Choose a group-aware or time-aware split so the test evidence is not inflated by near-duplicate country records across years.

**Model comparison:**
1. Reserve the held-out groups or later years before fitting preprocessing.
2. Establish a \`DummyRegressor\` baseline.
3. Build a leakage-safe linear-regression pipeline.
4. Build one justified regularized or tree-based comparison model.
5. Evaluate both on the same held-out split with MAE and one secondary metric.

**Reflection checks:**
- Compare which model fits better.
- Decide whether the added complexity is justified.
- Summarize associations at the country-year level without turning coefficients into causal claims.
- Name the ecological fallacy and explain why aggregate associations cannot be assigned to an individual.
- Record two error slices, uncertainty, and one data limitation that could change the conclusion.`,
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML5-Predicting-Life-Expectancy",
					datasetLink:
						"https://github.com/instruction-material/AI-Level-2/blob/main/ML5-Predicting-Life-Expectancy/life_expectancy.csv",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml5_project_3.mp4"
				}
			],
			supplementalProjects: [
				{
					title: "Introduction to Regression: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Introduction to Regression",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML5-Simple-Linear-Regression-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-Simple-Linear-Regression-Updated"
				},
				{
					title: "Introduction to Regression Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML5 Introduction to Regression",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-09-ml5-introduction-to-regression-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-09-ml5-introduction-to-regression-supplemental-2/solution"
				},
				{
					title: "Introduction to Regression Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML5 Introduction to Regression",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-10-ml5-introduction-to-regression-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-10-ml5-introduction-to-regression-supplemental-3/solution"
				}
			]
		},
		{
			title: "ML6 Regression with Neural Networks",
			curriculum: [
				{
					title: "Neural Networks for Regression",
					content:
						"Neural networks can also be used for regression, not just classification. For nonlinear or complex relationships, neural networks can approximate a curved function that fits the data more flexibly than polynomial regression. The tradeoffs matter: networks usually require more data, take longer to train, and are harder to interpret, so they are best used when simpler models are not accurate enough."
				},
				{
					title: "Evaluating Regression Models",
					content:
						"Mean squared error (MSE) and mean absolute error (MAE) are standard metrics for regression. Both measure average prediction error: MAE averages absolute differences, while MSE averages squared differences, which penalizes large errors more heavily. A good regression model aims to minimize these values on both training and test data. Overfitting happens when a model fits the training data extremely well but performs poorly on new data; it has memorized rather than generalized. Train-test splits, such as 80% training and 20% testing, help check generalization."
				},
				{
					title: "ML6 Project 1: Comparing Housing-Value Regression Models",
					content: `**Goal:** Compare a bounded neural-network regressor with a simpler baseline on the California housing dataset or the supplied synthetic housing fixture.

**Data setup:**
- Work locally with scikit-learn's California housing data when it is already cached, or use the supplied synthetic fixture for a complete offline route.
- Record the unit of observation, target, feature meanings, source, and limitations.
- Split with a fixed random state before fitting preprocessing.
- Normalize input features inside a pipeline or training-only preprocessing path.

**Model steps:**
1. Establish \`DummyRegressor\` and linear-regression baselines.
2. Design a small dense neural network for regression.
3. Use ReLU or a similar activation in hidden layers and a linear numeric output.
4. Fix seeds, compile with a regression loss, and cap samples, epochs, batch size, and CPU time.
5. Use validation evidence and an explicit stopping rule rather than increasing epochs until the result looks good.

**Evaluation:**
- Record training and validation MAE over epochs.
- Evaluate every candidate on the same held-out test set with MAE and RMSE.
- Plot residuals and predicted versus observed values with a \`y = x\` reference line.
- Inspect at least two error slices and compare the network with the simpler baselines.

**Legacy audit:** The linked historical source uses the Boston Housing dataset. Preserve it only as an optional dataset-ethics and migration audit; do not use its ethically problematic \`B\` feature or its score as the required benchmark.

**Reflection:** Explain whether the neural network earned its added complexity, how normalization and stopping affected generalization, and why this educational estimate is not a real appraisal.`,
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML6-Predicting-House-Prices",
					datasetLink:
						"https://scikit-learn.org/stable/modules/generated/sklearn.datasets.fetch_california_housing.html",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml6_project_1.mp4"
				},
				{
					title: "Regression with Neural Networks: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Regression with Neural Networks",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Regression with Neural Networks: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Regression with Neural Networks",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML6-Predicting-House-Prices"
				},
				{
					title: "Regression with Neural Networks Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML6 Regression with Neural Networks",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-11-ml6-regression-with-neural-networks-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-11-ml6-regression-with-neural-networks-supplemental-2/solution"
				},
				{
					title: "Regression with Neural Networks Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML6 Regression with Neural Networks",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-12-ml6-regression-with-neural-networks-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-12-ml6-regression-with-neural-networks-supplemental-3/solution"
				}
			]
		},
		{
			title: "ML7 Image Classifier",
			curriculum: [
				{
					title: "Image Data and Classification",
					content:
						"Images are arrays of pixel values, but near-duplicate images, camera sources, and augmentation can leak across splits. This optional appendix uses only supplied non-personal cloudy, rain, sunrise, and sunshine examples. Group originals and related images by source before creating train, validation, and test sets; apply augmentation to training only; and treat a small result as a workflow demonstration rather than broad visual recognition."
				},
				{
					title: "ML7 Project 1: Weather Image Classifier",
					content: `**Goal:** Build a neural network that classifies weather images as rainy, sunny, cloudy, or sunrise.

**Data setup:**
- Use the supplied local, non-personal weather-image example set; do not upload learner photos or images of people.
- Group originals, crops, and near-duplicates by source before splitting.
- Define separate training, validation, and held-out test directories.
- Handle resizing, rescaling, bounded batching, and deterministic seeds explicitly.
- Apply random augmentation to training images only.

**Model choices:**
- Establish a majority-class or simple color-histogram baseline.
- Use a small convolutional neural network only when local resources permit.
- A dense network after flattening can be used as a comparison, but discuss it as a weaker baseline for image structure.
- Compile with a suitable multi-class classification loss.
- Cap image count, dimensions, epochs, batch size, and CPU time before training.

**Evaluation steps:**
1. Train on the training set while monitoring validation accuracy.
2. Choose the stopping point without looking at the held-out test labels.
3. Evaluate once on the test set with accuracy, macro F1, per-class recall, and a confusion matrix.
4. Inspect at least one error from each class when available.
5. Report runtime, resource limits, and instability across seeds.

**Reflection checks:**
- Compare predictions with true labels.
- Discuss both success behavior and failure-mode behavior.
- Summarize the dataset, split-by-source rule, model architecture, baseline comparison, class-level results, and images where the model struggled.
- State that the linked Colab notebooks are preserved historical references and that the active source repository has no complete local ML7 implementation.`,
					projectLink:
						"https://colab.research.google.com/drive/12HpOOjmQgf5sLmrTgknSFX24aSln6rT6?usp=sharing",
					solutionLink:
						"https://colab.research.google.com/drive/1YvuhSoBOXsV7Iip3Xu5AGgQC4LmJWbnL?usp=sharing",
					datasetLink:
						"https://data.mendeley.com/datasets/4drtyfjtfy/",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ml7_project_1.mp4"
				},
				{
					title: "Further Reading on ML Models",
					content:
						"Provide optional reading to deepen understanding of advanced concepts used in modern ML: loss functions (how models measure their error during training and why different problems use different loss definitions), convolutional neural networks (CNNs) for image processing and why convolutions help detect patterns like edges and textures, and the idea of a `model` as a trained artifact that can be deployed and reused. Skim articles on loss functions, convolutional networks, and machine learning models from sources such as Google's ML Crash Course, IBM, Microsoft, and Databricks, then connect those ideas back to the weather image classifier built in the course."
				},
				{
					title: "Image Classifier: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Image Classifier",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Image Classifier: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Image Classifier",
						section: "extension"
					}),
					projectLink:
						"https://colab.research.google.com/drive/12HpOOjmQgf5sLmrTgknSFX24aSln6rT6?usp=sharing",
					solutionLink:
						"https://colab.research.google.com/drive/1YvuhSoBOXsV7Iip3Xu5AGgQC4LmJWbnL?usp=sharing"
				},
				{
					title: "Image Classifier Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML7 Image Classifier",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-13-ml7-image-classifier-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-13-ml7-image-classifier-supplemental-2/solution"
				},
				{
					title: "Image Classifier Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML7 Image Classifier",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-14-ml7-image-classifier-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-14-ml7-image-classifier-supplemental-3/solution"
				}
			]
		},
		{
			title: "ML7.5 Model Evaluation, Comparison, and Dataset Strategy",
			curriculum: [
				{
					title: "Classification Metrics beyond Accuracy",
					content:
						"Accuracy, balanced accuracy, precision, recall, F1, and the confusion matrix are different lenses on model quality. Start with a task-appropriate DummyClassifier, name one primary and one secondary metric before training, and keep the held-out test set untouched until model selection is complete. A single percentage can hide the wrong failure mode, especially on imbalanced data."
				},
				{
					title: "Regression Metrics and Residual Thinking",
					content:
						"Start regression with DummyRegressor, then make residuals, MAE, RMSE, and `R^2` part of the recurring workflow. Fit imputers, scalers, encoders, and feature generation only on training data. A strong explanation connects a bad prediction and meaningful error slice to the same pattern in the summary metrics."
				},
				{
					title: "Dataset Choice by Difficulty and Model Fit",
					content:
						"Build a small internal dataset bank by difficulty: tiny synthetic demos for concept explanation, medium structured datasets for classification and regression, and broader low-stakes capstone candidates. Each dataset card records source, license, unit of observation, target, prediction-time features, likely leakage, sensitive fields, sampling limits, and intended use."
				},
				{
					title: "Compare at Least Two Models per Serious Project",
					content:
						"Include a dummy baseline and short comparison note whenever two plausible models can be tried on the same problem. Use one fixed split or cross-validation plan, one reproducible pipeline per candidate, the same metrics, and a written reason to prefer the simpler model when performance is meaningfully similar."
				},
				{
					title: "ML7.5 Model Evaluation, Comparison, and Dataset Strategy: Core Project",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"ML7.5 Model Evaluation, Comparison, and Dataset Strategy",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML5-Simple-Linear-Regression-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML5-Simple-Linear-Regression"
				}
			],
			supplementalProjects: [
				{
					title: "ML7.5 Model Evaluation, Comparison, and Dataset Strategy: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"ML7.5 Model Evaluation, Comparison, and Dataset Strategy",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML5-Simple-Linear-Regression-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML5-Simple-Linear-Regression"
				},
				{
					title: "ML7.5 Model Evaluation, Comparison, and Dataset Strategy Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"ML7.5 Model Evaluation, Comparison, and Dataset Strategy",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-15-ml7-5-model-evaluation-comparison-and-dataset-strategy-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-15-ml7-5-model-evaluation-comparison-and-dataset-strategy-supplemental-2/solution"
				},
				{
					title: "ML7.5 Model Evaluation, Comparison, and Dataset Strategy Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"ML7.5 Model Evaluation, Comparison, and Dataset Strategy",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-16-ml7-5-model-evaluation-comparison-and-dataset-strategy-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-16-ml7-5-model-evaluation-comparison-and-dataset-strategy-supplemental-3/solution"
				}
			]
		},
		{
			title: "ML8 Master Project",
			curriculum: [
				{
					title: "Master Project Planning",
					content: `The Master Project is a capstone built around a low-stakes public, synthetic, or course-supplied dataset and a substantial machine-learning question.

**Allowed problem types:**
- Classification, such as fictional support tickets, plant species, manufactured-part quality labels, or supplied game states.
- Regression, such as synthetic energy use, bicycle demand, or a course-generated numeric outcome.
- Clustering, such as comparing stable groupings in a supplied non-personal dataset without naming clusters as facts about people.
- A comparison project that uses more than one course algorithm on the same dataset.

**Possible algorithms:** k-means, KNN, Naive Bayes, neural networks, regression, and related evaluation tools.

**Scoping checks:**
- The dataset is accessible and understandable.
- The target variable is clearly defined.
- Every feature is available at the claimed prediction time, and likely leakage has been identified.
- The problem fits personal interests well enough to sustain debugging and analysis.
- The result can be evaluated with an appropriate metric.
- The project does not make medical, financial, employment, discipline, admissions, identity, biometric, surveillance, or other consequential decisions.`
				},
				{
					title: "Master Project Implementation",
					content: `**Goal:** Turn the scoped capstone idea into a two-week build plan.

**Planning decisions:**
- Write a data-and-problem card with intended use and non-goals.
- Identify input features.
- Identify the target label or regression output.
- Choose one primary and one secondary evaluation metric before training.
- Choose a task-appropriate dummy baseline.
- Decide which two algorithms to compare.
- Prefer a simple interpretable model as one candidate.

**Notebook workflow:**
1. Create a local notebook or Python module and record the environment.
2. Load the supplied or locally cached dataset and verify its version.
3. Reserve the held-out test set before fitting preprocessing.
4. Build leakage-safe preprocessing and model pipelines.
5. Fit the dummy baseline.
6. Tune or cross-validate the first candidate on training data.
7. Tune or cross-validate the comparison model on the same training evidence.
8. Evaluate both once on the held-out test set with the same metrics.
9. Inspect error slices, record resource use, and complete a model card.
10. Restart and rerun from the first cell to prove reproducibility.

**Checkpoint cadence:** Plan for substantial independent implementation and debugging, with periodic review checkpoints that focus on evidence, not just whether the notebook runs.`
				},
				{
					title: "ML8 Project 1: Master Project Workspace",
					content:
						"Use the linked ML8 folder only as a minimal historical placeholder, not as a complete starter. The supplied practice pack is the current capstone structure. Compare a dummy baseline and at least two candidate models, justify the metrics, preserve the held-out test boundary, add error slices and a model card, and leave the local notebook or modules reproducible enough to review as a portfolio artifact.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML8-Master-Project"
				},
				{
					title: "Master Project Examples",
					content:
						"Use supplied low-stakes examples such as fictional support-ticket classification, synthetic energy-use regression, plant classification, or non-personal clustering. Historical Titanic, insurance, health, credit, fraud, and market examples may be audited for data and claim risks, but they are not required capstone templates. Adapt a technique only when its assumptions fit the chosen dataset and problem."
				},
				{
					title: "Master Project Presentation",
					content:
						"When the project reaches a solid, working state, write a concise project summary explaining which concepts from the course were used (clustering, classification, regression, neural networks, train–test split, etc.) and what was learned about the data."
				},
				{
					title: "Course Recap & Next Steps",
					content: `**Recap targets:**
- Unsupervised learning and clustering.
- Supervised learning and classification.
- KNN, Naive Bayes, decision trees, neural networks, regression, overfitting, leakage control, evaluation, and optional image classification.
- The difference between a working notebook and a justified modeling result.

**Master Project connection:**
- Identify which techniques were used.
- State what evidence supports the results.
- Name the strongest limitation that remains.
- Explain what would be improved with more time, data, or compute.

**Next-step options:** Strong follow-on paths include USACO training for advanced competitive programming, AP Computer Science, or language-specific Level 1 courses in Java, JavaScript, or C++.

**Portfolio framing:** Treat the Master Project as evidence of a complete data/modeling workflow, including data cleaning, model selection, evaluation, comparison, and cautious interpretation.`
				}
			],
			supplementalProjects: [
				{
					title: "Master Project: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Master Project",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML8-Master-Project"
				},
				{
					title: "Master Project Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML8 Master Project",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-17-ml8-master-project-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-17-ml8-master-project-supplemental-2/solution"
				},
				{
					title: "Master Project Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "ML8 Master Project",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-18-ml8-master-project-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-18-ml8-master-project-supplemental-3/solution"
				}
			]
		},
		{
			title: "Customer Segmentation Starter Build: Practice Studio",
			aliases: ["Customer Segmentation: Implementation Lab"],
			curriculum: [
				{
					title: "Customer Segmentation Starter Build: Core Concepts",
					aliases: ["Customer Segmentation: Core Concepts"],
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation Starter Build: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "Customer Segmentation Starter Build: Guided Example",
					aliases: ["Customer Segmentation: Guided Example"],
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation Starter Build: Practice Studio",
						section: "example"
					})
				},
				{
					title: "Customer Segmentation Starter Build: Core Project",
					aliases: ["Customer Segmentation: Core Project"],
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation Starter Build: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Customer-Segmentation-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Customer-Segmentation"
				},
				{
					title: "Customer Segmentation Starter Build: Review and Reflection",
					aliases: ["Customer Segmentation: Review and Reflection"],
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation Starter Build: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Customer Segmentation Starter Build: Extension Challenge",
					aliases: ["Customer Segmentation: Extension Challenge"],
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation Starter Build: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Customer-Segmentation-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Customer-Segmentation"
				},
				{
					title: "Customer Segmentation Starter Build Transfer Practice",
					aliases: [
						"Customer Segmentation supplemental 2: Implementation Lab"
					],
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation Starter Build: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-19-applied-studio-12-customer-segmentation-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-19-applied-studio-12-customer-segmentation-supplemental-2/solution"
				},
				{
					title: "Customer Segmentation Starter Build Extension Practice",
					aliases: [
						"Customer Segmentation supplemental 3: Implementation Lab"
					],
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation Starter Build: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-20-applied-studio-12-customer-segmentation-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-20-applied-studio-12-customer-segmentation-supplemental-3/solution"
				}
			]
		},
		{
			title: "Customer Segmentation Interview: Practice Studio",
			curriculum: [
				{
					title: "Customer Segmentation Interview: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation Interview: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "Customer Segmentation Interview: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation Interview: Practice Studio",
						section: "example"
					})
				},
				{
					title: "Customer Segmentation Interview: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation Interview: Practice Studio",
						section: "coreProject",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Customer-Segmentation-Interview-Starter"
				},
				{
					title: "Customer Segmentation Interview: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation Interview: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Customer Segmentation Interview: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation Interview: Practice Studio",
						section: "extension",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Customer-Segmentation-Interview-Starter"
				},
				{
					title: "Customer Segmentation Interview Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation Interview: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-21-applied-studio-13-customer-segmentation-interview-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-21-applied-studio-13-customer-segmentation-interview-supplemental-2/solution"
				},
				{
					title: "Customer Segmentation Interview Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Customer Segmentation Interview: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-22-applied-studio-13-customer-segmentation-interview-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-22-applied-studio-13-customer-segmentation-interview-supplemental-3/solution"
				}
			]
		},
		{
			title: "Customer Segmentation: Practice Studio",
			curriculum: [
				{
					title: "Customer Segmentation: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Customer Segmentation: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "Customer Segmentation: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Customer Segmentation: Practice Studio",
						section: "example"
					})
				},
				{
					title: "Customer Segmentation: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Customer Segmentation: Practice Studio",
						section: "coreProject",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Customer-Segmentation-Starter"
				},
				{
					title: "Customer Segmentation: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Customer Segmentation: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Customer Segmentation: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Customer Segmentation: Practice Studio",
						section: "extension",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Customer-Segmentation-Starter"
				},
				{
					title: "Customer Segmentation Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Customer Segmentation: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-23-applied-studio-14-customer-segmentation-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-23-applied-studio-14-customer-segmentation-supplemental-2/solution"
				},
				{
					title: "Customer Segmentation Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Customer Segmentation: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-24-applied-studio-14-customer-segmentation-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-24-applied-studio-14-customer-segmentation-supplemental-3/solution"
				}
			]
		},
		{
			title: "Disney Movie Clustering Starter Build: Practice Studio",
			aliases: ["Disney Movie Clustering: Implementation Lab"],
			curriculum: [
				{
					title: "Disney Movie Clustering Starter Build: Core Concepts",
					aliases: ["Disney Movie Clustering: Core Concepts"],
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Disney Movie Clustering Starter Build: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "Disney Movie Clustering Starter Build: Guided Example",
					aliases: ["Disney Movie Clustering: Guided Example"],
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Disney Movie Clustering Starter Build: Practice Studio",
						section: "example"
					})
				},
				{
					title: "Disney Movie Clustering Starter Build: Core Project",
					aliases: ["Disney Movie Clustering: Core Project"],
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Disney Movie Clustering Starter Build: Practice Studio",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Disney-Movie-Clustering-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Disney-Movie-Clustering"
				},
				{
					title: "Disney Movie Clustering Starter Build: Review and Reflection",
					aliases: ["Disney Movie Clustering: Review and Reflection"],
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Disney Movie Clustering Starter Build: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Disney Movie Clustering Starter Build: Extension Challenge",
					aliases: ["Disney Movie Clustering: Extension Challenge"],
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Disney Movie Clustering Starter Build: Practice Studio",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Disney-Movie-Clustering-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Disney-Movie-Clustering"
				},
				{
					title: "Disney Movie Clustering Starter Build Transfer Practice",
					aliases: [
						"Disney Movie Clustering supplemental 2: Implementation Lab"
					],
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Disney Movie Clustering Starter Build: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-25-applied-studio-15-disney-movie-clustering-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-25-applied-studio-15-disney-movie-clustering-supplemental-2/solution"
				},
				{
					title: "Disney Movie Clustering Starter Build Extension Practice",
					aliases: [
						"Disney Movie Clustering supplemental 3: Implementation Lab"
					],
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle:
							"Disney Movie Clustering Starter Build: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-26-applied-studio-15-disney-movie-clustering-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-26-applied-studio-15-disney-movie-clustering-supplemental-3/solution"
				}
			]
		},
		{
			title: "Disney Movie Clustering: Practice Studio",
			curriculum: [
				{
					title: "Disney Movie Clustering: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Disney Movie Clustering: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "Disney Movie Clustering: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Disney Movie Clustering: Practice Studio",
						section: "example"
					})
				},
				{
					title: "Disney Movie Clustering: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Disney Movie Clustering: Practice Studio",
						section: "coreProject",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Disney-Movie-Clustering-Starter"
				},
				{
					title: "Disney Movie Clustering: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Disney Movie Clustering: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Disney Movie Clustering: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Disney Movie Clustering: Practice Studio",
						section: "extension",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML1-Disney-Movie-Clustering-Starter"
				},
				{
					title: "Disney Movie Clustering Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Disney Movie Clustering: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-27-applied-studio-16-disney-movie-clustering-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-27-applied-studio-16-disney-movie-clustering-supplemental-2/solution"
				},
				{
					title: "Disney Movie Clustering Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "Disney Movie Clustering: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-28-applied-studio-16-disney-movie-clustering-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-28-applied-studio-16-disney-movie-clustering-supplemental-3/solution"
				}
			]
		},
		{
			title: "KNN Car Classification: Practice Studio",
			curriculum: [
				{
					title: "KNN Car Classification: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle: "KNN Car Classification: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "KNN Car Classification: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle: "KNN Car Classification: Practice Studio",
						section: "example"
					})
				},
				{
					title: "KNN Car Classification: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle: "KNN Car Classification: Practice Studio",
						section: "coreProject",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML2-KNN-Car-Classification-Updated"
				},
				{
					title: "KNN Car Classification: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle: "KNN Car Classification: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "KNN Car Classification: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "machine learning",
						moduleTitle: "KNN Car Classification: Practice Studio",
						section: "extension",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML2-KNN-Car-Classification-Updated"
				},
				{
					title: "KNN Car Classification Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "KNN Car Classification: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-29-applied-studio-17-knn-car-classification-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-29-applied-studio-17-knn-car-classification-supplemental-2/solution"
				},
				{
					title: "KNN Car Classification Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "machine learning",
						moduleTitle: "KNN Car Classification: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-30-applied-studio-17-knn-car-classification-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main/ML-30-applied-studio-17-knn-car-classification-supplemental-3/solution"
				}
			]
		},
		{
			kind: "appendix",
			title: "Pending Static Assets",
			curriculum: [
				{
					title: "Machine Learning Media Status",
					content: [
						"This course uses the videos and images below. Hosted videos are available as direct static media links; pending images keep stable static media URLs until the files are added.",
						"**Hosted project videos:**",
						hostedMachineLearningAssetList(
							machineLearningHostedSourceVideos
						),
						"**Pending concept images:**",
						pendingMachineLearningAssetList(
							machineLearningPendingSourceImages
						)
					].join("\n\n")
				}
			],
			supplementalProjects: []
		}
	]
};

const MACHINE_LEARNING_CORE_SEQUENCE = [
	"ML0 Setup, Tooling, and Data Workflow",
	"ML7.5 Model Evaluation, Comparison, and Dataset Strategy",
	"ML1 K-Means Clustering",
	"ML2 K-Nearest Neighbors",
	"ML3 Naive Bayes",
	"ML3.5 Decision Trees and Interpretable Models",
	"ML5 Introduction to Regression",
	"ML4 Neural Networks",
	"ML6 Regression with Neural Networks",
	"ML8 Master Project"
] as const;

const MACHINE_LEARNING_APPENDICES = [
	"ML7 Image Classifier",
	"Customer Segmentation Starter Build: Practice Studio",
	"Customer Segmentation Interview: Practice Studio",
	"Customer Segmentation: Practice Studio",
	"Disney Movie Clustering Starter Build: Practice Studio",
	"Disney Movie Clustering: Practice Studio",
	"KNN Car Classification: Practice Studio",
	"Pending Static Assets"
] as const;

interface MachineLearningModuleFlow {
	stage: string;
	estimatedTime: string;
	keyBlocks: readonly [string, string, string, string, string, string];
	practiceSection: string;
	answerSection: string;
	route: string;
	evidence: string;
	primaryReference: {
		label: string;
		url: string;
	};
	additionalReferences?: readonly {
		label: string;
		url: string;
	}[];
}

const MACHINE_LEARNING_MODULE_FLOW: Record<
	(typeof MACHINE_LEARNING_CORE_SEQUENCE)[number],
	MachineLearningModuleFlow
> = {
	"ML0 Setup, Tooling, and Data Workflow": {
		stage: "Reproducible local foundation",
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"environment record",
			"data card",
			"local notebook",
			"split boundary",
			"restart check",
			"privacy"
		],
		practiceSection: "environment-and-data-card-case",
		answerSection: "environment-and-data-card-key",
		route: "Create the local environment, verify imports and versions, inspect a supplied fixture, write its data-and-problem card, reserve a held-out split, then restart and rerun from the first cell.",
		evidence:
			"The record includes Python and package versions, dataset source and checksum or version, unit of observation, target or unsupervised goal, likely leakage, expected and observed import check, and a clean restart result.",
		primaryReference: {
			label: "scikit-learn getting started",
			url: "https://scikit-learn.org/stable/getting_started.html"
		}
	},
	"ML7.5 Model Evaluation, Comparison, and Dataset Strategy": {
		stage: "Evaluation contract before model selection",
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"dummy baseline",
			"split plan",
			"pipeline",
			"primary metric",
			"error slice",
			"model card"
		],
		practiceSection: "evaluation-contract-case",
		answerSection: "evaluation-contract-key",
		route: "Write the evaluation contract before training: define the split, dummy baseline, primary and secondary metric, preprocessing fit boundary, model-comparison rule, error slices, and test-set opening condition.",
		evidence:
			"The completed contract makes leakage visible, uses the same evidence for every candidate, explains why accuracy or R-squared alone can mislead, and states when the simpler model is preferred.",
		primaryReference: {
			label: "scikit-learn common pitfalls",
			url: "https://scikit-learn.org/stable/common_pitfalls.html"
		},
		additionalReferences: [
			{
				label: "scikit-learn model evaluation",
				url: "https://scikit-learn.org/stable/modules/model_evaluation.html"
			}
		]
	},
	"ML1 K-Means Clustering": {
		stage: "Unsupervised pattern finding",
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"feature scale",
			"seed",
			"convergence",
			"empty cluster",
			"stability",
			"cluster limits"
		],
		practiceSection: "clustering-stability-case",
		answerSection: "clustering-stability-key",
		route: "Trace one manual iteration, repair the supplied convergence and empty-cluster failures, then compare scaled scikit-learn pipelines across k values and random seeds.",
		evidence:
			"The result records scaling, random state, n_init, stopping rule, stability across seeds, at least two k values, one visual or numeric quality measure, and why cluster labels are descriptive rather than causal facts.",
		primaryReference: {
			label: "StandardScaler reference",
			url: "https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.StandardScaler.html"
		}
	},
	"ML2 K-Nearest Neighbors": {
		stage: "Distance-based supervised classification",
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"ground truth",
			"stratified split",
			"one-hot encoding",
			"scaling",
			"dummy baseline",
			"confusion matrix"
		],
		practiceSection: "distance-classification-case",
		answerSection: "distance-classification-key",
		route: "Compare generated labels with ground truth, encode categorical inputs without arbitrary distances, fit preprocessing and KNN in one pipeline, tune k on training evidence, and compare with a dummy baseline.",
		evidence:
			"The report distinguishes learned-from-clusters labels from real labels, shows the split and pipeline, explains distance behavior, reports accuracy or balanced accuracy plus macro F1 and a confusion matrix, and tests one unknown category.",
		primaryReference: {
			label: "OneHotEncoder reference",
			url: "https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OneHotEncoder.html"
		},
		additionalReferences: [
			{
				label: "ColumnTransformer guide",
				url: "https://scikit-learn.org/stable/modules/compose.html"
			}
		]
	},
	"ML3 Naive Bayes": {
		stage: "Probability-based classification",
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"model assumption",
			"GaussianNB",
			"text pipeline",
			"precision recall",
			"redaction",
			"failure mode"
		],
		practiceSection: "probabilistic-classification-case",
		answerSection: "probabilistic-classification-key",
		route: "Match GaussianNB to continuous Iris measurements, match MultinomialNB to nonnegative text counts, keep vectorization inside the training pipeline, and compare both tasks with dummy baselines.",
		evidence:
			"The learner explains each distribution assumption, preserves raw-to-pipeline split order, reports task-appropriate metrics and confusion matrices, inspects only supplied or redacted errors, and names one assumption-driven failure.",
		primaryReference: {
			label: "GaussianNB reference",
			url: "https://scikit-learn.org/stable/modules/generated/sklearn.naive_bayes.GaussianNB.html"
		}
	},
	"ML3.5 Decision Trees and Interpretable Models": {
		stage: "Inspectable model comparison",
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"split question",
			"depth",
			"overfitting",
			"baseline",
			"tree explanation",
			"limit"
		],
		practiceSection: "interpretable-tree-case",
		answerSection: "interpretable-tree-key",
		route: "Fit a shallow decision tree to the supplied low-stakes fixture, compare depths using training-only evidence, inspect the main split rules, and compare held-out behavior with a dummy baseline.",
		evidence:
			"The result contains a depth comparison, a readable tree or rule trace, primary and secondary metrics, one error slice, a reason not to grow the tree further, and no claim that interpretability guarantees fairness or truth.",
		primaryReference: {
			label: "DecisionTreeClassifier reference",
			url: "https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeClassifier.html"
		}
	},
	"ML5 Introduction to Regression": {
		stage: "Numeric prediction with simple baselines",
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"unit of observation",
			"DummyRegressor",
			"MAE",
			"residual",
			"extrapolation",
			"association limit"
		],
		practiceSection: "regression-baseline-case",
		answerSection: "regression-baseline-key",
		route: "Graph first, establish a dummy baseline, fit linear and one justified nonlinear comparison on the same split, inspect residuals and extrapolation, then audit the optional country-year dataset without individual or causal claims.",
		evidence:
			"The report includes unit and target, split plan, dummy MAE, candidate MAE and one secondary metric, residual evidence, an extrapolation boundary, and a statement separating association from causation.",
		primaryReference: {
			label: "scikit-learn model evaluation",
			url: "https://scikit-learn.org/stable/modules/model_evaluation.html"
		}
	},
	"ML4 Neural Networks": {
		stage: "From explicit neuron arithmetic to bounded training",
		estimatedTime: "4–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"weighted sum",
			"activation",
			"layer trace",
			"simple baseline",
			"compute cap",
			"nonclinical claim"
		],
		practiceSection: "neural-network-audit-case",
		answerSection: "neural-network-audit-key",
		route: "Trace a neuron and tiny forward pass by hand, verify a transparent Python simulation, then compare one bounded trained network with a simpler model on supplied low-stakes data. The historical diabetes project is an optional audit only.",
		evidence:
			"The learner reproduces intermediate values, distinguishes simulation from training, records seeds and compute limits, compares against a simpler baseline, reports error evidence, and makes no diagnosis or individual-risk claim.",
		primaryReference: {
			label: "Keras training guide",
			url: "https://www.tensorflow.org/guide/keras/training_with_built_in_methods"
		}
	},
	"ML6 Regression with Neural Networks": {
		stage: "Bounded nonlinear regression comparison",
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"California housing",
			"training-only scaling",
			"early stopping",
			"MAE RMSE",
			"residual slices",
			"complexity decision"
		],
		practiceSection: "neural-regression-case",
		answerSection: "neural-regression-key",
		route: "Use California housing when locally cached or the supplied synthetic fixture, compare dummy, linear, and small neural models, stop from validation evidence, and decide whether the network earns its complexity.",
		evidence:
			"The packet records data route, split, scaler fit boundary, seeds, epoch and CPU caps, validation stopping point, held-out MAE and RMSE, residual slices, baseline comparison, and a non-appraisal limitation.",
		primaryReference: {
			label: "California housing dataset reference",
			url: "https://scikit-learn.org/stable/modules/generated/sklearn.datasets.fetch_california_housing.html"
		},
		additionalReferences: [
			{
				label: "Boston Housing ethical-use warning",
				url: "https://scikit-learn.org/1.0/modules/generated/sklearn.datasets.load_boston.html"
			}
		]
	},
	"ML8 Master Project": {
		stage: "Low-stakes reproducible capstone",
		estimatedTime: "8–10 sessions · 45–60 minutes each",
		keyBlocks: [
			"problem card",
			"held-out test",
			"baseline",
			"two candidates",
			"error analysis",
			"model card"
		],
		practiceSection: "model-comparison-capstone-case",
		answerSection: "model-comparison-capstone-key",
		route: "Choose one supplied or approved low-stakes dataset, freeze the problem and evaluation contract, compare a dummy baseline and two candidate pipelines, open the held-out test once, analyze errors, and present a reproducible model card.",
		evidence:
			"The final packet includes source and license, intended use and non-goals, split and random state, preprocessing boundary, baseline, two candidates, primary and secondary metrics, error slices, resource budget, restart-and-rerun proof, limitations, and human review.",
		primaryReference: {
			label: "NIST AI Risk Management Framework",
			url: "https://www.nist.gov/itl/ai-risk-management-framework"
		},
		additionalReferences: [
			{
				label: "NIST AI RMF measure guidance",
				url: "https://airc.nist.gov/airmf-resources/airmf/5-sec-core/"
			}
		]
	}
};

function machineLearningPracticeLink(section: string) {
	return `${MACHINE_LEARNING_PRACTICE_PACK}#${section}`;
}

function machineLearningVerificationLink(section: string) {
	return `${MACHINE_LEARNING_VERIFICATION_GUIDE}#${section}`;
}

function renderMachineLearningReferences(flow: MachineLearningModuleFlow) {
	return [
		`[${flow.primaryReference.label}](${flow.primaryReference.url})`,
		...(flow.additionalReferences ?? []).map(
			reference => `[${reference.label}](${reference.url})`
		)
	].join(", ");
}

function machineLearningSupplementalPath(title: string) {
	return /extension|challenge/i.test(title)
		? ("challenge" as const)
		: ("choice" as const);
}

function isMachineLearningChoice(title: string) {
	return /Choice Audit|Diabetes|Life Expectancy/i.test(title);
}

function decorateMachineLearningCoreModule(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	const flow =
		MACHINE_LEARNING_MODULE_FLOW[
			module.title as (typeof MACHINE_LEARNING_CORE_SEQUENCE)[number]
		];
	if (!flow) {
		throw new Error(`Missing Machine Learning flow: ${module.title}`);
	}

	const practiceLink = machineLearningPracticeLink(flow.practiceSection);
	const verificationLink = machineLearningVerificationLink(
		flow.answerSection
	);
	const references = renderMachineLearningReferences(flow);

	return {
		...module,
		kind: "module",
		estimatedTime: flow.estimatedTime,
		keyBlocks: [...flow.keyBlocks],
		curriculum: module.curriculum.map((item, index) => ({
			...item,
			content:
				index === 0
					? `**Course flow:** ${flow.stage}. ${flow.route}

**Evaluation contract:** Split before fitting learned preprocessing, establish a task-appropriate dummy baseline, fix random state, name one primary and one secondary metric, keep the held-out test set closed during model selection, and record meaningful error slices.

**Evidence gate:** ${flow.evidence}

**Local continuity:** Complete the [supplied Machine Learning case](${practiceLink}) before comparing it with the [verification guide](${verificationLink}). The local fixture and recorded environment are the complete route; Google Colab, remote datasets, accelerators, and personal accounts remain optional.

**Current references:** ${references}. Record versions and dataset identity because package behavior, defaults, examples, and hosted files can change.

${item.content}`
					: item.content,
			learningPath: isMachineLearningChoice(item.title)
				? ("choice" as const)
				: ("core" as const),
			...(item.projectLink
				? {
						datasetLink: item.datasetLink ?? practiceLink,
						mediaLink: item.mediaLink ?? flow.primaryReference.url
					}
				: {})
		})),
		supplementalProjects: module.supplementalProjects.map(item => ({
			...item,
			learningPath: machineLearningSupplementalPath(item.title),
			...(item.projectLink
				? {
						datasetLink: item.datasetLink ?? practiceLink,
						mediaLink: item.mediaLink ?? flow.primaryReference.url
					}
				: {})
		}))
	};
}

function decorateMachineLearningAppendix(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	const imageAppendix = module.title === "ML7 Image Classifier";
	return {
		...module,
		kind: "appendix",
		estimatedTime: imageAppendix
			? "Optional · 3–5 sessions"
			: "Optional reference or transfer practice",
		keyBlocks: imageAppendix
			? [
					"non-personal images",
					"grouped split",
					"training-only augmentation",
					"compute cap",
					"per-class metrics",
					"source gap"
				]
			: [
					"prior project",
					"transfer",
					"source trace",
					"evidence",
					"limitation",
					"next step"
				],
		curriculum: module.curriculum.map((item, index) => ({
			...item,
			content:
				index === 0
					? `**Optional appendix:** This material follows the complete ML0, ML7.5, ML1, ML2, ML3, ML3.5, ML5, ML4, ML6, and ML8 path. It does not add a hidden prerequisite. ${imageAppendix ? "The image-classification route is bounded, local, non-personal, and compute-capped; the active source repository does not contain a complete local implementation." : "Use this repeated studio only when another pass through the named project serves a specific transfer or support need."}

${item.content}`
					: item.content,
			learningPath: "choice" as const
		})),
		supplementalProjects: module.supplementalProjects.map(item => ({
			...item,
			learningPath: machineLearningSupplementalPath(item.title)
		}))
	};
}

const machineLearningModulesByTitle = new Map(
	machineLearningSourceCourse.modules.map(module => [module.title, module])
);

const machineLearningCoreModules = MACHINE_LEARNING_CORE_SEQUENCE.map(title => {
	const module = machineLearningModulesByTitle.get(title);
	if (!module) throw new Error(`Missing Machine Learning module: ${title}`);
	return decorateMachineLearningCoreModule(module);
});

const machineLearningAppendices = MACHINE_LEARNING_APPENDICES.map(title => {
	const module = machineLearningModulesByTitle.get(title);
	if (!module) throw new Error(`Missing Machine Learning appendix: ${title}`);
	return decorateMachineLearningAppendix(module);
});

export const machineLearningCourse: RawCourse = {
	...machineLearningSourceCourse,
	modules: [...machineLearningCoreModules, ...machineLearningAppendices]
};
