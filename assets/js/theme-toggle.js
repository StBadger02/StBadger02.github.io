/* ── Mobile nav fix ─────────────────────────────────────────────────────────
   Force ALL nav items into the hamburger dropdown on narrow screens and
   keep CV pinned to the top of the list.
   ───────────────────────────────────────────────────────────────────────── */

function fixMobileNav() {
  if (window.innerWidth >= 925) return;

  var nav          = document.getElementById('site-nav');
  if (!nav) return;

  var visibleLinks = nav.querySelector('.visible-links');
  var hiddenLinks  = nav.querySelector('.hidden-links');
  var hamburger    = nav.querySelector('button');
  if (!visibleLinks || !hiddenLinks) return;

  // Move any items already in hidden-links back to visible first (reset greedy-nav state)
  Array.from(hiddenLinks.querySelectorAll('li')).forEach(function (item) {
    visibleLinks.appendChild(item);
  });

  // Now move every non-site-title item from visible → hidden, preserving nav order
  Array.from(visibleLinks.querySelectorAll('li:not(.masthead__menu-item--lg)')).forEach(function (item) {
    hiddenLinks.appendChild(item);
  });

  // Ensure the hamburger button is shown
  if (hamburger) hamburger.classList.remove('hidden');

  // Pin CV to the top of the dropdown
  var items = hiddenLinks.querySelectorAll('li');
  for (var i = 0; i < items.length; i++) {
    var a = items[i].querySelector('a');
    if (a && a.textContent.trim() === 'CV') {
      if (i > 0) hiddenLinks.insertBefore(items[i], hiddenLinks.firstChild);
      break;
    }
  }
}

// Run after greedy-nav has had time to initialise, and again on resize
setTimeout(fixMobileNav, 200);
window.addEventListener('resize', function () { setTimeout(fixMobileNav, 200); });


/* ── Theme toggle ────────────────────────────────────────────────────────── */

(function () {
  var btn  = document.getElementById('theme-toggle');
  var root = document.documentElement;
  var mql  = window.matchMedia('(prefers-color-scheme: dark)');

  function savedTheme()   { return localStorage.getItem('theme'); }
  function systemTheme()  { return mql.matches ? 'dark' : 'light'; }
  function currentTheme() { return savedTheme() || systemTheme(); }

  // Paint only. Writing to localStorage here is what used to pin the theme to
  // whatever the OS happened to be on the very first visit, after which
  // [data-theme] outranked the prefers-color-scheme rules in _dark-mode.scss
  // and the site stopped following the OS forever.
  function paint(theme) {
    root.setAttribute('data-theme', theme);
    if (btn) {
      var icon = btn.querySelector('i');
      if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  paint(currentTheme());

  if (btn) {
    btn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next); // persist an explicit choice only
      paint(next);
    });
  }

  // Keep following the OS until the visitor actually picks a side.
  function onSystemChange() { if (!savedTheme()) paint(systemTheme()); }
  if (mql.addEventListener)   mql.addEventListener('change', onSystemChange);
  else if (mql.addListener)   mql.addListener(onSystemChange); // Safari < 14
})();
