const STORAGE_KEY = 'studor_activities';
const DEFAULT_FILTER = 'All';
const DEFAULT_FORM_TITLE = 'Log New Activity';
const EDIT_FORM_TITLE = 'Edit Activity';
const DEFAULT_SUBMIT_LABEL = '<i data-lucide="plus"></i> Log Activity';
const EDIT_SUBMIT_LABEL = '<i data-lucide="save"></i> Save Changes';
const MAX_IMAGE_COUNT = 2;
const EMPTY_STATE_MARKUP = `
  <div class="empty-state">
    <div class="empty-icon-wrapper">
      <i data-lucide="compass"></i>
    </div>
    <p>Your path is just beginning.</p>
    <small>Log your first milestone!</small>
  </div>
`;
const DATE_FORMAT_OPTIONS = { month: 'short', day: 'numeric', year: 'numeric' };
const ICONS_BY_CATEGORY = {
  Technical: 'monitor',
  Sports: 'trophy',
  Academic: 'book-open',
  Cultural: 'palette',
  Default: 'tag'
};

const form = document.getElementById('activity-form');
const inputName = document.getElementById('input-name');
const selectCategory = document.getElementById('select-category');
const inputDate = document.getElementById('input-date');
const inputDescription = document.getElementById('input-description');
const inputImages = document.getElementById('input-images');
const inputCertificate = document.getElementById('input-certificate');
const removeImagesButton = document.getElementById('remove-images-btn');
const removeCertificateButton = document.getElementById('remove-certificate-btn');
const filterSelect = document.getElementById('filter-select');
const activityList = document.getElementById('activity-list');
const submitButton = form.querySelector('.btn-submit');
const formTitle = document.querySelector('.form-card h2');
const cancelEditButton = document.getElementById('cancel-edit-btn');
const attachmentSummary = document.getElementById('attachment-summary');
const confirmModal = document.getElementById('confirm-modal');
const confirmDeleteButton = document.getElementById('confirm-delete-btn');
const confirmCancelButton = document.getElementById('confirm-cancel-btn');
const detailsModal = document.getElementById('details-modal');
const detailsCloseButton = document.getElementById('details-close-btn');
const detailsModalDate = document.getElementById('details-modal-date');
const detailsModalName = document.getElementById('details-modal-name');
const detailsModalCategory = document.getElementById('details-modal-category');
const detailsModalDescription = document.getElementById('details-modal-description');
const detailsImagesSection = document.getElementById('details-images-section');
const detailsImages = document.getElementById('details-images');
const detailsCertificateSection = document.getElementById('details-certificate-section');
const detailsCertificateLink = document.getElementById('details-certificate-link');
const imagePreviewModal = document.getElementById('image-preview-modal');
const imagePreviewCloseButton = document.getElementById('image-preview-close-btn');
const imagePreviewContent = document.getElementById('image-preview-content');
const documentPreviewModal = document.getElementById('document-preview-modal');
const documentPreviewCloseButton = document.getElementById('document-preview-close-btn');
const documentPreviewFrame = document.getElementById('document-preview-frame');
const documentPreviewFallback = document.getElementById('document-preview-fallback');
const documentPreviewDownload = document.getElementById('document-preview-download');

let activities = [];
let currentFilter = DEFAULT_FILTER;
let editingId = null;
let pendingDeleteId = null;
let editingImages = [];
let editingCertificate = null;
let selectedImageFiles = [];

function initializeApp() {
  setTodayAsDefaultDate();
  activities = loadActivities();
  attachEventListeners();
  renderFeed();
  renderIcons();
}

function loadActivities() {
  const savedActivities = localStorage.getItem(STORAGE_KEY);

  if (!savedActivities) {
    return [];
  }

  try {
    return JSON.parse(savedActivities).map((activity) => ({
      ...activity,
      description: activity.description || '',
      images: Array.isArray(activity.images) ? activity.images : [],
      certificate: activity.certificate || null
    }));
  } catch {
    return [];
  }
}

function saveActivities() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  renderFeed();
}

function renderFeed() {
  const visibleActivities = getVisibleActivities();

  if (visibleActivities.length === 0) {
    activityList.innerHTML = EMPTY_STATE_MARKUP;
    renderIcons();
    return;
  }

  activityList.innerHTML = visibleActivities.map(createActivityMarkup).join('');
  renderIcons();
}

function getVisibleActivities() {
  if (currentFilter === DEFAULT_FILTER) {
    return activities;
  }

  return activities.filter((activity) => activity.category === currentFilter);
}

function createActivityMarkup(activity) {
  const safeId = escapeHtml(activity.id);
  const safeName = escapeHtml(activity.name);
  const safeCategory = escapeHtml(activity.category);
  const iconName = ICONS_BY_CATEGORY[activity.category] || ICONS_BY_CATEGORY.Default;
  const formattedDate = formatDate(activity.date);
  const previewText = activity.description
    ? escapeHtml(createDescriptionPreview(activity.description))
    : 'No description added.';
  const attachmentLabel = createAttachmentPreview(activity);

  return `
    <div class="activity-item" onclick="openActivityDetails('${safeId}')">
      <div style="flex: 1; display: flex; justify-content: space-between; align-items: center; width: 100%;">
        <div class="item-info">
          <h3>${safeName}</h3>
          <span>${formattedDate}</span>
          <p class="item-preview">${previewText}</p>
          ${attachmentLabel ? `<p class="item-preview">${attachmentLabel}</p>` : ''}
        </div>
        <div>
          <span class="badge badge-${safeCategory}">
            <i data-lucide="${iconName}"></i>
            ${safeCategory}
          </span>
        </div>
      </div>
      <div class="item-actions">
        <button class="btn-action edit" onclick="handleEditClick(event, '${safeId}')">
          <i data-lucide="edit-2"></i>
        </button>
        <button class="btn-action delete" onclick="handleDeleteClick(event, '${safeId}')">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    </div>
  `;
}

function createAttachmentPreview(activity) {
  const imageCount = Array.isArray(activity.images) ? activity.images.length : 0;
  const hasCertificate = Boolean(activity.certificate);
  const parts = [];

  if (imageCount > 0) {
    parts.push(`${imageCount} image${imageCount === 1 ? '' : 's'}`);
  }

  if (hasCertificate) {
    parts.push('certificate');
  }

  if (parts.length === 0) {
    return '';
  }

  return `Attachments: ${parts.join(' • ')}`;
}

function formatDate(dateValue) {
  return new Date(dateValue).toLocaleDateString('en-US', DATE_FORMAT_OPTIONS);
}

function escapeHtml(value) {
  const element = document.createElement('p');
  element.appendChild(document.createTextNode(value));
  return element.innerHTML;
}

function createDescriptionPreview(description) {
  const singleLineDescription = description.replace(/\s+/g, ' ').trim();
  const maxLength = 90;

  if (singleLineDescription.length <= maxLength) {
    return singleLineDescription;
  }

  return `${singleLineDescription.slice(0, maxLength)}...`;
}

function setTodayAsDefaultDate() {
  inputDate.valueAsDate = new Date();
}

function clearAttachmentInputs() {
  selectedImageFiles = [];
  inputImages.value = '';
  inputCertificate.value = '';
}

function updateRemoveImagesButton() {
  const hasSelectedImages = selectedImageFiles.length > 0;
  const hasExistingImages = editingImages.length > 0;
  const shouldShow = Boolean(editingId) && (hasSelectedImages || hasExistingImages);
  removeImagesButton.classList.toggle('hidden', !shouldShow);
}

function updateRemoveCertificateButton() {
  const hasSelectedCertificate = Boolean(inputCertificate.files?.[0]);
  const hasExistingCertificate = Boolean(editingCertificate);
  const shouldShow = Boolean(editingId) && (hasSelectedCertificate || hasExistingCertificate);
  removeCertificateButton.classList.toggle('hidden', !shouldShow);
}

function setFormMode(isEditing) {
  formTitle.textContent = isEditing ? EDIT_FORM_TITLE : DEFAULT_FORM_TITLE;
  submitButton.innerHTML = isEditing ? EDIT_SUBMIT_LABEL : DEFAULT_SUBMIT_LABEL;
  cancelEditButton.classList.toggle('hidden', !isEditing);
  updateAttachmentSummary();
  updateRemoveImagesButton();
  updateRemoveCertificateButton();
  renderIcons();
}

function resetForm() {
  editingId = null;
  editingImages = [];
  editingCertificate = null;
  inputName.value = '';
  setTodayAsDefaultDate();
  inputDescription.value = '';
  clearAttachmentInputs();
  setFormMode(false);
}

function startEditing(id) {
  const activity = activities.find((item) => item.id === id);

  if (!activity) {
    return;
  }

  editingId = activity.id;
  inputName.value = activity.name;
  selectCategory.value = activity.category;
  inputDate.value = activity.date;
  inputDescription.value = activity.description || '';
  editingImages = Array.isArray(activity.images) ? [...activity.images] : [];
  editingCertificate = activity.certificate || null;
  selectedImageFiles = [];
  inputImages.value = '';
  inputCertificate.value = '';
  setFormMode(true);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function addActivity(name, category, date, description, images, certificate) {
  activities.unshift({
    id: Date.now().toString(),
    name,
    category,
    date,
    description,
    images,
    certificate
  });
}

function updateActivity(id, name, category, date, description, images, certificate) {
  const activity = activities.find((item) => item.id === id);

  if (!activity) {
    return;
  }

  activity.name = name;
  activity.category = category;
  activity.date = date;
  activity.description = description;
  activity.images = images;
  activity.certificate = certificate;
}

function openConfirmModal(id) {
  pendingDeleteId = id;
  confirmModal.classList.add('is-visible');
  confirmModal.setAttribute('aria-hidden', 'false');
}

function closeConfirmModal() {
  pendingDeleteId = null;
  confirmModal.classList.remove('is-visible');
  confirmModal.setAttribute('aria-hidden', 'true');
}

function openDetailsModal(id) {
  const activity = activities.find((item) => item.id === id);

  if (!activity) {
    return;
  }

  const iconName = ICONS_BY_CATEGORY[activity.category] || ICONS_BY_CATEGORY.Default;
  detailsModalDate.textContent = formatDate(activity.date);
  detailsModalName.textContent = activity.name;
  detailsModalCategory.className = `badge badge-${activity.category}`;
  detailsModalCategory.innerHTML = `
    <i data-lucide="${iconName}"></i>
    ${escapeHtml(activity.category)}
  `;
  detailsModalDescription.textContent = activity.description || 'No description added.';
  renderDetailsImages(activity.images || []);
  renderDetailsCertificate(activity.certificate || null);
  detailsModal.classList.add('is-visible');
  detailsModal.setAttribute('aria-hidden', 'false');
  renderIcons();
}

function closeDetailsModal() {
  detailsModal.classList.remove('is-visible');
  detailsModal.setAttribute('aria-hidden', 'true');
}

function openImagePreview(imageUrl) {
  imagePreviewContent.src = imageUrl;
  imagePreviewModal.classList.add('is-visible');
  imagePreviewModal.setAttribute('aria-hidden', 'false');
}

function closeImagePreview() {
  imagePreviewContent.src = '';
  imagePreviewModal.classList.remove('is-visible');
  imagePreviewModal.setAttribute('aria-hidden', 'true');
}

function showDocumentFallback(certificate) {
  documentPreviewFrame.classList.add('hidden');
  documentPreviewFallback.classList.remove('hidden');
  documentPreviewDownload.href = certificate.dataUrl;
  documentPreviewDownload.textContent = `Open ${certificate.name}`;
}

function openDocumentPreview() {
  const certificate = detailsCertificateLink.certificateData;

  if (!certificate) {
    return;
  }

  if (certificate.type.startsWith('image/')) {
    openImagePreview(certificate.dataUrl);
    return;
  }

  documentPreviewFrame.classList.remove('hidden');
  documentPreviewFallback.classList.add('hidden');
  documentPreviewDownload.href = certificate.dataUrl;
  documentPreviewDownload.textContent = `Open ${certificate.name}`;
  documentPreviewFrame.src = certificate.dataUrl;

  documentPreviewModal.classList.add('is-visible');
  documentPreviewModal.setAttribute('aria-hidden', 'false');
}

function closeDocumentPreview() {
  documentPreviewFrame.src = '';
  documentPreviewModal.classList.remove('is-visible');
  documentPreviewModal.setAttribute('aria-hidden', 'true');
}

function handleDocumentPreviewError() {
  const certificate = detailsCertificateLink.certificateData;

  if (!certificate) {
    return;
  }

  showDocumentFallback(certificate);
}

function renderDetailsImages(images) {
  if (!images.length) {
    detailsImages.innerHTML = '';
    detailsImagesSection.classList.add('hidden');
    return;
  }

  detailsImages.innerHTML = images
    .map(
      (image) => `<button type="button" class="image-preview-trigger" onclick="openImagePreview('${image.dataUrl}')">
        <img src="${image.dataUrl}" alt="${escapeHtml(image.name)}" />
      </button>`
    )
    .join('');
  detailsImagesSection.classList.remove('hidden');
}

function renderDetailsCertificate(certificate) {
  if (!certificate) {
    detailsCertificateLink.textContent = '';
    detailsCertificateLink.certificateData = null;
    detailsCertificateSection.classList.add('hidden');
    return;
  }

  detailsCertificateLink.textContent = certificate.name;
  detailsCertificateLink.certificateData = certificate;
  detailsCertificateSection.classList.remove('hidden');
}

function deletePendingActivity() {
  if (!pendingDeleteId) {
    return;
  }

  const idToDelete = pendingDeleteId;
  activities = activities.filter((activity) => activity.id !== idToDelete);

  if (editingId === idToDelete) {
    resetForm();
  }

  closeConfirmModal();
  saveActivities();
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const name = inputName.value.trim();
  if (!name) {
    return;
  }

  const category = selectCategory.value;
  const date = inputDate.value;
  const description = inputDescription.value.trim();
  const images = await getImagesForSubmit();
  const certificate = await getCertificateForSubmit();

  if (images === null) {
    return;
  }

  if (editingId) {
    updateActivity(editingId, name, category, date, description, images, certificate);
    resetForm();
  } else {
    addActivity(name, category, date, description, images, certificate);
    inputName.value = '';
    inputDescription.value = '';
    setTodayAsDefaultDate();
    clearAttachmentInputs();
    updateAttachmentSummary();
  }

  saveActivities();
}

async function getImagesForSubmit() {
  if (selectedImageFiles.length === 0) {
    return editingId ? editingImages : [];
  }

  return Promise.all(selectedImageFiles.map(readFileAsAttachment));
}

async function getCertificateForSubmit() {
  const file = inputCertificate.files?.[0];

  if (!file) {
    return editingId ? editingCertificate : null;
  }

  return readFileAsAttachment(file);
}

function readFileAsAttachment(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve({
        name: file.name,
        type: file.type,
        dataUrl: reader.result
      });
    };

    reader.onerror = () => {
      reject(new Error(`Failed to read file: ${file.name}`));
    };

    reader.readAsDataURL(file);
  });
}

function handleFilterChange(event) {
  currentFilter = event.target.value;
  renderFeed();
}

function handleModalBackdropClick(event) {
  if (event.target === confirmModal) {
    closeConfirmModal();
  }
}

function handleEscapeKey(event) {
  if (event.key !== 'Escape') {
    return;
  }

  if (confirmModal.classList.contains('is-visible')) {
    closeConfirmModal();
  }

  if (detailsModal.classList.contains('is-visible')) {
    closeDetailsModal();
  }

  if (imagePreviewModal.classList.contains('is-visible')) {
    closeImagePreview();
  }

  if (documentPreviewModal.classList.contains('is-visible')) {
    closeDocumentPreview();
  }
}

function handleEditClick(event, id) {
  event.stopPropagation();
  startEditing(id);
}

function handleDeleteClick(event, id) {
  event.stopPropagation();
  openConfirmModal(id);
}

function handleDetailsModalBackdropClick(event) {
  if (event.target === detailsModal) {
    closeDetailsModal();
  }
}

function handleImagePreviewBackdropClick(event) {
  if (event.target === imagePreviewModal) {
    closeImagePreview();
  }
}

function handleDocumentPreviewBackdropClick(event) {
  if (event.target === documentPreviewModal) {
    closeDocumentPreview();
  }
}

function handleImageSelection() {
  const incomingFiles = Array.from(inputImages.files || []);

  if (incomingFiles.length === 0) {
    return;
  }

  const remainingSlots = MAX_IMAGE_COUNT - selectedImageFiles.length;

  if (remainingSlots <= 0) {
    window.alert(`You can upload a maximum of ${MAX_IMAGE_COUNT} images.`);
    inputImages.value = '';
    return;
  }

  const filesToAdd = incomingFiles.slice(0, remainingSlots);
  selectedImageFiles = [...selectedImageFiles, ...filesToAdd];

  if (incomingFiles.length > remainingSlots) {
    window.alert(`Only ${MAX_IMAGE_COUNT} images can be attached to one log.`);
  }

  inputImages.value = '';

  updateAttachmentSummary();
  updateRemoveImagesButton();
}

function handleCertificateSelection() {
  updateAttachmentSummary();
  updateRemoveCertificateButton();
}

function handleRemoveImages() {
  if (selectedImageFiles.length > 0) {
    selectedImageFiles = [];
  } else {
    editingImages = [];
  }

  inputImages.value = '';
  updateAttachmentSummary();
  updateRemoveImagesButton();
}

function handleRemoveCertificate() {
  const hasSelected = Boolean(inputCertificate.files?.[0]);

  if (hasSelected) {
    inputCertificate.value = '';
  } else {
    editingCertificate = null;
  }

  updateAttachmentSummary();
  updateRemoveCertificateButton();
}

function updateAttachmentSummary() {
  const nextCertificate = inputCertificate.files?.[0] || null;
  const currentImages = selectedImageFiles.length > 0
    ? selectedImageFiles
    : editingId
      ? editingImages
      : [];
  const currentCertificate = editingId && !nextCertificate ? editingCertificate : nextCertificate;
  const parts = [];

  if (currentImages.length > 0) {
    const imageNames = currentImages.map((image) => image.name).join(', ');
    parts.push(`Images: ${currentImages.length} (${imageNames})`);
  }

  if (currentCertificate) {
    parts.push(`Certificate: ${currentCertificate.name}`);
  }

  if (parts.length === 0) {
    attachmentSummary.textContent = '';
    attachmentSummary.classList.add('hidden');
    return;
  }

  attachmentSummary.textContent = parts.join(' | ');
  attachmentSummary.classList.remove('hidden');
}

function attachEventListeners() {
  form.addEventListener('submit', handleFormSubmit);
  filterSelect.addEventListener('change', handleFilterChange);
  cancelEditButton.addEventListener('click', resetForm);
  inputImages.addEventListener('change', handleImageSelection);
  inputCertificate.addEventListener('change', handleCertificateSelection);
  removeImagesButton.addEventListener('click', handleRemoveImages);
  removeCertificateButton.addEventListener('click', handleRemoveCertificate);
  confirmDeleteButton.addEventListener('click', deletePendingActivity);
  confirmCancelButton.addEventListener('click', closeConfirmModal);
  confirmModal.addEventListener('click', handleModalBackdropClick);
  detailsCloseButton.addEventListener('click', closeDetailsModal);
  detailsModal.addEventListener('click', handleDetailsModalBackdropClick);
  detailsCertificateLink.addEventListener('click', openDocumentPreview);
  imagePreviewCloseButton.addEventListener('click', closeImagePreview);
  imagePreviewModal.addEventListener('click', handleImagePreviewBackdropClick);
  documentPreviewCloseButton.addEventListener('click', closeDocumentPreview);
  documentPreviewModal.addEventListener('click', handleDocumentPreviewBackdropClick);
  documentPreviewFrame.addEventListener('error', handleDocumentPreviewError);
  document.addEventListener('keydown', handleEscapeKey);
}

function renderIcons() {
  lucide.createIcons();
}

window.editActivity = startEditing;
window.requestDeleteActivity = openConfirmModal;
window.openActivityDetails = openDetailsModal;
window.openImagePreview = openImagePreview;
window.handleEditClick = handleEditClick;
window.handleDeleteClick = handleDeleteClick;

initializeApp();
