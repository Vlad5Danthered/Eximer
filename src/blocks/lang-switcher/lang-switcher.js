document.querySelectorAll('[data-lang-switcher]').forEach((el) => {
  const toggle = el.querySelector('.lang-switcher__toggle');

  const setOpen = (open) => {
    el.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open);
  };

  toggle.addEventListener('click', () => setOpen(!el.classList.contains('is-open')));

  document.addEventListener('click', (e) => {
    if (!el.contains(e.target)) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && el.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
});