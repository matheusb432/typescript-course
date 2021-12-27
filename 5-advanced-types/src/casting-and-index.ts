interface Bird {
  // NOTE applying the discriminated union pattern
  type: 'bird';
  flyingSpeed: number;
}

interface Horse {
  type: 'horse';
  runningSpeed: number;
}

type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
  let speed: number;

  // NOTE switching on the animal type to always only run the code relevant to the type on each case
  switch (animal.type) {
    case 'bird':
      speed = animal.flyingSpeed;
      break;
    case 'horse':
      speed = animal.runningSpeed;
      break;
    default:
      speed = 0;
      console.log('Not a bird or a horse!');
  }

  console.log(`Speed is ${speed}`);
}

const bird: Bird = { type: 'bird', flyingSpeed: 100 };
const horse: Horse = { type: 'horse', runningSpeed: 50 };

moveAnimal(bird);
moveAnimal(horse);

// const userInput = <HTMLInputElement>document.getElementById('user-input');
// NOTE type casting, should be used with caution since it overrides TS type inferrence
const userInput = document.getElementById('user-input') as HTMLInputElement;

if (userInput) {
  userInput.value = 'Greetings';
}

interface ErrorContainer {
  // NOTE other properties have to be of the same type as the index type
  //   id: string;
  // NOTE index types, prop name and count is unknown but the types are
  [prop: string]: string;
}

const errorBag: ErrorContainer = {
  email: 'Not a valid email!',
  userName: 'Must start with a capital character!',
};
