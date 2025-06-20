document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");

    if (!header) return;

    const searchHTML = `
    <div class="header__search">
      <div class="header_container">
        <div class="header__logo">
          <img src="img/logo.svg" alt="Logo">
        </div>
        <div class="search_container">
          <form class="search-form">
            <span class="_icon-search"></span>
            <input type="text" placeholder="Search">
          </form>
          <button class="search-close _icon-cross"></button>
        </div>
      </div>
    </div>
  `;

    header.insertAdjacentHTML("afterend", searchHTML);

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
