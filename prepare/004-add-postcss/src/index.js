import './assets/style.css'

function foo() {
  const array = [11, 12, 13]

  document.querySelector('.example').innerText = [1, 2, 3, 4, ...array].filter((item) => item > 2)
}

foo()
