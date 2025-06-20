// Открытие и закрытие меню слева в личном кабинете // Открытие и закрытие дополнительной информации о товаре справа  на странице заказов в личном кабинете

const trans = document.querySelector('.left_nav');
const dop_info = document.querySelectorAll('.product-item');

if (trans) {
  trans.addEventListener('click', function () {
    trans.classList.toggle('open');
  });
}

if (dop_info.length > 0) {
  dop_info.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });
}





// Отслеживание активного блока radio-button
document.addEventListener("DOMContentLoaded", function () {
  const radios = document.querySelectorAll('input[type="radio"][name="shipping"]');
  const boxes = document.querySelectorAll(".email_border");

  function updateBorders() {
    boxes.forEach((box, index) => {
      if (radios[index].checked) {
        box.style.border = "1px solid black"; // активная рамка
      } else {
        box.style.border = "1px solid #E6E6E6"; // неактивная рамка
      }
    });
  }

  // При загрузке и при клике
  updateBorders();
  radios.forEach((radio) => {
    radio.addEventListener("change", updateBorders);
  });
});


// функционал кнопок на странице Про нас

document.addEventListener("DOMContentLoaded", function () {
  const target = document.querySelector('.process_bottom_block');
  const button = document.querySelector('.toggle-process');
  const blur = document.querySelector('.blur_overlay');

  if (target && button && blur) {
    button.addEventListener('click', function () {
      const isCollapsed = target.classList.toggle('collapsed');
      blur.style.opacity = isCollapsed ? '1' : '0';
    });
  } else {
    console.warn('Не найден один из элементов: .process_bottom_block, .toggle-process или .blur_overlay');
  }
});


document.addEventListener("DOMContentLoaded", function () {
  const target = document.querySelector('.cards_of_events');
  const button = document.querySelector('.toggle-events');
  const blur = document.querySelector('.blur_white_overlay');

  if (target && button && blur) {
    button.addEventListener('click', function () {
      const isCollapsed = target.classList.toggle('collapsed');
      blur.style.opacity = isCollapsed ? '1' : '0';
    });
  } else {
    console.warn('Не найден один из элементов: .process_bottom_block, .toggle-process или .blur_overlay');
  }
});


document.addEventListener("DOMContentLoaded", function () {
  const target = document.querySelector('.cards_of_projects');
  const button = document.querySelector('.toggle-projects');
  const blur = document.querySelector('.projects_blur_white_overlay');

  if (target && button && blur) {
    button.addEventListener('click', function () {
      const isCollapsed = target.classList.toggle('collapsed');
      blur.style.opacity = isCollapsed ? '1' : '0';
    });
  } else {
    console.warn('Не найден один из элементов: .process_bottom_block, .toggle-process или .blur_overlay');
  }
});



// Слайдер логотипов на странице Про нас

document.addEventListener("DOMContentLoaded", function () {
  const original = document.querySelector('.publications_cards');
  const mobileSlider = document.querySelector('.publications_mobile_slider');

  if (!original || !mobileSlider) return;

  const logos = Array.from(original.querySelectorAll('img'));
  const slidesCount = Math.ceil(logos.length / 3);

  let currentSlide = 0;

  // Создаём контейнер
  const track = document.createElement('div');
  track.className = 'slider-track';

  // Создаём слайды
  for (let i = 0; i < slidesCount; i++) {
    const slide = document.createElement('div');
    slide.className = 'slide';
    const group = logos.slice(i * 3, i * 3 + 3);

    group.forEach(img => {
      const cloned = img.cloneNode(true);
      slide.appendChild(cloned);
    });

    track.appendChild(slide);
  }

  // Добавляем трек
  mobileSlider.appendChild(track);

  // Точки
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'slider-dots';

  const dotsCenter = document.createElement('div');
  dotsCenter.className = 'slider-center';
  dotsContainer.appendChild(dotsCenter);

  for (let i = 0; i < slidesCount; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    if (i === 0) dot.classList.add('active');

    dot.addEventListener('click', () => {
      track.style.transform = `translateX(-${i * 100}%)`;
      dotsContainer.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });

    dotsCenter.appendChild(dot);
  }

  mobileSlider.appendChild(dotsContainer);




  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  // трекаем свайпы на самой "дорожке"
  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
  });

  track.addEventListener('touchend', () => {
    if (!isDragging) return;

    const deltaX = currentX - startX;

    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0 && currentSlide < slidesCount - 1) {
        currentSlide++;
      } else if (deltaX > 0 && currentSlide > 0) {
        currentSlide--;
      }
      goToSlide(currentSlide);
    }

    // сброс
    isDragging = false;
    startX = 0;
    currentX = 0;
  });

  // функция обновления слайда и точек
  function goToSlide(index) {
    let startX = 0;
    let endX = 0;



    track.addEventListener("touchend", function (e) {
      endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;

      if (Math.abs(diffX) > 50) { // если сдвиг больше 50px — свайп
        if (diffX > 0 && currentSlide < slidesCount - 1) {
          // свайп влево
          goToSlide(currentSlide + 1);
        } else if (diffX < 0 && currentSlide > 0) {
          // свайп вправо
          goToSlide(currentSlide - 1);
        }
      }
    });
    currentSlide = index;
    track.style.transform = `translateX(-${index * 100}%)`;
    dotsContainer.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
    dotsContainer.querySelectorAll('.dot')[index].classList.add('active');
  }
});






// Переключение сердечка на странице Любимое

document.addEventListener("DOMContentLoaded", function () {
  const hearts = document.querySelectorAll(".fav-heart");

  hearts.forEach((heart) => {
    heart.addEventListener("click", () => {
      heart.classList.toggle("active");
    });
  });
});



// мобильный селект на странице Любимое
document.addEventListener('DOMContentLoaded', () => {
  const dotsButton = document.querySelector('.triple_dots');
  const dotsSelect = document.querySelector('.select-dots');

  if (dotsButton && dotsSelect) {
    dotsButton.addEventListener('click', (e) => {
      e.preventDefault();
      dotsSelect.classList.toggle('hidden_menu_dots');
    });
  } else {
    console.warn('Не найдены элементы .triple_dots или .select-dots');
  }
});





// Мобильный нав на странице Любимое
const btn = document.querySelector('.custom-select-btn');
const options = document.querySelector('.custom-select-options');

if (btn && options) {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    options.classList.toggle('hidden');
  });

  options.querySelectorAll('div').forEach(opt => {
    opt.addEventListener('click', () => {
      btn.textContent = opt.textContent;
      options.classList.add('hidden');
    });
  });

  document.addEventListener('click', () => options.classList.add('hidden'));
}




// Карусель, на странице кастомных
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector('.carousel-track');
  const wrapper = document.querySelector('.gallery-carousel-wrapper');

  if (!track || !wrapper) return;

  const originalCards = Array.from(track.children);

  // Дублируем дважды (3 копии в итоге)
  for (let i = 0; i < 2; i++) {
    originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      track.appendChild(clone);
    });
  }

  const oneLoopWidth = originalCards.reduce((acc, card) => acc + card.offsetWidth, 0);
  const scrollDistance = oneLoopWidth; // ← проскролим ровно на одну копию
  const duration = scrollDistance / 100; // 100px/sec

  // Создаём/обновляем @keyframes с точным расстоянием
  const style = document.createElement('style');
  style.textContent = `
    @keyframes scrollLeft {
      0% { transform: translateX(0); }
      100% { transform: translateX(-${scrollDistance}px); }
    }
  `;
  document.head.appendChild(style);

  // Запускаем анимацию
  track.style.animation = `scrollLeft ${duration}s linear infinite`;
});






// Поиск в шапке
document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.querySelector('.header__actions-btn._icon-search');
  const searchBlock = document.querySelector('.header__search');
  const headerBottom = document.querySelector('.header__bottom');
  const closeBtn = document.querySelector('.search-close');

  if (searchBtn && searchBlock && headerBottom && closeBtn) {
    searchBtn.addEventListener('click', () => {
      headerBottom.style.display = 'none';
      searchBlock.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
      headerBottom.style.display = '';
      searchBlock.classList.remove('active');
    });
  }
});


