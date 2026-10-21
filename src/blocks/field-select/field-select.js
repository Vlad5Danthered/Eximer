/**
 * Custom Select — кастомный дропдаун (замена нативного <select>)
 * Использование: @@include('blocks/field-select/field-select.js')
 */

function initCustomSelects() {
  var selects = document.querySelectorAll('.field-select');

  selects.forEach(function (select) {
    var trigger = select.querySelector('.field-select__trigger');
    var valueEl = select.querySelector('.field-select__value');
    var options = select.querySelectorAll('.field-select__option');
    var hiddenInput = select.querySelector('input[type="hidden"]');

    if (!trigger) return;

    function openSelect() {
      select.classList.add('field-select--open');
      trigger.setAttribute('aria-expanded', 'true');
    }

    function closeSelect() {
      select.classList.remove('field-select--open');
      trigger.setAttribute('aria-expanded', 'false');
    }

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = select.classList.contains('field-select--open');
      // Закрыть все другие открытые селекты
      document.querySelectorAll('.field-select--open').forEach(function (s) {
        s.classList.remove('field-select--open');
        s.querySelector('.field-select__trigger').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) openSelect();
    });

    options.forEach(function (option) {
      option.addEventListener('click', function () {
        options.forEach(function (o) {
          o.classList.remove('field-select__option--selected');
          o.setAttribute('aria-selected', 'false');
        });
        option.classList.add('field-select__option--selected');
        option.setAttribute('aria-selected', 'true');
        if (valueEl) valueEl.textContent = option.textContent;
        if (hiddenInput) hiddenInput.value = option.getAttribute('data-value');
        closeSelect();
      });
    });

    document.addEventListener('click', function () {
      closeSelect();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSelect();
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCustomSelects);
} else {
  initCustomSelects();
}
