// function delay(ms){
//     return new Promise(resolve => setTimeout(resolve,ms));
// }

// delay(1000).then(()=> console.log("1 second later"));

// // Wrong — await inside forEach doesn't work as expected
// items.forEach(async (item) => {
//   await process(item); // forEach doesn't await these
// });

// // Right
// await Promise.all(items.map(item => process(item)));
// // or
// for (const item of items) {
//   await process(item); // sequential but correct
// }
// ```


// fetcher.js


// async function getUserWithPosts(){

//     try {
//         const res = await fetch(`https://jsonplaceholder.typicode.com/users`);

//         if (!res.ok) {
//             throw new Error(`HTTP error: ${res.status}`);
//         }

//         const data = await res.json();
//         console.log(data);
//     } catch (error) {
//         console.log("Failed to Fetch: ", error);
//         throw error;
//     }

// }

// getUserWithPosts();

async function getUserWithPosts(userId){

    const [userRes, postsRes] = await Promise.all([
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`),
    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`),
  ]);

    if(!userRes.ok) throw new Error(`User fetch failed : ${userRes.status}`);
    if(!postsRes.ok) throw new Error(`Posts fetch failed : ${postsRes.status}`);

    const [user,posts] = await Promise.all([userRes.json(),postsRes.json()]);

    return { user , posts , postCount: posts.length };

}

async function run() {
  try {
    const result = await getUserWithPosts(1);
    console.log(result.user);
    console.log(`${result.postCount} posts`);
  } catch (err) {
    console.error(err.message);
  }
}
run();

async function getMultipleUsers(ids){
    return Promise.all(ids.map((id)=>getUserWithPosts(id)));

}

async function run() {
  try {
    const result = await getUserWithPosts(1);
    console.log(result.user);
    console.log(`${result.postCount} posts`);

    const many = await getMultipleUsers([1, 2, 3]);
    console.log(`Fetched ${many.length} users`);
    many.forEach((r) => console.log(r.user.name, "-", r.postCount, "posts"));
  } catch (err) {
    console.error(err.message);
  }
}
run();



// // do after
// // Add a retry mechanism — if a request fails, retry once after 1 second
// - Measure and log how long each fetch took using `Date.now()`