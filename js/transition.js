// Открытие и закрытие меню слева в личном кабинете // Открытие и закрытие дополнительной информации о товаре справа  на странице заказов в личном кабинете

const trans = document.querySelector('.left_nav');
const dop_info = document.querySelectorAll('.product-item');

trans.addEventListener('click', function () {
  trans.classList.toggle('open');
});

dop_info.forEach(item => {
  item.addEventListener('click', () => {
    item.classList.toggle('open');
  });
});





// Отслеживание активного блока radio-button
document.addEventListener("DOMContentLoaded", function () {
  const radios = document.querySelectorAll('input[type="radio"][name="shipping"]');
  const boxes = document.querySelectorAll(".email_border");

  function updateBorders() {
    boxes.forEach((box, index) => {
      if (radios[index].checked) {
        box.style.border = "2px solid black"; // активная рамка
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

