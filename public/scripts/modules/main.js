Require.define( "main", ["mod1", "mod2"], (mod1, mod2) => ({
    doSomething() {
      mod1.say();
      mod2.say();
    }
}));
