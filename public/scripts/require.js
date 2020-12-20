(function(global) {
  "use strict";

  let baseURL = "";

  /**
   * Hash for instances of modules
   */
  let modules = {};

  /**
   * Hash for module callbacks
   * Are called when module is becoming available in `modules` hash
   */
  let callbacks = {};

  /**
   * Initialize private config vairables
   */
  function config(url) {
    baseURL = url;
  }

  /**
   * Add module definition
   */
  function define(name, deps, impl) {
    // define module without deps
    if (!deps.length) {
      modules[name] = impl(); 

      // define() is called always after get() for this module
      // so callback for this module is already registered and can be called immediately
      return trigger(name);
    }

    // `get` each dependency
    deps.forEach(dep => get(dep, onDepReady));

    // ------------------------

    /**
     * Callback for dependencies
     * Is called when dependency is becoming available
     */
    function onDepReady() {
      // skip if not all deps are ready
      if (!allDepsReady()) return;

      // collect module deps
      let depsModules = deps.map(name => modules[name]);

      // create module
      modules[name] = impl(...depsModules);

      // fire callback from `get` for this module
      trigger(name);
    }

    /**
     * Check if all deps for module are available
     */
    function allDepsReady() {
        return deps.every(dep => dep in modules);
    }
  }

  /** 
   * Load script by name
   * New `script` tag is inserted right after last script tag on the page
   */
  function loadScript(name) {
    let $script = $("<script/>");
    $("script").last().after($script);
    $script.attr("src", `${baseURL}/${name}.js`);
  }

  /**
   * Get module instance and call `cb` with it
   */
  function get(name, cb) {
    // call `cb` immediately if module is already available
    if (modules[name]) {
      return cb(modules[name]);
    }

    // load `script` with module definition if module is not yet available
    // or loading is already in progress
    if (!callbacks[name] || !callbacks[name].length) {
      loadScript(name);

      // add callback to call when module will be available
      on(name, cb);
    }
  }

  /**
   * Add callback for module `name`
   */
  function on(name, cb) {
    if (!callbacks[name]) callbacks[name] = [];
    callbacks[name].push(cb);
  }

  /**
   * Call all callbacks for module `name` and clean callback queue
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