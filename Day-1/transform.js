const users = [
  { id: 1, first_name: "Alice", last_name: "Smith", age: 28, role: "admin" },
  { id: 2, first_name: "Bob", last_name: "Jones", age: 17, role: "user" },
  { id: 3, first_name: "Carol", last_name: "White", age: 34, role: "user" },
  { id: 4, first_name: "Dave", last_name: "Brown", age: 22, role: "moderator" },
];

// here we have to write functions 
// Format each user as `{ id, fullName, age, role }` using destructuring + template literals
//    - Filter to only adults (age >= 18)
//    - Find the first admin
//    - Return a summary object: `{ total, adults, admins }`


// console.log(`Formatted : [`)
// users.forEach(element => {
//     console.log(`{id: ${element.id}, ${element.first_name} ${element.last_name}, age: ${element.age}, role: ${element.role}} ,`);
// });
// console.log(`]`);
// console.log(`Adults : [`)
// users.filter(u=> u.age>=18);
// users.forEach(element=>{
//     console.loge(`${element.first_name}`);
// })


// correct way

const formatUser = ({id,first_name,last_name,age,role})=>({

    id,
    fullName : `${first_name} ${last_name}`,
    age,
    role,
});



const formatted = users.map(formatUser);

const adults = users.filter((u) => u.age >=18).map(formatUser);

const firstAdmin = users.find((u)=>u.role ==="admin");

const summary = {
    total: users.length,
    adults: adults.length,
    admins: users.filter((u)=>u.role === "admin").length,
};

console.log("Formatted: ",formatted);

console.log("Adults:",adults);

console.log("First admin:",formatUser(firstAdmin));

console.log("Summary:",summary);


const labelled = users.map(({id,first_name,last_name,age,role})=>({

id,
fullName: `${first_name} ${last_name}`,
age,
role,
label: age < 18 ? "minor" : "adult",
})).sort((a,b)=> a.fullName.localeCompare(b.fullName));

console.log(labelled);
