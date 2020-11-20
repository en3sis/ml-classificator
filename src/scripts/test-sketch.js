async function setup () {
  ctx = createCanvas(280, 280);
  ctx.parent('canvas')
  background(200)

  fetch('http://localhost:8000/dataset?label=clock&quantity=10')
    .then(response => response.json())
    .then(data => {
      let count = 0
      for (const image of data) {
        setTimeout(() => {
          clear()
          background(200)
          drawImageFromData(image.drawing)
            .then((r) => {
              sendCanvasToAPI({ count })
              count += 1
            })
        })
      }
    })
}

const drawImageFromData = imageData => {
  for (let path of imageData) {
    noFill()
    stroke(2)
    beginShape()

    for (let i = 0; i < path[0].length; i++) {
      const x = path[0][i]
      const y = path[1][i]

      vertex(x, y)
    }

    endShape()
  }

  return new Promise((resolve, reject) => {
    resolve()
  })
}

const sendCanvasToAPI = ({ count }) => {
  fetch('http://localhost:8000/', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      label: 'clock',
      count: count,
      data: $('canvas')[0].toDataURL()
    })
  })
}
