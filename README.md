# About
This is a POC using Machine Learning [ml5](https://ml5js.org/) and MobilNet model with the idea to train the model and predict labels based on users input.

## How to try it locally:
First, make sure you install the dependencies:

### `npm i`

Once you do that, you can now run the local server and serve the static files by running:

### `npm start`

## Current state:

At this moment, we have a dataset of 4 categories, arrow-left, arrow-right, clock, x.
Once the project loads, give him like 5sec and then click on the Train button (open the devtool so you can see the feedback in the console.)

Once the output is `Loss is null` you can now draw an arrow (left or right) and click on predict.
You can cick on `Reset` and draw a new shape.
