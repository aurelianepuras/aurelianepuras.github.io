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
