(function () {
  const ATTRS = [
    "href","routerLink","ng-reflect-router-link","data-href","data-url",
    "data-link","data-target-url","data-destination","data-path","to"
  ];

  const BUTTON_LIKE = [
    "button", "[role='button']",
    ".mdc-list-item", ".mat-mdc-list-item", "[mat-list-item]", "mat-list-item",
    ".mat-mdc-icon-button", "[mat-icon-button]"
  ].join(",");

  function meaningful(raw) {
    if (!raw) return false;
    const s = String(raw).trim().toLowerCase();
    if (!s || s === "#" || s.startsWith("#") || s.startsWith("javascript:")) return false;
    return true;
  }
  function absolutize(raw) { try { return new URL(raw, location.href).href; } catch { return null; } }
  function composedPath(e){ return (typeof e.composedPath === "function") ? e.composedPath() : [e.target]; }

  function findAInPath(e) {
    const path = composedPath(e);
    for (const el of path) if (el?.tagName?.toLowerCase() === "a") return el;
    try { return e.target.closest?.("a") || null; } catch { return null; }
  }

  function findUrlInAncestors(start, maxHops=10) {
    let el = start;
    for (let i=0; el && i<maxHops; i++, el = el.parentElement) {
      if (el.tagName?.toLowerCase() === "a") {
        const raw = el.getAttribute("href");
        if (meaningful(raw)) return absolutize(raw) || el.href || null;
        if (meaningful(el.href)) return el.href;
      }
      for (const a of ATTRS) {
        const v = el.getAttribute?.(a);
        if (meaningful(v)) { const abs = absolutize(v); if (abs) return abs; }
      }
      const oc = el.getAttribute?.("onclick");
      if (oc) {
        let m;
        if ((m = oc.match(/open\(\s*['"]([^'"]+)['"]/i))) { const abs = absolutize(m[1]); if (abs) return abs; }
        if ((m = oc.match(/location\.(?:assign|replace)\(\s*['"]([^'"]+)['"]/i))) { const abs = absolutize(m[1]); if (abs) return abs; }
        if ((m = oc.match(/location\.href\s*=\s*['"]([^'"]+)['"]/i))) { const abs = absolutize(m[1]); if (abs) return abs; }
      }
      try {
        const aDesc = el.querySelector?.("a[href]");
        if (aDesc) {
          const raw = aDesc.getAttribute("href");
          if (meaningful(raw)) return absolutize(raw) || aDesc.href || null;
          if (meaningful(aDesc.href)) return aDesc.href;
        }
      } catch {}
    }
    return null;
  }

  function isButtonLike(tgt) {
    try {
      if (!tgt) return false;
      if (tgt.closest?.(BUTTON_LIKE)) return true;
      const role = tgt.getAttribute?.("role");
      if (role === "button" || role === "menuitem") return true;
    } catch {}
    return false;
  }

  function hasMods(e){ return e.ctrlKey || e.metaKey || e.shiftKey || e.altKey; }
  function maybeOpen(url){ if (url) chrome.runtime.sendMessage({ type: "maybeOpenOnMiddle", url }); }

  document.addEventListener("auxclick", (e) => {
    if (e.button !== 1 || hasMods(e)) return;
    const a = findAInPath(e);
    if (!a) return;
    const raw = a.getAttribute?.("href");
    const isReal = meaningful(raw) || meaningful(a.href);
    if (!isReal) return;
    if (e.defaultPrevented) {
      maybeOpen(a.href);
    }
  }, { capture: true, passive: true });

  document.addEventListener("mousedown", (e) => {
    if (e.button !== 1 || hasMods(e)) return;

    const a = findAInPath(e);
    if (a && (meaningful(a.getAttribute?.("href")) || meaningful(a.href))) return;

    if (isButtonLike(e.target)) {
      maybeOpen(location.href);
      return;
    }

    const fromAnc = findUrlInAncestors(e.target);
    if (fromAnc) {
      maybeOpen(fromAnc);
      return;
    }
  }, { capture: true, passive: true });
})();