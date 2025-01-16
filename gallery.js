function showFullSizeImage(imageUrl, title, smallImage, tabId) {
  const dimmerOverlay = document.querySelector('.gallery-overlay');
  const imagePopover = document.querySelector('.image-popover');
  const largeImage = imagePopover.querySelector('.large-image');
  const largeImageLabel = imagePopover.querySelector('.large-image-label');

  if (!imagePopover.classList.contains('hidden')) {
    return; // Exit the function early if the popover is already open
  }

  largeImage.src = imageUrl;
  imagePopover.classList.remove('hidden');
  dimmerOverlay.classList.remove('hidden');
  largeImageLabel.textContent = title;

  if (tabId === 'tab1') {
    largeImageLabel.classList.add('show-overline');
    largeImageLabel.href = `galleryDetail.html?i=${encodeURIComponent(title)}`;
  }

  if (tabId === 'tab3') {
    largeImageLabel.textContent = '';
  }

  // Close popover when clicking outside
  closePopoverOutside = function(event) {
      if (!imagePopover.contains(event.target) && !smallImage.contains(event.target)) {
          imagePopover.classList.add('hidden');
          dimmerOverlay.classList.add('hidden');
          imagePopover.querySelector('.large-image').src = '';
          document.removeEventListener('click', closePopoverOutside);
      }
  };
  document.addEventListener('click', closePopoverOutside);

  // Close popover when clicking close button
  const closeButton = imagePopover.querySelector('.close');
  closeButton.addEventListener('click', function() {
      imagePopover.classList.add('hidden');
      dimmerOverlay.classList.add('hidden');
      imagePopover.querySelector('.large-image').src = '';
      document.removeEventListener('click', closePopoverOutside);
  });
}

function loadImages(tabId) {
  const imagesContainer = document.querySelector(`#${tabId} .images`);
  imagesContainer.innerHTML = '';

  let images = [];
  switch (tabId) {
    case 'tab1':
      images = [
        'Self-Titled',
        'aMazeKing',
        'ExcalAmaze',
        'Floydian Slip',
        'EYEnima',
        'animEYE',
        'Start of Texas',
        'Dog Maze of Summer',
        'Black Gives Way to Red',
        'E3',
        'Its Electric!',
        'Rebel Tri-Start',
        'RouEND',
        'Space$h!+',
        'Welcome Home Planetarium',
        'Collection',
      ];
      break;
    case 'tab2':
      images = [
        'Piranha',
        'Amy',
        'Ash',
        'Black Light Social Hour',
        'Cayrolla',
        'Extralife',
        'Hayes',
        'Hellfyre',
        'Holly is Love',
        'Judeth of Bohr',
        'Lady harper',
        'LandMark Credit',
        'Macey Austin',
        'MomZilla',
        'Polly',
        'Ryan & Julie',
        'The Illustrious Jenny',
        'The Mazemerizing Weird Al Yankovic',
        'Tifany Roy',
        'WiLD BILL',
      ];
      break;
    case 'tab3':
      images = [
        'Alphabet - Collection1',
        'Start Left',
        'End Right',
        'Space Bar',
        'THICK CAPITAL ALPHA',
        'THICK CAPITAL BRAVO',
        'THICK CAPITAL CHARLIE',
        'THICK CAPITAL DELTA',
        'THICK CAPITAL ECHO',
        'THICK CAPITAL FOXTROT',
        'THICK CAPITAL GOLF',
        'THICK CAPITAL HOTEL',
        'THICK CAPITAL IGLOO',
        'THICK CAPITAL JULIET',
        'THICK CAPITAL KILO',
        'THICK CAPITAL LIMA',
        'THICK CAPITAL MONTANA',
        'THICK CAPITAL NANCY',
        'THICK CAPITAL OSCAR',
        'THICK CAPITAL PAPA',
        'THICK CAPITAL QUEBECK',
        'THICK CAPITAL ROMEO',
        'THICK CAPITAL SNAKE',
        'THICK CAPITAL TANGO',
        'THICK CAPITAL UNIFORM',
        'THICK CAPITAL VERMONT',
        'THICK CAPITAL WALTER',
        'THICK CAPITAL XRAY',
        'THICK CAPITAL YANKIE',
        'THICK CAPITAL ZULU',
        'THICK EXCLAMATION Point',
        'THICK Question Mark',
        'Alphabet - Collection2',
        'Alphabet - Collection3',
        'Alphabet - Collection4',
        'Alphabet - Collection5',
        'Alphabet BL1',
        'Alphabet BL2',
        'Alphabet BL3',
        'Alphabet BL4',
        'Alphabet BL5',
        'Alphabet BL6',
        'Alphabet BL7',
        'Alphabet BL8',
        'Alphabet BL9',
        'Alphabet BL10',
        'Alphabet BL11',
        'Alphabet BL12',
        'Alphabet BL13',
        'Alphabet BL14',
        'Alphabet BL15',
      ];
      break;
    default:
      break;
  }

  images.forEach(imageName => {
    const div = document.createElement('div');
    let randomMargin = [
      8 + Math.random() * 27,
      8 + Math.random() * 27,
      8 + Math.random() * 27,
      8 + Math.random() * 27,
    ]
    div.style.margin = randomMargin.join('px ') + 'px';

    const imgGroup = document.createElement('div');
    imgGroup.classList.add('img-group');

    const img = document.createElement('img');
    img.src = 'img/mazes/preview/' + imageName + '.jpg';
    img.alt = imageName;
    img.addEventListener('click', function() {
      showFullSizeImage('img/mazes/watermark/' + imageName + '.jpg', imageName, img, tabId);
    });

    imgGroup.appendChild(img);

    const title = document.createElement('a');
    title.classList.add('img-title');
    title.textContent = imageName;

    if (tabId === 'tab1') {
      title.classList.add('show-overline');
      title.href = `galleryDetail.html?i=${encodeURIComponent(imageName)}`;
    }

    imageFromName(imageName + ' BL.jpg', imageName, imgBl => {
      imgGroup.appendChild(imgBl);
    }, tabId);
    // imageFromName(imageName + ' BL2.jpg', imageName, imgBl2 => {
    //   imgGroup.appendChild(imgBl2);
    // });

    div.appendChild(imgGroup);

    if (tabId !== 'tab3') {
      div.appendChild(title);
    }

    imagesContainer.appendChild(div);
  });
}

function imageFromName(fileName, imageName, save, tabId) {
  const path = 'img/mazes/preview/' + fileName;
  checkImageExists(path, () => {
    const img = document.createElement('img');
    img.src = path;
    img.alt = fileName;
    img.addEventListener('click', function() {
      showFullSizeImage('img/mazes/watermark/' + fileName, imageName, img, tabId);
    });
    save(img);
  });
}

function openTab(tabId) {
  // Hide all tab contents and deactivate all tabs
  document.querySelectorAll('.tab-content').forEach(tabContent => {
    tabContent.classList.remove('active');
  });
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });

  // Show the selected tab content and activate the selected tab
  document.getElementById(tabId).classList.add('active');
  document.getElementById(`c${tabId}`).classList.add('active');

  loadImages(tabId);
}

document.addEventListener("DOMContentLoaded", function () {
  openTab('tab1');
});

function checkImageExists(imageUrl, callback) {
  const img = new Image();
  img.onload = function() {
      callback();
  };
  img.src = imageUrl;
}
