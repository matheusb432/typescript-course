const hobbies = ['Sports', 'Cooking'];
const activeHobbies = ['Hiking'];

// NOTE the spread operator, this is equivalent to passing 'Sports', 'Cooking' to this push call
activeHobbies.push(...hobbies);

const person = {
  firstName: 'Max',
  age: 30,
  anotherObj: {
    age: 55,
  },
};

// NOTE a common practice to shallow copy an object, in this case it will have the same contents but a different reference
const copiedPerson = { ...person };

// ! However if person were to have another object as a property, copiedPerson would still hold the same reference to anotherObj
// ! so mutating this value will also mutate the value in copied person
person.anotherObj.age = 60;

console.log(copiedPerson);

// * The solution to this is to deep clone it, like so:
const clonedPerson = JSON.parse(JSON.stringify(person));

person.anotherObj.age = 24;

console.log(clonedPerson);
/* // ? Output:
{
    "firstName": "Max",
    "age": 30,
    "anotherObj": {
        "age": 60
    }
}
*/

const add = (...numbers: number[]) => {
  return numbers.reduce((curResult, curValue) => {
    return curResult + curValue;
  }, 0);
};

const addedNumbers = add(5, 10, 2, 3.7);

console.log(addedNumbers);

// NOTE Array destructuring, order of elements matters and goes equivalent to array
const [hobby1, hobby2, ...remainingHobbies] = hobbies;

console.log(hobbies, hobby1, hobby2);

// NOTE Object destructuring, order doesn't matter and only goes by property names
const { firstName: userName, age } = person;

console.log(userName, age, person);
