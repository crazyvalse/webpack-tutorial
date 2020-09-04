const bar = {
  a: {
    b: 123,
    c: {
      d: 'hello',
      e() {
        console.info(123)
      }
    }
  }
}

const bb = {
  ...bar,
  app: [1, 2, 3, 4],
  bpp: 'hello world'.includes('ll')
}

document.body.innerText = `这个是 ${JSON.stringify(bb)}`
