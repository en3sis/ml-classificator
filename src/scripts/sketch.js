let featureExtractor, classifier, label, confidence, ctx, dataLoaded = false, trained = false;

const trainRight = [];
const trainLeft = [];
const trainClock = []
const trainX = []


function preload () {
  featureExtractor = ml5.featureExtractor('MobileNet', { numLabels: 4, epochs: 50 })
  classifier = featureExtractor.classification()


/* ==========================================================================
Loading training data
========================================================================== */
  for (let i = 0; i < 10; i++) {
    trainRight.push(loadImage(`dataset/arrow-right/arrow${i}.jpg`))
  }

  for (let i = 0; i < 10; i++) {
    trainLeft.push(loadImage(`dataset/arrow-left/arrow${i}.jpg`))
  }

  for (let i = 0; i < 20; i++) {
    trainClock.push(loadImage(`dataset/clock/clock${i}.jpg`))
  }

  for (let i = 0; i < 10; i++) {
    trainX.push(loadImage(`dataset/x/x${i}.jpg`))
  }

}

function setup () {
  ctx = createCanvas(280, 280);
  ctx.parent('canvas');

  background(200)

  loadData(trainRight, 'arrow-right').then(res => {
    console.log('right dataset images loaded!')
    console.log(res)
  })

  loadData(trainLeft, 'arrow-left').then(res => {
    console.log('left dataset images loaded!')
    console.log(res)
  })

  loadData(trainClock, 'clock').then(res => {
    console.log('clock dataset images loaded!')
    console.log(res)
  })

  loadData(trainX, 'x').then(res => {
    console.log('x dataset images loaded!')
    console.log(res)
    dataLoaded = true
  })

}


function draw () {
  if (mouseIsPressed === true) {
    strokeWeight(4)
    line(mouseX, mouseY, pmouseX, pmouseY);
  }

  if (!dataLoaded) {
    $('.alert').text('Loading training data...')
    $('.btn-group').hide()
  } else {
    $('.alert').text('Done! You can train the model now.')
    $('.js-controller').show()
  }
}


async function loadData (arr, label) {
  const status = arr.map(async item => {
    return classifier.addImage(item.canvas, label)
  })

  return await Promise.all(status)
}

/* Controller
========================================================================== */

const trainModel = () => {
  return classifier.train((lossValue) => {
    $('.btn-group').hide()
    // $('.alert').text('Training model...')

    if (lossValue === null) {
      $('.btn-group').show()
    }
    console.log('Loss is', lossValue);
  })
}

const resetCanvas = () => {
  clear()
  background(200)
}

const predict = () => {
  classifier.classify(ctx, (err, result) => {
    if (err) console.error(err)
    console.log(result);

    const label = document.querySelector('#label-value')
    const confidence = document.querySelector('#confidence-value')
    label.textContent = result[0].label
    confidence.textContent = nf(result[0].confidence, 0, 2)
  });
}

const saveImage = () => {
  saveCanvas(ctx, 'arrow0', 'jpg');
}

const saveMovie = () => {
  classifier.save(cb => {
    console.log(cb)
  }, 'eos-icon-classif');
}
