function foo() {
  const array = [11, 12, 13];

  document.body.innerText = 123; // [1, 2, 3, 4, ...array].filter((item) => item > 2);
}

foo();
