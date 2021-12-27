const fetchedUserData = {
  id: 'u1',
  name: 'Max',
  job: { title: 'CEO', description: 'My own company' },
};

// NOTE optional chaining to safely access deeply nested properties
console.log(fetchedUserData?.job?.title);

const storedValue = undefined;

// NOTE nullish coalescing to default to another value in case the left operator is nullish (null or undefined)
const storedData = storedValue ?? 'DEFAULT';

console.log(storedData);
