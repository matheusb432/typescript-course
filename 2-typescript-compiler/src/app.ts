let button: HTMLButtonElement;

button ??= document.querySelector('button') as HTMLButtonElement;

// NOTE noImplicitReturns -- Since this function doesn't always return a value it should specify that in it's return type.
function add(n1: number, n2: number): number | void {
  if (n1 + n2 > 0) return n1 + n2;
}

function clickHandler(message: string) {
  console.log(`Clicked -- ${message}`);
}

button.addEventListener('click', clickHandler.bind(null, 'Test'));
