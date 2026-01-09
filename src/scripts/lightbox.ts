let cleanupFunctions: (() => void)[] = [];

export function initLightbox() {
  console.log('--- Lightbox Init ---');

  cleanup();

  const galleryGrid = document.getElementById('gallery-grid');
  console.log('Gallery Grid Found:', !!galleryGrid);

  if (!galleryGrid) {
    console.log('No gallery grid on this page, exiting.');
    return;
  }

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image') as HTMLImageElement;
  const lightboxDescription = document.getElementById('lightbox-description');
  const lightboxClose = document.getElementById('lightbox-close');

  console.log('Lightbox elements:', {
    lightbox: !!lightbox,
    lightboxImage: !!lightboxImage,
    lightboxDescription: !!lightboxDescription,
    lightboxClose: !!lightboxClose
  });

  if (!lightbox || !lightboxImage || !lightboxDescription || !lightboxClose) {
    console.error('Missing lightbox elements!');
    return;
  }

  function openLightbox(image: string, title: string, description: string) {
    console.log('Opening lightbox with:', { image, title, description });

    lightboxImage.src = image;
    lightboxImage.alt = title;
    lightboxDescription.textContent = description || '';

    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    console.log('Closing lightbox');
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
    lightboxImage.src = '';
  }

  function handleGalleryClick(e: Event) {
    const target = e.target as HTMLElement;
    const galleryItem = target.closest('.gallery-item') as HTMLElement;

    if (galleryItem) {
      console.log('Gallery item clicked:', galleryItem);
      e.preventDefault();
      e.stopPropagation();

      const image = galleryItem.getAttribute('data-image') || '';
      const title = galleryItem.getAttribute('data-title') || '';
      const description = galleryItem.getAttribute('data-description') || '';

      openLightbox(image, title, description);
    }
  }

  function handleCloseClick(e: Event) {
    console.log('Close button clicked');
    e.stopPropagation();
    closeLightbox();
  }

  function handleBackgroundClick(e: Event) {
    if (e.target === lightbox) {
      console.log('Background clicked');
      closeLightbox();
    }
  }

  function handleEscapeKey(e: KeyboardEvent) {
    if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
      console.log('Escape pressed');
      closeLightbox();
    }
  }

  galleryGrid.addEventListener('click', handleGalleryClick);
  lightboxClose.addEventListener('click', handleCloseClick);
  lightbox.addEventListener('click', handleBackgroundClick);
  document.addEventListener('keydown', handleEscapeKey);

  cleanupFunctions = [
    () => {
      console.log('Cleaning up lightbox listeners');
      galleryGrid.removeEventListener('click', handleGalleryClick);
      lightboxClose.removeEventListener('click', handleCloseClick);
      lightbox.removeEventListener('click', handleBackgroundClick);
      document.removeEventListener('keydown', handleEscapeKey);
      closeLightbox();
    }
  ];

  console.log('Lightbox initialization complete!');
}

export function cleanup() {
  cleanupFunctions.forEach(fn => fn());
  cleanupFunctions = [];
}
