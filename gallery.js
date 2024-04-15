function showFullSizeImage(imageUrl, smallImage) {
  const imagePopover = document.querySelector('.image-popover');
  const largeImage = imagePopover.querySelector('.large-image');

  if (!imagePopover.classList.contains('hidden')) {
    return; // Exit the function early if the popover is already open
  }

  // Set the source of the larger image
  largeImage.src = imageUrl;

  // Display the popover
  imagePopover.classList.remove('hidden');

  // Close popover when clicking outside
  closePopoverOutside = function(event) {
      if (!imagePopover.contains(event.target) && !smallImage.contains(event.target)) {
          imagePopover.classList.add('hidden');
          document.removeEventListener('click', closePopoverOutside);
      }
  };
  document.addEventListener('click', closePopoverOutside);

  // Close popover when clicking close button
  const closeButton = imagePopover.querySelector('.close');
  closeButton.addEventListener('click', function() {
      imagePopover.classList.add('hidden');
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
        'Self Titled',
        'Piranha',
        'ExcalAmaze',
        'Floydian Slip',
        'EYEnima',
        'Start of Texas',
        'Dog Maze of Summer',
        'Black Gives Way to Red',
        'E3',
        'Electric Borders',
        'Rebel Tri-Start',
        'Rouend',
        'Space$h!+',
        'Welcome Home Planetarium',
      ];
      break;
    case 'tab2':
      images = [
        'Ash',
        'Black Light Social Hour',
        'Cayrolla',
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
      ];
      break;
    default:
      break;
  }

  images.forEach(imageName => {
    const img = document.createElement('img');

    img.src = 'img/mazes/preview/' + imageName + '.jpg';
    img.alt = imageName;
    img.addEventListener('click', function() {
      showFullSizeImage('img/mazes/watermark/' + imageName + '.jpg', img);
    });

    const title = document.createElement('span');
    title.classList.add('img-title');
    title.textContent = imageName;
    
    const div = document.createElement('div');
    div.classList.add('card')
    let randomMargin = [
      8 + Math.random() * 27,
      8 + Math.random() * 27,
      8 + Math.random() * 27,
      8 + Math.random() * 27,
    ]
    div.style.margin = randomMargin.join('px ') + 'px';

    div.appendChild(img);


    const blPath = 'img/mazes/preview/' + imageName + ' BL.jpg';
    checkImageExists(blPath, () => {
      const imgBl = document.createElement('img');
      imgBl.src = blPath;
      imgBl.alt = imageName;
      imgBl.addEventListener('click', function() {
        showFullSizeImage('img/mazes/watermark/' + imageName + ' BL.jpg', imgBl);
      });
      div.appendChild(imgBl);
      div.appendChild(title);
    });

    if (tabId !== 'tab3') {
      div.appendChild(title);
    }

    imagesContainer.appendChild(div);
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
