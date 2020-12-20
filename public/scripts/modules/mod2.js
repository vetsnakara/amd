Require.define("mod2", ["sub1", "sub2"], (sub1, sub2) => ({
    say() {
      console.log("I am mod2");
      console.log("I include:", sub1.say());
      console.log("I include:", sub2.say());
    }
}));