// Toggle .condensed on the sticky hero once the page scrolls past the header.
(function(){
  var hero = document.querySelector('.hero');
  if (!hero) return;

  // Inject a compact back button into the hero (visible only in condensed mode).
  var srcBack = document.querySelector('header .back-link');
  var heroInner = hero.querySelector('.hero-inner');
  if (srcBack && heroInner && !heroInner.querySelector('.hero-back')){
    var back = document.createElement('a');
    back.className = 'hero-back';
    back.href = srcBack.getAttribute('href');
    back.title = srcBack.textContent.trim();
    back.setAttribute('aria-label', srcBack.textContent.trim());
    back.innerHTML = '<svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="10,3 4,8 10,13"/></svg>';
    heroInner.insertBefore(back, heroInner.firstChild);
  }

  // Place a sentinel as the first child of the main content (i.e. immediately
  // *below* the hero in document flow). Then watch it with an IntersectionObserver
  // whose rootMargin shrinks the viewport's top edge by ~60px. As soon as the
  // sentinel scrolls above that invisible line we condense; when it scrolls back
  // below, we expand. The sentinel moves with content, so when the hero shrinks
  // there is no oscillation: shrinking pushes the sentinel further above the line,
  // never below it.
  var anchor = document.querySelector('main') || hero.parentElement;
  if (!anchor) return;

  var sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.cssText = 'height:1px;width:1px;pointer-events:none;visibility:hidden';
  anchor.insertBefore(sentinel, anchor.firstChild);

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        // entry.isIntersecting === true while sentinel is *below* the line.
        // When it scrolls above the line, intersecting becomes false → condense.
        hero.classList.toggle('condensed', !entry.isIntersecting);
      });
    }, { rootMargin: '-60px 0px 0px 0px', threshold: 0 });
    io.observe(sentinel);
  } else {
    // Fallback: simple scroll check with hysteresis.
    var condensed = false, ticking = false;
    function update(){
      var y = window.scrollY || window.pageYOffset || 0;
      if (!condensed && y > 80){ condensed = true; hero.classList.add('condensed'); }
      else if (condensed && y < 24){ condensed = false; hero.classList.remove('condensed'); }
      ticking = false;
    }
    window.addEventListener('scroll', function(){
      if (!ticking){ window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }
})();
