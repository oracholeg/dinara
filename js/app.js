(() => {
    "use strict";
    const modules_flsModules = {};
    function functions_getHash() {
        if (location.hash) return location.hash.replace("#", "");
    }
    function setHash(hash) {
        hash = hash ? `#${hash}` : window.location.href.split("#")[0];
        history.pushState("", "", hash);
    }
    let _slideUp = (target, duration = 500, showmore = 0, margin = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore + margin}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle(0);
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function spoilers() {
        const spoilersArray = document.querySelectorAll("[data-spoilers]");
        if (spoilersArray.length > 0) {
            document.addEventListener("click", setspoilerAction);
            const spoilersRegular = Array.from(spoilersArray).filter((function(item, index, self) {
                return !item.dataset.spoilers.split(",")[0];
            }));
            if (spoilersRegular.length) initspoilers(spoilersRegular);
            let mdQueriesArray = dataMediaQueries(spoilersArray, "spoilers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    initspoilers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                initspoilers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            function initspoilers(spoilersArray, matchMedia = false) {
                spoilersArray.forEach((spoilersBlock => {
                    spoilersBlock = matchMedia ? spoilersBlock.item : spoilersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spoilersBlock.classList.add("_spoiler-init");
                        initspoilerBody(spoilersBlock);
                    } else {
                        spoilersBlock.classList.remove("_spoiler-init");
                        initspoilerBody(spoilersBlock, false);
                    }
                }));
            }
            function initspoilerBody(spoilersBlock, hidespoilerBody = true) {
                let spoilerItems = spoilersBlock.querySelectorAll("details");
                if (spoilerItems.length) spoilerItems.forEach((spoilerItem => {
                    let spoilerTitle = spoilerItem.querySelector("summary");
                    if (hidespoilerBody) {
                        spoilerTitle.removeAttribute("tabindex");
                        if (!spoilerItem.hasAttribute("data-open")) {
                            spoilerItem.open = false;
                            spoilerTitle.nextElementSibling.hidden = true;
                        } else {
                            spoilerTitle.classList.add("_spoiler-active");
                            spoilerItem.open = true;
                        }
                    } else {
                        spoilerTitle.setAttribute("tabindex", "-1");
                        spoilerTitle.classList.remove("_spoiler-active");
                        spoilerItem.open = true;
                        spoilerTitle.nextElementSibling.hidden = false;
                    }
                }));
            }
            function setspoilerAction(e) {
                const el = e.target;
                if (el.closest("summary") && el.closest("[data-spoilers]")) {
                    e.preventDefault();
                    if (el.closest("[data-spoilers]").classList.contains("_spoiler-init")) {
                        const spoilerTitle = el.closest("summary");
                        const spoilerBlock = spoilerTitle.closest("details");
                        const spoilersBlock = spoilerTitle.closest("[data-spoilers]");
                        const onespoiler = spoilersBlock.hasAttribute("data-one-spoiler");
                        const scrollspoiler = spoilerBlock.hasAttribute("data-spoiler-scroll");
                        const spoilerSpeed = spoilersBlock.dataset.spoilersSpeed ? parseInt(spoilersBlock.dataset.spoilersSpeed) : 500;
                        if (!spoilersBlock.querySelectorAll("._slide").length) {
                            if (onespoiler && !spoilerBlock.open) hidespoilersBody(spoilersBlock);
                            !spoilerBlock.open ? spoilerBlock.open = true : setTimeout((() => {
                                spoilerBlock.open = false;
                            }), spoilerSpeed);
                            spoilerTitle.classList.toggle("_spoiler-active");
                            _slideToggle(spoilerTitle.nextElementSibling, spoilerSpeed);
                            if (scrollspoiler && spoilerTitle.classList.contains("_spoiler-active")) {
                                const scrollspoilerValue = spoilerBlock.dataset.spoilerScroll;
                                const scrollspoilerOffset = +scrollspoilerValue ? +scrollspoilerValue : 0;
                                const scrollspoilerNoHeader = spoilerBlock.hasAttribute("data-spoiler-scroll-noheader") ? document.querySelector(".header").offsetHeight : 0;
                                window.scrollTo({
                                    top: spoilerBlock.offsetTop - (scrollspoilerOffset + scrollspoilerNoHeader),
                                    behavior: "smooth"
                                });
                            }
                        }
                    }
                }
                if (!el.closest("[data-spoilers]")) {
                    const spoilersClose = document.querySelectorAll("[data-spoiler-close]");
                    if (spoilersClose.length) spoilersClose.forEach((spoilerClose => {
                        const spoilersBlock = spoilerClose.closest("[data-spoilers]");
                        const spoilerCloseBlock = spoilerClose.parentNode;
                        if (spoilersBlock.classList.contains("_spoiler-init")) {
                            const spoilerSpeed = spoilersBlock.dataset.spoilersSpeed ? parseInt(spoilersBlock.dataset.spoilersSpeed) : 500;
                            spoilerClose.classList.remove("_spoiler-active");
                            _slideUp(spoilerClose.nextElementSibling, spoilerSpeed);
                            setTimeout((() => {
                                spoilerCloseBlock.open = false;
                            }), spoilerSpeed);
                        }
                    }));
                }
            }
            function hidespoilersBody(spoilersBlock) {
                const spoilerActiveBlock = spoilersBlock.querySelector("details[open]");
                if (spoilerActiveBlock && !spoilersBlock.querySelectorAll("._slide").length) {
                    const spoilerActiveTitle = spoilerActiveBlock.querySelector("summary");
                    const spoilerSpeed = spoilersBlock.dataset.spoilersSpeed ? parseInt(spoilersBlock.dataset.spoilersSpeed) : 500;
                    spoilerActiveTitle.classList.remove("_spoiler-active");
                    _slideUp(spoilerActiveTitle.nextElementSibling, spoilerSpeed);
                    setTimeout((() => {
                        spoilerActiveBlock.open = false;
                    }), spoilerSpeed);
                }
            }
        }
    }
    function tabs() {
        const tabs = document.querySelectorAll("[data-tabs]");
        let tabsActiveHash = [];
        if (tabs.length > 0) {
            const hash = functions_getHash();
            if (hash && hash.startsWith("tab-")) tabsActiveHash = hash.replace("tab-", "").split("-");
            tabs.forEach(((tabsBlock, index) => {
                tabsBlock.classList.add("_tab-init");
                tabsBlock.setAttribute("data-tabs-index", index);
                tabsBlock.addEventListener("click", setTabsAction);
                initTabs(tabsBlock);
            }));
            let mdQueriesArray = dataMediaQueries(tabs, "tabs");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
        }
        function setTitlePosition(tabsMediaArray, matchMedia) {
            tabsMediaArray.forEach((tabsMediaItem => {
                tabsMediaItem = tabsMediaItem.item;
                let tabsTitles = tabsMediaItem.querySelector("[data-tabs-titles]");
                let tabsTitleItems = tabsMediaItem.querySelectorAll("[data-tabs-title]");
                let tabsContent = tabsMediaItem.querySelector("[data-tabs-body]");
                let tabsContentItems = tabsMediaItem.querySelectorAll("[data-tabs-item]");
                tabsTitleItems = Array.from(tabsTitleItems).filter((item => item.closest("[data-tabs]") === tabsMediaItem));
                tabsContentItems = Array.from(tabsContentItems).filter((item => item.closest("[data-tabs]") === tabsMediaItem));
                tabsContentItems.forEach(((tabsContentItem, index) => {
                    if (matchMedia.matches) {
                        tabsContent.append(tabsTitleItems[index]);
                        tabsContent.append(tabsContentItem);
                        tabsMediaItem.classList.add("_tab-spoller");
                    } else {
                        tabsTitles.append(tabsTitleItems[index]);
                        tabsMediaItem.classList.remove("_tab-spoller");
                    }
                }));
            }));
        }
        function initTabs(tabsBlock) {
            let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-titles]>*");
            let tabsContent = tabsBlock.querySelectorAll("[data-tabs-body]>*");
            const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
            const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;
            if (tabsActiveHashBlock) {
                const tabsActiveTitle = tabsBlock.querySelector("[data-tabs-titles]>._tab-active");
                tabsActiveTitle ? tabsActiveTitle.classList.remove("_tab-active") : null;
            }
            if (tabsContent.length) tabsContent.forEach(((tabsContentItem, index) => {
                tabsTitles[index].setAttribute("data-tabs-title", "");
                tabsContentItem.setAttribute("data-tabs-item", "");
                if (tabsActiveHashBlock && index == tabsActiveHash[1]) tabsTitles[index].classList.add("_tab-active");
                tabsContentItem.hidden = !tabsTitles[index].classList.contains("_tab-active");
            }));
        }
        function setTabsStatus(tabsBlock) {
            let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-title]");
            let tabsContent = tabsBlock.querySelectorAll("[data-tabs-item]");
            const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
            function isTabsAnamate(tabsBlock) {
                if (tabsBlock.hasAttribute("data-tabs-animate")) return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
            }
            const tabsBlockAnimate = isTabsAnamate(tabsBlock);
            if (tabsContent.length > 0) {
                const isHash = tabsBlock.hasAttribute("data-tabs-hash");
                tabsContent = Array.from(tabsContent).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsTitles = Array.from(tabsTitles).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsContent.forEach(((tabsContentItem, index) => {
                    if (tabsTitles[index].classList.contains("_tab-active")) {
                        if (tabsBlockAnimate) _slideDown(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = false;
                        if (isHash && !tabsContentItem.closest(".popup")) setHash(`tab-${tabsBlockIndex}-${index}`);
                    } else if (tabsBlockAnimate) _slideUp(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = true;
                }));
            }
        }
        function setTabsAction(e) {
            const el = e.target;
            if (el.closest("[data-tabs-title]")) {
                const tabTitle = el.closest("[data-tabs-title]");
                const tabsBlock = tabTitle.closest("[data-tabs]");
                if (!tabTitle.classList.contains("_tab-active") && !tabsBlock.querySelector("._slide")) {
                    let tabActiveTitle = tabsBlock.querySelectorAll("[data-tabs-title]._tab-active");
                    tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter((item => item.closest("[data-tabs]") === tabsBlock)) : null;
                    tabActiveTitle.length ? tabActiveTitle[0].classList.remove("_tab-active") : null;
                    tabTitle.classList.add("_tab-active");
                    setTabsStatus(tabsBlock);
                }
                e.preventDefault();
            }
        }
    }
    function showMore() {
        window.addEventListener("load", (function(e) {
            const showMoreBlocks = document.querySelectorAll("[data-showmore]");
            let showMoreBlocksRegular;
            let mdQueriesArray;
            if (showMoreBlocks.length) {
                showMoreBlocksRegular = Array.from(showMoreBlocks).filter((function(item, index, self) {
                    return !item.dataset.showmoreMedia;
                }));
                showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
                document.addEventListener("click", showMoreActions);
                window.addEventListener("resize", showMoreActions);
                mdQueriesArray = dataMediaQueries(showMoreBlocks, "showmoreMedia");
                if (mdQueriesArray && mdQueriesArray.length) {
                    mdQueriesArray.forEach((mdQueriesItem => {
                        mdQueriesItem.matchMedia.addEventListener("change", (function() {
                            initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                        }));
                    }));
                    initItemsMedia(mdQueriesArray);
                }
            }
            function initItemsMedia(mdQueriesArray) {
                mdQueriesArray.forEach((mdQueriesItem => {
                    initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
            }
            function initItems(showMoreBlocks, matchMedia) {
                showMoreBlocks.forEach((showMoreBlock => {
                    initItem(showMoreBlock, matchMedia);
                }));
            }
            function initItem(showMoreBlock, matchMedia = false) {
                showMoreBlock = matchMedia ? showMoreBlock.item : showMoreBlock;
                const tabsParent = showMoreBlock.closest("[data-tabs]");
                if (tabsParent && !tabsParent.hasListener) {
                    tabsParent.addEventListener("tabSwitch", (function() {
                        var showMoreContent = showMoreBlock.querySelector("[data-showmore-content]");
                        if (showMoreContent && showMoreContent.hidden) showMoreContent.hidden = false;
                        showMoreActions({
                            type: "resize"
                        });
                    }));
                    tabsParent.hasListener = true;
                }
                const spoilerParent = showMoreBlock.closest("details");
                if (spoilerParent && !spoilerParent.hasListener) {
                    spoilerParent.addEventListener("spoilerToggle", (function() {
                        var showMoreContent = showMoreBlock.querySelector("[data-showmore-content]");
                        if (showMoreContent && showMoreContent.hidden) showMoreContent.hidden = false;
                        showMoreActions({
                            type: "resize"
                        });
                    }));
                    spoilerParent.hasListener = true;
                }
                let showMoreContent = showMoreBlock.querySelectorAll("[data-showmore-content]");
                let showMoreButton = showMoreBlock.querySelectorAll("[data-showmore-button]");
                showMoreContent = Array.from(showMoreContent).filter((item => item.closest("[data-showmore]") === showMoreBlock))[0];
                showMoreButton = Array.from(showMoreButton).filter((item => item.closest("[data-showmore]") === showMoreBlock))[0];
                const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
                if (matchMedia.matches || !matchMedia) {
                    if (hiddenHeight < getOriginalHeight(showMoreContent)) {
                        _slideUp(showMoreContent, 0, showMoreBlock.classList.contains("_showmore-active") ? getOriginalHeight(showMoreContent) : hiddenHeight);
                        showMoreButton.hidden = false;
                        showMoreBlock.classList.remove("_contain");
                    } else {
                        _slideDown(showMoreContent, 0, hiddenHeight);
                        showMoreButton.hidden = true;
                        showMoreBlock.classList.add("_contain");
                    }
                    if (getOriginalHeight(showMoreContent) <= hiddenHeight) showMoreButton.hidden = true;
                } else {
                    _slideDown(showMoreContent, 0, hiddenHeight);
                    showMoreButton.hidden = true;
                }
            }
            function getHeight(showMoreBlock, showMoreContent) {
                let hiddenHeight = 0;
                const showMoreType = showMoreBlock.dataset.showmore ? showMoreBlock.dataset.showmore : "size";
                const rowGap = parseFloat(getComputedStyle(showMoreContent).rowGap) || 0;
                if (showMoreType === "items") {
                    const showMoreTypeValue = parseInt(showMoreContent.dataset.showmoreContent) || 3;
                    const showMoreItems = Array.from(showMoreContent.children);
                    if (showMoreItems.length > 0) {
                        for (let index = 0; index < showMoreTypeValue && index < showMoreItems.length; index++) {
                            const showMoreItem = showMoreItems[index];
                            const itemStyles = getComputedStyle(showMoreItem);
                            const marginTop = parseFloat(itemStyles.marginTop) || 0;
                            const marginBottom = parseFloat(itemStyles.marginBottom) || 0;
                            hiddenHeight += showMoreItem.offsetHeight + marginTop + marginBottom;
                        }
                        if (showMoreItems.length > 1) hiddenHeight += (showMoreTypeValue - 1) * rowGap;
                    }
                } else {
                    const showMoreTypeValue = parseInt(showMoreContent.dataset.showmoreContent) || 150;
                    hiddenHeight = Math.min(showMoreTypeValue, showMoreContent.scrollHeight);
                }
                return hiddenHeight;
            }
            function getOriginalHeight(showMoreContent) {
                let parentHidden;
                let hiddenHeight = showMoreContent.offsetHeight;
                let margin = showMoreContent.dataset.showmoreMb ? +showMoreContent.dataset.showmoreMb : 0;
                showMoreContent.style.removeProperty("height");
                if (showMoreContent.closest(`[hidden]`)) {
                    parentHidden = showMoreContent.closest(`[hidden]`);
                    parentHidden.hidden = false;
                }
                let originalHeight = showMoreContent.offsetHeight;
                parentHidden ? parentHidden.hidden = true : null;
                showMoreContent.style.height = `${hiddenHeight + margin}px`;
                return originalHeight;
            }
            function showMoreActions(e) {
                const targetEvent = e.target;
                const targetType = e.type;
                if (targetType === "click") {
                    if (targetEvent.closest("[data-showmore-button]")) {
                        const showMoreButton = targetEvent.closest("[data-showmore-button]");
                        const showMoreBlock = showMoreButton.closest("[data-showmore]");
                        const showMoreContent = showMoreBlock.querySelector("[data-showmore-content]");
                        let margin = showMoreContent.dataset.showmoreMb ? +showMoreContent.dataset.showmoreMb : 0;
                        const showMoreSpeed = showMoreBlock.dataset.showmoreButton ? showMoreBlock.dataset.showmoreButton : "500";
                        const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
                        if (!showMoreContent.classList.contains("_slide")) {
                            if (showMoreBlock.classList.contains("_showmore-active")) _slideUp(showMoreContent, showMoreSpeed, hiddenHeight, margin); else _slideDown(showMoreContent, showMoreSpeed, hiddenHeight);
                            showMoreBlock.classList.toggle("_showmore-active");
                        }
                    }
                } else if (targetType === "resize") {
                    showMoreBlocksRegular && showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
                    mdQueriesArray && mdQueriesArray.length ? initItemsMedia(mdQueriesArray) : null;
                }
            }
        }));
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: false,
                    goHash: false
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.popupLogging(`Прокинувся`);
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    if (this._dataValue !== "error") {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Йой, не заповнено атрибут у ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && e.which == 27 && e.code === "Escape" && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && e.which == 9 && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function() {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function() {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
                if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.popupLogging(`Відкрив попап`);
                } else this.popupLogging(`Йой, такого попапу немає. Перевірте коректність введення. `);
            }
        }
        close(selectorValue) {
            if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
            this.popupLogging(`Закрив попап`);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
            this.youTubeCode = buttons.getAttribute(this.options.youtubeAttribute) ? buttons.getAttribute(this.options.youtubeAttribute) : null;
            if (buttons && classInHash) this.open(classInHash);
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && focusedIndex === 0) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
        popupLogging(message) {
            this.options.logging ? functions_FLS(`[Попапос]: ${message}`) : null;
        }
    }
    modules_flsModules.popup = new Popup({});
    let formValidate = {
        getErrors(form) {
            let error = 0;
            let formRequiredItems = form.querySelectorAll("*[data-required]");
            if (formRequiredItems.length) formRequiredItems.forEach((formRequiredItem => {
                if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) error += this.validateInput(formRequiredItem);
            }));
            return error;
        },
        validateInput(formRequiredItem) {
            let error = 0;
            if (formRequiredItem.dataset.required === "email") {
                formRequiredItem.value = formRequiredItem.value.replace(" ", "");
                if (this.emailTest(formRequiredItem)) {
                    this.addError(formRequiredItem);
                    error++;
                } else this.removeError(formRequiredItem);
            } else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
                this.addError(formRequiredItem);
                error++;
            } else if (!formRequiredItem.value.trim()) {
                this.addError(formRequiredItem);
                error++;
            } else this.removeError(formRequiredItem);
            return error;
        },
        addError(formRequiredItem) {
            formRequiredItem.classList.add("_form-error");
            formRequiredItem.parentElement.classList.add("_form-error");
            let inputError = formRequiredItem.parentElement.querySelector(".form__error");
            if (inputError) formRequiredItem.parentElement.removeChild(inputError);
            if (formRequiredItem.dataset.error) formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
        },
        removeError(formRequiredItem) {
            formRequiredItem.classList.remove("_form-error");
            formRequiredItem.parentElement.classList.remove("_form-error");
            if (formRequiredItem.parentElement.querySelector(".form__error")) formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector(".form__error"));
        },
        formClean(form) {
            form.reset();
            setTimeout((() => {
                let inputs = form.querySelectorAll("input,textarea");
                for (let index = 0; index < inputs.length; index++) {
                    const el = inputs[index];
                    el.parentElement.classList.remove("_form-focus");
                    el.classList.remove("_form-focus");
                    formValidate.removeError(el);
                }
                let checkboxes = form.querySelectorAll(".checkbox__input");
                if (checkboxes.length > 0) for (let index = 0; index < checkboxes.length; index++) {
                    const checkbox = checkboxes[index];
                    checkbox.checked = false;
                }
                if (modules_flsModules.select) {
                    let selects = form.querySelectorAll("div.select");
                    if (selects.length) for (let index = 0; index < selects.length; index++) {
                        const select = selects[index].querySelector("select");
                        modules_flsModules.select.selectBuild(select);
                    }
                }
            }), 0);
        },
        emailTest(formRequiredItem) {
            return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
        }
    };
    class SelectConstructor {
        constructor(props, data = null) {
            let defaultConfig = {
                init: true,
                logging: true,
                speed: 150
            };
            this.config = Object.assign(defaultConfig, props);
            this.selectClasses = {
                classSelect: "select",
                classSelectBody: "select__body",
                classSelectTitle: "select__title",
                classSelectValue: "select__value",
                classSelectLabel: "select__label",
                classSelectInput: "select__input",
                classSelectText: "select__text",
                classSelectLink: "select__link",
                classSelectOptions: "select__options",
                classSelectOptionsScroll: "select__scroll",
                classSelectOption: "select__option",
                classSelectContent: "select__content",
                classSelectRow: "select__row",
                classSelectData: "select__asset",
                classSelectDisabled: "_select-disabled",
                classSelectTag: "_select-tag",
                classSelectOpen: "_select-open",
                classSelectActive: "_select-active",
                classSelectFocus: "_select-focus",
                classSelectMultiple: "_select-multiple",
                classSelectCheckBox: "_select-checkbox",
                classSelectOptionSelected: "_select-selected",
                classSelectPseudoLabel: "_select-pseudo-label"
            };
            this._this = this;
            if (this.config.init) {
                const selectItems = data ? document.querySelectorAll(data) : document.querySelectorAll("select");
                if (selectItems.length) {
                    this.selectsInit(selectItems);
                    this.setLogging(`Прокинувся, построїв селектов: (${selectItems.length})`);
                } else this.setLogging("Сплю, немає жодного select");
            }
        }
        getSelectClass(className) {
            return `.${className}`;
        }
        getSelectElement(selectItem, className) {
            return {
                originalSelect: selectItem.querySelector("select"),
                selectElement: selectItem.querySelector(this.getSelectClass(className))
            };
        }
        selectsInit(selectItems) {
            selectItems.forEach(((originalSelect, index) => {
                this.selectInit(originalSelect, index + 1);
            }));
            document.addEventListener("click", function(e) {
                this.selectsActions(e);
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                this.selectsActions(e);
            }.bind(this));
            document.addEventListener("focusin", function(e) {
                this.selectsActions(e);
            }.bind(this));
            document.addEventListener("focusout", function(e) {
                this.selectsActions(e);
            }.bind(this));
        }
        selectInit(originalSelect, index) {
            const _this = this;
            let selectItem = document.createElement("div");
            selectItem.classList.add(this.selectClasses.classSelect);
            originalSelect.parentNode.insertBefore(selectItem, originalSelect);
            selectItem.appendChild(originalSelect);
            originalSelect.hidden = true;
            index ? originalSelect.dataset.id = index : null;
            if (this.getSelectPlaceholder(originalSelect)) {
                originalSelect.dataset.placeholder = this.getSelectPlaceholder(originalSelect).value;
                if (this.getSelectPlaceholder(originalSelect).label.show) {
                    const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
                    selectItemTitle.insertAdjacentHTML("afterbegin", `<span class="${this.selectClasses.classSelectLabel}">${this.getSelectPlaceholder(originalSelect).label.text ? this.getSelectPlaceholder(originalSelect).label.text : this.getSelectPlaceholder(originalSelect).value}</span>`);
                }
            }
            selectItem.insertAdjacentHTML("beforeend", `<div class="${this.selectClasses.classSelectBody}"><div hidden class="${this.selectClasses.classSelectOptions}"></div></div>`);
            this.selectBuild(originalSelect);
            originalSelect.dataset.speed = originalSelect.dataset.speed ? originalSelect.dataset.speed : this.config.speed;
            this.config.speed = +originalSelect.dataset.speed;
            originalSelect.addEventListener("change", (function(e) {
                _this.selectChange(e);
            }));
        }
        selectBuild(originalSelect) {
            const selectItem = originalSelect.parentElement;
            selectItem.dataset.id = originalSelect.dataset.id;
            originalSelect.dataset.classModif ? selectItem.classList.add(`select_${originalSelect.dataset.classModif}`) : null;
            originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectMultiple) : selectItem.classList.remove(this.selectClasses.classSelectMultiple);
            originalSelect.hasAttribute("data-checkbox") && originalSelect.multiple ? selectItem.classList.add(this.selectClasses.classSelectCheckBox) : selectItem.classList.remove(this.selectClasses.classSelectCheckBox);
            this.setSelectTitleValue(selectItem, originalSelect);
            this.setOptions(selectItem, originalSelect);
            originalSelect.hasAttribute("data-search") ? this.searchActions(selectItem) : null;
            originalSelect.hasAttribute("data-open") ? this.selectAction(selectItem) : null;
            this.selectDisabled(selectItem, originalSelect);
        }
        selectsActions(e) {
            const targetElement = e.target;
            const targetType = e.type;
            if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect)) || targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
                const selectItem = targetElement.closest(".select") ? targetElement.closest(".select") : document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag)).dataset.selectId}"]`);
                const originalSelect = this.getSelectElement(selectItem).originalSelect;
                if (targetType === "click") {
                    if (!originalSelect.disabled) if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag))) {
                        const targetTag = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTag));
                        const optionItem = document.querySelector(`.${this.selectClasses.classSelect}[data-id="${targetTag.dataset.selectId}"] .select__option[data-value="${targetTag.dataset.value}"]`);
                        this.optionAction(selectItem, originalSelect, optionItem);
                    } else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectTitle))) this.selectAction(selectItem); else if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption))) {
                        const optionItem = targetElement.closest(this.getSelectClass(this.selectClasses.classSelectOption));
                        this.optionAction(selectItem, originalSelect, optionItem);
                    }
                } else if (targetType === "focusin" || targetType === "focusout") {
                    if (targetElement.closest(this.getSelectClass(this.selectClasses.classSelect))) targetType === "focusin" ? selectItem.classList.add(this.selectClasses.classSelectFocus) : selectItem.classList.remove(this.selectClasses.classSelectFocus);
                } else if (targetType === "keydown" && e.code === "Escape") this.selectsСlose();
            } else this.selectsСlose();
        }
        selectsСlose(selectOneGroup) {
            const selectsGroup = selectOneGroup ? selectOneGroup : document;
            const selectActiveItems = selectsGroup.querySelectorAll(`${this.getSelectClass(this.selectClasses.classSelect)}${this.getSelectClass(this.selectClasses.classSelectOpen)}`);
            if (selectActiveItems.length) selectActiveItems.forEach((selectActiveItem => {
                this.selectСlose(selectActiveItem);
            }));
        }
        selectСlose(selectItem) {
            const originalSelect = this.getSelectElement(selectItem).originalSelect;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            if (!selectOptions.classList.contains("_slide")) {
                selectItem.classList.remove(this.selectClasses.classSelectOpen);
                _slideUp(selectOptions, originalSelect.dataset.speed);
                setTimeout((() => {
                    selectItem.style.zIndex = "";
                }), originalSelect.dataset.speed);
            }
        }
        selectAction(selectItem) {
            const originalSelect = this.getSelectElement(selectItem).originalSelect;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            const selectOpenzIndex = originalSelect.dataset.zIndex ? originalSelect.dataset.zIndex : 3;
            this.setOptionsPosition(selectItem);
            if (originalSelect.closest("[data-one-select]")) {
                const selectOneGroup = originalSelect.closest("[data-one-select]");
                this.selectsСlose(selectOneGroup);
            }
            setTimeout((() => {
                if (!selectOptions.classList.contains("_slide")) {
                    selectItem.classList.toggle(this.selectClasses.classSelectOpen);
                    _slideToggle(selectOptions, originalSelect.dataset.speed);
                    if (selectItem.classList.contains(this.selectClasses.classSelectOpen)) selectItem.style.zIndex = selectOpenzIndex; else setTimeout((() => {
                        selectItem.style.zIndex = "";
                    }), originalSelect.dataset.speed);
                }
            }), 0);
        }
        setSelectTitleValue(selectItem, originalSelect) {
            const selectItemBody = this.getSelectElement(selectItem, this.selectClasses.classSelectBody).selectElement;
            const selectItemTitle = this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement;
            if (selectItemTitle) selectItemTitle.remove();
            selectItemBody.insertAdjacentHTML("afterbegin", this.getSelectTitleValue(selectItem, originalSelect));
            originalSelect.hasAttribute("data-search") ? this.searchActions(selectItem) : null;
        }
        getSelectTitleValue(selectItem, originalSelect) {
            let selectTitleValue = this.getSelectedOptionsData(originalSelect, 2).html;
            if (originalSelect.multiple && originalSelect.hasAttribute("data-tags")) {
                selectTitleValue = this.getSelectedOptionsData(originalSelect).elements.map((option => `<span role="button" data-select-id="${selectItem.dataset.id}" data-value="${option.value}" class="_select-tag">${this.getSelectElementContent(option)}</span>`)).join("");
                if (originalSelect.dataset.tags && document.querySelector(originalSelect.dataset.tags)) {
                    document.querySelector(originalSelect.dataset.tags).innerHTML = selectTitleValue;
                    if (originalSelect.hasAttribute("data-search")) selectTitleValue = false;
                }
            }
            selectTitleValue = selectTitleValue.length ? selectTitleValue : originalSelect.dataset.placeholder ? originalSelect.dataset.placeholder : "";
            let pseudoAttribute = "";
            let pseudoAttributeClass = "";
            if (originalSelect.hasAttribute("data-pseudo-label")) {
                pseudoAttribute = originalSelect.dataset.pseudoLabel ? ` data-pseudo-label="${originalSelect.dataset.pseudoLabel}"` : ` data-pseudo-label="Заповніть атрибут"`;
                pseudoAttributeClass = ` ${this.selectClasses.classSelectPseudoLabel}`;
            }
            this.getSelectedOptionsData(originalSelect).values.length ? selectItem.classList.add(this.selectClasses.classSelectActive) : selectItem.classList.remove(this.selectClasses.classSelectActive);
            if (originalSelect.hasAttribute("data-search")) return `<div class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}"><input autocomplete="off" type="text" placeholder="${selectTitleValue}" data-placeholder="${selectTitleValue}" class="${this.selectClasses.classSelectInput}"></span></div>`; else {
                const customClass = this.getSelectedOptionsData(originalSelect).elements.length && this.getSelectedOptionsData(originalSelect).elements[0].dataset.class ? ` ${this.getSelectedOptionsData(originalSelect).elements[0].dataset.class}` : "";
                return `<button type="button" class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}${pseudoAttributeClass}"><span class="${this.selectClasses.classSelectContent}${customClass}">${selectTitleValue}</span></span></button>`;
            }
        }
        getSelectElementContent(selectOption) {
            const selectOptionData = selectOption.dataset.asset ? `${selectOption.dataset.asset}` : "";
            const selectOptionDataHTML = selectOptionData.indexOf("img") >= 0 ? `<img src="${selectOptionData}" alt="">` : selectOptionData;
            let selectOptionContentHTML = ``;
            selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectRow}">` : "";
            selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectData}">` : "";
            selectOptionContentHTML += selectOptionData ? selectOptionDataHTML : "";
            selectOptionContentHTML += selectOptionData ? `</span>` : "";
            selectOptionContentHTML += selectOptionData ? `<span class="${this.selectClasses.classSelectText}">` : "";
            selectOptionContentHTML += selectOption.textContent;
            selectOptionContentHTML += selectOptionData ? `</span>` : "";
            selectOptionContentHTML += selectOptionData ? `</span>` : "";
            return selectOptionContentHTML;
        }
        getSelectPlaceholder(originalSelect) {
            const selectPlaceholder = Array.from(originalSelect.options).find((option => !option.value));
            if (selectPlaceholder) return {
                value: selectPlaceholder.textContent,
                show: selectPlaceholder.hasAttribute("data-show"),
                label: {
                    show: selectPlaceholder.hasAttribute("data-label"),
                    text: selectPlaceholder.dataset.label
                }
            };
        }
        getSelectedOptionsData(originalSelect, type) {
            let selectedOptions = [];
            if (originalSelect.multiple) selectedOptions = Array.from(originalSelect.options).filter((option => option.value)).filter((option => option.selected)); else selectedOptions.push(originalSelect.options[originalSelect.selectedIndex]);
            return {
                elements: selectedOptions.map((option => option)),
                values: selectedOptions.filter((option => option.value)).map((option => option.value)),
                html: selectedOptions.map((option => this.getSelectElementContent(option)))
            };
        }
        getOptions(originalSelect) {
            const selectOptionsScroll = originalSelect.hasAttribute("data-scroll") ? `data-simplebar` : "";
            const customMaxHeightValue = +originalSelect.dataset.scroll ? +originalSelect.dataset.scroll : null;
            let selectOptions = Array.from(originalSelect.options);
            if (selectOptions.length > 0) {
                let selectOptionsHTML = ``;
                if (this.getSelectPlaceholder(originalSelect) && !this.getSelectPlaceholder(originalSelect).show || originalSelect.multiple) selectOptions = selectOptions.filter((option => option.value));
                selectOptionsHTML += `<div ${selectOptionsScroll} ${selectOptionsScroll ? `style="max-height: ${customMaxHeightValue}px"` : ""} class="${this.selectClasses.classSelectOptionsScroll}">`;
                selectOptions.forEach((selectOption => {
                    selectOptionsHTML += this.getOption(selectOption, originalSelect);
                }));
                selectOptionsHTML += `</div>`;
                return selectOptionsHTML;
            }
        }
        getOption(selectOption, originalSelect) {
            const selectOptionSelected = selectOption.selected && originalSelect.multiple ? ` ${this.selectClasses.classSelectOptionSelected}` : "";
            const selectOptionHide = selectOption.selected && !originalSelect.hasAttribute("data-show-selected") && !originalSelect.multiple ? `hidden` : ``;
            const selectOptionClass = selectOption.dataset.class ? ` ${selectOption.dataset.class}` : "";
            const selectOptionLink = selectOption.dataset.href ? selectOption.dataset.href : false;
            const selectOptionLinkTarget = selectOption.hasAttribute("data-href-blank") ? `target="_blank"` : "";
            let selectOptionHTML = ``;
            selectOptionHTML += selectOptionLink ? `<a ${selectOptionLinkTarget} ${selectOptionHide} href="${selectOptionLink}" data-value="${selectOption.value}" class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}">` : `<button ${selectOptionHide} class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}" data-value="${selectOption.value}" type="button">`;
            selectOptionHTML += this.getSelectElementContent(selectOption);
            selectOptionHTML += selectOptionLink ? `</a>` : `</button>`;
            return selectOptionHTML;
        }
        setOptions(selectItem, originalSelect) {
            const selectItemOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            selectItemOptions.innerHTML = this.getOptions(originalSelect);
        }
        setOptionsPosition(selectItem) {
            const originalSelect = this.getSelectElement(selectItem).originalSelect;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            const selectItemScroll = this.getSelectElement(selectItem, this.selectClasses.classSelectOptionsScroll).selectElement;
            const customMaxHeightValue = +originalSelect.dataset.scroll ? `${+originalSelect.dataset.scroll}px` : ``;
            const selectOptionsPosMargin = +originalSelect.dataset.optionsMargin ? +originalSelect.dataset.optionsMargin : 10;
            if (!selectItem.classList.contains(this.selectClasses.classSelectOpen)) {
                selectOptions.hidden = false;
                const selectItemScrollHeight = selectItemScroll.offsetHeight ? selectItemScroll.offsetHeight : parseInt(window.getComputedStyle(selectItemScroll).getPropertyValue("max-height"));
                const selectOptionsHeight = selectOptions.offsetHeight > selectItemScrollHeight ? selectOptions.offsetHeight : selectItemScrollHeight + selectOptions.offsetHeight;
                const selectOptionsScrollHeight = selectOptionsHeight - selectItemScrollHeight;
                selectOptions.hidden = true;
                const selectItemHeight = selectItem.offsetHeight;
                const selectItemPos = selectItem.getBoundingClientRect().top;
                const selectItemTotal = selectItemPos + selectOptionsHeight + selectItemHeight + selectOptionsScrollHeight;
                const selectItemResult = window.innerHeight - (selectItemTotal + selectOptionsPosMargin);
                if (selectItemResult < 0) {
                    const newMaxHeightValue = selectOptionsHeight + selectItemResult;
                    if (newMaxHeightValue < 100) {
                        selectItem.classList.add("select--show-top");
                        selectItemScroll.style.maxHeight = selectItemPos < selectOptionsHeight ? `${selectItemPos - (selectOptionsHeight - selectItemPos)}px` : customMaxHeightValue;
                    } else {
                        selectItem.classList.remove("select--show-top");
                        selectItemScroll.style.maxHeight = `${newMaxHeightValue}px`;
                    }
                }
            } else setTimeout((() => {
                selectItem.classList.remove("select--show-top");
                selectItemScroll.style.maxHeight = customMaxHeightValue;
            }), +originalSelect.dataset.speed);
        }
        optionAction(selectItem, originalSelect, optionItem) {
            const selectOptions = selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOptions)}`);
            if (!selectOptions.classList.contains("_slide")) {
                if (originalSelect.multiple) {
                    optionItem.classList.toggle(this.selectClasses.classSelectOptionSelected);
                    const originalSelectSelectedItems = this.getSelectedOptionsData(originalSelect).elements;
                    originalSelectSelectedItems.forEach((originalSelectSelectedItem => {
                        originalSelectSelectedItem.removeAttribute("selected");
                    }));
                    const selectSelectedItems = selectItem.querySelectorAll(this.getSelectClass(this.selectClasses.classSelectOptionSelected));
                    selectSelectedItems.forEach((selectSelectedItems => {
                        originalSelect.querySelector(`option[value = "${selectSelectedItems.dataset.value}"]`).setAttribute("selected", "selected");
                    }));
                } else {
                    if (!originalSelect.hasAttribute("data-show-selected")) setTimeout((() => {
                        if (selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`)) selectItem.querySelector(`${this.getSelectClass(this.selectClasses.classSelectOption)}[hidden]`).hidden = false;
                        optionItem.hidden = true;
                    }), this.config.speed);
                    originalSelect.value = optionItem.hasAttribute("data-value") ? optionItem.dataset.value : optionItem.textContent;
                    this.selectAction(selectItem);
                }
                this.setSelectTitleValue(selectItem, originalSelect);
                this.setSelectChange(originalSelect);
            }
        }
        selectChange(e) {
            e.target;
        }
        setSelectChange(originalSelect) {
            if (originalSelect.hasAttribute("data-validate")) formValidate.validateInput(originalSelect);
            if (originalSelect.hasAttribute("data-submit") && originalSelect.value) {
                let tempButton = document.createElement("button");
                tempButton.type = "submit";
                originalSelect.closest("form").append(tempButton);
                tempButton.click();
                tempButton.remove();
            }
            const selectItem = originalSelect.parentElement;
            this.selectCallback(selectItem, originalSelect);
        }
        selectDisabled(selectItem, originalSelect) {
            if (originalSelect.disabled) {
                selectItem.classList.add(this.selectClasses.classSelectDisabled);
                this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = true;
            } else {
                selectItem.classList.remove(this.selectClasses.classSelectDisabled);
                this.getSelectElement(selectItem, this.selectClasses.classSelectTitle).selectElement.disabled = false;
            }
        }
        searchActions(selectItem) {
            this.getSelectElement(selectItem).originalSelect;
            const selectInput = this.getSelectElement(selectItem, this.selectClasses.classSelectInput).selectElement;
            const selectOptions = this.getSelectElement(selectItem, this.selectClasses.classSelectOptions).selectElement;
            const selectOptionsItems = selectOptions.querySelectorAll(`.${this.selectClasses.classSelectOption} `);
            const _this = this;
            selectInput.addEventListener("input", (function() {
                selectOptionsItems.forEach((selectOptionsItem => {
                    if (selectOptionsItem.textContent.toUpperCase().includes(selectInput.value.toUpperCase())) selectOptionsItem.hidden = false; else selectOptionsItem.hidden = true;
                }));
                selectOptions.hidden === true ? _this.selectAction(selectItem) : null;
            }));
        }
        selectCallback(selectItem, originalSelect) {
            document.dispatchEvent(new CustomEvent("selectCallback", {
                detail: {
                    select: originalSelect
                }
            }));
        }
        setLogging(message) {
            this.config.logging ? functions_FLS(`[select]: ${message} `) : null;
        }
    }
    modules_flsModules.select = new SelectConstructor({});
    function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        Object.defineProperty(Constructor, "prototype", {
            writable: false
        });
        return Constructor;
    }
    /*!
 * Splide.js
 * Version  : 4.1.4
 * License  : MIT
 * Copyright: 2022 Naotoshi Fujita
 */    var MEDIA_PREFERS_REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
    var CREATED = 1;
    var MOUNTED = 2;
    var IDLE = 3;
    var MOVING = 4;
    var SCROLLING = 5;
    var DRAGGING = 6;
    var DESTROYED = 7;
    var STATES = {
        CREATED,
        MOUNTED,
        IDLE,
        MOVING,
        SCROLLING,
        DRAGGING,
        DESTROYED
    };
    function empty(array) {
        array.length = 0;
    }
    function slice(arrayLike, start, end) {
        return Array.prototype.slice.call(arrayLike, start, end);
    }
    function apply(func) {
        return func.bind.apply(func, [ null ].concat(slice(arguments, 1)));
    }
    var nextTick = setTimeout;
    var noop = function noop() {};
    function raf(func) {
        return requestAnimationFrame(func);
    }
    function typeOf(type, subject) {
        return typeof subject === type;
    }
    function isObject(subject) {
        return !isNull(subject) && typeOf("object", subject);
    }
    var isArray = Array.isArray;
    var isFunction = apply(typeOf, "function");
    var isString = apply(typeOf, "string");
    var isUndefined = apply(typeOf, "undefined");
    function isNull(subject) {
        return subject === null;
    }
    function isHTMLElement(subject) {
        try {
            return subject instanceof (subject.ownerDocument.defaultView || window).HTMLElement;
        } catch (e) {
            return false;
        }
    }
    function toArray(value) {
        return isArray(value) ? value : [ value ];
    }
    function forEach(values, iteratee) {
        toArray(values).forEach(iteratee);
    }
    function includes(array, value) {
        return array.indexOf(value) > -1;
    }
    function push(array, items) {
        array.push.apply(array, toArray(items));
        return array;
    }
    function toggleClass(elm, classes, add) {
        if (elm) forEach(classes, (function(name) {
            if (name) elm.classList[add ? "add" : "remove"](name);
        }));
    }
    function addClass(elm, classes) {
        toggleClass(elm, isString(classes) ? classes.split(" ") : classes, true);
    }
    function append(parent, children) {
        forEach(children, parent.appendChild.bind(parent));
    }
    function before(nodes, ref) {
        forEach(nodes, (function(node) {
            var parent = (ref || node).parentNode;
            if (parent) parent.insertBefore(node, ref);
        }));
    }
    function matches(elm, selector) {
        return isHTMLElement(elm) && (elm["msMatchesSelector"] || elm.matches).call(elm, selector);
    }
    function children(parent, selector) {
        var children2 = parent ? slice(parent.children) : [];
        return selector ? children2.filter((function(child) {
            return matches(child, selector);
        })) : children2;
    }
    function child(parent, selector) {
        return selector ? children(parent, selector)[0] : parent.firstElementChild;
    }
    var ownKeys = Object.keys;
    function forOwn(object, iteratee, right) {
        if (object) (right ? ownKeys(object).reverse() : ownKeys(object)).forEach((function(key) {
            key !== "__proto__" && iteratee(object[key], key);
        }));
        return object;
    }
    function splide_esm_assign(object) {
        slice(arguments, 1).forEach((function(source) {
            forOwn(source, (function(value, key) {
                object[key] = source[key];
            }));
        }));
        return object;
    }
    function merge(object) {
        slice(arguments, 1).forEach((function(source) {
            forOwn(source, (function(value, key) {
                if (isArray(value)) object[key] = value.slice(); else if (isObject(value)) object[key] = merge({}, isObject(object[key]) ? object[key] : {}, value); else object[key] = value;
            }));
        }));
        return object;
    }
    function omit(object, keys) {
        forEach(keys || ownKeys(object), (function(key) {
            delete object[key];
        }));
    }
    function removeAttribute(elms, attrs) {
        forEach(elms, (function(elm) {
            forEach(attrs, (function(attr) {
                elm && elm.removeAttribute(attr);
            }));
        }));
    }
    function setAttribute(elms, attrs, value) {
        if (isObject(attrs)) forOwn(attrs, (function(value2, name) {
            setAttribute(elms, name, value2);
        })); else forEach(elms, (function(elm) {
            isNull(value) || value === "" ? removeAttribute(elm, attrs) : elm.setAttribute(attrs, String(value));
        }));
    }
    function create(tag, attrs, parent) {
        var elm = document.createElement(tag);
        if (attrs) isString(attrs) ? addClass(elm, attrs) : setAttribute(elm, attrs);
        parent && append(parent, elm);
        return elm;
    }
    function style(elm, prop, value) {
        if (isUndefined(value)) return getComputedStyle(elm)[prop];
        if (!isNull(value)) elm.style[prop] = "" + value;
    }
    function display(elm, display2) {
        style(elm, "display", display2);
    }
    function splide_esm_focus(elm) {
        elm["setActive"] && elm["setActive"]() || elm.focus({
            preventScroll: true
        });
    }
    function getAttribute(elm, attr) {
        return elm.getAttribute(attr);
    }
    function hasClass(elm, className) {
        return elm && elm.classList.contains(className);
    }
    function rect(target) {
        return target.getBoundingClientRect();
    }
    function remove(nodes) {
        forEach(nodes, (function(node) {
            if (node && node.parentNode) node.parentNode.removeChild(node);
        }));
    }
    function parseHtml(html) {
        return child((new DOMParser).parseFromString(html, "text/html").body);
    }
    function prevent(e, stopPropagation) {
        e.preventDefault();
        if (stopPropagation) {
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
    }
    function query(parent, selector) {
        return parent && parent.querySelector(selector);
    }
    function queryAll(parent, selector) {
        return selector ? slice(parent.querySelectorAll(selector)) : [];
    }
    function removeClass(elm, classes) {
        toggleClass(elm, classes, false);
    }
    function timeOf(e) {
        return e.timeStamp;
    }
    function unit(value) {
        return isString(value) ? value : value ? value + "px" : "";
    }
    var PROJECT_CODE = "splide";
    var DATA_ATTRIBUTE = "data-" + PROJECT_CODE;
    function assert(condition, message) {
        if (!condition) throw new Error("[" + PROJECT_CODE + "] " + (message || ""));
    }
    var min = Math.min, max = Math.max, floor = Math.floor, ceil = Math.ceil, abs = Math.abs;
    function approximatelyEqual(x, y, epsilon) {
        return abs(x - y) < epsilon;
    }
    function between(number, x, y, exclusive) {
        var minimum = min(x, y);
        var maximum = max(x, y);
        return exclusive ? minimum < number && number < maximum : minimum <= number && number <= maximum;
    }
    function clamp(number, x, y) {
        var minimum = min(x, y);
        var maximum = max(x, y);
        return min(max(minimum, number), maximum);
    }
    function sign(x) {
        return +(x > 0) - +(x < 0);
    }
    function camelToKebab(string) {
        return string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
    }
    function format(string, replacements) {
        forEach(replacements, (function(replacement) {
            string = string.replace("%s", "" + replacement);
        }));
        return string;
    }
    function pad(number) {
        return number < 10 ? "0" + number : "" + number;
    }
    var ids = {};
    function uniqueId(prefix) {
        return "" + prefix + pad(ids[prefix] = (ids[prefix] || 0) + 1);
    }
    function EventBinder() {
        var listeners = [];
        function bind(targets, events, callback, options) {
            forEachEvent(targets, events, (function(target, event, namespace) {
                var isEventTarget = "addEventListener" in target;
                var remover = isEventTarget ? target.removeEventListener.bind(target, event, callback, options) : target["removeListener"].bind(target, callback);
                isEventTarget ? target.addEventListener(event, callback, options) : target["addListener"](callback);
                listeners.push([ target, event, namespace, callback, remover ]);
            }));
        }
        function unbind(targets, events, callback) {
            forEachEvent(targets, events, (function(target, event, namespace) {
                listeners = listeners.filter((function(listener) {
                    if (listener[0] === target && listener[1] === event && listener[2] === namespace && (!callback || listener[3] === callback)) {
                        listener[4]();
                        return false;
                    }
                    return true;
                }));
            }));
        }
        function dispatch(target, type, detail) {
            var e;
            var bubbles = true;
            if (typeof CustomEvent === "function") e = new CustomEvent(type, {
                bubbles,
                detail
            }); else {
                e = document.createEvent("CustomEvent");
                e.initCustomEvent(type, bubbles, false, detail);
            }
            target.dispatchEvent(e);
            return e;
        }
        function forEachEvent(targets, events, iteratee) {
            forEach(targets, (function(target) {
                target && forEach(events, (function(events2) {
                    events2.split(" ").forEach((function(eventNS) {
                        var fragment = eventNS.split(".");
                        iteratee(target, fragment[0], fragment[1]);
                    }));
                }));
            }));
        }
        function destroy() {
            listeners.forEach((function(data) {
                data[4]();
            }));
            empty(listeners);
        }
        return {
            bind,
            unbind,
            dispatch,
            destroy
        };
    }
    var EVENT_MOUNTED = "mounted";
    var EVENT_READY = "ready";
    var EVENT_MOVE = "move";
    var EVENT_MOVED = "moved";
    var EVENT_CLICK = "click";
    var EVENT_ACTIVE = "active";
    var EVENT_INACTIVE = "inactive";
    var EVENT_VISIBLE = "visible";
    var EVENT_HIDDEN = "hidden";
    var EVENT_REFRESH = "refresh";
    var EVENT_UPDATED = "updated";
    var EVENT_RESIZE = "resize";
    var EVENT_RESIZED = "resized";
    var EVENT_DRAG = "drag";
    var EVENT_DRAGGING = "dragging";
    var EVENT_DRAGGED = "dragged";
    var EVENT_SCROLL = "scroll";
    var EVENT_SCROLLED = "scrolled";
    var EVENT_OVERFLOW = "overflow";
    var EVENT_DESTROY = "destroy";
    var EVENT_ARROWS_MOUNTED = "arrows:mounted";
    var EVENT_ARROWS_UPDATED = "arrows:updated";
    var EVENT_PAGINATION_MOUNTED = "pagination:mounted";
    var EVENT_PAGINATION_UPDATED = "pagination:updated";
    var EVENT_NAVIGATION_MOUNTED = "navigation:mounted";
    var EVENT_AUTOPLAY_PLAY = "autoplay:play";
    var EVENT_AUTOPLAY_PLAYING = "autoplay:playing";
    var EVENT_AUTOPLAY_PAUSE = "autoplay:pause";
    var EVENT_LAZYLOAD_LOADED = "lazyload:loaded";
    var EVENT_SLIDE_KEYDOWN = "sk";
    var EVENT_SHIFTED = "sh";
    var EVENT_END_INDEX_CHANGED = "ei";
    function EventInterface(Splide2) {
        var bus = Splide2 ? Splide2.event.bus : document.createDocumentFragment();
        var binder = EventBinder();
        function on(events, callback) {
            binder.bind(bus, toArray(events).join(" "), (function(e) {
                callback.apply(callback, isArray(e.detail) ? e.detail : []);
            }));
        }
        function emit(event) {
            binder.dispatch(bus, event, slice(arguments, 1));
        }
        if (Splide2) Splide2.event.on(EVENT_DESTROY, binder.destroy);
        return splide_esm_assign(binder, {
            bus,
            on,
            off: apply(binder.unbind, bus),
            emit
        });
    }
    function RequestInterval(interval, onInterval, onUpdate, limit) {
        var now = Date.now;
        var startTime;
        var rate = 0;
        var id;
        var paused = true;
        var count = 0;
        function update() {
            if (!paused) {
                rate = interval ? min((now() - startTime) / interval, 1) : 1;
                onUpdate && onUpdate(rate);
                if (rate >= 1) {
                    onInterval();
                    startTime = now();
                    if (limit && ++count >= limit) return pause();
                }
                id = raf(update);
            }
        }
        function start(resume) {
            resume || cancel();
            startTime = now() - (resume ? rate * interval : 0);
            paused = false;
            id = raf(update);
        }
        function pause() {
            paused = true;
        }
        function rewind() {
            startTime = now();
            rate = 0;
            if (onUpdate) onUpdate(rate);
        }
        function cancel() {
            id && cancelAnimationFrame(id);
            rate = 0;
            id = 0;
            paused = true;
        }
        function set(time) {
            interval = time;
        }
        function isPaused() {
            return paused;
        }
        return {
            start,
            rewind,
            pause,
            cancel,
            set,
            isPaused
        };
    }
    function State(initialState) {
        var state = initialState;
        function set(value) {
            state = value;
        }
        function is(states) {
            return includes(toArray(states), state);
        }
        return {
            set,
            is
        };
    }
    function Throttle(func, duration) {
        var interval = RequestInterval(duration || 0, func, null, 1);
        return function() {
            interval.isPaused() && interval.start();
        };
    }
    function Media(Splide2, Components2, options) {
        var state = Splide2.state;
        var breakpoints = options.breakpoints || {};
        var reducedMotion = options.reducedMotion || {};
        var binder = EventBinder();
        var queries = [];
        function setup() {
            var isMin = options.mediaQuery === "min";
            ownKeys(breakpoints).sort((function(n, m) {
                return isMin ? +n - +m : +m - +n;
            })).forEach((function(key) {
                register(breakpoints[key], "(" + (isMin ? "min" : "max") + "-width:" + key + "px)");
            }));
            register(reducedMotion, MEDIA_PREFERS_REDUCED_MOTION);
            update();
        }
        function destroy(completely) {
            if (completely) binder.destroy();
        }
        function register(options2, query) {
            var queryList = matchMedia(query);
            binder.bind(queryList, "change", update);
            queries.push([ options2, queryList ]);
        }
        function update() {
            var destroyed = state.is(DESTROYED);
            var direction = options.direction;
            var merged = queries.reduce((function(merged2, entry) {
                return merge(merged2, entry[1].matches ? entry[0] : {});
            }), {});
            omit(options);
            set(merged);
            if (options.destroy) Splide2.destroy(options.destroy === "completely"); else if (destroyed) {
                destroy(true);
                Splide2.mount();
            } else direction !== options.direction && Splide2.refresh();
        }
        function reduce(enable) {
            if (matchMedia(MEDIA_PREFERS_REDUCED_MOTION).matches) enable ? merge(options, reducedMotion) : omit(options, ownKeys(reducedMotion));
        }
        function set(opts, base, notify) {
            merge(options, opts);
            base && merge(Object.getPrototypeOf(options), opts);
            if (notify || !state.is(CREATED)) Splide2.emit(EVENT_UPDATED, options);
        }
        return {
            setup,
            destroy,
            reduce,
            set
        };
    }
    var ARROW = "Arrow";
    var ARROW_LEFT = ARROW + "Left";
    var ARROW_RIGHT = ARROW + "Right";
    var ARROW_UP = ARROW + "Up";
    var ARROW_DOWN = ARROW + "Down";
    var RTL = "rtl";
    var TTB = "ttb";
    var ORIENTATION_MAP = {
        width: [ "height" ],
        left: [ "top", "right" ],
        right: [ "bottom", "left" ],
        x: [ "y" ],
        X: [ "Y" ],
        Y: [ "X" ],
        ArrowLeft: [ ARROW_UP, ARROW_RIGHT ],
        ArrowRight: [ ARROW_DOWN, ARROW_LEFT ]
    };
    function Direction(Splide2, Components2, options) {
        function resolve(prop, axisOnly, direction) {
            direction = direction || options.direction;
            var index = direction === RTL && !axisOnly ? 1 : direction === TTB ? 0 : -1;
            return ORIENTATION_MAP[prop] && ORIENTATION_MAP[prop][index] || prop.replace(/width|left|right/i, (function(match, offset) {
                var replacement = ORIENTATION_MAP[match.toLowerCase()][index] || match;
                return offset > 0 ? replacement.charAt(0).toUpperCase() + replacement.slice(1) : replacement;
            }));
        }
        function orient(value) {
            return value * (options.direction === RTL ? 1 : -1);
        }
        return {
            resolve,
            orient
        };
    }
    var ROLE = "role";
    var TAB_INDEX = "tabindex";
    var DISABLED = "disabled";
    var ARIA_PREFIX = "aria-";
    var ARIA_CONTROLS = ARIA_PREFIX + "controls";
    var ARIA_CURRENT = ARIA_PREFIX + "current";
    var ARIA_SELECTED = ARIA_PREFIX + "selected";
    var ARIA_LABEL = ARIA_PREFIX + "label";
    var ARIA_LABELLEDBY = ARIA_PREFIX + "labelledby";
    var ARIA_HIDDEN = ARIA_PREFIX + "hidden";
    var ARIA_ORIENTATION = ARIA_PREFIX + "orientation";
    var ARIA_ROLEDESCRIPTION = ARIA_PREFIX + "roledescription";
    var ARIA_LIVE = ARIA_PREFIX + "live";
    var ARIA_BUSY = ARIA_PREFIX + "busy";
    var ARIA_ATOMIC = ARIA_PREFIX + "atomic";
    var ALL_ATTRIBUTES = [ ROLE, TAB_INDEX, DISABLED, ARIA_CONTROLS, ARIA_CURRENT, ARIA_LABEL, ARIA_LABELLEDBY, ARIA_HIDDEN, ARIA_ORIENTATION, ARIA_ROLEDESCRIPTION ];
    var CLASS_PREFIX = PROJECT_CODE + "__";
    var STATUS_CLASS_PREFIX = "is-";
    var CLASS_ROOT = PROJECT_CODE;
    var CLASS_TRACK = CLASS_PREFIX + "track";
    var CLASS_LIST = CLASS_PREFIX + "list";
    var CLASS_SLIDE = CLASS_PREFIX + "slide";
    var CLASS_CLONE = CLASS_SLIDE + "--clone";
    var CLASS_CONTAINER = CLASS_SLIDE + "__container";
    var CLASS_ARROWS = CLASS_PREFIX + "arrows";
    var CLASS_ARROW = CLASS_PREFIX + "arrow";
    var CLASS_ARROW_PREV = CLASS_ARROW + "--prev";
    var CLASS_ARROW_NEXT = CLASS_ARROW + "--next";
    var CLASS_PAGINATION = CLASS_PREFIX + "pagination";
    var CLASS_PAGINATION_PAGE = CLASS_PAGINATION + "__page";
    var CLASS_PROGRESS = CLASS_PREFIX + "progress";
    var CLASS_PROGRESS_BAR = CLASS_PROGRESS + "__bar";
    var CLASS_TOGGLE = CLASS_PREFIX + "toggle";
    var CLASS_SPINNER = CLASS_PREFIX + "spinner";
    var CLASS_SR = CLASS_PREFIX + "sr";
    var CLASS_INITIALIZED = STATUS_CLASS_PREFIX + "initialized";
    var CLASS_ACTIVE = STATUS_CLASS_PREFIX + "active";
    var CLASS_PREV = STATUS_CLASS_PREFIX + "prev";
    var CLASS_NEXT = STATUS_CLASS_PREFIX + "next";
    var CLASS_VISIBLE = STATUS_CLASS_PREFIX + "visible";
    var CLASS_LOADING = STATUS_CLASS_PREFIX + "loading";
    var CLASS_FOCUS_IN = STATUS_CLASS_PREFIX + "focus-in";
    var CLASS_OVERFLOW = STATUS_CLASS_PREFIX + "overflow";
    var STATUS_CLASSES = [ CLASS_ACTIVE, CLASS_VISIBLE, CLASS_PREV, CLASS_NEXT, CLASS_LOADING, CLASS_FOCUS_IN, CLASS_OVERFLOW ];
    var CLASSES = {
        slide: CLASS_SLIDE,
        clone: CLASS_CLONE,
        arrows: CLASS_ARROWS,
        arrow: CLASS_ARROW,
        prev: CLASS_ARROW_PREV,
        next: CLASS_ARROW_NEXT,
        pagination: CLASS_PAGINATION,
        page: CLASS_PAGINATION_PAGE,
        spinner: CLASS_SPINNER
    };
    function closest(from, selector) {
        if (isFunction(from.closest)) return from.closest(selector);
        var elm = from;
        while (elm && elm.nodeType === 1) {
            if (matches(elm, selector)) break;
            elm = elm.parentElement;
        }
        return elm;
    }
    var FRICTION = 5;
    var LOG_INTERVAL = 200;
    var POINTER_DOWN_EVENTS = "touchstart mousedown";
    var POINTER_MOVE_EVENTS = "touchmove mousemove";
    var POINTER_UP_EVENTS = "touchend touchcancel mouseup click";
    function Elements(Splide2, Components2, options) {
        var _EventInterface = EventInterface(Splide2), on = _EventInterface.on, bind = _EventInterface.bind;
        var root = Splide2.root;
        var i18n = options.i18n;
        var elements = {};
        var slides = [];
        var rootClasses = [];
        var trackClasses = [];
        var track;
        var list;
        var isUsingKey;
        function setup() {
            collect();
            init();
            update();
        }
        function mount() {
            on(EVENT_REFRESH, destroy);
            on(EVENT_REFRESH, setup);
            on(EVENT_UPDATED, update);
            bind(document, POINTER_DOWN_EVENTS + " keydown", (function(e) {
                isUsingKey = e.type === "keydown";
            }), {
                capture: true
            });
            bind(root, "focusin", (function() {
                toggleClass(root, CLASS_FOCUS_IN, !!isUsingKey);
            }));
        }
        function destroy(completely) {
            var attrs = ALL_ATTRIBUTES.concat("style");
            empty(slides);
            removeClass(root, rootClasses);
            removeClass(track, trackClasses);
            removeAttribute([ track, list ], attrs);
            removeAttribute(root, completely ? attrs : [ "style", ARIA_ROLEDESCRIPTION ]);
        }
        function update() {
            removeClass(root, rootClasses);
            removeClass(track, trackClasses);
            rootClasses = getClasses(CLASS_ROOT);
            trackClasses = getClasses(CLASS_TRACK);
            addClass(root, rootClasses);
            addClass(track, trackClasses);
            setAttribute(root, ARIA_LABEL, options.label);
            setAttribute(root, ARIA_LABELLEDBY, options.labelledby);
        }
        function collect() {
            track = find("." + CLASS_TRACK);
            list = child(track, "." + CLASS_LIST);
            assert(track && list, "A track/list element is missing.");
            push(slides, children(list, "." + CLASS_SLIDE + ":not(." + CLASS_CLONE + ")"));
            forOwn({
                arrows: CLASS_ARROWS,
                pagination: CLASS_PAGINATION,
                prev: CLASS_ARROW_PREV,
                next: CLASS_ARROW_NEXT,
                bar: CLASS_PROGRESS_BAR,
                toggle: CLASS_TOGGLE
            }, (function(className, key) {
                elements[key] = find("." + className);
            }));
            splide_esm_assign(elements, {
                root,
                track,
                list,
                slides
            });
        }
        function init() {
            var id = root.id || uniqueId(PROJECT_CODE);
            var role = options.role;
            root.id = id;
            track.id = track.id || id + "-track";
            list.id = list.id || id + "-list";
            if (!getAttribute(root, ROLE) && root.tagName !== "SECTION" && role) setAttribute(root, ROLE, role);
            setAttribute(root, ARIA_ROLEDESCRIPTION, i18n.carousel);
            setAttribute(list, ROLE, "presentation");
        }
        function find(selector) {
            var elm = query(root, selector);
            return elm && closest(elm, "." + CLASS_ROOT) === root ? elm : void 0;
        }
        function getClasses(base) {
            return [ base + "--" + options.type, base + "--" + options.direction, options.drag && base + "--draggable", options.isNavigation && base + "--nav", base === CLASS_ROOT && CLASS_ACTIVE ];
        }
        return splide_esm_assign(elements, {
            setup,
            mount,
            destroy
        });
    }
    var SLIDE = "slide";
    var LOOP = "loop";
    var FADE = "fade";
    function Slide$1(Splide2, index, slideIndex, slide) {
        var event = EventInterface(Splide2);
        var on = event.on, emit = event.emit, bind = event.bind;
        var Components = Splide2.Components, root = Splide2.root, options = Splide2.options;
        var isNavigation = options.isNavigation, updateOnMove = options.updateOnMove, i18n = options.i18n, pagination = options.pagination, slideFocus = options.slideFocus;
        var resolve = Components.Direction.resolve;
        var styles = getAttribute(slide, "style");
        var label = getAttribute(slide, ARIA_LABEL);
        var isClone = slideIndex > -1;
        var container = child(slide, "." + CLASS_CONTAINER);
        var destroyed;
        function mount() {
            if (!isClone) {
                slide.id = root.id + "-slide" + pad(index + 1);
                setAttribute(slide, ROLE, pagination ? "tabpanel" : "group");
                setAttribute(slide, ARIA_ROLEDESCRIPTION, i18n.slide);
                setAttribute(slide, ARIA_LABEL, label || format(i18n.slideLabel, [ index + 1, Splide2.length ]));
            }
            listen();
        }
        function listen() {
            bind(slide, "click", apply(emit, EVENT_CLICK, self));
            bind(slide, "keydown", apply(emit, EVENT_SLIDE_KEYDOWN, self));
            on([ EVENT_MOVED, EVENT_SHIFTED, EVENT_SCROLLED ], update);
            on(EVENT_NAVIGATION_MOUNTED, initNavigation);
            if (updateOnMove) on(EVENT_MOVE, onMove);
        }
        function destroy() {
            destroyed = true;
            event.destroy();
            removeClass(slide, STATUS_CLASSES);
            removeAttribute(slide, ALL_ATTRIBUTES);
            setAttribute(slide, "style", styles);
            setAttribute(slide, ARIA_LABEL, label || "");
        }
        function initNavigation() {
            var controls = Splide2.splides.map((function(target) {
                var Slide2 = target.splide.Components.Slides.getAt(index);
                return Slide2 ? Slide2.slide.id : "";
            })).join(" ");
            setAttribute(slide, ARIA_LABEL, format(i18n.slideX, (isClone ? slideIndex : index) + 1));
            setAttribute(slide, ARIA_CONTROLS, controls);
            setAttribute(slide, ROLE, slideFocus ? "button" : "");
            slideFocus && removeAttribute(slide, ARIA_ROLEDESCRIPTION);
        }
        function onMove() {
            if (!destroyed) update();
        }
        function update() {
            if (!destroyed) {
                var curr = Splide2.index;
                updateActivity();
                updateVisibility();
                toggleClass(slide, CLASS_PREV, index === curr - 1);
                toggleClass(slide, CLASS_NEXT, index === curr + 1);
            }
        }
        function updateActivity() {
            var active = isActive();
            if (active !== hasClass(slide, CLASS_ACTIVE)) {
                toggleClass(slide, CLASS_ACTIVE, active);
                setAttribute(slide, ARIA_CURRENT, isNavigation && active || "");
                emit(active ? EVENT_ACTIVE : EVENT_INACTIVE, self);
            }
        }
        function updateVisibility() {
            var visible = isVisible();
            var hidden = !visible && (!isActive() || isClone);
            if (!Splide2.state.is([ MOVING, SCROLLING ])) setAttribute(slide, ARIA_HIDDEN, hidden || "");
            setAttribute(queryAll(slide, options.focusableNodes || ""), TAB_INDEX, hidden ? -1 : "");
            if (slideFocus) setAttribute(slide, TAB_INDEX, hidden ? -1 : 0);
            if (visible !== hasClass(slide, CLASS_VISIBLE)) {
                toggleClass(slide, CLASS_VISIBLE, visible);
                emit(visible ? EVENT_VISIBLE : EVENT_HIDDEN, self);
            }
            if (!visible && document.activeElement === slide) {
                var Slide2 = Components.Slides.getAt(Splide2.index);
                Slide2 && splide_esm_focus(Slide2.slide);
            }
        }
        function style$1(prop, value, useContainer) {
            style(useContainer && container || slide, prop, value);
        }
        function isActive() {
            var curr = Splide2.index;
            return curr === index || options.cloneStatus && curr === slideIndex;
        }
        function isVisible() {
            if (Splide2.is(FADE)) return isActive();
            var trackRect = rect(Components.Elements.track);
            var slideRect = rect(slide);
            var left = resolve("left", true);
            var right = resolve("right", true);
            return floor(trackRect[left]) <= ceil(slideRect[left]) && floor(slideRect[right]) <= ceil(trackRect[right]);
        }
        function isWithin(from, distance) {
            var diff = abs(from - index);
            if (!isClone && (options.rewind || Splide2.is(LOOP))) diff = min(diff, Splide2.length - diff);
            return diff <= distance;
        }
        var self = {
            index,
            slideIndex,
            slide,
            container,
            isClone,
            mount,
            destroy,
            update,
            style: style$1,
            isWithin
        };
        return self;
    }
    function Slides(Splide2, Components2, options) {
        var _EventInterface2 = EventInterface(Splide2), on = _EventInterface2.on, emit = _EventInterface2.emit, bind = _EventInterface2.bind;
        var _Components2$Elements = Components2.Elements, slides = _Components2$Elements.slides, list = _Components2$Elements.list;
        var Slides2 = [];
        function mount() {
            init();
            on(EVENT_REFRESH, destroy);
            on(EVENT_REFRESH, init);
        }
        function init() {
            slides.forEach((function(slide, index) {
                register(slide, index, -1);
            }));
        }
        function destroy() {
            forEach$1((function(Slide2) {
                Slide2.destroy();
            }));
            empty(Slides2);
        }
        function update() {
            forEach$1((function(Slide2) {
                Slide2.update();
            }));
        }
        function register(slide, index, slideIndex) {
            var object = Slide$1(Splide2, index, slideIndex, slide);
            object.mount();
            Slides2.push(object);
            Slides2.sort((function(Slide1, Slide2) {
                return Slide1.index - Slide2.index;
            }));
        }
        function get(excludeClones) {
            return excludeClones ? filter((function(Slide2) {
                return !Slide2.isClone;
            })) : Slides2;
        }
        function getIn(page) {
            var Controller = Components2.Controller;
            var index = Controller.toIndex(page);
            var max = Controller.hasFocus() ? 1 : options.perPage;
            return filter((function(Slide2) {
                return between(Slide2.index, index, index + max - 1);
            }));
        }
        function getAt(index) {
            return filter(index)[0];
        }
        function add(items, index) {
            forEach(items, (function(slide) {
                if (isString(slide)) slide = parseHtml(slide);
                if (isHTMLElement(slide)) {
                    var ref = slides[index];
                    ref ? before(slide, ref) : append(list, slide);
                    addClass(slide, options.classes.slide);
                    observeImages(slide, apply(emit, EVENT_RESIZE));
                }
            }));
            emit(EVENT_REFRESH);
        }
        function remove$1(matcher) {
            remove(filter(matcher).map((function(Slide2) {
                return Slide2.slide;
            })));
            emit(EVENT_REFRESH);
        }
        function forEach$1(iteratee, excludeClones) {
            get(excludeClones).forEach(iteratee);
        }
        function filter(matcher) {
            return Slides2.filter(isFunction(matcher) ? matcher : function(Slide2) {
                return isString(matcher) ? matches(Slide2.slide, matcher) : includes(toArray(matcher), Slide2.index);
            });
        }
        function style(prop, value, useContainer) {
            forEach$1((function(Slide2) {
                Slide2.style(prop, value, useContainer);
            }));
        }
        function observeImages(elm, callback) {
            var images = queryAll(elm, "img");
            var length = images.length;
            if (length) images.forEach((function(img) {
                bind(img, "load error", (function() {
                    if (! --length) callback();
                }));
            })); else callback();
        }
        function getLength(excludeClones) {
            return excludeClones ? slides.length : Slides2.length;
        }
        function isEnough() {
            return Slides2.length > options.perPage;
        }
        return {
            mount,
            destroy,
            update,
            register,
            get,
            getIn,
            getAt,
            add,
            remove: remove$1,
            forEach: forEach$1,
            filter,
            style,
            getLength,
            isEnough
        };
    }
    function Layout(Splide2, Components2, options) {
        var _EventInterface3 = EventInterface(Splide2), on = _EventInterface3.on, bind = _EventInterface3.bind, emit = _EventInterface3.emit;
        var Slides = Components2.Slides;
        var resolve = Components2.Direction.resolve;
        var _Components2$Elements2 = Components2.Elements, root = _Components2$Elements2.root, track = _Components2$Elements2.track, list = _Components2$Elements2.list;
        var getAt = Slides.getAt, styleSlides = Slides.style;
        var vertical;
        var rootRect;
        var overflow;
        function mount() {
            init();
            bind(window, "resize load", Throttle(apply(emit, EVENT_RESIZE)));
            on([ EVENT_UPDATED, EVENT_REFRESH ], init);
            on(EVENT_RESIZE, resize);
        }
        function init() {
            vertical = options.direction === TTB;
            style(root, "maxWidth", unit(options.width));
            style(track, resolve("paddingLeft"), cssPadding(false));
            style(track, resolve("paddingRight"), cssPadding(true));
            resize(true);
        }
        function resize(force) {
            var newRect = rect(root);
            if (force || rootRect.width !== newRect.width || rootRect.height !== newRect.height) {
                style(track, "height", cssTrackHeight());
                styleSlides(resolve("marginRight"), unit(options.gap));
                styleSlides("width", cssSlideWidth());
                styleSlides("height", cssSlideHeight(), true);
                rootRect = newRect;
                emit(EVENT_RESIZED);
                if (overflow !== (overflow = isOverflow())) {
                    toggleClass(root, CLASS_OVERFLOW, overflow);
                    emit(EVENT_OVERFLOW, overflow);
                }
            }
        }
        function cssPadding(right) {
            var padding = options.padding;
            var prop = resolve(right ? "right" : "left");
            return padding && unit(padding[prop] || (isObject(padding) ? 0 : padding)) || "0px";
        }
        function cssTrackHeight() {
            var height = "";
            if (vertical) {
                height = cssHeight();
                assert(height, "height or heightRatio is missing.");
                height = "calc(" + height + " - " + cssPadding(false) + " - " + cssPadding(true) + ")";
            }
            return height;
        }
        function cssHeight() {
            return unit(options.height || rect(list).width * options.heightRatio);
        }
        function cssSlideWidth() {
            return options.autoWidth ? null : unit(options.fixedWidth) || (vertical ? "" : cssSlideSize());
        }
        function cssSlideHeight() {
            return unit(options.fixedHeight) || (vertical ? options.autoHeight ? null : cssSlideSize() : cssHeight());
        }
        function cssSlideSize() {
            var gap = unit(options.gap);
            return "calc((100%" + (gap && " + " + gap) + ")/" + (options.perPage || 1) + (gap && " - " + gap) + ")";
        }
        function listSize() {
            return rect(list)[resolve("width")];
        }
        function slideSize(index, withoutGap) {
            var Slide = getAt(index || 0);
            return Slide ? rect(Slide.slide)[resolve("width")] + (withoutGap ? 0 : getGap()) : 0;
        }
        function totalSize(index, withoutGap) {
            var Slide = getAt(index);
            if (Slide) {
                var right = rect(Slide.slide)[resolve("right")];
                var left = rect(list)[resolve("left")];
                return abs(right - left) + (withoutGap ? 0 : getGap());
            }
            return 0;
        }
        function sliderSize(withoutGap) {
            return totalSize(Splide2.length - 1) - totalSize(0) + slideSize(0, withoutGap);
        }
        function getGap() {
            var Slide = getAt(0);
            return Slide && parseFloat(style(Slide.slide, resolve("marginRight"))) || 0;
        }
        function getPadding(right) {
            return parseFloat(style(track, resolve("padding" + (right ? "Right" : "Left")))) || 0;
        }
        function isOverflow() {
            return Splide2.is(FADE) || sliderSize(true) > listSize();
        }
        return {
            mount,
            resize,
            listSize,
            slideSize,
            sliderSize,
            totalSize,
            getPadding,
            isOverflow
        };
    }
    var MULTIPLIER = 2;
    function Clones(Splide2, Components2, options) {
        var event = EventInterface(Splide2);
        var on = event.on;
        var Elements = Components2.Elements, Slides = Components2.Slides;
        var resolve = Components2.Direction.resolve;
        var clones = [];
        var cloneCount;
        function mount() {
            on(EVENT_REFRESH, remount);
            on([ EVENT_UPDATED, EVENT_RESIZE ], observe);
            if (cloneCount = computeCloneCount()) {
                generate(cloneCount);
                Components2.Layout.resize(true);
            }
        }
        function remount() {
            destroy();
            mount();
        }
        function destroy() {
            remove(clones);
            empty(clones);
            event.destroy();
        }
        function observe() {
            var count = computeCloneCount();
            if (cloneCount !== count) if (cloneCount < count || !count) event.emit(EVENT_REFRESH);
        }
        function generate(count) {
            var slides = Slides.get().slice();
            var length = slides.length;
            if (length) {
                while (slides.length < count) push(slides, slides);
                push(slides.slice(-count), slides.slice(0, count)).forEach((function(Slide, index) {
                    var isHead = index < count;
                    var clone = cloneDeep(Slide.slide, index);
                    isHead ? before(clone, slides[0].slide) : append(Elements.list, clone);
                    push(clones, clone);
                    Slides.register(clone, index - count + (isHead ? 0 : length), Slide.index);
                }));
            }
        }
        function cloneDeep(elm, index) {
            var clone = elm.cloneNode(true);
            addClass(clone, options.classes.clone);
            clone.id = Splide2.root.id + "-clone" + pad(index + 1);
            return clone;
        }
        function computeCloneCount() {
            var clones2 = options.clones;
            if (!Splide2.is(LOOP)) clones2 = 0; else if (isUndefined(clones2)) {
                var fixedSize = options[resolve("fixedWidth")] && Components2.Layout.slideSize(0);
                var fixedCount = fixedSize && ceil(rect(Elements.track)[resolve("width")] / fixedSize);
                clones2 = fixedCount || options[resolve("autoWidth")] && Splide2.length || options.perPage * MULTIPLIER;
            }
            return clones2;
        }
        return {
            mount,
            destroy
        };
    }
    function Move(Splide2, Components2, options) {
        var _EventInterface4 = EventInterface(Splide2), on = _EventInterface4.on, emit = _EventInterface4.emit;
        var set = Splide2.state.set;
        var _Components2$Layout = Components2.Layout, slideSize = _Components2$Layout.slideSize, getPadding = _Components2$Layout.getPadding, totalSize = _Components2$Layout.totalSize, listSize = _Components2$Layout.listSize, sliderSize = _Components2$Layout.sliderSize;
        var _Components2$Directio = Components2.Direction, resolve = _Components2$Directio.resolve, orient = _Components2$Directio.orient;
        var _Components2$Elements3 = Components2.Elements, list = _Components2$Elements3.list, track = _Components2$Elements3.track;
        var Transition;
        function mount() {
            Transition = Components2.Transition;
            on([ EVENT_MOUNTED, EVENT_RESIZED, EVENT_UPDATED, EVENT_REFRESH ], reposition);
        }
        function reposition() {
            if (!Components2.Controller.isBusy()) {
                Components2.Scroll.cancel();
                jump(Splide2.index);
                Components2.Slides.update();
            }
        }
        function move(dest, index, prev, callback) {
            if (dest !== index && canShift(dest > prev)) {
                cancel();
                translate(shift(getPosition(), dest > prev), true);
            }
            set(MOVING);
            emit(EVENT_MOVE, index, prev, dest);
            Transition.start(index, (function() {
                set(IDLE);
                emit(EVENT_MOVED, index, prev, dest);
                callback && callback();
            }));
        }
        function jump(index) {
            translate(toPosition(index, true));
        }
        function translate(position, preventLoop) {
            if (!Splide2.is(FADE)) {
                var destination = preventLoop ? position : loop(position);
                style(list, "transform", "translate" + resolve("X") + "(" + destination + "px)");
                position !== destination && emit(EVENT_SHIFTED);
            }
        }
        function loop(position) {
            if (Splide2.is(LOOP)) {
                var index = toIndex(position);
                var exceededMax = index > Components2.Controller.getEnd();
                var exceededMin = index < 0;
                if (exceededMin || exceededMax) position = shift(position, exceededMax);
            }
            return position;
        }
        function shift(position, backwards) {
            var excess = position - getLimit(backwards);
            var size = sliderSize();
            position -= orient(size * (ceil(abs(excess) / size) || 1)) * (backwards ? 1 : -1);
            return position;
        }
        function cancel() {
            translate(getPosition(), true);
            Transition.cancel();
        }
        function toIndex(position) {
            var Slides = Components2.Slides.get();
            var index = 0;
            var minDistance = 1 / 0;
            for (var i = 0; i < Slides.length; i++) {
                var slideIndex = Slides[i].index;
                var distance = abs(toPosition(slideIndex, true) - position);
                if (distance <= minDistance) {
                    minDistance = distance;
                    index = slideIndex;
                } else break;
            }
            return index;
        }
        function toPosition(index, trimming) {
            var position = orient(totalSize(index - 1) - offset(index));
            return trimming ? trim(position) : position;
        }
        function getPosition() {
            var left = resolve("left");
            return rect(list)[left] - rect(track)[left] + orient(getPadding(false));
        }
        function trim(position) {
            if (options.trimSpace && Splide2.is(SLIDE)) position = clamp(position, 0, orient(sliderSize(true) - listSize()));
            return position;
        }
        function offset(index) {
            var focus = options.focus;
            return focus === "center" ? (listSize() - slideSize(index, true)) / 2 : +focus * slideSize(index) || 0;
        }
        function getLimit(max) {
            return toPosition(max ? Components2.Controller.getEnd() : 0, !!options.trimSpace);
        }
        function canShift(backwards) {
            var shifted = orient(shift(getPosition(), backwards));
            return backwards ? shifted >= 0 : shifted <= list[resolve("scrollWidth")] - rect(track)[resolve("width")];
        }
        function exceededLimit(max, position) {
            position = isUndefined(position) ? getPosition() : position;
            var exceededMin = max !== true && orient(position) < orient(getLimit(false));
            var exceededMax = max !== false && orient(position) > orient(getLimit(true));
            return exceededMin || exceededMax;
        }
        return {
            mount,
            move,
            jump,
            translate,
            shift,
            cancel,
            toIndex,
            toPosition,
            getPosition,
            getLimit,
            exceededLimit,
            reposition
        };
    }
    function Controller(Splide2, Components2, options) {
        var _EventInterface5 = EventInterface(Splide2), on = _EventInterface5.on, emit = _EventInterface5.emit;
        var Move = Components2.Move;
        var getPosition = Move.getPosition, getLimit = Move.getLimit, toPosition = Move.toPosition;
        var _Components2$Slides = Components2.Slides, isEnough = _Components2$Slides.isEnough, getLength = _Components2$Slides.getLength;
        var omitEnd = options.omitEnd;
        var isLoop = Splide2.is(LOOP);
        var isSlide = Splide2.is(SLIDE);
        var getNext = apply(getAdjacent, false);
        var getPrev = apply(getAdjacent, true);
        var currIndex = options.start || 0;
        var endIndex;
        var prevIndex = currIndex;
        var slideCount;
        var perMove;
        var perPage;
        function mount() {
            init();
            on([ EVENT_UPDATED, EVENT_REFRESH, EVENT_END_INDEX_CHANGED ], init);
            on(EVENT_RESIZED, onResized);
        }
        function init() {
            slideCount = getLength(true);
            perMove = options.perMove;
            perPage = options.perPage;
            endIndex = getEnd();
            var index = clamp(currIndex, 0, omitEnd ? endIndex : slideCount - 1);
            if (index !== currIndex) {
                currIndex = index;
                Move.reposition();
            }
        }
        function onResized() {
            if (endIndex !== getEnd()) emit(EVENT_END_INDEX_CHANGED);
        }
        function go(control, allowSameIndex, callback) {
            if (!isBusy()) {
                var dest = parse(control);
                var index = loop(dest);
                if (index > -1 && (allowSameIndex || index !== currIndex)) {
                    setIndex(index);
                    Move.move(dest, index, prevIndex, callback);
                }
            }
        }
        function scroll(destination, duration, snap, callback) {
            Components2.Scroll.scroll(destination, duration, snap, (function() {
                var index = loop(Move.toIndex(getPosition()));
                setIndex(omitEnd ? min(index, endIndex) : index);
                callback && callback();
            }));
        }
        function parse(control) {
            var index = currIndex;
            if (isString(control)) {
                var _ref = control.match(/([+\-<>])(\d+)?/) || [], indicator = _ref[1], number = _ref[2];
                if (indicator === "+" || indicator === "-") index = computeDestIndex(currIndex + +("" + indicator + (+number || 1)), currIndex); else if (indicator === ">") index = number ? toIndex(+number) : getNext(true); else if (indicator === "<") index = getPrev(true);
            } else index = isLoop ? control : clamp(control, 0, endIndex);
            return index;
        }
        function getAdjacent(prev, destination) {
            var number = perMove || (hasFocus() ? 1 : perPage);
            var dest = computeDestIndex(currIndex + number * (prev ? -1 : 1), currIndex, !(perMove || hasFocus()));
            if (dest === -1 && isSlide) if (!approximatelyEqual(getPosition(), getLimit(!prev), 1)) return prev ? 0 : endIndex;
            return destination ? dest : loop(dest);
        }
        function computeDestIndex(dest, from, snapPage) {
            if (isEnough() || hasFocus()) {
                var index = computeMovableDestIndex(dest);
                if (index !== dest) {
                    from = dest;
                    dest = index;
                    snapPage = false;
                }
                if (dest < 0 || dest > endIndex) if (!perMove && (between(0, dest, from, true) || between(endIndex, from, dest, true))) dest = toIndex(toPage(dest)); else if (isLoop) dest = snapPage ? dest < 0 ? -(slideCount % perPage || perPage) : slideCount : dest; else if (options.rewind) dest = dest < 0 ? endIndex : 0; else dest = -1; else if (snapPage && dest !== from) dest = toIndex(toPage(from) + (dest < from ? -1 : 1));
            } else dest = -1;
            return dest;
        }
        function computeMovableDestIndex(dest) {
            if (isSlide && options.trimSpace === "move" && dest !== currIndex) {
                var position = getPosition();
                while (position === toPosition(dest, true) && between(dest, 0, Splide2.length - 1, !options.rewind)) dest < currIndex ? --dest : ++dest;
            }
            return dest;
        }
        function loop(index) {
            return isLoop ? (index + slideCount) % slideCount || 0 : index;
        }
        function getEnd() {
            var end = slideCount - (hasFocus() || isLoop && perMove ? 1 : perPage);
            while (omitEnd && end-- > 0) if (toPosition(slideCount - 1, true) !== toPosition(end, true)) {
                end++;
                break;
            }
            return clamp(end, 0, slideCount - 1);
        }
        function toIndex(page) {
            return clamp(hasFocus() ? page : perPage * page, 0, endIndex);
        }
        function toPage(index) {
            return hasFocus() ? min(index, endIndex) : floor((index >= endIndex ? slideCount - 1 : index) / perPage);
        }
        function toDest(destination) {
            var closest = Move.toIndex(destination);
            return isSlide ? clamp(closest, 0, endIndex) : closest;
        }
        function setIndex(index) {
            if (index !== currIndex) {
                prevIndex = currIndex;
                currIndex = index;
            }
        }
        function getIndex(prev) {
            return prev ? prevIndex : currIndex;
        }
        function hasFocus() {
            return !isUndefined(options.focus) || options.isNavigation;
        }
        function isBusy() {
            return Splide2.state.is([ MOVING, SCROLLING ]) && !!options.waitForTransition;
        }
        return {
            mount,
            go,
            scroll,
            getNext,
            getPrev,
            getAdjacent,
            getEnd,
            setIndex,
            getIndex,
            toIndex,
            toPage,
            toDest,
            hasFocus,
            isBusy
        };
    }
    var XML_NAME_SPACE = "http://www.w3.org/2000/svg";
    var PATH = "m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z";
    var SIZE = 40;
    function Arrows(Splide2, Components2, options) {
        var event = EventInterface(Splide2);
        var on = event.on, bind = event.bind, emit = event.emit;
        var classes = options.classes, i18n = options.i18n;
        var Elements = Components2.Elements, Controller = Components2.Controller;
        var placeholder = Elements.arrows, track = Elements.track;
        var wrapper = placeholder;
        var prev = Elements.prev;
        var next = Elements.next;
        var created;
        var wrapperClasses;
        var arrows = {};
        function mount() {
            init();
            on(EVENT_UPDATED, remount);
        }
        function remount() {
            destroy();
            mount();
        }
        function init() {
            var enabled = options.arrows;
            if (enabled && !(prev && next)) createArrows();
            if (prev && next) {
                splide_esm_assign(arrows, {
                    prev,
                    next
                });
                display(wrapper, enabled ? "" : "none");
                addClass(wrapper, wrapperClasses = CLASS_ARROWS + "--" + options.direction);
                if (enabled) {
                    listen();
                    update();
                    setAttribute([ prev, next ], ARIA_CONTROLS, track.id);
                    emit(EVENT_ARROWS_MOUNTED, prev, next);
                }
            }
        }
        function destroy() {
            event.destroy();
            removeClass(wrapper, wrapperClasses);
            if (created) {
                remove(placeholder ? [ prev, next ] : wrapper);
                prev = next = null;
            } else removeAttribute([ prev, next ], ALL_ATTRIBUTES);
        }
        function listen() {
            on([ EVENT_MOUNTED, EVENT_MOVED, EVENT_REFRESH, EVENT_SCROLLED, EVENT_END_INDEX_CHANGED ], update);
            bind(next, "click", apply(go, ">"));
            bind(prev, "click", apply(go, "<"));
        }
        function go(control) {
            Controller.go(control, true);
        }
        function createArrows() {
            wrapper = placeholder || create("div", classes.arrows);
            prev = createArrow(true);
            next = createArrow(false);
            created = true;
            append(wrapper, [ prev, next ]);
            !placeholder && before(wrapper, track);
        }
        function createArrow(prev2) {
            var arrow = '<button class="' + classes.arrow + " " + (prev2 ? classes.prev : classes.next) + '" type="button"><svg xmlns="' + XML_NAME_SPACE + '" viewBox="0 0 ' + SIZE + " " + SIZE + '" width="' + SIZE + '" height="' + SIZE + '" focusable="false"><path d="' + (options.arrowPath || PATH) + '" />';
            return parseHtml(arrow);
        }
        function update() {
            if (prev && next) {
                var index = Splide2.index;
                var prevIndex = Controller.getPrev();
                var nextIndex = Controller.getNext();
                var prevLabel = prevIndex > -1 && index < prevIndex ? i18n.last : i18n.prev;
                var nextLabel = nextIndex > -1 && index > nextIndex ? i18n.first : i18n.next;
                prev.disabled = prevIndex < 0;
                next.disabled = nextIndex < 0;
                setAttribute(prev, ARIA_LABEL, prevLabel);
                setAttribute(next, ARIA_LABEL, nextLabel);
                emit(EVENT_ARROWS_UPDATED, prev, next, prevIndex, nextIndex);
            }
        }
        return {
            arrows,
            mount,
            destroy,
            update
        };
    }
    var INTERVAL_DATA_ATTRIBUTE = DATA_ATTRIBUTE + "-interval";
    function Autoplay(Splide2, Components2, options) {
        var _EventInterface6 = EventInterface(Splide2), on = _EventInterface6.on, bind = _EventInterface6.bind, emit = _EventInterface6.emit;
        var interval = RequestInterval(options.interval, Splide2.go.bind(Splide2, ">"), onAnimationFrame);
        var isPaused = interval.isPaused;
        var Elements = Components2.Elements, _Components2$Elements4 = Components2.Elements, root = _Components2$Elements4.root, toggle = _Components2$Elements4.toggle;
        var autoplay = options.autoplay;
        var hovered;
        var focused;
        var stopped = autoplay === "pause";
        function mount() {
            if (autoplay) {
                listen();
                toggle && setAttribute(toggle, ARIA_CONTROLS, Elements.track.id);
                stopped || play();
                update();
            }
        }
        function listen() {
            if (options.pauseOnHover) bind(root, "mouseenter mouseleave", (function(e) {
                hovered = e.type === "mouseenter";
                autoToggle();
            }));
            if (options.pauseOnFocus) bind(root, "focusin focusout", (function(e) {
                focused = e.type === "focusin";
                autoToggle();
            }));
            if (toggle) bind(toggle, "click", (function() {
                stopped ? play() : pause(true);
            }));
            on([ EVENT_MOVE, EVENT_SCROLL, EVENT_REFRESH ], interval.rewind);
            on(EVENT_MOVE, onMove);
        }
        function play() {
            if (isPaused() && Components2.Slides.isEnough()) {
                interval.start(!options.resetProgress);
                focused = hovered = stopped = false;
                update();
                emit(EVENT_AUTOPLAY_PLAY);
            }
        }
        function pause(stop) {
            if (stop === void 0) stop = true;
            stopped = !!stop;
            update();
            if (!isPaused()) {
                interval.pause();
                emit(EVENT_AUTOPLAY_PAUSE);
            }
        }
        function autoToggle() {
            if (!stopped) hovered || focused ? pause(false) : play();
        }
        function update() {
            if (toggle) {
                toggleClass(toggle, CLASS_ACTIVE, !stopped);
                setAttribute(toggle, ARIA_LABEL, options.i18n[stopped ? "play" : "pause"]);
            }
        }
        function onAnimationFrame(rate) {
            var bar = Elements.bar;
            bar && style(bar, "width", rate * 100 + "%");
            emit(EVENT_AUTOPLAY_PLAYING, rate);
        }
        function onMove(index) {
            var Slide = Components2.Slides.getAt(index);
            interval.set(Slide && +getAttribute(Slide.slide, INTERVAL_DATA_ATTRIBUTE) || options.interval);
        }
        return {
            mount,
            destroy: interval.cancel,
            play,
            pause,
            isPaused
        };
    }
    function Cover(Splide2, Components2, options) {
        var _EventInterface7 = EventInterface(Splide2), on = _EventInterface7.on;
        function mount() {
            if (options.cover) {
                on(EVENT_LAZYLOAD_LOADED, apply(toggle, true));
                on([ EVENT_MOUNTED, EVENT_UPDATED, EVENT_REFRESH ], apply(cover, true));
            }
        }
        function cover(cover2) {
            Components2.Slides.forEach((function(Slide) {
                var img = child(Slide.container || Slide.slide, "img");
                if (img && img.src) toggle(cover2, img, Slide);
            }));
        }
        function toggle(cover2, img, Slide) {
            Slide.style("background", cover2 ? 'center/cover no-repeat url("' + img.src + '")' : "", true);
            display(img, cover2 ? "none" : "");
        }
        return {
            mount,
            destroy: apply(cover, false)
        };
    }
    var BOUNCE_DIFF_THRESHOLD = 10;
    var BOUNCE_DURATION = 600;
    var FRICTION_FACTOR = .6;
    var BASE_VELOCITY = 1.5;
    var MIN_DURATION = 800;
    function Scroll(Splide2, Components2, options) {
        var _EventInterface8 = EventInterface(Splide2), on = _EventInterface8.on, emit = _EventInterface8.emit;
        var set = Splide2.state.set;
        var Move = Components2.Move;
        var getPosition = Move.getPosition, getLimit = Move.getLimit, exceededLimit = Move.exceededLimit, translate = Move.translate;
        var isSlide = Splide2.is(SLIDE);
        var interval;
        var callback;
        var friction = 1;
        function mount() {
            on(EVENT_MOVE, clear);
            on([ EVENT_UPDATED, EVENT_REFRESH ], cancel);
        }
        function scroll(destination, duration, snap, onScrolled, noConstrain) {
            var from = getPosition();
            clear();
            if (snap && (!isSlide || !exceededLimit())) {
                var size = Components2.Layout.sliderSize();
                var offset = sign(destination) * size * floor(abs(destination) / size) || 0;
                destination = Move.toPosition(Components2.Controller.toDest(destination % size)) + offset;
            }
            var noDistance = approximatelyEqual(from, destination, 1);
            friction = 1;
            duration = noDistance ? 0 : duration || max(abs(destination - from) / BASE_VELOCITY, MIN_DURATION);
            callback = onScrolled;
            interval = RequestInterval(duration, onEnd, apply(update, from, destination, noConstrain), 1);
            set(SCROLLING);
            emit(EVENT_SCROLL);
            interval.start();
        }
        function onEnd() {
            set(IDLE);
            callback && callback();
            emit(EVENT_SCROLLED);
        }
        function update(from, to, noConstrain, rate) {
            var position = getPosition();
            var target = from + (to - from) * easing(rate);
            var diff = (target - position) * friction;
            translate(position + diff);
            if (isSlide && !noConstrain && exceededLimit()) {
                friction *= FRICTION_FACTOR;
                if (abs(diff) < BOUNCE_DIFF_THRESHOLD) scroll(getLimit(exceededLimit(true)), BOUNCE_DURATION, false, callback, true);
            }
        }
        function clear() {
            if (interval) interval.cancel();
        }
        function cancel() {
            if (interval && !interval.isPaused()) {
                clear();
                onEnd();
            }
        }
        function easing(t) {
            var easingFunc = options.easingFunc;
            return easingFunc ? easingFunc(t) : 1 - Math.pow(1 - t, 4);
        }
        return {
            mount,
            destroy: clear,
            scroll,
            cancel
        };
    }
    var SCROLL_LISTENER_OPTIONS = {
        passive: false,
        capture: true
    };
    function Drag(Splide2, Components2, options) {
        var _EventInterface9 = EventInterface(Splide2), on = _EventInterface9.on, emit = _EventInterface9.emit, bind = _EventInterface9.bind, unbind = _EventInterface9.unbind;
        var state = Splide2.state;
        var Move = Components2.Move, Scroll = Components2.Scroll, Controller = Components2.Controller, track = Components2.Elements.track, reduce = Components2.Media.reduce;
        var _Components2$Directio2 = Components2.Direction, resolve = _Components2$Directio2.resolve, orient = _Components2$Directio2.orient;
        var getPosition = Move.getPosition, exceededLimit = Move.exceededLimit;
        var basePosition;
        var baseEvent;
        var prevBaseEvent;
        var isFree;
        var dragging;
        var exceeded = false;
        var clickPrevented;
        var disabled;
        var target;
        function mount() {
            bind(track, POINTER_MOVE_EVENTS, noop, SCROLL_LISTENER_OPTIONS);
            bind(track, POINTER_UP_EVENTS, noop, SCROLL_LISTENER_OPTIONS);
            bind(track, POINTER_DOWN_EVENTS, onPointerDown, SCROLL_LISTENER_OPTIONS);
            bind(track, "click", onClick, {
                capture: true
            });
            bind(track, "dragstart", prevent);
            on([ EVENT_MOUNTED, EVENT_UPDATED ], init);
        }
        function init() {
            var drag = options.drag;
            disable(!drag);
            isFree = drag === "free";
        }
        function onPointerDown(e) {
            clickPrevented = false;
            if (!disabled) {
                var isTouch = isTouchEvent(e);
                if (isDraggable(e.target) && (isTouch || !e.button)) if (!Controller.isBusy()) {
                    target = isTouch ? track : window;
                    dragging = state.is([ MOVING, SCROLLING ]);
                    prevBaseEvent = null;
                    bind(target, POINTER_MOVE_EVENTS, onPointerMove, SCROLL_LISTENER_OPTIONS);
                    bind(target, POINTER_UP_EVENTS, onPointerUp, SCROLL_LISTENER_OPTIONS);
                    Move.cancel();
                    Scroll.cancel();
                    save(e);
                } else prevent(e, true);
            }
        }
        function onPointerMove(e) {
            if (!state.is(DRAGGING)) {
                state.set(DRAGGING);
                emit(EVENT_DRAG);
            }
            if (e.cancelable) if (dragging) {
                Move.translate(basePosition + constrain(diffCoord(e)));
                var expired = diffTime(e) > LOG_INTERVAL;
                var hasExceeded = exceeded !== (exceeded = exceededLimit());
                if (expired || hasExceeded) save(e);
                clickPrevented = true;
                emit(EVENT_DRAGGING);
                prevent(e);
            } else if (isSliderDirection(e)) {
                dragging = shouldStart(e);
                prevent(e);
            }
        }
        function onPointerUp(e) {
            if (state.is(DRAGGING)) {
                state.set(IDLE);
                emit(EVENT_DRAGGED);
            }
            if (dragging) {
                move(e);
                prevent(e);
            }
            unbind(target, POINTER_MOVE_EVENTS, onPointerMove);
            unbind(target, POINTER_UP_EVENTS, onPointerUp);
            dragging = false;
        }
        function onClick(e) {
            if (!disabled && clickPrevented) prevent(e, true);
        }
        function save(e) {
            prevBaseEvent = baseEvent;
            baseEvent = e;
            basePosition = getPosition();
        }
        function move(e) {
            var velocity = computeVelocity(e);
            var destination = computeDestination(velocity);
            var rewind = options.rewind && options.rewindByDrag;
            reduce(false);
            if (isFree) Controller.scroll(destination, 0, options.snap); else if (Splide2.is(FADE)) Controller.go(orient(sign(velocity)) < 0 ? rewind ? "<" : "-" : rewind ? ">" : "+"); else if (Splide2.is(SLIDE) && exceeded && rewind) Controller.go(exceededLimit(true) ? ">" : "<"); else Controller.go(Controller.toDest(destination), true);
            reduce(true);
        }
        function shouldStart(e) {
            var thresholds = options.dragMinThreshold;
            var isObj = isObject(thresholds);
            var mouse = isObj && thresholds.mouse || 0;
            var touch = (isObj ? thresholds.touch : +thresholds) || 10;
            return abs(diffCoord(e)) > (isTouchEvent(e) ? touch : mouse);
        }
        function isSliderDirection(e) {
            return abs(diffCoord(e)) > abs(diffCoord(e, true));
        }
        function computeVelocity(e) {
            if (Splide2.is(LOOP) || !exceeded) {
                var time = diffTime(e);
                if (time && time < LOG_INTERVAL) return diffCoord(e) / time;
            }
            return 0;
        }
        function computeDestination(velocity) {
            return getPosition() + sign(velocity) * min(abs(velocity) * (options.flickPower || 600), isFree ? 1 / 0 : Components2.Layout.listSize() * (options.flickMaxPages || 1));
        }
        function diffCoord(e, orthogonal) {
            return coordOf(e, orthogonal) - coordOf(getBaseEvent(e), orthogonal);
        }
        function diffTime(e) {
            return timeOf(e) - timeOf(getBaseEvent(e));
        }
        function getBaseEvent(e) {
            return baseEvent === e && prevBaseEvent || baseEvent;
        }
        function coordOf(e, orthogonal) {
            return (isTouchEvent(e) ? e.changedTouches[0] : e)["page" + resolve(orthogonal ? "Y" : "X")];
        }
        function constrain(diff) {
            return diff / (exceeded && Splide2.is(SLIDE) ? FRICTION : 1);
        }
        function isDraggable(target2) {
            var noDrag = options.noDrag;
            return !matches(target2, "." + CLASS_PAGINATION_PAGE + ", ." + CLASS_ARROW) && (!noDrag || !matches(target2, noDrag));
        }
        function isTouchEvent(e) {
            return typeof TouchEvent !== "undefined" && e instanceof TouchEvent;
        }
        function isDragging() {
            return dragging;
        }
        function disable(value) {
            disabled = value;
        }
        return {
            mount,
            disable,
            isDragging
        };
    }
    var NORMALIZATION_MAP = {
        Spacebar: " ",
        Right: ARROW_RIGHT,
        Left: ARROW_LEFT,
        Up: ARROW_UP,
        Down: ARROW_DOWN
    };
    function normalizeKey(key) {
        key = isString(key) ? key : key.key;
        return NORMALIZATION_MAP[key] || key;
    }
    var KEYBOARD_EVENT = "keydown";
    function Keyboard(Splide2, Components2, options) {
        var _EventInterface10 = EventInterface(Splide2), on = _EventInterface10.on, bind = _EventInterface10.bind, unbind = _EventInterface10.unbind;
        var root = Splide2.root;
        var resolve = Components2.Direction.resolve;
        var target;
        var disabled;
        function mount() {
            init();
            on(EVENT_UPDATED, destroy);
            on(EVENT_UPDATED, init);
            on(EVENT_MOVE, onMove);
        }
        function init() {
            var keyboard = options.keyboard;
            if (keyboard) {
                target = keyboard === "global" ? window : root;
                bind(target, KEYBOARD_EVENT, onKeydown);
            }
        }
        function destroy() {
            unbind(target, KEYBOARD_EVENT);
        }
        function disable(value) {
            disabled = value;
        }
        function onMove() {
            var _disabled = disabled;
            disabled = true;
            nextTick((function() {
                disabled = _disabled;
            }));
        }
        function onKeydown(e) {
            if (!disabled) {
                var key = normalizeKey(e);
                if (key === resolve(ARROW_LEFT)) Splide2.go("<"); else if (key === resolve(ARROW_RIGHT)) Splide2.go(">");
            }
        }
        return {
            mount,
            destroy,
            disable
        };
    }
    var SRC_DATA_ATTRIBUTE = DATA_ATTRIBUTE + "-lazy";
    var SRCSET_DATA_ATTRIBUTE = SRC_DATA_ATTRIBUTE + "-srcset";
    var IMAGE_SELECTOR = "[" + SRC_DATA_ATTRIBUTE + "], [" + SRCSET_DATA_ATTRIBUTE + "]";
    function LazyLoad(Splide2, Components2, options) {
        var _EventInterface11 = EventInterface(Splide2), on = _EventInterface11.on, off = _EventInterface11.off, bind = _EventInterface11.bind, emit = _EventInterface11.emit;
        var isSequential = options.lazyLoad === "sequential";
        var events = [ EVENT_MOVED, EVENT_SCROLLED ];
        var entries = [];
        function mount() {
            if (options.lazyLoad) {
                init();
                on(EVENT_REFRESH, init);
            }
        }
        function init() {
            empty(entries);
            register();
            if (isSequential) loadNext(); else {
                off(events);
                on(events, check);
                check();
            }
        }
        function register() {
            Components2.Slides.forEach((function(Slide) {
                queryAll(Slide.slide, IMAGE_SELECTOR).forEach((function(img) {
                    var src = getAttribute(img, SRC_DATA_ATTRIBUTE);
                    var srcset = getAttribute(img, SRCSET_DATA_ATTRIBUTE);
                    if (src !== img.src || srcset !== img.srcset) {
                        var className = options.classes.spinner;
                        var parent = img.parentElement;
                        var spinner = child(parent, "." + className) || create("span", className, parent);
                        entries.push([ img, Slide, spinner ]);
                        img.src || display(img, "none");
                    }
                }));
            }));
        }
        function check() {
            entries = entries.filter((function(data) {
                var distance = options.perPage * ((options.preloadPages || 1) + 1) - 1;
                return data[1].isWithin(Splide2.index, distance) ? load(data) : true;
            }));
            entries.length || off(events);
        }
        function load(data) {
            var img = data[0];
            addClass(data[1].slide, CLASS_LOADING);
            bind(img, "load error", apply(onLoad, data));
            setAttribute(img, "src", getAttribute(img, SRC_DATA_ATTRIBUTE));
            setAttribute(img, "srcset", getAttribute(img, SRCSET_DATA_ATTRIBUTE));
            removeAttribute(img, SRC_DATA_ATTRIBUTE);
            removeAttribute(img, SRCSET_DATA_ATTRIBUTE);
        }
        function onLoad(data, e) {
            var img = data[0], Slide = data[1];
            removeClass(Slide.slide, CLASS_LOADING);
            if (e.type !== "error") {
                remove(data[2]);
                display(img, "");
                emit(EVENT_LAZYLOAD_LOADED, img, Slide);
                emit(EVENT_RESIZE);
            }
            isSequential && loadNext();
        }
        function loadNext() {
            entries.length && load(entries.shift());
        }
        return {
            mount,
            destroy: apply(empty, entries),
            check
        };
    }
    function Pagination(Splide2, Components2, options) {
        var event = EventInterface(Splide2);
        var on = event.on, emit = event.emit, bind = event.bind;
        var Slides = Components2.Slides, Elements = Components2.Elements, Controller = Components2.Controller;
        var hasFocus = Controller.hasFocus, getIndex = Controller.getIndex, go = Controller.go;
        var resolve = Components2.Direction.resolve;
        var placeholder = Elements.pagination;
        var items = [];
        var list;
        var paginationClasses;
        function mount() {
            destroy();
            on([ EVENT_UPDATED, EVENT_REFRESH, EVENT_END_INDEX_CHANGED ], mount);
            var enabled = options.pagination;
            placeholder && display(placeholder, enabled ? "" : "none");
            if (enabled) {
                on([ EVENT_MOVE, EVENT_SCROLL, EVENT_SCROLLED ], update);
                createPagination();
                update();
                emit(EVENT_PAGINATION_MOUNTED, {
                    list,
                    items
                }, getAt(Splide2.index));
            }
        }
        function destroy() {
            if (list) {
                remove(placeholder ? slice(list.children) : list);
                removeClass(list, paginationClasses);
                empty(items);
                list = null;
            }
            event.destroy();
        }
        function createPagination() {
            var length = Splide2.length;
            var classes = options.classes, i18n = options.i18n, perPage = options.perPage;
            var max = hasFocus() ? Controller.getEnd() + 1 : ceil(length / perPage);
            list = placeholder || create("ul", classes.pagination, Elements.track.parentElement);
            addClass(list, paginationClasses = CLASS_PAGINATION + "--" + getDirection());
            setAttribute(list, ROLE, "tablist");
            setAttribute(list, ARIA_LABEL, i18n.select);
            setAttribute(list, ARIA_ORIENTATION, getDirection() === TTB ? "vertical" : "");
            for (var i = 0; i < max; i++) {
                var li = create("li", null, list);
                var button = create("button", {
                    class: classes.page,
                    type: "button"
                }, li);
                var controls = Slides.getIn(i).map((function(Slide) {
                    return Slide.slide.id;
                }));
                var text = !hasFocus() && perPage > 1 ? i18n.pageX : i18n.slideX;
                bind(button, "click", apply(onClick, i));
                if (options.paginationKeyboard) bind(button, "keydown", apply(onKeydown, i));
                setAttribute(li, ROLE, "presentation");
                setAttribute(button, ROLE, "tab");
                setAttribute(button, ARIA_CONTROLS, controls.join(" "));
                setAttribute(button, ARIA_LABEL, format(text, i + 1));
                setAttribute(button, TAB_INDEX, -1);
                items.push({
                    li,
                    button,
                    page: i
                });
            }
        }
        function onClick(page) {
            go(">" + page, true);
        }
        function onKeydown(page, e) {
            var length = items.length;
            var key = normalizeKey(e);
            var dir = getDirection();
            var nextPage = -1;
            if (key === resolve(ARROW_RIGHT, false, dir)) nextPage = ++page % length; else if (key === resolve(ARROW_LEFT, false, dir)) nextPage = (--page + length) % length; else if (key === "Home") nextPage = 0; else if (key === "End") nextPage = length - 1;
            var item = items[nextPage];
            if (item) {
                splide_esm_focus(item.button);
                go(">" + nextPage);
                prevent(e, true);
            }
        }
        function getDirection() {
            return options.paginationDirection || options.direction;
        }
        function getAt(index) {
            return items[Controller.toPage(index)];
        }
        function update() {
            var prev = getAt(getIndex(true));
            var curr = getAt(getIndex());
            if (prev) {
                var button = prev.button;
                removeClass(button, CLASS_ACTIVE);
                removeAttribute(button, ARIA_SELECTED);
                setAttribute(button, TAB_INDEX, -1);
            }
            if (curr) {
                var _button = curr.button;
                addClass(_button, CLASS_ACTIVE);
                setAttribute(_button, ARIA_SELECTED, true);
                setAttribute(_button, TAB_INDEX, "");
            }
            emit(EVENT_PAGINATION_UPDATED, {
                list,
                items
            }, prev, curr);
        }
        return {
            items,
            mount,
            destroy,
            getAt,
            update
        };
    }
    var TRIGGER_KEYS = [ " ", "Enter" ];
    function Sync(Splide2, Components2, options) {
        var isNavigation = options.isNavigation, slideFocus = options.slideFocus;
        var events = [];
        function mount() {
            Splide2.splides.forEach((function(target) {
                if (!target.isParent) {
                    sync(Splide2, target.splide);
                    sync(target.splide, Splide2);
                }
            }));
            if (isNavigation) navigate();
        }
        function destroy() {
            events.forEach((function(event) {
                event.destroy();
            }));
            empty(events);
        }
        function remount() {
            destroy();
            mount();
        }
        function sync(splide, target) {
            var event = EventInterface(splide);
            event.on(EVENT_MOVE, (function(index, prev, dest) {
                target.go(target.is(LOOP) ? dest : index);
            }));
            events.push(event);
        }
        function navigate() {
            var event = EventInterface(Splide2);
            var on = event.on;
            on(EVENT_CLICK, onClick);
            on(EVENT_SLIDE_KEYDOWN, onKeydown);
            on([ EVENT_MOUNTED, EVENT_UPDATED ], update);
            events.push(event);
            event.emit(EVENT_NAVIGATION_MOUNTED, Splide2.splides);
        }
        function update() {
            setAttribute(Components2.Elements.list, ARIA_ORIENTATION, options.direction === TTB ? "vertical" : "");
        }
        function onClick(Slide) {
            Splide2.go(Slide.index);
        }
        function onKeydown(Slide, e) {
            if (includes(TRIGGER_KEYS, normalizeKey(e))) {
                onClick(Slide);
                prevent(e);
            }
        }
        return {
            setup: apply(Components2.Media.set, {
                slideFocus: isUndefined(slideFocus) ? isNavigation : slideFocus
            }, true),
            mount,
            destroy,
            remount
        };
    }
    function Wheel(Splide2, Components2, options) {
        var _EventInterface12 = EventInterface(Splide2), bind = _EventInterface12.bind;
        var lastTime = 0;
        function mount() {
            if (options.wheel) bind(Components2.Elements.track, "wheel", onWheel, SCROLL_LISTENER_OPTIONS);
        }
        function onWheel(e) {
            if (e.cancelable) {
                var deltaY = e.deltaY;
                var backwards = deltaY < 0;
                var timeStamp = timeOf(e);
                var _min = options.wheelMinThreshold || 0;
                var sleep = options.wheelSleep || 0;
                if (abs(deltaY) > _min && timeStamp - lastTime > sleep) {
                    Splide2.go(backwards ? "<" : ">");
                    lastTime = timeStamp;
                }
                shouldPrevent(backwards) && prevent(e);
            }
        }
        function shouldPrevent(backwards) {
            return !options.releaseWheel || Splide2.state.is(MOVING) || Components2.Controller.getAdjacent(backwards) !== -1;
        }
        return {
            mount
        };
    }
    var SR_REMOVAL_DELAY = 90;
    function Live(Splide2, Components2, options) {
        var _EventInterface13 = EventInterface(Splide2), on = _EventInterface13.on;
        var track = Components2.Elements.track;
        var enabled = options.live && !options.isNavigation;
        var sr = create("span", CLASS_SR);
        var interval = RequestInterval(SR_REMOVAL_DELAY, apply(toggle, false));
        function mount() {
            if (enabled) {
                disable(!Components2.Autoplay.isPaused());
                setAttribute(track, ARIA_ATOMIC, true);
                sr.textContent = "…";
                on(EVENT_AUTOPLAY_PLAY, apply(disable, true));
                on(EVENT_AUTOPLAY_PAUSE, apply(disable, false));
                on([ EVENT_MOVED, EVENT_SCROLLED ], apply(toggle, true));
            }
        }
        function toggle(active) {
            setAttribute(track, ARIA_BUSY, active);
            if (active) {
                append(track, sr);
                interval.start();
            } else {
                remove(sr);
                interval.cancel();
            }
        }
        function destroy() {
            removeAttribute(track, [ ARIA_LIVE, ARIA_ATOMIC, ARIA_BUSY ]);
            remove(sr);
        }
        function disable(disabled) {
            if (enabled) setAttribute(track, ARIA_LIVE, disabled ? "off" : "polite");
        }
        return {
            mount,
            disable,
            destroy
        };
    }
    var ComponentConstructors = Object.freeze({
        __proto__: null,
        Media,
        Direction,
        Elements,
        Slides,
        Layout,
        Clones,
        Move,
        Controller,
        Arrows,
        Autoplay,
        Cover,
        Scroll,
        Drag,
        Keyboard,
        LazyLoad,
        Pagination,
        Sync,
        Wheel,
        Live
    });
    var I18N = {
        prev: "Previous slide",
        next: "Next slide",
        first: "Go to first slide",
        last: "Go to last slide",
        slideX: "Go to slide %s",
        pageX: "Go to page %s",
        play: "Start autoplay",
        pause: "Pause autoplay",
        carousel: "carousel",
        slide: "slide",
        select: "Select a slide to show",
        slideLabel: "%s of %s"
    };
    var DEFAULTS = {
        type: "slide",
        role: "region",
        speed: 400,
        perPage: 1,
        cloneStatus: true,
        arrows: true,
        pagination: true,
        paginationKeyboard: true,
        interval: 5e3,
        pauseOnHover: true,
        pauseOnFocus: true,
        resetProgress: true,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
        drag: true,
        direction: "ltr",
        trimSpace: true,
        focusableNodes: "a, button, textarea, input, select, iframe",
        live: true,
        classes: CLASSES,
        i18n: I18N,
        reducedMotion: {
            speed: 0,
            rewindSpeed: 0,
            autoplay: "pause"
        }
    };
    function Fade(Splide2, Components2, options) {
        var Slides = Components2.Slides;
        function mount() {
            EventInterface(Splide2).on([ EVENT_MOUNTED, EVENT_REFRESH ], init);
        }
        function init() {
            Slides.forEach((function(Slide) {
                Slide.style("transform", "translateX(-" + 100 * Slide.index + "%)");
            }));
        }
        function start(index, done) {
            Slides.style("transition", "opacity " + options.speed + "ms " + options.easing);
            nextTick(done);
        }
        return {
            mount,
            start,
            cancel: noop
        };
    }
    function Slide(Splide2, Components2, options) {
        var Move = Components2.Move, Controller = Components2.Controller, Scroll = Components2.Scroll;
        var list = Components2.Elements.list;
        var transition = apply(style, list, "transition");
        var endCallback;
        function mount() {
            EventInterface(Splide2).bind(list, "transitionend", (function(e) {
                if (e.target === list && endCallback) {
                    cancel();
                    endCallback();
                }
            }));
        }
        function start(index, done) {
            var destination = Move.toPosition(index, true);
            var position = Move.getPosition();
            var speed = getSpeed(index);
            if (abs(destination - position) >= 1 && speed >= 1) if (options.useScroll) Scroll.scroll(destination, speed, false, done); else {
                transition("transform " + speed + "ms " + options.easing);
                Move.translate(destination, true);
                endCallback = done;
            } else {
                Move.jump(index);
                done();
            }
        }
        function cancel() {
            transition("");
            Scroll.cancel();
        }
        function getSpeed(index) {
            var rewindSpeed = options.rewindSpeed;
            if (Splide2.is(SLIDE) && rewindSpeed) {
                var prev = Controller.getIndex(true);
                var end = Controller.getEnd();
                if (prev === 0 && index >= end || prev >= end && index === 0) return rewindSpeed;
            }
            return options.speed;
        }
        return {
            mount,
            start,
            cancel
        };
    }
    var _Splide = function() {
        function _Splide(target, options) {
            this.event = EventInterface();
            this.Components = {};
            this.state = State(CREATED);
            this.splides = [];
            this._o = {};
            this._E = {};
            var root = isString(target) ? query(document, target) : target;
            assert(root, root + " is invalid.");
            this.root = root;
            options = merge({
                label: getAttribute(root, ARIA_LABEL) || "",
                labelledby: getAttribute(root, ARIA_LABELLEDBY) || ""
            }, DEFAULTS, _Splide.defaults, options || {});
            try {
                merge(options, JSON.parse(getAttribute(root, DATA_ATTRIBUTE)));
            } catch (e) {
                assert(false, "Invalid JSON");
            }
            this._o = Object.create(merge({}, options));
        }
        var _proto = _Splide.prototype;
        _proto.mount = function mount(Extensions, Transition) {
            var _this = this;
            var state = this.state, Components2 = this.Components;
            assert(state.is([ CREATED, DESTROYED ]), "Already mounted!");
            state.set(CREATED);
            this._C = Components2;
            this._T = Transition || this._T || (this.is(FADE) ? Fade : Slide);
            this._E = Extensions || this._E;
            var Constructors = splide_esm_assign({}, ComponentConstructors, this._E, {
                Transition: this._T
            });
            forOwn(Constructors, (function(Component, key) {
                var component = Component(_this, Components2, _this._o);
                Components2[key] = component;
                component.setup && component.setup();
            }));
            forOwn(Components2, (function(component) {
                component.mount && component.mount();
            }));
            this.emit(EVENT_MOUNTED);
            addClass(this.root, CLASS_INITIALIZED);
            state.set(IDLE);
            this.emit(EVENT_READY);
            return this;
        };
        _proto.sync = function sync(splide) {
            this.splides.push({
                splide
            });
            splide.splides.push({
                splide: this,
                isParent: true
            });
            if (this.state.is(IDLE)) {
                this._C.Sync.remount();
                splide.Components.Sync.remount();
            }
            return this;
        };
        _proto.go = function go(control) {
            this._C.Controller.go(control);
            return this;
        };
        _proto.on = function on(events, callback) {
            this.event.on(events, callback);
            return this;
        };
        _proto.off = function off(events) {
            this.event.off(events);
            return this;
        };
        _proto.emit = function emit(event) {
            var _this$event;
            (_this$event = this.event).emit.apply(_this$event, [ event ].concat(slice(arguments, 1)));
            return this;
        };
        _proto.add = function add(slides, index) {
            this._C.Slides.add(slides, index);
            return this;
        };
        _proto.remove = function remove(matcher) {
            this._C.Slides.remove(matcher);
            return this;
        };
        _proto.is = function is(type) {
            return this._o.type === type;
        };
        _proto.refresh = function refresh() {
            this.emit(EVENT_REFRESH);
            return this;
        };
        _proto.destroy = function destroy(completely) {
            if (completely === void 0) completely = true;
            var event = this.event, state = this.state;
            if (state.is(CREATED)) EventInterface(this).on(EVENT_READY, this.destroy.bind(this, completely)); else {
                forOwn(this._C, (function(component) {
                    component.destroy && component.destroy(completely);
                }), true);
                event.emit(EVENT_DESTROY);
                event.destroy();
                completely && empty(this.splides);
                state.set(DESTROYED);
            }
            return this;
        };
        _createClass(_Splide, [ {
            key: "options",
            get: function get() {
                return this._o;
            },
            set: function set(options) {
                this._C.Media.set(options, true, true);
            }
        }, {
            key: "length",
            get: function get() {
                return this._C.Slides.getLength(true);
            }
        }, {
            key: "index",
            get: function get() {
                return this._C.Controller.getIndex();
            }
        } ]);
        return _Splide;
    }();
    var Splide = _Splide;
    Splide.defaults = {};
    Splide.STATES = STATES;
    var CLASS_RENDERED = "is-rendered";
    var RENDERER_DEFAULT_CONFIG = {
        listTag: "ul",
        slideTag: "li"
    };
    var Style = null && function() {
        function Style(id, options) {
            this.styles = {};
            this.id = id;
            this.options = options;
        }
        var _proto2 = Style.prototype;
        _proto2.rule = function rule(selector, prop, value, breakpoint) {
            breakpoint = breakpoint || "default";
            var selectors = this.styles[breakpoint] = this.styles[breakpoint] || {};
            var styles = selectors[selector] = selectors[selector] || {};
            styles[prop] = value;
        };
        _proto2.build = function build() {
            var _this2 = this;
            var css = "";
            if (this.styles.default) css += this.buildSelectors(this.styles.default);
            Object.keys(this.styles).sort((function(n, m) {
                return _this2.options.mediaQuery === "min" ? +n - +m : +m - +n;
            })).forEach((function(breakpoint) {
                if (breakpoint !== "default") {
                    css += "@media screen and (max-width: " + breakpoint + "px) {";
                    css += _this2.buildSelectors(_this2.styles[breakpoint]);
                    css += "}";
                }
            }));
            return css;
        };
        _proto2.buildSelectors = function buildSelectors(selectors) {
            var _this3 = this;
            var css = "";
            forOwn(selectors, (function(styles, selector) {
                selector = ("#" + _this3.id + " " + selector).trim();
                css += selector + " {";
                forOwn(styles, (function(value, prop) {
                    if (value || value === 0) css += prop + ": " + value + ";";
                }));
                css += "}";
            }));
            return css;
        };
        return Style;
    }();
    null && function() {
        function SplideRenderer(contents, options, config, defaults) {
            this.slides = [];
            this.options = {};
            this.breakpoints = [];
            merge(DEFAULTS, defaults || {});
            merge(merge(this.options, DEFAULTS), options || {});
            this.contents = contents;
            this.config = splide_esm_assign({}, RENDERER_DEFAULT_CONFIG, config || {});
            this.id = this.config.id || uniqueId("splide");
            this.Style = new Style(this.id, this.options);
            this.Direction = Direction(null, null, this.options);
            assert(this.contents.length, "Provide at least 1 content.");
            this.init();
        }
        SplideRenderer.clean = function clean(splide) {
            var _EventInterface14 = EventInterface(splide), on = _EventInterface14.on;
            var root = splide.root;
            var clones = queryAll(root, "." + CLASS_CLONE);
            on(EVENT_MOUNTED, (function() {
                remove(child(root, "style"));
            }));
            remove(clones);
        };
        var _proto3 = SplideRenderer.prototype;
        _proto3.init = function init() {
            this.parseBreakpoints();
            this.initSlides();
            this.registerRootStyles();
            this.registerTrackStyles();
            this.registerSlideStyles();
            this.registerListStyles();
        };
        _proto3.initSlides = function initSlides() {
            var _this4 = this;
            push(this.slides, this.contents.map((function(content, index) {
                content = isString(content) ? {
                    html: content
                } : content;
                content.styles = content.styles || {};
                content.attrs = content.attrs || {};
                _this4.cover(content);
                var classes = _this4.options.classes.slide + " " + (index === 0 ? CLASS_ACTIVE : "");
                splide_esm_assign(content.attrs, {
                    class: (classes + " " + (content.attrs.class || "")).trim(),
                    style: _this4.buildStyles(content.styles)
                });
                return content;
            })));
            if (this.isLoop()) this.generateClones(this.slides);
        };
        _proto3.registerRootStyles = function registerRootStyles() {
            var _this5 = this;
            this.breakpoints.forEach((function(_ref2) {
                var width = _ref2[0], options = _ref2[1];
                _this5.Style.rule(" ", "max-width", unit(options.width), width);
            }));
        };
        _proto3.registerTrackStyles = function registerTrackStyles() {
            var _this6 = this;
            var Style2 = this.Style;
            var selector = "." + CLASS_TRACK;
            this.breakpoints.forEach((function(_ref3) {
                var width = _ref3[0], options = _ref3[1];
                Style2.rule(selector, _this6.resolve("paddingLeft"), _this6.cssPadding(options, false), width);
                Style2.rule(selector, _this6.resolve("paddingRight"), _this6.cssPadding(options, true), width);
                Style2.rule(selector, "height", _this6.cssTrackHeight(options), width);
            }));
        };
        _proto3.registerListStyles = function registerListStyles() {
            var _this7 = this;
            var Style2 = this.Style;
            var selector = "." + CLASS_LIST;
            this.breakpoints.forEach((function(_ref4) {
                var width = _ref4[0], options = _ref4[1];
                Style2.rule(selector, "transform", _this7.buildTranslate(options), width);
                if (!_this7.cssSlideHeight(options)) Style2.rule(selector, "aspect-ratio", _this7.cssAspectRatio(options), width);
            }));
        };
        _proto3.registerSlideStyles = function registerSlideStyles() {
            var _this8 = this;
            var Style2 = this.Style;
            var selector = "." + CLASS_SLIDE;
            this.breakpoints.forEach((function(_ref5) {
                var width = _ref5[0], options = _ref5[1];
                Style2.rule(selector, "width", _this8.cssSlideWidth(options), width);
                Style2.rule(selector, "height", _this8.cssSlideHeight(options) || "100%", width);
                Style2.rule(selector, _this8.resolve("marginRight"), unit(options.gap) || "0px", width);
                Style2.rule(selector + " > img", "display", options.cover ? "none" : "inline", width);
            }));
        };
        _proto3.buildTranslate = function buildTranslate(options) {
            var _this$Direction = this.Direction, resolve = _this$Direction.resolve, orient = _this$Direction.orient;
            var values = [];
            values.push(this.cssOffsetClones(options));
            values.push(this.cssOffsetGaps(options));
            if (this.isCenter(options)) {
                values.push(this.buildCssValue(orient(-50), "%"));
                values.push.apply(values, this.cssOffsetCenter(options));
            }
            return values.filter(Boolean).map((function(value) {
                return "translate" + resolve("X") + "(" + value + ")";
            })).join(" ");
        };
        _proto3.cssOffsetClones = function cssOffsetClones(options) {
            var _this$Direction2 = this.Direction, resolve = _this$Direction2.resolve, orient = _this$Direction2.orient;
            var cloneCount = this.getCloneCount();
            if (this.isFixedWidth(options)) {
                var _this$parseCssValue = this.parseCssValue(options[resolve("fixedWidth")]), value = _this$parseCssValue.value, unit2 = _this$parseCssValue.unit;
                return this.buildCssValue(orient(value) * cloneCount, unit2);
            }
            var percent = 100 * cloneCount / options.perPage;
            return orient(percent) + "%";
        };
        _proto3.cssOffsetCenter = function cssOffsetCenter(options) {
            var _this$Direction3 = this.Direction, resolve = _this$Direction3.resolve, orient = _this$Direction3.orient;
            if (this.isFixedWidth(options)) {
                var _this$parseCssValue2 = this.parseCssValue(options[resolve("fixedWidth")]), value = _this$parseCssValue2.value, unit2 = _this$parseCssValue2.unit;
                return [ this.buildCssValue(orient(value / 2), unit2) ];
            }
            var values = [];
            var perPage = options.perPage, gap = options.gap;
            values.push(orient(50 / perPage) + "%");
            if (gap) {
                var _this$parseCssValue3 = this.parseCssValue(gap), _value = _this$parseCssValue3.value, _unit = _this$parseCssValue3.unit;
                var gapOffset = (_value / perPage - _value) / 2;
                values.push(this.buildCssValue(orient(gapOffset), _unit));
            }
            return values;
        };
        _proto3.cssOffsetGaps = function cssOffsetGaps(options) {
            var cloneCount = this.getCloneCount();
            if (cloneCount && options.gap) {
                var orient = this.Direction.orient;
                var _this$parseCssValue4 = this.parseCssValue(options.gap), value = _this$parseCssValue4.value, unit2 = _this$parseCssValue4.unit;
                if (this.isFixedWidth(options)) return this.buildCssValue(orient(value * cloneCount), unit2);
                var perPage = options.perPage;
                var gaps = cloneCount / perPage;
                return this.buildCssValue(orient(gaps * value), unit2);
            }
            return "";
        };
        _proto3.resolve = function resolve(prop) {
            return camelToKebab(this.Direction.resolve(prop));
        };
        _proto3.cssPadding = function cssPadding(options, right) {
            var padding = options.padding;
            var prop = this.Direction.resolve(right ? "right" : "left", true);
            return padding && unit(padding[prop] || (isObject(padding) ? 0 : padding)) || "0px";
        };
        _proto3.cssTrackHeight = function cssTrackHeight(options) {
            var height = "";
            if (this.isVertical()) {
                height = this.cssHeight(options);
                assert(height, '"height" is missing.');
                height = "calc(" + height + " - " + this.cssPadding(options, false) + " - " + this.cssPadding(options, true) + ")";
            }
            return height;
        };
        _proto3.cssHeight = function cssHeight(options) {
            return unit(options.height);
        };
        _proto3.cssSlideWidth = function cssSlideWidth(options) {
            return options.autoWidth ? "" : unit(options.fixedWidth) || (this.isVertical() ? "" : this.cssSlideSize(options));
        };
        _proto3.cssSlideHeight = function cssSlideHeight(options) {
            return unit(options.fixedHeight) || (this.isVertical() ? options.autoHeight ? "" : this.cssSlideSize(options) : this.cssHeight(options));
        };
        _proto3.cssSlideSize = function cssSlideSize(options) {
            var gap = unit(options.gap);
            return "calc((100%" + (gap && " + " + gap) + ")/" + (options.perPage || 1) + (gap && " - " + gap) + ")";
        };
        _proto3.cssAspectRatio = function cssAspectRatio(options) {
            var heightRatio = options.heightRatio;
            return heightRatio ? "" + 1 / heightRatio : "";
        };
        _proto3.buildCssValue = function buildCssValue(value, unit2) {
            return "" + value + unit2;
        };
        _proto3.parseCssValue = function parseCssValue(value) {
            if (isString(value)) {
                var number = parseFloat(value) || 0;
                var unit2 = value.replace(/\d*(\.\d*)?/, "") || "px";
                return {
                    value: number,
                    unit: unit2
                };
            }
            return {
                value,
                unit: "px"
            };
        };
        _proto3.parseBreakpoints = function parseBreakpoints() {
            var _this9 = this;
            var breakpoints = this.options.breakpoints;
            this.breakpoints.push([ "default", this.options ]);
            if (breakpoints) forOwn(breakpoints, (function(options, width) {
                _this9.breakpoints.push([ width, merge(merge({}, _this9.options), options) ]);
            }));
        };
        _proto3.isFixedWidth = function isFixedWidth(options) {
            return !!options[this.Direction.resolve("fixedWidth")];
        };
        _proto3.isLoop = function isLoop() {
            return this.options.type === LOOP;
        };
        _proto3.isCenter = function isCenter(options) {
            if (options.focus === "center") {
                if (this.isLoop()) return true;
                if (this.options.type === SLIDE) return !this.options.trimSpace;
            }
            return false;
        };
        _proto3.isVertical = function isVertical() {
            return this.options.direction === TTB;
        };
        _proto3.buildClasses = function buildClasses() {
            var options = this.options;
            return [ CLASS_ROOT, CLASS_ROOT + "--" + options.type, CLASS_ROOT + "--" + options.direction, options.drag && CLASS_ROOT + "--draggable", options.isNavigation && CLASS_ROOT + "--nav", CLASS_ACTIVE, !this.config.hidden && CLASS_RENDERED ].filter(Boolean).join(" ");
        };
        _proto3.buildAttrs = function buildAttrs(attrs) {
            var attr = "";
            forOwn(attrs, (function(value, key) {
                attr += value ? " " + camelToKebab(key) + '="' + value + '"' : "";
            }));
            return attr.trim();
        };
        _proto3.buildStyles = function buildStyles(styles) {
            var style = "";
            forOwn(styles, (function(value, key) {
                style += " " + camelToKebab(key) + ":" + value + ";";
            }));
            return style.trim();
        };
        _proto3.renderSlides = function renderSlides() {
            var _this10 = this;
            var tag = this.config.slideTag;
            return this.slides.map((function(content) {
                return "<" + tag + " " + _this10.buildAttrs(content.attrs) + ">" + (content.html || "") + "</" + tag + ">";
            })).join("");
        };
        _proto3.cover = function cover(content) {
            var styles = content.styles, _content$html = content.html, html = _content$html === void 0 ? "" : _content$html;
            if (this.options.cover && !this.options.lazyLoad) {
                var src = html.match(/<img.*?src\s*=\s*(['"])(.+?)\1.*?>/);
                if (src && src[2]) styles.background = "center/cover no-repeat url('" + src[2] + "')";
            }
        };
        _proto3.generateClones = function generateClones(contents) {
            var classes = this.options.classes;
            var count = this.getCloneCount();
            var slides = contents.slice();
            while (slides.length < count) push(slides, slides);
            push(slides.slice(-count).reverse(), slides.slice(0, count)).forEach((function(content, index) {
                var attrs = splide_esm_assign({}, content.attrs, {
                    class: content.attrs.class + " " + classes.clone
                });
                var clone = splide_esm_assign({}, content, {
                    attrs
                });
                index < count ? contents.unshift(clone) : contents.push(clone);
            }));
        };
        _proto3.getCloneCount = function getCloneCount() {
            if (this.isLoop()) {
                var options = this.options;
                if (options.clones) return options.clones;
                var perPage = max.apply(void 0, this.breakpoints.map((function(_ref6) {
                    var options2 = _ref6[1];
                    return options2.perPage;
                })));
                return perPage * ((options.flickMaxPages || 1) + 1);
            }
            return 0;
        };
        _proto3.renderArrows = function renderArrows() {
            var html = "";
            html += '<div class="' + this.options.classes.arrows + '">';
            html += this.renderArrow(true);
            html += this.renderArrow(false);
            html += "</div>";
            return html;
        };
        _proto3.renderArrow = function renderArrow(prev) {
            var _this$options = this.options, classes = _this$options.classes, i18n = _this$options.i18n;
            var attrs = {
                class: classes.arrow + " " + (prev ? classes.prev : classes.next),
                type: "button",
                ariaLabel: prev ? i18n.prev : i18n.next
            };
            return "<button " + this.buildAttrs(attrs) + '><svg xmlns="' + XML_NAME_SPACE + '" viewBox="0 0 ' + SIZE + " " + SIZE + '" width="' + SIZE + '" height="' + SIZE + '"><path d="' + (this.options.arrowPath || PATH) + '" /></svg></button>';
        };
        _proto3.html = function html() {
            var _this$config = this.config, rootClass = _this$config.rootClass, listTag = _this$config.listTag, arrows = _this$config.arrows, beforeTrack = _this$config.beforeTrack, afterTrack = _this$config.afterTrack, slider = _this$config.slider, beforeSlider = _this$config.beforeSlider, afterSlider = _this$config.afterSlider;
            var html = "";
            html += '<div id="' + this.id + '" class="' + this.buildClasses() + " " + (rootClass || "") + '">';
            html += "<style>" + this.Style.build() + "</style>";
            if (slider) {
                html += beforeSlider || "";
                html += '<div class="splide__slider">';
            }
            html += beforeTrack || "";
            if (arrows) html += this.renderArrows();
            html += '<div class="splide__track">';
            html += "<" + listTag + ' class="splide__list">';
            html += this.renderSlides();
            html += "</" + listTag + ">";
            html += "</div>";
            html += afterTrack || "";
            if (slider) {
                html += "</div>";
                html += afterSlider || "";
            }
            html += "</div>";
            return html;
        };
    }();
    /*!
 * @splidejs/splide-extension-grid
 * Version  : 0.4.1
 * License  : MIT
 * Copyright: 2022 Naotoshi Fujita
 */
    function empty$1(array) {
        array.length = 0;
    }
    function slice$1(arrayLike, start, end) {
        return Array.prototype.slice.call(arrayLike, start, end);
    }
    function apply$1(func) {
        return func.bind.apply(func, [ null ].concat(slice$1(arguments, 1)));
    }
    function typeOf$1(type, subject) {
        return typeof subject === type;
    }
    var isArray$1 = Array.isArray;
    apply$1(typeOf$1, "function");
    apply$1(typeOf$1, "string");
    apply$1(typeOf$1, "undefined");
    function toArray$1(value) {
        return isArray$1(value) ? value : [ value ];
    }
    function forEach$1(values, iteratee) {
        toArray$1(values).forEach(iteratee);
    }
    var ownKeys$1 = Object.keys;
    function forOwn$1(object, iteratee, right) {
        if (object) {
            var keys = ownKeys$1(object);
            keys = right ? keys.reverse() : keys;
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (key !== "__proto__") if (iteratee(object[key], key) === false) break;
            }
        }
        return object;
    }
    function assign$1(object) {
        slice$1(arguments, 1).forEach((function(source) {
            forOwn$1(source, (function(value, key) {
                object[key] = source[key];
            }));
        }));
        return object;
    }
    var PROJECT_CODE$1 = "splide";
    function splide_extension_grid_esm_EventBinder() {
        var listeners = [];
        function bind(targets, events, callback, options) {
            forEachEvent(targets, events, (function(target, event, namespace) {
                var isEventTarget = "addEventListener" in target;
                var remover = isEventTarget ? target.removeEventListener.bind(target, event, callback, options) : target["removeListener"].bind(target, callback);
                isEventTarget ? target.addEventListener(event, callback, options) : target["addListener"](callback);
                listeners.push([ target, event, namespace, callback, remover ]);
            }));
        }
        function unbind(targets, events, callback) {
            forEachEvent(targets, events, (function(target, event, namespace) {
                listeners = listeners.filter((function(listener) {
                    if (listener[0] === target && listener[1] === event && listener[2] === namespace && (!callback || listener[3] === callback)) {
                        listener[4]();
                        return false;
                    }
                    return true;
                }));
            }));
        }
        function dispatch(target, type, detail) {
            var e;
            var bubbles = true;
            if (typeof CustomEvent === "function") e = new CustomEvent(type, {
                bubbles,
                detail
            }); else {
                e = document.createEvent("CustomEvent");
                e.initCustomEvent(type, bubbles, false, detail);
            }
            target.dispatchEvent(e);
            return e;
        }
        function forEachEvent(targets, events, iteratee) {
            forEach$1(targets, (function(target) {
                target && forEach$1(events, (function(events2) {
                    events2.split(" ").forEach((function(eventNS) {
                        var fragment = eventNS.split(".");
                        iteratee(target, fragment[0], fragment[1]);
                    }));
                }));
            }));
        }
        function destroy() {
            listeners.forEach((function(data) {
                data[4]();
            }));
            empty$1(listeners);
        }
        return {
            bind,
            unbind,
            dispatch,
            destroy
        };
    }
    var splide_extension_grid_esm_EVENT_VISIBLE = "visible";
    var splide_extension_grid_esm_EVENT_HIDDEN = "hidden";
    var splide_extension_grid_esm_EVENT_REFRESH = "refresh";
    var splide_extension_grid_esm_EVENT_UPDATED = "updated";
    var splide_extension_grid_esm_EVENT_DESTROY = "destroy";
    function splide_extension_grid_esm_EventInterface(Splide2) {
        var bus = Splide2 ? Splide2.event.bus : document.createDocumentFragment();
        var binder = splide_extension_grid_esm_EventBinder();
        function on(events, callback) {
            binder.bind(bus, toArray$1(events).join(" "), (function(e) {
                callback.apply(callback, isArray$1(e.detail) ? e.detail : []);
            }));
        }
        function emit(event) {
            binder.dispatch(bus, event, slice$1(arguments, 1));
        }
        if (Splide2) Splide2.event.on(splide_extension_grid_esm_EVENT_DESTROY, binder.destroy);
        return assign$1(binder, {
            bus,
            on,
            off: apply$1(binder.unbind, bus),
            emit
        });
    }
    var splide_extension_grid_esm_CLASS_ROOT = PROJECT_CODE$1;
    var splide_extension_grid_esm_CLASS_SLIDE = PROJECT_CODE$1 + "__slide";
    var splide_extension_grid_esm_CLASS_CONTAINER = splide_extension_grid_esm_CLASS_SLIDE + "__container";
    function splide_extension_grid_esm_empty(array) {
        array.length = 0;
    }
    function splide_extension_grid_esm_slice(arrayLike, start, end) {
        return Array.prototype.slice.call(arrayLike, start, end);
    }
    function splide_extension_grid_esm_apply(func) {
        return func.bind(null, ...splide_extension_grid_esm_slice(arguments, 1));
    }
    function splide_extension_grid_esm_typeOf(type, subject) {
        return typeof subject === type;
    }
    function splide_extension_grid_esm_isObject(subject) {
        return !splide_extension_grid_esm_isNull(subject) && splide_extension_grid_esm_typeOf("object", subject);
    }
    const splide_extension_grid_esm_isArray = Array.isArray;
    splide_extension_grid_esm_apply(splide_extension_grid_esm_typeOf, "function");
    const splide_extension_grid_esm_isString = splide_extension_grid_esm_apply(splide_extension_grid_esm_typeOf, "string");
    const splide_extension_grid_esm_isUndefined = splide_extension_grid_esm_apply(splide_extension_grid_esm_typeOf, "undefined");
    function splide_extension_grid_esm_isNull(subject) {
        return subject === null;
    }
    function splide_extension_grid_esm_isHTMLElement(subject) {
        return subject instanceof HTMLElement;
    }
    function splide_extension_grid_esm_toArray(value) {
        return splide_extension_grid_esm_isArray(value) ? value : [ value ];
    }
    function splide_extension_grid_esm_forEach(values, iteratee) {
        splide_extension_grid_esm_toArray(values).forEach(iteratee);
    }
    function splide_extension_grid_esm_push(array, items) {
        array.push(...splide_extension_grid_esm_toArray(items));
        return array;
    }
    function splide_extension_grid_esm_toggleClass(elm, classes, add) {
        if (elm) splide_extension_grid_esm_forEach(classes, (name => {
            if (name) elm.classList[add ? "add" : "remove"](name);
        }));
    }
    function splide_extension_grid_esm_addClass(elm, classes) {
        splide_extension_grid_esm_toggleClass(elm, splide_extension_grid_esm_isString(classes) ? classes.split(" ") : classes, true);
    }
    function splide_extension_grid_esm_append(parent, children) {
        splide_extension_grid_esm_forEach(children, parent.appendChild.bind(parent));
    }
    function splide_extension_grid_esm_matches(elm, selector) {
        return splide_extension_grid_esm_isHTMLElement(elm) && (elm["msMatchesSelector"] || elm.matches).call(elm, selector);
    }
    function splide_extension_grid_esm_children(parent, selector) {
        const children2 = parent ? splide_extension_grid_esm_slice(parent.children) : [];
        return selector ? children2.filter((child => splide_extension_grid_esm_matches(child, selector))) : children2;
    }
    function splide_extension_grid_esm_child(parent, selector) {
        return selector ? splide_extension_grid_esm_children(parent, selector)[0] : parent.firstElementChild;
    }
    const splide_extension_grid_esm_ownKeys = Object.keys;
    function splide_extension_grid_esm_forOwn(object, iteratee, right) {
        if (object) {
            let keys = splide_extension_grid_esm_ownKeys(object);
            keys = right ? keys.reverse() : keys;
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (key !== "__proto__") if (iteratee(object[key], key) === false) break;
            }
        }
        return object;
    }
    function splide_extension_grid_esm_assign(object) {
        splide_extension_grid_esm_slice(arguments, 1).forEach((source => {
            splide_extension_grid_esm_forOwn(source, ((value, key) => {
                object[key] = source[key];
            }));
        }));
        return object;
    }
    function splide_extension_grid_esm_omit(object, keys) {
        splide_extension_grid_esm_toArray(keys || splide_extension_grid_esm_ownKeys(object)).forEach((key => {
            delete object[key];
        }));
    }
    function splide_extension_grid_esm_removeAttribute(elms, attrs) {
        splide_extension_grid_esm_forEach(elms, (elm => {
            splide_extension_grid_esm_forEach(attrs, (attr => {
                elm && elm.removeAttribute(attr);
            }));
        }));
    }
    function splide_extension_grid_esm_setAttribute(elms, attrs, value) {
        if (splide_extension_grid_esm_isObject(attrs)) splide_extension_grid_esm_forOwn(attrs, ((value2, name) => {
            splide_extension_grid_esm_setAttribute(elms, name, value2);
        })); else splide_extension_grid_esm_forEach(elms, (elm => {
            splide_extension_grid_esm_isNull(value) || value === "" ? splide_extension_grid_esm_removeAttribute(elm, attrs) : elm.setAttribute(attrs, String(value));
        }));
    }
    function splide_extension_grid_esm_create(tag, attrs, parent) {
        const elm = document.createElement(tag);
        if (attrs) splide_extension_grid_esm_isString(attrs) ? splide_extension_grid_esm_addClass(elm, attrs) : splide_extension_grid_esm_setAttribute(elm, attrs);
        parent && splide_extension_grid_esm_append(parent, elm);
        return elm;
    }
    function splide_extension_grid_esm_style(elm, prop, value) {
        if (splide_extension_grid_esm_isUndefined(value)) return getComputedStyle(elm)[prop];
        if (!splide_extension_grid_esm_isNull(value)) elm.style[prop] = `${value}`;
    }
    function splide_extension_grid_esm_hasClass(elm, className) {
        return elm && elm.classList.contains(className);
    }
    function splide_extension_grid_esm_remove(nodes) {
        splide_extension_grid_esm_forEach(nodes, (node => {
            if (node && node.parentNode) node.parentNode.removeChild(node);
        }));
    }
    function splide_extension_grid_esm_queryAll(parent, selector) {
        return selector ? splide_extension_grid_esm_slice(parent.querySelectorAll(selector)) : [];
    }
    function splide_extension_grid_esm_removeClass(elm, classes) {
        splide_extension_grid_esm_toggleClass(elm, classes, false);
    }
    function splide_extension_grid_esm_unit(value) {
        return splide_extension_grid_esm_isString(value) ? value : value ? `${value}px` : "";
    }
    const splide_extension_grid_esm_PROJECT_CODE = "splide";
    function splide_extension_grid_esm_assert(condition, message) {
        if (!condition) throw new Error(`[${splide_extension_grid_esm_PROJECT_CODE}] ${message || ""}`);
    }
    const {min: splide_extension_grid_esm_min, max: splide_extension_grid_esm_max, floor: splide_extension_grid_esm_floor, ceil: splide_extension_grid_esm_ceil, abs: splide_extension_grid_esm_abs} = Math;
    function splide_extension_grid_esm_pad(number) {
        return number < 10 ? `0${number}` : `${number}`;
    }
    const CLASS_SLIDE_ROW = `${splide_extension_grid_esm_CLASS_SLIDE}__row`;
    const CLASS_SLIDE_COL = `${splide_extension_grid_esm_CLASS_SLIDE}--col`;
    const splide_extension_grid_esm_DEFAULTS = {
        rows: 1,
        cols: 1,
        dimensions: [],
        gap: {}
    };
    function Dimension(options) {
        function normalize() {
            const {rows, cols, dimensions} = options;
            return splide_extension_grid_esm_isArray(dimensions) && dimensions.length ? dimensions : [ [ rows, cols ] ];
        }
        function get(index) {
            const dimensions = normalize();
            return dimensions[splide_extension_grid_esm_min(index, dimensions.length - 1)];
        }
        function getAt(index) {
            const dimensions = normalize();
            let rows, cols, aggregator = 0;
            for (let i = 0; i < dimensions.length; i++) {
                const dimension = dimensions[i];
                rows = dimension[0] || 1;
                cols = dimension[1] || 1;
                aggregator += rows * cols;
                if (index < aggregator) break;
            }
            splide_extension_grid_esm_assert(rows && cols, "Invalid dimension");
            return [ rows, cols ];
        }
        return {
            get,
            getAt
        };
    }
    function splide_extension_grid_esm_Layout(Splide2, gridOptions, Dimension) {
        const {on, destroy: destroyEvent} = splide_extension_grid_esm_EventInterface(Splide2);
        const {Components, options} = Splide2;
        const {resolve} = Components.Direction;
        const {forEach} = Components.Slides;
        function mount() {
            layout();
            if (options.slideFocus) {
                on(splide_extension_grid_esm_EVENT_VISIBLE, onVisible);
                on(splide_extension_grid_esm_EVENT_HIDDEN, onHidden);
            }
        }
        function destroy() {
            forEach((Slide => {
                const {slide} = Slide;
                toggleTabIndex(slide, false);
                getRowsIn(slide).forEach((cell => {
                    splide_extension_grid_esm_removeAttribute(cell, "style");
                }));
                getColsIn(slide).forEach((colSlide => {
                    cover(colSlide, true);
                    splide_extension_grid_esm_removeAttribute(colSlide, "style");
                }));
            }));
            destroyEvent();
        }
        function layout() {
            forEach((Slide => {
                const {slide} = Slide;
                const [rows, cols] = Dimension.get(Slide.isClone ? Slide.slideIndex : Slide.index);
                layoutRow(rows, slide);
                layoutCol(cols, slide);
                getColsIn(Slide.slide).forEach(((colSlide, index) => {
                    colSlide.id = `${Slide.slide.id}-col${splide_extension_grid_esm_pad(index + 1)}`;
                    if (Splide2.options.cover) cover(colSlide);
                }));
            }));
        }
        function layoutRow(rows, slide) {
            const {row: rowGap} = gridOptions.gap;
            const height = `calc(${100 / rows}%${rowGap ? ` - ${splide_extension_grid_esm_unit(rowGap)} * ${(rows - 1) / rows}` : ""})`;
            getRowsIn(slide).forEach(((rowElm, index, rowElms) => {
                splide_extension_grid_esm_style(rowElm, "height", height);
                splide_extension_grid_esm_style(rowElm, "display", "flex");
                splide_extension_grid_esm_style(rowElm, "margin", `0 0 ${splide_extension_grid_esm_unit(rowGap)} 0`);
                splide_extension_grid_esm_style(rowElm, "padding", 0);
                if (index === rowElms.length - 1) splide_extension_grid_esm_style(rowElm, "marginBottom", 0);
            }));
        }
        function layoutCol(cols, slide) {
            const {col: colGap} = gridOptions.gap;
            const width = `calc(${100 / cols}%${colGap ? ` - ${splide_extension_grid_esm_unit(colGap)} * ${(cols - 1) / cols}` : ""})`;
            getColsIn(slide).forEach(((colElm, index, colElms) => {
                splide_extension_grid_esm_style(colElm, "width", width);
                if (index !== colElms.length - 1) splide_extension_grid_esm_style(colElm, resolve("marginRight"), splide_extension_grid_esm_unit(colGap));
            }));
        }
        function cover(colSlide, uncover) {
            const container = splide_extension_grid_esm_child(colSlide, `.${splide_extension_grid_esm_CLASS_CONTAINER}`);
            const img = splide_extension_grid_esm_child(container || colSlide, "img");
            if (img && img.src) {
                splide_extension_grid_esm_style(container || colSlide, "background", uncover ? "" : `center/cover no-repeat url("${img.src}")`);
                splide_extension_grid_esm_style(img, "display", uncover ? "" : "none");
            }
        }
        function getRowsIn(slide) {
            return splide_extension_grid_esm_queryAll(slide, `.${CLASS_SLIDE_ROW}`);
        }
        function getColsIn(slide) {
            return splide_extension_grid_esm_queryAll(slide, `.${CLASS_SLIDE_COL}`);
        }
        function toggleTabIndex(slide, add) {
            getColsIn(slide).forEach((colSlide => {
                splide_extension_grid_esm_setAttribute(colSlide, "tabindex", add ? 0 : null);
            }));
        }
        function onVisible(Slide) {
            toggleTabIndex(Slide.slide, true);
        }
        function onHidden(Slide) {
            toggleTabIndex(Slide.slide, false);
        }
        return {
            mount,
            destroy
        };
    }
    function Grid(Splide2, Components2, options) {
        const {on, off} = splide_extension_grid_esm_EventInterface(Splide2);
        const {Elements} = Components2;
        const gridOptions = {};
        const Dimension$1 = Dimension(gridOptions);
        const Layout$1 = splide_extension_grid_esm_Layout(Splide2, gridOptions, Dimension$1);
        const modifier = `${splide_extension_grid_esm_CLASS_ROOT}--grid`;
        const originalSlides = [];
        function mount() {
            init();
            on(splide_extension_grid_esm_EVENT_UPDATED, init);
        }
        function init() {
            splide_extension_grid_esm_omit(gridOptions);
            splide_extension_grid_esm_assign(gridOptions, splide_extension_grid_esm_DEFAULTS, options.grid || {});
            if (shouldBuild()) {
                destroy();
                splide_extension_grid_esm_push(originalSlides, Elements.slides);
                splide_extension_grid_esm_addClass(Splide2.root, modifier);
                splide_extension_grid_esm_append(Elements.list, build());
                off(splide_extension_grid_esm_EVENT_REFRESH);
                on(splide_extension_grid_esm_EVENT_REFRESH, layout);
                refresh();
            } else if (isActive()) {
                destroy();
                refresh();
            }
        }
        function destroy() {
            if (isActive()) {
                const {slides} = Elements;
                Layout$1.destroy();
                originalSlides.forEach((slide => {
                    splide_extension_grid_esm_removeClass(slide, CLASS_SLIDE_COL);
                    splide_extension_grid_esm_append(Elements.list, slide);
                }));
                splide_extension_grid_esm_remove(slides);
                splide_extension_grid_esm_removeClass(Splide2.root, modifier);
                splide_extension_grid_esm_empty(slides);
                splide_extension_grid_esm_push(slides, originalSlides);
                splide_extension_grid_esm_empty(originalSlides);
                off(splide_extension_grid_esm_EVENT_REFRESH);
            }
        }
        function refresh() {
            Splide2.refresh();
        }
        function layout() {
            if (isActive()) Layout$1.mount();
        }
        function build() {
            const outerSlides = [];
            let row = 0, col = 0;
            let outerSlide, rowSlide;
            originalSlides.forEach(((slide, index) => {
                const [rows, cols] = Dimension$1.getAt(index);
                if (!col) {
                    if (!row) {
                        outerSlide = splide_extension_grid_esm_create(slide.tagName, splide_extension_grid_esm_CLASS_SLIDE);
                        outerSlides.push(outerSlide);
                    }
                    rowSlide = buildRow(rows, slide, outerSlide);
                }
                buildCol(cols, slide, rowSlide);
                if (++col >= cols) {
                    col = 0;
                    row = ++row >= rows ? 0 : row;
                }
            }));
            return outerSlides;
        }
        function buildRow(rows, slide, outerSlide) {
            const tag = slide.tagName.toLowerCase() === "li" ? "ul" : "div";
            return splide_extension_grid_esm_create(tag, CLASS_SLIDE_ROW, outerSlide);
        }
        function buildCol(cols, slide, rowSlide) {
            splide_extension_grid_esm_addClass(slide, CLASS_SLIDE_COL);
            splide_extension_grid_esm_append(rowSlide, slide);
            return slide;
        }
        function shouldBuild() {
            if (options.grid) {
                const {rows, cols, dimensions} = gridOptions;
                return rows > 1 || cols > 1 || splide_extension_grid_esm_isArray(dimensions) && dimensions.length > 0;
            }
            return false;
        }
        function isActive() {
            return splide_extension_grid_esm_hasClass(Splide2.root, modifier);
        }
        return {
            mount,
            destroy
        };
    }
    class VideoBox {
        constructor(container) {
            this.container = container;
            this.video = container.querySelector(".video-box__video");
            this.button = container.querySelector(".video-box__play");
            this.video.addEventListener("ended", (() => this.showButton()));
        }
        play() {
            this.video.play();
            this.button.classList.add("_hide");
        }
        pause() {
            if (this.video.tagName !== "IFRAME") this.video.pause();
            if (this.button) this.button.classList.remove("_hide");
        }
        toggle() {
            if (!this.video.classList.contains("_disabled")) if (this.video.paused) this.play(); else this.pause();
        }
        showButton() {
            this.button.classList.remove("_hide");
        }
    }
    document.addEventListener("DOMContentLoaded", (function() {
        var heroSliderEls = document.querySelectorAll(".hero-home__slider");
        heroSliderEls.forEach((function(sliderEl) {
            var slider = new Splide(sliderEl, {
                type: "fade",
                perPage: 1,
                arrows: true,
                pagination: true,
                autoplay: true,
                interval: 3e3,
                rewind: true,
                classes: {
                    arrow: "splide__arrow _icon-ch-round-right"
                },
                breakpoints: {
                    991.98: {
                        arrows: false
                    }
                }
            });
            slider.mount();
        }));
        var productsSectionSliderEls = document.querySelectorAll(".products-section__slider");
        productsSectionSliderEls.forEach((function(sliderEl) {
            var slider = new Splide(sliderEl, {
                perPage: 5,
                arrows: true,
                pagination: false,
                perMove: 1,
                gap: 20,
                updateOnMove: true,
                classes: {
                    arrow: "splide__arrow splide__arrow--black _icon-arrow-right"
                },
                breakpoints: {
                    1599.98: {
                        perPage: 4
                    },
                    1279.98: {
                        perPage: 3
                    },
                    959.98: {
                        perPage: 2
                    },
                    539.98: {
                        destroy: true
                    }
                }
            });
            slider.mount();
        }));
        var shareSliderEls = document.querySelectorAll(".share-cakes__slider");
        shareSliderEls.forEach((function(sliderEl) {
            var slider = new Splide(sliderEl, {
                perPage: 5,
                arrows: true,
                pagination: false,
                perMove: 1,
                gap: "1.25rem",
                updateOnMove: true,
                classes: {
                    arrow: "splide__arrow splide__arrow--black _icon-arrow-right"
                },
                breakpoints: {
                    1279.98: {
                        perPage: 4
                    },
                    959.98: {
                        perPage: 3
                    },
                    639.98: {
                        perPage: 2
                    },
                    399.98: {
                        pagination: true,
                        arrows: false,
                        perPage: 1,
                        grid: {
                            rows: 2,
                            cols: 1,
                            gap: {
                                row: "1.25rem",
                                col: "1.25rem"
                            }
                        }
                    }
                }
            });
            slider.mount({
                Grid
            });
        }));
        var reviewsProductEls = document.querySelectorAll(".reviews-product__slider");
        reviewsProductEls.forEach((function(sliderEl) {
            var slider = new Splide(sliderEl, {
                perPage: 5,
                arrows: true,
                pagination: false,
                perMove: 1,
                gap: 60,
                updateOnMove: true,
                classes: {
                    arrow: "splide__arrow splide__arrow--black _icon-arrow-right"
                },
                breakpoints: {
                    1599.98: {
                        perPage: 4
                    },
                    1279.98: {
                        perPage: 3
                    },
                    959.98: {
                        perPage: 2,
                        gap: 20,
                        arrows: false,
                        pagination: true
                    },
                    539.98: {
                        perPage: 1
                    }
                }
            });
            slider.mount();
        }));
        var imageSliderEls = document.querySelectorAll(".splide--image");
        if (imageSliderEls) imageSliderEls.forEach((imageSliderEl => {
            var slider = new Splide(imageSliderEl, {
                type: "fade",
                perPage: 1,
                arrows: true,
                pagination: true,
                autoplay: true,
                interval: 3e3,
                rewind: true,
                classes: {
                    arrow: "splide__arrow _icon-ch-round-right"
                },
                breakpoints: {
                    499.98: {
                        arrows: false
                    }
                }
            });
            slider.mount();
        }));
        const creatorsSliders = document.querySelectorAll(".collection-home__slider");
        creatorsSliders.forEach(((slider, index) => {
            const parent = slider.closest("[data-slider-parent]");
            let prevArrow = null;
            let nextArrow = null;
            if (parent) {
                prevArrow = parent.querySelector(".splide__arrow--prev");
                nextArrow = parent.querySelector(".splide__arrow--next");
            }
            let options = {
                type: "fade",
                perPage: 1,
                arrows: false,
                pagination: true,
                autoplay: true,
                interval: 3e3,
                rewind: true,
                classes: {
                    arrow: "splide__arrow _icon-ch-round-right"
                }
            };
            function refreshButtons() {
                if (slider.closest("[hidden]") !== null) return;
                if (prevArrow) prevArrow.disabled = splideInstance.index === 0;
                if (nextArrow) nextArrow.disabled = splideInstance.index === splideInstance.Components.Controller.getEnd();
            }
            const splideInstance = new Splide(slider, options);
            splideInstance.on("mounted move", (() => {
                refreshButtons();
            }));
            splideInstance.mount();
            if (prevArrow) prevArrow.addEventListener("click", (() => splideInstance.go("<")));
            if (nextArrow) nextArrow.addEventListener("click", (() => splideInstance.go(">")));
        }));
        var publicationsSliderEls = document.querySelectorAll(".publications-home__slider");
        publicationsSliderEls.forEach((function(sliderEl) {
            var slider = new Splide(sliderEl, {
                perPage: 1,
                arrows: false,
                pagination: true,
                destroy: true,
                grid: {
                    rows: 6,
                    cols: 1
                },
                breakpoints: {
                    549.98: {
                        destroy: false
                    }
                }
            });
            slider.mount({
                Grid
            });
        }));
        const productSliders = document.querySelectorAll(".main-product__sliders");
        if (productSliders.length) productSliders.forEach((sliderWrapper => {
            const mainSlider = sliderWrapper.querySelector(".main-product__main-slider");
            const thumbnailSlider = sliderWrapper.querySelector(".main-product__thumbnail-slider");
            if (mainSlider && thumbnailSlider) {
                const mainSplide = new Splide(mainSlider, {
                    type: "fade",
                    rewind: true,
                    perPage: 1,
                    pagination: false,
                    arrows: false,
                    breakpoints: {
                        991.98: {
                            pagination: true
                        }
                    }
                });
                const thumbSplide = new Splide(thumbnailSlider, {
                    isNavigation: true,
                    perPage: 4,
                    gap: "1.25rem",
                    pagination: false,
                    arrows: false
                });
                mainSplide.on("move", ((newIndex, oldIndex) => {
                    mainSplide.querySelectorAll("iframe")?.forEach((iframe => {
                        iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', "*");
                    }));
                    const oldSlide = mainSplide.Components.Slides.getAt(oldIndex);
                    if (oldSlide) {
                        const videoBoxes = oldSlide.slide.querySelectorAll(".video-box");
                        videoBoxes.forEach((container => {
                            const vb = new VideoBox(container);
                            vb.pause();
                        }));
                    }
                }));
                mainSplide.mount();
                thumbSplide.mount();
                mainSplide.sync(thumbSplide);
            }
        }));
    }));
    class ScrollWatcher {
        constructor(props) {
            let defaultConfig = {
                logging: true
            };
            this.config = Object.assign(defaultConfig, props);
            this.observer;
            !document.documentElement.classList.contains("watcher") ? this.scrollWatcherRun() : null;
        }
        scrollWatcherUpdate() {
            this.scrollWatcherRun();
        }
        scrollWatcherRun() {
            document.documentElement.classList.add("watcher");
            this.scrollWatcherConstructor(document.querySelectorAll("[data-watch]"));
        }
        scrollWatcherConstructor(items) {
            if (items.length) {
                this.scrollWatcherLogging(`Прокинувся, стежу за об'єктами (${items.length})...`);
                let uniqParams = uniqArray(Array.from(items).map((function(item) {
                    if (item.dataset.watch === "navigator" && !item.dataset.watchThreshold) {
                        let valueOfThreshold;
                        if (item.clientHeight > 2) {
                            valueOfThreshold = window.innerHeight / 2 / (item.clientHeight - 1);
                            if (valueOfThreshold > 1) valueOfThreshold = 1;
                        } else valueOfThreshold = 1;
                        item.setAttribute("data-watch-threshold", valueOfThreshold.toFixed(2));
                    }
                    return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : "0px"}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
                })));
                uniqParams.forEach((uniqParam => {
                    let uniqParamArray = uniqParam.split("|");
                    let paramsWatch = {
                        root: uniqParamArray[0],
                        margin: uniqParamArray[1],
                        threshold: uniqParamArray[2]
                    };
                    let groupItems = Array.from(items).filter((function(item) {
                        let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
                        let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : "0px";
                        let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
                        if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) return item;
                    }));
                    let configWatcher = this.getScrollWatcherConfig(paramsWatch);
                    this.scrollWatcherInit(groupItems, configWatcher);
                }));
            } else this.scrollWatcherLogging("Сплю, немає об'єктів для стеження. ZzzZZzz");
        }
        getScrollWatcherConfig(paramsWatch) {
            let configWatcher = {};
            if (document.querySelector(paramsWatch.root)) configWatcher.root = document.querySelector(paramsWatch.root); else if (paramsWatch.root !== "null") this.scrollWatcherLogging(`Эмм... батьківського об'єкта ${paramsWatch.root} немає на сторінці`);
            configWatcher.rootMargin = paramsWatch.margin;
            if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
                this.scrollWatcherLogging(`йой, налаштування data-watch-margin потрібно задавати в PX або %`);
                return;
            }
            if (paramsWatch.threshold === "prx") {
                paramsWatch.threshold = [];
                for (let i = 0; i <= 1; i += .005) paramsWatch.threshold.push(i);
            } else paramsWatch.threshold = paramsWatch.threshold.split(",");
            configWatcher.threshold = paramsWatch.threshold;
            return configWatcher;
        }
        scrollWatcherCreate(configWatcher) {
            console.log(configWatcher);
            this.observer = new IntersectionObserver(((entries, observer) => {
                entries.forEach((entry => {
                    this.scrollWatcherCallback(entry, observer);
                }));
            }), configWatcher);
        }
        scrollWatcherInit(items, configWatcher) {
            this.scrollWatcherCreate(configWatcher);
            items.forEach((item => this.observer.observe(item)));
        }
        scrollWatcherIntersecting(entry, targetElement) {
            if (entry.isIntersecting) {
                !targetElement.classList.contains("_watcher-view") ? targetElement.classList.add("_watcher-view") : null;
                this.scrollWatcherLogging(`Я бачу ${targetElement.classList}, додав клас _watcher-view`);
            } else {
                targetElement.classList.contains("_watcher-view") ? targetElement.classList.remove("_watcher-view") : null;
                this.scrollWatcherLogging(`Я не бачу ${targetElement.classList}, прибрав клас _watcher-view`);
            }
        }
        scrollWatcherOff(targetElement, observer) {
            observer.unobserve(targetElement);
            this.scrollWatcherLogging(`Я перестав стежити за ${targetElement.classList}`);
        }
        scrollWatcherLogging(message) {
            this.config.logging ? functions_FLS(`[Спостерігач]: ${message}`) : null;
        }
        scrollWatcherCallback(entry, observer) {
            const targetElement = entry.target;
            this.scrollWatcherIntersecting(entry, targetElement);
            if (entry.isIntersecting) this.scrollWatcherOff(targetElement, observer);
            document.dispatchEvent(new CustomEvent("watcherCallback", {
                detail: {
                    entry
                }
            }));
        }
    }
    document.addEventListener("DOMContentLoaded", (() => {
        modules_flsModules.watcher = new ScrollWatcher({});
    }));
    let addWindowScrollEvent = false;
    function digitsCounter() {
        function digitsCountersInit(digitsCountersItems) {
            let digitsCounters = digitsCountersItems ? digitsCountersItems : document.querySelectorAll("[data-digits-counter]");
            if (digitsCounters.length) digitsCounters.forEach((digitsCounter => {
                if (digitsCounter.hasAttribute("data-go")) return;
                digitsCounter.setAttribute("data-go", "");
                digitsCounter.innerHTML = `0`;
                setMinWidth(digitsCounter);
                digitsCountersAnimate(digitsCounter);
            }));
        }
        function formatNumberWithCommas(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        function setMinWidth(digitsCounter) {
            const endValue = parseFloat(digitsCounter.dataset.digitsCounter);
            const formattedValue = formatNumberWithCommas(endValue);
            const charCount = formattedValue.length;
            digitsCounter.style.minWidth = `${charCount}ch`;
        }
        function digitsCountersAnimate(digitsCounter) {
            let startTimestamp = null;
            const duration = parseFloat(digitsCounter.dataset.digitsCounterSpeed) ? parseFloat(digitsCounter.dataset.digitsCounterSpeed) : 1e3;
            const startValue = parseFloat(digitsCounter.dataset.digitsCounter);
            const startPosition = 0;
            const step = timestamp => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const value = Math.floor(progress * (startPosition + startValue));
                digitsCounter.innerHTML = formatNumberWithCommas(value);
                if (progress < 1) window.requestAnimationFrame(step); else digitsCounter.removeAttribute("data-go");
            };
            window.requestAnimationFrame(step);
        }
        function digitsCounterAction(e) {
            const entry = e.detail.entry;
            const targetElement = entry.target;
            if (targetElement.querySelectorAll("[data-digits-counter]").length) digitsCountersInit(targetElement.querySelectorAll("[data-digits-counter]"));
        }
        document.addEventListener("watcherCallback", digitsCounterAction);
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    class DynamicAdapt {
        constructor(type) {
            this.type = type;
        }
        init() {
            this.оbjects = [];
            this.daClassname = "_dynamic_adapt_";
            this.nodes = [ ...document.querySelectorAll("[data-da]") ];
            this.nodes.forEach((node => {
                const data = node.dataset.da.trim();
                const dataArray = data.split(",");
                const оbject = {};
                оbject.element = node;
                оbject.parent = node.parentNode;
                const parentSelectorMatch = dataArray[0].trim().match(/^\{(.+)\}(?:\s*(.+)?)$/);
                if (parentSelectorMatch) {
                    const parentSelector = parentSelectorMatch[1].trim();
                    const childSelector = parentSelectorMatch[2] ? parentSelectorMatch[2].trim() : null;
                    const parentElement = node.closest(parentSelector);
                    if (parentElement) оbject.destination = childSelector ? parentElement.querySelector(childSelector) : parentElement;
                } else оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
                оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767.98";
                оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.оbjects.push(оbject);
            }));
            this.arraySort(this.оbjects);
            this.mediaQueries = this.оbjects.map((({breakpoint}) => `(${this.type}-width: ${breakpoint / 16}em),${breakpoint}`)).filter(((item, index, self) => self.indexOf(item) === index));
            this.mediaQueries.forEach((media => {
                const mediaSplit = media.split(",");
                const matchMedia = window.matchMedia(mediaSplit[0]);
                const mediaBreakpoint = mediaSplit[1];
                const оbjectsFilter = this.оbjects.filter((({breakpoint}) => breakpoint === mediaBreakpoint));
                matchMedia.addEventListener("change", (() => {
                    this.mediaHandler(matchMedia, оbjectsFilter);
                }));
                this.mediaHandler(matchMedia, оbjectsFilter);
            }));
        }
        mediaHandler(matchMedia, оbjects) {
            if (matchMedia.matches) оbjects.forEach((оbject => {
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            })); else оbjects.forEach((({parent, element, index}) => {
                if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
            }));
        }
        moveTo(place, element, destination) {
            if (!destination) return;
            element.classList.add(this.daClassname);
            if (place === "last" || place >= destination.children.length) {
                destination.append(element);
                return;
            }
            if (place === "first") {
                destination.prepend(element);
                return;
            }
            destination.children[place].before(element);
        }
        moveBack(parent, element, index) {
            element.classList.remove(this.daClassname);
            if (parent.children[index] !== void 0) parent.children[index].before(element); else parent.append(element);
        }
        indexInParent(parent, element) {
            return [ ...parent.children ].indexOf(element);
        }
        arraySort(arr) {
            if (this.type === "min") arr.sort(((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if (a.place === "first" || b.place === "last") return -1;
                    if (a.place === "last" || b.place === "first") return 1;
                    return 0;
                }
                return a.breakpoint - b.breakpoint;
            })); else {
                arr.sort(((a, b) => {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) return 0;
                        if (a.place === "first" || b.place === "last") return 1;
                        if (a.place === "last" || b.place === "first") return -1;
                        return 0;
                    }
                    return b.breakpoint - a.breakpoint;
                }));
                return;
            }
        }
    }
    const da = new DynamicAdapt("max");
    da.init();
    function updateHeaderHeights() {
        const headerEl = document.querySelector("header.header");
        if (headerEl) {
            const headerHeight = headerEl.offsetHeight;
            document.documentElement.style.setProperty("--header-height", `${headerHeight}px`);
        }
    }
    document.querySelectorAll(".share-cakes__wrapper")?.forEach((block => {
        _slideUp(block, 0);
    }));
    window.addEventListener("load", (function() {
        updateHeaderHeights();
    }));
    window.addEventListener("resize", updateHeaderHeights);
    document.addEventListener("selectCallback", (e => {
        e.detail.select.dispatchEvent(new Event("change"));
    }));
    document.addEventListener("click", (e => {
        if (e.target.closest(".icon-menu")) {
            bodyLockToggle(0);
            document.documentElement.classList.toggle("menu-open");
        } else if (!e.target.closest(".mobile-menu") && document.documentElement.classList.contains(`menu-open`)) {
            bodyUnlock(0);
            document.documentElement.classList.remove("menu-open");
        }
        if (e.target.closest(".footer__up")) window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        if (e.target.closest(".share-cakes__button")) {
            const container = e.target.closest(".share-cakes");
            const block = container.querySelector(".share-cakes__wrapper");
            block && block.hidden ? _slideDown(block) : null;
        }
        if (e.target.closest(".video-box__play")) {
            const playTarget = e.target.closest(".video-box__play");
            const container = playTarget.closest(".video-box");
            const videoBox = new VideoBox(container);
            videoBox.toggle();
        }
        if (e.target.closest("[data-share-close]")) {
            const container = e.target.closest(".share-cakes");
            const block = container.querySelector(".share-cakes__wrapper");
            block && !block.hidden ? _slideUp(block) : null;
        }
    }));
    const numberInputs = document.querySelectorAll(".counter");
    if (numberInputs) numberInputs.forEach((wrapperInput => {
        const input = wrapperInput.querySelector("input");
        const min = parseInt(wrapperInput.getAttribute("data-min"));
        const max = parseInt(wrapperInput.getAttribute("data-max"));
        const validateInput = () => {
            let value = parseInt(input.value);
            if (isNaN(value)) value = min;
            if (value < min) value = min; else if (value > max) value = max;
            input.value = value;
        };
        input.addEventListener("input", validateInput);
        input.addEventListener("blur", validateInput);
    }));
    window["FLS"] = false;
    menuInit();
    spoilers();
    tabs();
    showMore();
    digitsCounter();
})();