Require.config("/scripts/modules");

Require.get("main", main => main.doSomething());

// Require.get("sub2", mod => console.log(mod.say()));

// Require.get("mod2", mod => mod.say());

// Require.get("mod2", mod =>  mod.say());

// setTimeout(() => {
//   Require.get("mod2", mod => mod.say());
// }, 2000);
