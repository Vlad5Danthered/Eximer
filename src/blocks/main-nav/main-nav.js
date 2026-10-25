(function(){

  var toggler = document.getElementById('main-nav-toggler');
  var nav = document.getElementById('main-nav');
  var header = document.querySelector('.page-header');

  var HIDDEN_CLASS = 'page-header--hidden';
  var LOCK_CLASS = 'is-nav-locked';
  var SCROLL_THRESHOLD = 8; // px, игнорируем микро-скролл

  // Зона, где меню выпадающее и блокирует скролл страницы (< $menu-desktop-width = 1440px)
  var lockMq = window.matchMedia('(max-width: 1439px)');

  function isMenuOpen() {
    return !!nav && nav.classList.contains('main-nav--open');
  }

  // Единая точка открытия/закрытия меню (кнопка и скролл не расходятся)
  function setMenuOpen(open) {
    if (!toggler || !nav) return;
    if (open && header) header.classList.remove(HIDDEN_CLASS);
    nav.classList.toggle('main-nav--open', open);
    toggler.classList.toggle('burger--close', open); // модификатор иконки (должен быть .burger)
    // пока меню открыто - страница не скроллится (мобила + планшет)
    document.documentElement.classList.toggle(LOCK_CLASS, open && lockMq.matches);
  }

  // Добавление/удаление модификаторов при клике на переключение видимости
  if (toggler) {
    toggler.addEventListener('click', function(e) {
      e.preventDefault();
      setMenuOpen(!isMenuOpen());
    });
  }

  // При смене брейкпоинта (поворот экрана, ресайз) синхронизируем блокировку скролла
  var onMqChange = function() {
    document.documentElement.classList.toggle(LOCK_CLASS, isMenuOpen() && lockMq.matches);
  };
  if (lockMq.addEventListener) lockMq.addEventListener('change', onMqChange);
  else lockMq.addListener(onMqChange); // старый Safari

  // Страховка для старых мобильных браузеров: гасим скролл жестами вне меню
  var blockScroll = function(e) {
    if (!document.documentElement.classList.contains(LOCK_CLASS)) return;
    if (nav && nav.contains(e.target)) return; // внутри меню разрешаем
    e.preventDefault();
  };
  document.addEventListener('touchmove', blockScroll, { passive: false });
  document.addEventListener('wheel', blockScroll, { passive: false });

  // Подложка под шапкой: затемняет страницу при открытом меню
  var overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.appendChild(overlay);

  // Клик вне меню (по подложке, логотипу и т.п.) закрывает его
  document.addEventListener('click', function(e) {
    if (isMenuOpen() && !nav.contains(e.target)) {
      setMenuOpen(false);
    }
  });

  // Esc тоже закрывает
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isMenuOpen()) {
      setMenuOpen(false);
      if (toggler) toggler.focus();
    }
  });

  // Прятать шапку при скролле вниз, показывать при скролле вверх
  if (header) {
    var lastY = window.pageYOffset;
    var ticking = false;

    var showHeader = function() { header.classList.remove(HIDDEN_CLASS); };
    var hideHeader = function() { header.classList.add(HIDDEN_CLASS); };

    var update = function() {
      ticking = false;
      var y = Math.max(window.pageYOffset, 0); // iOS bounce даёт отрицательные значения
      var delta = y - lastY;
      if (Math.abs(delta) < SCROLL_THRESHOLD) return; // lastY не обновляем: дельта накопится

      if (delta > 0) {                 // вниз
        setMenuOpen(false);
        if (y > header.offsetHeight) hideHeader();
      } else {                         // вверх
        showHeader();
      }
      if (y <= header.offsetHeight) showHeader(); // у самого верха всегда видна
      lastY = y;
    };

    window.addEventListener('scroll', function() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });

    // Фокус внутри шапки (Tab) - показываем, иначе ссылки "улетят" за экран
    header.addEventListener('focusin', showHeader);
  }

  // Добавление/удаление модификаторов при фокусировке на ссылочном элементе
  var linkClassName = 'main-nav__link';
  var linkClassNameShowChild = 'main-nav__item--show-child';
  var findLinkClassName = new RegExp(linkClassName);
  // Слежение за всплывшим событием focus (нужно добавить класс, показывающий потомков)
  document.addEventListener('focus', function(event) {
    // Если событие всплыло от одной из ссылок гл. меню
    if (findLinkClassName.test(event.target.className)) {
      // Добавим классы, показывающие списки вложенных уровней, на всех родителей
      event.target.parents('.main-nav__item').forEach(function(item){
        item.classList.add(linkClassNameShowChild);
      });
    }
  }, true);
  // Слежение за всплывшим событием blur (нужно убрать класс, показывающий потомков)
  document.addEventListener('blur', function(event) {
    // Если событие всплыло от одной из ссылок гл. меню
    if (findLinkClassName.test(event.target.className)) {
      // Уберем все классы, показывающие списки 2+ уровней
      document.querySelectorAll('.'+linkClassNameShowChild).forEach(function(item){
        item.classList.remove(linkClassNameShowChild);
      });
    }
  }, true);

  // Добавление метода .parents()
  Element.prototype.parents = function(selector) {
    var elements = [];
    var elem = this;
    var ishaveselector = selector !== undefined;

    while ((elem = elem.parentElement) !== null) {
      if (elem.nodeType !== Node.ELEMENT_NODE) {
        continue;
      }

      if (!ishaveselector || elem.matches(selector)) {
        elements.push(elem);
      }
    }

    return elements;
  };

}());