let featureExtractor, classifier, label, confidence, ctx, dataLoaded = false, trained = false, numLabels, trainingData

function preload () {
  numLabels = dataSet.numLabels
  trainingData = dataSet.trainingData

  featureExtractor = ml5
    .featureExtractor('MobileNet', {
      numLabels: 4,
      topk: 3,
      learningRate: 0.0001,
      hiddenUnits: 100,
      epochs: 20,
    }, loadLocalModel)

  classifier = featureExtractor
    .classification()
}

async function setup () {
  ctx = createCanvas(280, 280);
  ctx.parent('canvas')
  background(200)

  ctx.mouseReleased(predict)
}

function draw () {
  if (mouseIsPressed === true) {
    strokeWeight(4)
    line(mouseX, mouseY, pmouseX, pmouseY);
  }

  if (!trained) {
    $('#save-model').addClass('disabled')
  } else {
    $('#save-model').removeClass('disabled')
  }
}

/* Controller
========================================================================== */
const predict = () => {
  classifier.classify(ctx, (err, result) => {
    if (err) console.error(err)
    // console.log(result);
    const label = document.querySelector('#label-value')
    const confidence = document.querySelector('#confidence-value')
    label.textContent = result[0].label
    confidence.textContent = nf(result[0].confidence, 0, 2)
  });
}

const saveImage = () => {
  saveCanvas(ctx, 'arrow0', 'jpg')
}

const saveModel = () => {
  classifier.save(cb => {
    console.log(cb)
  }, `model-${new Date().toISOString().slice(0, 10)}`)
}

const loadLocalModel = () => {
  classifier.load('../models/model-v0.0.1.json', () => {
    $('.alert').show()
    $('.alert').text('✅ Local model was loaded!')
    setTimeout(() => $('.alert').hide(), 2500)
    $('.js-controller-model').show()
    $('.js-prediction').show()
    dataLoaded = true
    trained = true;
  })
}

function keyPressed () {
  if (key === ' ') {
    resetCanvas()
  }
}

const resetCanvas = () => {
  clear()
  background(200)
}

/*  Loading training data
========================================================================== */
const trainModel = async () => {
  $('.alert').show()

  trainingData
    .map(item => {
      for (let i = 0; i < item.length; i++) {
        item.examples.push(loadImage(`dataset/${item.label}/${item.label}-${i}.jpg`))
      }
    })

  await Promise
    .all(trainingData
      .map(async item => {
        try {
          await loadData(item.examples, item.label)
            .then(() => {
              console.log(`✅ ${item.label} has been loaded!`)
            })
        } catch (error) {
          console.log('Error on loadData(): ', error);
        }
      }))
    .then(() => {
      dataLoaded = true
      $('.alert').text('🎉 Done! You can train the model now.')
      $('.js-controller-model').show()
    })

  classifier.train((lossValue) => {
    $('.alert').text(`⌛  Training model...  Loss value: ${lossValue}`)
    if (lossValue === null) {
      $('.js-prediction').show()
      $('.alert').text('✅ Retraining completed!')

      setTimeout(() => $('.alert').hide(), 3000)
      trained = true;
    }

    console.log('Loss is', lossValue)
  })
}

async function loadData (arr, label) {
  return await Promise
    .all(arr.map(async item => await classifier.addImage(item.canvas, label)))
}
