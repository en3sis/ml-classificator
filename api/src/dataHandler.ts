import fs from 'fs';
import ndjson from 'ndjson';
import path from 'path';

export const readDataStream = ({ label, quantity }: {
  label: any,
  quantity: any
}) => {
  return new Promise((resolve, reject) => {
    const data: any = []

    // TODO: Download the model in a /temp file instead of saving the model
    fs.createReadStream(path.resolve(__dirname, `../dataset/${label}.ndjson`))
      .pipe(ndjson.parse())
      .on('error', err => reject(err))
      .on('data', function (obj) { data.push(obj) })
      .on('end', () => resolve(data.slice(0, quantity))
      )
  })
}

export const createImag = ({ label, count, data }: {
  label: string | undefined,
  count: number | undefined,
  data: string
}): void => {
  const base64Data = data.replace(/^data:image\/png;base64,/, '');

  const dir = path.resolve(__dirname, `../images/${label}/`)

  if (!fs.existsSync(dir)) fs.mkdirSync(dir)

  fs.writeFile(path.resolve(__dirname, `${dir}/${label}-${count}.png`), base64Data, 'base64', function (err: any) {
    if (err) {
      console.log(err)

      return {
        type: 'error',
        message: err
      }
    }
  })
}

export default readDataStream
