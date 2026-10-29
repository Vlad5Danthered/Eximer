/**
 * Custom Select — доступный кастомный дропдаун (WAI-ARIA Listbox Pattern)
 * Поддерживает мышь, клавиатуру (стрелки, Enter, Space, Home, End, Esc, быстрый поиск по букве)
 * и синхронизацию со скринридерами без необходимости изменения исходного HTML.
 */

function initCustomSelects() {
  var selects = document.querySelectorAll('.field-select');

  selects.forEach(function (select, selectIndex) {
    if (select.dataset.selectInit === 'true') return;
    select.dataset.selectInit = 'true';

    var trigger = select.querySelector('.field-select__trigger');
    var valueEl = select.querySelector('.field-select__value');
    var dropdown = select.querySelector('.field-select__dropdown');
    var options = select.querySelectorAll('.field-select__option');
    var hiddenInput = select.querySelector('input[type="hidden"]');
    var nameEl = select.querySelector('.field-select__name');

    if (!trigger || !dropdown || !options.length) return;

    // Динамически связываем ARIA-атрибуты для скринридеров
    var selectId = select.getAttribute('data-name') || 'select-' + selectIndex;
    var dropdownId = dropdown.id || selectId + '-dropdown';
    dropdown.id = dropdownId;
    trigger.setAttribute('aria-controls', dropdownId);

    if (nameEl) {
      var nameId = nameEl.id || selectId + '-label';
      nameEl.id = nameId;
      trigger.setAttribute('aria-labelledby', nameId);
    }

    options.forEach(function (opt, optIndex) {
      if (!opt.id) {
        opt.id = selectId + '-opt-' + optIndex;
      }
    });

    var highlightedIndex = -1;

    function getSelectedIndex() {
      for (var i = 0; i < options.length; i++) {
        if (options[i].classList.contains('field-select__option--selected')) {
          return i;
        }
      }
      return 0;
    }

    function setHighlight(index) {
      if (index < 0) index = 0;
      if (index >= options.length) index = options.length - 1;

      options.forEach(function (opt, i) {
        var isCurrent = i === index;
        opt.classList.toggle('is-focused', isCurrent);
        opt.classList.toggle('field-select__option--focused', isCurrent);
      });

      highlightedIndex = index;
      var activeOption = options[index];
      if (activeOption) {
        trigger.setAttribute('aria-activedescendant', activeOption.id);
        if (typeof activeOption.scrollIntoView === 'function') {
          activeOption.scrollIntoView({ block: 'nearest' });
        }
      }
    }

    function clearHighlight() {
      options.forEach(function (opt) {
        opt.classList.remove('is-focused', 'field-select__option--focused');
      });
      highlightedIndex = -1;
      trigger.removeAttribute('aria-activedescendant');
    }

    function openSelect() {
      document.querySelectorAll('.field-select--open').forEach(function (s) {
        if (s !== select) {
          s.classList.remove('field-select--open');
          var tr = s.querySelector('.field-select__trigger');
          if (tr) tr.setAttribute('aria-expanded', 'false');
        }
      });

      select.classList.add('field-select--open');
      trigger.setAttribute('aria-expanded', 'true');
      setHighlight(getSelectedIndex());
    }

    function closeSelect(returnFocus) {
      if (!select.classList.contains('field-select--open')) return;
      select.classList.remove('field-select--open');
      trigger.setAttribute('aria-expanded', 'false');
      clearHighlight();
      if (returnFocus) {
        trigger.focus();
      }
    }

    function selectOption(index) {
      if (index < 0 || index >= options.length) return;
      var option = options[index];

      options.forEach(function (o, i) {
        var isSel = i === index;
        o.classList.toggle('field-select__option--selected', isSel);
        o.setAttribute('aria-selected', isSel ? 'true' : 'false');
      });

      if (valueEl) valueEl.textContent = option.textContent.trim();
      var newVal = option.getAttribute('data-value');

      if (hiddenInput && hiddenInput.value !== newVal) {
        hiddenInput.value = newVal;
        hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
        hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
      }

      closeSelect(true);
    }

    // Открытие/закрытие по клику
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (select.classList.contains('field-select--open')) {
        closeSelect(false);
      } else {
        openSelect();
      }
    });

    // Клавиатурное управление
    trigger.addEventListener('keydown', function (e) {
      var isOpen = select.classList.contains('field-select--open');

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            openSelect();
          } else {
            setHighlight(highlightedIndex + 1);
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (!isOpen) {
            openSelect();
          } else {
            setHighlight(highlightedIndex - 1);
          }
          break;

        case 'Home':
        case 'PageUp':
          if (isOpen) {
            e.preventDefault();
            setHighlight(0);
          }
          break;

        case 'End':
        case 'PageDown':
          if (isOpen) {
            e.preventDefault();
            setHighlight(options.length - 1);
          }
          break;

        case 'Enter':
        case ' ': // Пробел
          e.preventDefault();
          if (!isOpen) {
            openSelect();
          } else if (highlightedIndex >= 0) {
            selectOption(highlightedIndex);
          }
          break;

        case 'Escape':
          if (isOpen) {
            e.preventDefault();
            closeSelect(true);
          }
          break;

        case 'Tab':
          if (isOpen) {
            closeSelect(false);
          }
          break;

        default:
          // Быстрый поиск по напечатанной букве
          if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
            var char = e.key.toLowerCase();
            var startIndex = isOpen ? highlightedIndex + 1 : 0;
            var foundIndex = -1;

            for (var i = 0; i < options.length; i++) {
              var checkIdx = (startIndex + i) % options.length;
              var text = options[checkIdx].textContent.trim().toLowerCase();
              if (text.startsWith(char)) {
                foundIndex = checkIdx;
                break;
              }
            }

            if (foundIndex !== -1) {
              e.preventDefault();
              if (!isOpen) openSelect();
              setHighlight(foundIndex);
            }
          }
          break;
      }
    });

    // Клик и наведение мыши на элементы списка
    options.forEach(function (option, idx) {
      option.addEventListener('click', function (e) {
        e.stopPropagation();
        selectOption(idx);
      });

      option.addEventListener('mouseenter', function () {
        setHighlight(idx);
      });
    });

    // Закрытие при клике вне компонента
    document.addEventListener('click', function (e) {
      if (!select.contains(e.target)) {
        closeSelect(false);
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCustomSelects);
} else {
  initCustomSelects();
}
