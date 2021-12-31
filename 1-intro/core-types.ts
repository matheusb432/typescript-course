// const ADMIN = 0;
// const READ_ONLY = 1;
// const AUTHOR = 2;

// NOTE enums allow magic numbers or string constants to be better defined and more human-readable
enum Role {
  Admin = 'Admin',
  // NOTE string or number values can also be assigned
  ReadOnly = 'Read Only',
  Author = 'Author',
}

// NOTE the Tuple type, specifies that this needs to be an array of fixed size with those types in that order.
//   role: [number, string];

const person = {
  name: 'Matt',
  age: 21,
  hobbies: ['Sports', 'Cooking'],
  role: Role.Author,
};

// NOTE TS can't detect that pushing is invalid code, so only explicit assignments get caught as errors in compilation
// person.role.push('admin');
// ? These two still throw errors though
// person.role[1] = 10;
// person.role = [0, 'admin', 'user'];

let activities: string[];

activities = ['Sports'];

console.log(person.hobbies);

for (const hobby of person.hobbies) {
  console.log(hobby.toUpperCase());
}

if (person.role === Role.Author) {
  console.log('user is author');
}
