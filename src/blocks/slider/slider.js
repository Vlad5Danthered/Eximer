// Слайдер на Swiper (v10+). Разметка: <section class="slider swiper" data-slider>
// Автопрокрутка (необязательно): data-slider-autoplay="6000" (мс)
//
import Swiper from 'swiper';
// import { Autoplay, Keyboard, A11y } from 'swiper/modules';

document.querySelectorAll('[data-slider]').forEach((el) => {
  const delay = Number(el.dataset.sliderAutoplay) || 0;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const btnPrev = el.querySelector('.slider__arrow--prev');
  const btnNext = el.querySelector('.slider__arrow--next');

  // Функция для обновления классов и атрибутов disabled
  const updateNavigation = (swiper) => {
    if (btnPrev) {
      btnPrev.classList.toggle('slider__arrow--disabled', swiper.isBeginning);
      btnPrev.toggleAttribute('slider__arrow--disabled', swiper.isBeginning);
    }
    if (btnNext) {
      btnNext.classList.toggle('slider__arrow--disabled', swiper.isEnd);
      btnNext.toggleAttribute('slider__arrow--disabled', swiper.isEnd);
    }
  };

  const swiper = new Swiper(el, {
    // modules: [Autoplay, Keyboard, A11y],
    rewind: false, // с последнего слайда "вперёд" возвращает на первый, и наоборот
    speed: reduceMotion ? 0 : 600,
    grabCursor: true,
    // keyboard: { enabled: true }, // нужен модуль Keyboard
    a11y: {
      slideLabelMessage: '{{index}} з {{slidesLength}}',
    },
    autoplay: delay && !reduceMotion
      ? { delay, disableOnInteraction: true, pauseOnMouseEnter: true }
      : false, // нужен модуль Autoplay
    on: {
      init: (swiper) => {
        markInactive(swiper);
        updateNavigation(swiper);
      },
      slideChange: (swiper) => {
        markInactive(swiper);
        updateNavigation(swiper);
      },
    },
  });

  // Стрелки подключены напрямую, без модуля Navigation
  btnPrev?.addEventListener('click', () => swiper.slidePrev());
  btnNext?.addEventListener('click', () => swiper.slideNext());
});

function markInactive(swiper) {
  swiper.slides.forEach((slide, i) => {
    slide.toggleAttribute('inert', i !== swiper.activeIndex);
  });
}