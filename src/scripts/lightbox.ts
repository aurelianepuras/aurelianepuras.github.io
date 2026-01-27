function initBlogLightbox() {
  let currentImageIndex = 0;
  let galleryImages: HTMLImageElement[] = [];

  function openLightbox(images: HTMLImageElement[], index: number) {
    galleryImages = images;
    currentImageIndex = index;

    const lightbox = document.getElementById('lightbox') as HTMLElement | null;
    const counter = lightbox?.querySelector('.lightbox-counter') as HTMLElement | null;

    if (!lightbox || !counter) return;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    showImage();
  }

  function showImage() {
    const lightboxImg = document.getElementById('lightbox-img') as HTMLImageElement | null;
    const counter = document.querySelector('.lightbox-counter') as HTMLElement | null;
    const currentImg = galleryImages[currentImageIndex];

    if (!lightboxImg || !counter || !currentImg) return;

    lightboxImg.src = currentImg.src;
    lightboxImg.alt = currentImg.alt;
    counter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
  }

  function closeLightbox() {
    const lightbox = document.getElementById('lightbox') as HTMLElement | null;
    if (!lightbox) return;

    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function nextImage() {
    if (galleryImages.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    showImage();
  }

  function prevImage() {
    if (galleryImages.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    showImage();
  }

  function createGalleryFromImages(paragraph: HTMLParagraphElement, images: HTMLImageElement[]) {
    const gallery = document.createElement('div');
    gallery.className = 'image-gallery';

    const count = images.length;

    if (count === 4) {
      gallery.style.setProperty('--img-count', '2');
    } else if (count > 4) {
      gallery.style.setProperty('--img-count', '3');
    } else {
      gallery.style.setProperty('--img-count', count.toString());
    }

    const localGalleryImages: HTMLImageElement[] = [];

    images.forEach((img) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'gallery-item';

      const clonedImg = img.cloneNode(true) as HTMLImageElement;
      clonedImg.style.cssText = '';
      clonedImg.classList.add('gallery-image');

      clonedImg.addEventListener('click', () => {
        openLightbox(localGalleryImages, localGalleryImages.indexOf(clonedImg));
      });

      localGalleryImages.push(clonedImg);
      wrapper.appendChild(clonedImg);
      gallery.appendChild(wrapper);
    });

    paragraph.replaceWith(gallery);
  }

  function createGallery(paragraphs: HTMLParagraphElement[]) {
    const gallery = document.createElement('div');
    gallery.className = 'image-gallery';

    const count = paragraphs.length;

    if (count === 4) {
      gallery.style.setProperty('--img-count', '2');
    } else if (count > 4) {
      gallery.style.setProperty('--img-count', '3');
    } else {
      gallery.style.setProperty('--img-count', count.toString());
    }

    const images: HTMLImageElement[] = [];

    paragraphs.forEach((p) => {
      const img = p.querySelector('img') as HTMLImageElement | null;
      if (img) {
        const wrapper = document.createElement('div');
        wrapper.className = 'gallery-item';

        const clonedImg = img.cloneNode(true) as HTMLImageElement;
        clonedImg.style.cssText = '';
        clonedImg.classList.add('gallery-image');

        clonedImg.addEventListener('click', () => {
          openLightbox(images, images.indexOf(clonedImg));
        });

        images.push(clonedImg);
        wrapper.appendChild(clonedImg);
        gallery.appendChild(wrapper);
      }
    });

    let prevEl = paragraphs[0].previousElementSibling;
    while (prevEl && prevEl.tagName === 'P' && !prevEl.textContent?.trim()) {
      const toRemove = prevEl;
      prevEl = prevEl.previousElementSibling;
      toRemove.remove();
    }

    paragraphs[0].replaceWith(gallery);
    paragraphs.slice(1).forEach((p) => p.remove());
  }

  function createImageGalleries() {
    const content = document.querySelector('.prose');
    if (!content) return;

    const paragraphs = Array.from(content.querySelectorAll('p')) as HTMLParagraphElement[];
    const processed = new Set<HTMLElement>();

    paragraphs.forEach((p) => {
      if (processed.has(p)) return;

      const imgsInParagraph = Array.from(p.querySelectorAll('img')) as HTMLImageElement[];
      if (imgsInParagraph.length >= 2 && imgsInParagraph.length <= 10) {
        createGalleryFromImages(p, imgsInParagraph);
        processed.add(p);
        return;
      }

      const img = p.querySelector('img');
      if (!img || p.children.length !== 1) return;

      const group: HTMLParagraphElement[] = [p];
      let nextEl = p.nextElementSibling;

      while (nextEl && nextEl.tagName === 'P') {
        const nextImg = nextEl.querySelector('img');
        if (nextImg && nextEl.children.length === 1) {
          group.push(nextEl as HTMLParagraphElement);
          processed.add(nextEl as HTMLElement);
          nextEl = nextEl.nextElementSibling;
        } else {
          break;
        }
      }

      if (group.length >= 2 && group.length <= 10) {
        createGallery(group);
        processed.add(p);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');

    lightbox?.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
    lightbox?.querySelector('.lightbox-next')?.addEventListener('click', nextImage);
    lightbox?.querySelector('.lightbox-prev')?.addEventListener('click', prevImage);

    lightbox?.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox?.classList.contains('active')) return;

      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    });
  });

  const initContentTransforms = () => {
    createImageGalleries();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContentTransforms);
  } else {
    initContentTransforms();
  }
}

function initFotoLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-image') as HTMLImageElement | null;
  const lightboxDesc = document.getElementById('lightbox-description');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  const imagesInGrid = Array.from(
    document.querySelectorAll('#gallery-grid img')
  ) as HTMLImageElement[];
  let currentIndex = 0;

  let touchStartX = 0;
  let touchEndX = 0;

  function openLightbox(index: number) {
    if (!lightbox || !lightboxImg) return;

    currentIndex = index;
    updateLightbox();
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function updateLightbox() {
    if (!lightboxImg) return;
    const img = imagesInGrid[currentIndex];
    if (!img) return;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || 'Imagine galerie Aurelian Epuraș';
    if (lightboxDesc) lightboxDesc.textContent = img.alt || '';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function showNext() {
    if (imagesInGrid.length === 0) return;
    currentIndex = (currentIndex + 1) % imagesInGrid.length;
    updateLightbox();
  }

  function showPrev() {
    if (imagesInGrid.length === 0) return;
    currentIndex = (currentIndex - 1 + imagesInGrid.length) % imagesInGrid.length;
    updateLightbox();
  }

  if (imagesInGrid.length > 0) {
    imagesInGrid.forEach((img, index) => {
      img.addEventListener('click', () => openLightbox(index));
    });
  }

  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });
  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    showNext();
  });
  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrev();
  });

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  lightbox?.addEventListener(
    'touchstart',
    (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  lightbox?.addEventListener(
    'touchend',
    (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0) showPrev();
        else showNext();
      }
    },
    { passive: true }
  );
}

export function initLightboxScripts() {
  if (document.querySelector('.prose')) {
    initBlogLightbox();
  }

  if (document.getElementById('gallery-grid')) {
    initFotoLightbox();
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightboxScripts);
  } else {
    initLightboxScripts();
  }
}

let cleanupFunctions: (() => void)[] = [];

export function initLightbox() {
  cleanup();

  const galleryGrid = document.getElementById('gallery-grid');

  if (!galleryGrid) {
    return;
  }

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image') as HTMLImageElement;
  const lightboxDescription = document.getElementById('lightbox-description');
  const lightboxClose = document.getElementById('lightbox-close');

  if (!lightbox || !lightboxImage || !lightboxDescription || !lightboxClose) {
    return;
  }

  function openLightbox(image: string, title: string, description: string) {
    lightboxImage.src = image;
    lightboxImage.alt = title;
    lightboxDescription.textContent = description || '';

    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
    lightboxImage.src = '';
  }

  function handleGalleryClick(e: Event) {
    const target = e.target as HTMLElement;
    const galleryItem = target.closest('.gallery-item') as HTMLElement;

    if (galleryItem) {
      e.preventDefault();
      e.stopPropagation();

      const image = galleryItem.getAttribute('data-image') || '';
      const title = galleryItem.getAttribute('data-title') || '';
      const description = galleryItem.getAttribute('data-description') || '';

      openLightbox(image, title, description);
    }
  }

  function handleCloseClick(e: Event) {
    e.stopPropagation();
    closeLightbox();
  }

  function handleBackgroundClick(e: Event) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  }

  function handleEscapeKey(e: KeyboardEvent) {
    if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
      closeLightbox();
    }
  }

  galleryGrid.addEventListener('click', handleGalleryClick);
  lightboxClose.addEventListener('click', handleCloseClick);
  lightbox.addEventListener('click', handleBackgroundClick);
  document.addEventListener('keydown', handleEscapeKey);

  cleanupFunctions = [
    () => {
      galleryGrid.removeEventListener('click', handleGalleryClick);
      lightboxClose.removeEventListener('click', handleCloseClick);
      lightbox.removeEventListener('click', handleBackgroundClick);
      document.removeEventListener('keydown', handleEscapeKey);
      closeLightbox();
    }
  ];
}

export function cleanup() {
  cleanupFunctions.forEach(fn => fn());
  cleanupFunctions = [];
}
