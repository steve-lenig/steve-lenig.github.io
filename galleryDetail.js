const imageMap = window.imageMap;

function getQueryParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

const galleryKey = getQueryParameter('i');
const galleryData = imageMap[galleryKey];

const title = document.getElementById('title');
title.textContent = galleryKey;

if (!galleryData) {
  document.body.innerHTML = '<p>No images found for the specified gallery.</p>';
} else {
  const defaultTitle = galleryData.items[0].title;
  const defaultDescription = galleryData.items[0].description;

  const previewList = document.getElementById('preview-list');
  const mainSliderContainer = document.querySelector('.slider-main');
  const imageTitle = document.getElementById('image-title');
  const imageDescription = document.getElementById('image-description');

  // Create preview list and main viewer from data
  galleryData.items.forEach((item) => {
    const title = item.title || defaultTitle;

    const mainSlide = document.createElement('div');
    mainSlide.classList.add('gallery__slide');
    const mainImage = document.createElement('img');
    mainImage.src = item.image;
    mainImage.alt = title;
    mainSlide.appendChild(mainImage);
    mainSliderContainer.appendChild(mainSlide);

    const previewSlide = document.createElement('div');
    const previewSlideContent = document.createElement('div');
    previewSlideContent.classList.add('preview-img-content');
    const previewImage = document.createElement('img');
    previewImage.src = item.image;
    previewImage.alt = title;
    previewSlideContent.appendChild(previewImage);
    previewSlide.appendChild(previewSlideContent);
    previewList.appendChild(previewSlide);

    if (galleryData.items.length <= 1) {
      document.querySelector('.preview-list-container').style.display = 'none';
      document.querySelector('.gallery').style.minHeight = '586px';
    }
  });

  // Create sliders
  const mainSlider = tns({
    container: '.slider-main',
    items: 1,
    slideBy: 'page',
    mouseDrag: true,
    swipeAngle: false,
    autoplay: false,
    nav: false,
    controls: false,
    mode: 'gallery'
  });

  let currentAxis = 'vertical';

  function checkControlsVisibility() {
    const isMobile = window.innerWidth <= 640;

    const controlUp = document.querySelector('.control-up');
    const controlDown = document.querySelector('.control-down');
    const controlLeft = document.querySelector('.control-left');
    const controlRight = document.querySelector('.control-right');

    const info = previewSlider.getInfo();
    const atStart = info.index === 0;
    const atEnd = info.index + info.items >= info.slideCount;

    controlUp.style.display = atStart ? 'none' : 'flex';
    controlDown.style.display = atEnd ? 'none' : 'flex';
    controlLeft.style.display = atStart ? 'none' : 'flex';
    controlRight.style.display = atEnd ? 'none' : 'flex';

    if (isMobile) {
      controlUp.style.display = 'none';
      controlDown.style.display = 'none';
    } else {
      controlLeft.style.display = 'none';
      controlRight.style.display = 'none';
    }
  }

  function createPreviewSlider(axis) {
    const controlUp = document.querySelector('.control-up');
    const controlDown = document.querySelector('.control-down');
    const controlLeft = document.querySelector('.control-left');
    const controlRight = document.querySelector('.control-right');

    const slider = tns({
      container: '.preview-list',
      items: axis === 'vertical' ? 5 : 4,
      slideBy: 'page',
      mouseDrag: true,
      swipeAngle: false,
      axis: axis,
      loop: false,
      gutter: 6,
      nav: false,
      prevButton: axis === 'vertical' ? controlUp : controlLeft,
      nextButton: axis === 'vertical' ? controlDown : controlRight,
    });

    slider.events.on('indexChanged', checkControlsVisibility);
    slider.events.on('scroll', checkControlsVisibility);

    return slider;
  }

  let previewSlider = createPreviewSlider(currentAxis);

  const mainSliderSlides = mainSlider.getInfo().slideItems;
  function updateSelectedPreview(index) {
    imageTitle.textContent = galleryData.items[index].title || defaultTitle;
    imageDescription.textContent = galleryData.items[index].description || defaultDescription;

    const previewSliderSlides = Array.from(previewSlider.getInfo().slideItems);
    previewSliderSlides.forEach(slide => {
      slide.firstChild.classList.remove('preview-img-content-active');
    });

    previewSliderSlides[index].firstChild.classList.add('preview-img-content-active');
  }

  function updateMainSlider(index) {
    mainSlider.goTo(index);
    updateSelectedPreview(index);
    checkControlsVisibility();
  }

  let previewSlides = Array.from(previewSlider.getInfo().slideItems);
  previewSlides.forEach((slide, index) => {
    slide.addEventListener('click', () => updateMainSlider(index));
  });
  previewSlides[0].firstChild.classList.add('preview-img-content-active');

  // Set the initial title and description
  imageTitle.textContent = defaultTitle;
  imageDescription.textContent = defaultDescription;

  mainSlider.events.on('indexChanged', (info) => {
    const index = info.index;
    previewSlider.goTo(index);
    updateSelectedPreview(index);
    addZoomEffect(mainSliderSlides[index].querySelector('img'));
    checkControlsVisibility();
  });

  function updateSliderAxis() {
    const newAxis = window.innerWidth <= 640 ? 'horizontal' : 'vertical';

    if (currentAxis !== newAxis) {
      currentAxis = newAxis;
      previewSlider.destroy();
      previewSlider = createPreviewSlider(currentAxis);

      const newPreviewSliderSlides = Array.from(previewSlider.getInfo().slideItems);
      newPreviewSliderSlides.forEach((slide, index) => {
        slide.addEventListener('click', () => updateMainSlider(index));
      });

      const currentIndex = mainSlider.getInfo().index;
      previewSlider.goTo(currentIndex);
      updateSelectedPreview(currentIndex);
      checkControlsVisibility();
    }
  }

  window.addEventListener('resize', updateSliderAxis);
  updateSliderAxis();

  function addZoomEffect(image) {
    const mainViewer = document.querySelector('.viewer');

    image.style.transition = 'transform 0.15s ease-out';

    mainViewer.addEventListener('mousemove', (e) => {
      const rect = mainViewer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;

      image.style.transformOrigin = `${xPercent}% ${yPercent}%`;
    });
  }

  addZoomEffect(mainSliderSlides[0].querySelector('img'));
  checkControlsVisibility();
}
