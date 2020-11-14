let featureExtractor, classifier, label, confidence, ctx, dataLoaded = false, trained = false

$(function () {
  $('.btn-group')
    .hide()
})

function preload () {
  featureExtractor = ml5
    .featureExtractor('MobileNet', { numLabels: 4, epochs: 50 })

  classifier = featureExtractor
    .classification()

  /*  Loading training data
  ========================================================================== */
  dataSet
    .map(item => {
      for (let i = 0; i < item.length; i++) {
        item.examples.push(loadImage(`dataset/${item.label}/${item.label}-${i}.jpg`))
    }
    })
}

async function setup () {
  ctx = createCanvas(280, 280);
  ctx
    .parent('canvas')
  background(200)

  await Promise
    .all(dataSet
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
}


function draw () {
  if (mouseIsPressed === true) {
    strokeWeight(4)
    line(mouseX, mouseY, pmouseX, pmouseY);
  }

  if (!dataLoaded) {
    $('.alert').text('⌛ Loading training data...')
    $('.btn-group').hide()
  }

  if (!trained) {
    $('#save-model').addClass('disabled')
  } else {
    $('#save-model').removeClass('disabled')
  }
}

async function loadData (arr, label) {
  return await Promise
    .all(arr.map(async item => await classifier.addImage(item.canvas, label)))
}

/* Controller
========================================================================== */
const trainModel = () => {
  return classifier.train((lossValue) => {
    $('.alert').text(`⌛  Training model...  Loss value: ${lossValue}`)
    if (lossValue === null) {
      $('.js-prediction').show()
      $('.alert').text('✅ Training completed! \n You can now draw on the canvas and click on Predict button')
      trained = true;
    }

    console.log('Loss is', lossValue)
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
  saveCanvas(ctx, 'arrow0', 'jpg')
}

const saveModel = () => {
  classifier.save(cb => {
    console.log(cb)
  }, `model-${new Date().toISOString().slice(0, 10)}`)
}


const loadModel = () => {
  // TODO: Load training data only on click, by default load local model once we have the v0.0.1
}
