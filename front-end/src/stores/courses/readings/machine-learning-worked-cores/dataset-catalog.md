# Supplied data and source records

These pinned library projects include their required inputs:

| Project | Rows |
| --- | --- |
| [Customer neighbors](https://github.com/instruction-material/AI-Level-2/blob/609c914d179ffde8518cfbfdb74f6739f9a0418d/ML-Library-Workspaces/customer-neighbors/starter/customers.csv) | 200 |
| [Car neighbors](https://github.com/instruction-material/AI-Level-2/blob/609c914d179ffde8518cfbfdb74f6739f9a0418d/ML-Library-Workspaces/car-neighbors/starter/cars.csv) | 1,728 |
| [Iris Bayes](https://github.com/instruction-material/AI-Level-2/blob/609c914d179ffde8518cfbfdb74f6739f9a0418d/ML-Library-Workspaces/iris-naive-bayes/starter/iris.csv) | 150 |
| [Email Bayes](https://github.com/instruction-material/AI-Level-2/blob/609c914d179ffde8518cfbfdb74f6739f9a0418d/ML-Library-Workspaces/email-naive-bayes/starter/fictional-emails.csv) | 66 raw |
| [Linear fit](https://github.com/instruction-material/AI-Level-2/blob/609c914d179ffde8518cfbfdb74f6739f9a0418d/ML-Library-Workspaces/linear-regression/starter/main.py) | 10 |
| [Polynomial fit](https://github.com/instruction-material/AI-Level-2/blob/609c914d179ffde8518cfbfdb74f6739f9a0418d/ML-Library-Workspaces/polynomial-regression/starter/main.py) | 10 |
| [Country-year comparison](https://github.com/instruction-material/AI-Level-2/blob/609c914d179ffde8518cfbfdb74f6739f9a0418d/ML-Library-Workspaces/country-year-regression/starter/life_expectancy.csv) | 2,938 raw |

Customer features are income and spending; the training-only clustering rule supplies its labels. Car inputs are six categorical descriptors with a constructed acceptability target. Iris inputs are four continuous measurements with three species labels. Email uses authored text and ham/spam labels; removing two duplicate text/label pairs leaves 64 observations.

The two ten-point regressions demonstrate fitted-sample behavior. The optional country-year comparison removes ten missing targets, reserves disjoint country groups and uses 19 numeric inputs. Country and target remain outside the input features.

Each complete project supplies its local source record, README and runtime requirements. [Source records](https://github.com/instruction-material/AI-Level-2/tree/609c914d179ffde8518cfbfdb74f6739f9a0418d/ML-Library-Workspaces) identify the retained input copies and hashes. Original-data reuse conditions belong with the source when sharing a derived dataset; a source-code record identifies a copy rather than granting additional data rights.

The earlier standard-library projects include their own fictional tabular and small image fixtures. Their local data paths and question are specified in the corresponding assignment. Keep the complete selected folder together when running a case.
