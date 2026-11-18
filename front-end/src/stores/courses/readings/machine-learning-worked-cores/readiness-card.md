# Record the data before fitting

Create a readiness card for one supplied dataset using the completed example below. Link the selected input and record the observation unit, features, target, missing values, split, baseline and interpretation limit.

## Completed car card

**Source:** Marko Bohanec's [Car Evaluation dataset at UCI](https://archive.ics.uci.edu/dataset/19/car+evaluation), with attribution and reuse terms recorded on its CC BY 4.0 dataset page. The [course copy](https://github.com/instruction-material/AI-Level-2/blob/609c914d179ffde8518cfbfdb74f6739f9a0418d/ML-Library-Workspaces/car-neighbors/starter/cars.csv) supplies a header and uses `maintenance`, `lug boot` and `acceptability` for the corresponding original field names.

**Unit and inputs:** One constructed attribute combination. The six feature columns are `buying`, `maintenance`, `doors`, `persons`, `lug boot` and `safety`. `acceptability` is the target and stays outside the features.

**Inspection:** 1,728 rows, no missing values in the supplied columns, and label counts unacc=1,210; acc=384; good=69; vgood=65. Preserve the categorical values as strings.

**Evaluation:** The project's seed-100 stratified split reserves 1,296 training and 432 test rows. Fit the one-hot vocabulary and classifier on training rows; compare with a training-only most-frequent classifier on the same test rows.

**Check and limit:** Inspect an unknown-category query without expanding the vocabulary. The labels describe a decision rule, rather than observed real-vehicle safety.

Complete the card for a different supplied input, recording its actual counts and source conditions. Check it against that project's README and source record before fitting. Identify one field that would leak the target or reveal a reserved group if incorrectly included.
