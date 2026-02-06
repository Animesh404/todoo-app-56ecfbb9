
(function () {
  try {
    var qs = new URLSearchParams(window.location.search);
    var parentOrigin = qs.get('parentOrigin') || '*';

    function send(level, args) {
      try {
        window.parent.postMessage({
          source: 'iframe-logger',
          type: 'log',
          level: level,
          payload: Array.prototype.slice.call(args),
          timestamp: new Date().toISOString(),
        }, parentOrigin);
      } catch (_) {}
    }

    ['log','info','warn','error','debug'].forEach(function (m) {
      var orig = console[m];
      console[m] = function () {
        send(m, arguments);
        try { return orig.apply(console, arguments); } catch (_) {}
      };
    });

    console.log('[Fastable] Console interceptor ready');
  } catch (e) {
    try { console.warn('[Fastable] console interceptor init error:', e); } catch (_) {}
  }
})();

