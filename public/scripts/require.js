// todo: rebuild from scratch
// todo: rebuild with promises ?

(function(global) {
  "use strict";

  let baseURL = "";

  let modules = {};
  let callbacks = {};

  /**
   * 
   */
  function config(url) {
    baseURL = url;
  }

  /**
   *
   */
  function define(name, deps, impl) {
    if (!deps.length) {
      modules[name] = impl(); // define module without deps
      return trigger(name);
    }

    // call `get` for each dependency
    deps.forEach(dep => get(dep, onDepReady));

    // ------------------------

    function onDepReady() {
      // do nothing if not all deps are ready
      if (!allDepsReady) return;

      // collect module deps
      let depsModules = deps.map(name => modules[name]);

      // create module
      modules[name] = impl(...depsModules);

      // fire callback from `get` for this module
      trigger(name);
    }

    function allDepsReady() {
        return deps.every(dep => dep in modules);
    }
  }

  /**
   * 
   */
  function loadScript(name) {
    let $script = $("<script/>");
    $("script").last().after($script);
    $script.attr("src", `${baseURL}/${name}.js`);
  }

  /**
   * 
   */
  function get(name, cb) {
    if (modules[name]) {
      return cb(modules[name]);
    }

    if (!callbacks[name] || !callbacks[name].length) {
      loadScript(name);
    }

    on(name, cb);
  }

  /**
   * 
   */
  function on(name, cb) {
    if (!callbacks[name]) callbacks[name] = [];
    callbacks[name].push(cb);
  }

  /**
   * 
   */
  function trigger(name) {
    let cb;

    while (cb = callbacks[name].pop()) {
      let module = modules[name];
      cb(module);
    }
  }

  global.Require = {
    get: get,
    config: config,
    define: define
  }
})(window);