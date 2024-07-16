const imageMap = {
  'aMazeKing': {
    items: [
      {
        image: 'img/mazes/watermark/aMazeKing.jpg',
        title: 'default title',
        description: 'default description'
      },
      { image: 'img/mazes/watermark/Amy.jpg' },
      { image: 'img/mazes/watermark/Ash.jpg', title: 'custom title', description: 'custom description' },
      { image: 'img/mazes/watermark/E3.jpg' },
      { image: 'img/mazes/watermark/Extralife.jpg' },
    ],
  },
};

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
    // const mainImage = document.getElementById('main-image');
    const mainSliderContainer = document.querySelector('.slider-main');
    const imageTitle = document.getElementById('image-title');
    const imageDescription = document.getElementById('image-description');

    galleryData.items.forEach((item, index) => {
        const title = item.title || defaultTitle;

        const mainSlide = document.createElement('div');
        mainSlide.classList.add('gallery__slide');
        const mainImage = document.createElement('img');
        mainImage.src = item.image;
        mainImage.alt = title;
        mainSlide.appendChild(mainImage);
        mainSliderContainer.appendChild(mainSlide);

        const previewSlide = document.createElement('div');
        // previewSlide.classList.add('preview-img-container');
        const previewSlideContent = document.createElement('div');
        previewSlideContent.classList.add('preview-img-content');
        const previewImage = document.createElement('img');
        previewImage.src = item.image;
        previewImage.alt = title;
        // imgContainer.addEventListener('click', () => {
        //     mainImage.src = src;
        //     imageTitle.textContent = title;
        //     imageDescription.textContent = galleryData.descriptions[index] || galleryData.descriptions[0];
        //     const prevActive = document.getElementsByClassName('preview-img-container-active');
        //     if (prevActive && prevActive.length > 0) {
        //       prevActive[0].classList = 'preview-img-container';
        //     }
        //     imgContainer.classList.add('preview-img-container-active');
        // });
        previewSlideContent.appendChild(previewImage);
        previewSlide.appendChild(previewSlideContent);
        previewList.appendChild(previewSlide);
    });

    // Set the initial image, title, and description
    // mainImage.src = galleryData.images[0];
    // imageTitle.textContent = galleryData.titles[0];
    // imageDescription.textContent = galleryData.descriptions[0];

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

    function createPreviewSlider(axis) {
      return tns({
        container: '.preview-list',
        items: 4,
        slideBy: 'page',
        mouseDrag: true,
        swipeAngle: false,
        // speed: 400,
        axis: axis,
        loop: false,
        gutter: 6,
        // controlsText: ['<', '>'],
        controls: false,
        // nextButton: '.preview-list-next',
        // prevButton: '.preview-list-prev',
        nav: false,
      });
    }

    let previewSlider = createPreviewSlider(currentAxis);

    // const mainSliderInfo = mainSlider.getInfo();
    // const previewSliderInfo = previewSlider.getInfo();
    // const mainSliderSlides = mainSliderInfo.slideItems;
    // const previewSliderSlides = Array.from(previewSlider.getInfo().slideItems);

    function updateSelectedPreview(index) {
      imageTitle.textContent = galleryData.items[index].title || defaultTitle
      imageDescription.textContent = galleryData.items[index].description || defaultDescription;

      // previewSliderSlides.forEach(slide => {
      //   slide.firstChild.classList.remove('active');
      // });

      // const prevActive = document.getElementsByClassName('preview-img-container-active');
      // prevActive.classList.remove('preview-img-container-active');

      const previewSliderSlides = Array.from(previewSlider.getInfo().slideItems);
      previewSliderSlides.forEach(slide => {
        slide.firstChild.classList.remove('preview-img-content-active');
      });

      previewSliderSlides[index].firstChild.classList.add('preview-img-content-active');
    };

    function updateMainSlider(index) {
      mainSlider.goTo(index);
      updateSelectedPreview(index);
    };

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
        // imageTitle.textContent = galleryData.items[index].title || defaultTitle;
        // imageDescription.textContent = galleryData.items[index].description || defaultDescription;
        previewSlider.goTo(index);
        updateSelectedPreview(index);
    });

    function updateSliderAxis() {
      const isMobile = window.innerWidth <= 640;
      const newAxis = isMobile ? 'horizontal' : 'vertical';

      if (currentAxis !== newAxis) {
        currentAxis = newAxis;
        previewSlider.destroy();
        previewSlider = createPreviewSlider(currentAxis);

        const newPreviewSliderInfo = previewSlider.getInfo();
        const newPreviewSliderSlides = Array.from(newPreviewSliderInfo.slideItems);
        newPreviewSliderSlides.forEach((slide, index) => {
            slide.addEventListener('click', () => updateMainSlider(index));
        });

        const currentIndex = mainSlider.getInfo().index;
        previewSlider.goTo(currentIndex);
        updateSelectedPreview(currentIndex);
      }
    }

    window.addEventListener('resize', updateSliderAxis);
    updateSliderAxis(); // Initial call
  }