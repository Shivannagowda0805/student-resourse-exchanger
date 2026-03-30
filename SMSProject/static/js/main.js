// Main JavaScript for Student Resource Exchange

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');

    if (mobileMenuToggle && navList) {
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navList.classList.toggle('active');

            // Update hamburger animation
            const lines = this.querySelectorAll('.hamburger-line');
            if (!isExpanded) {
                lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                lines[1].style.opacity = '0';
                lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                lines[0].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuToggle.contains(event.target) && !navList.contains(event.target)) {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                navList.classList.remove('active');
                const lines = mobileMenuToggle.querySelectorAll('.hamburger-line');
                lines[0].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            }
        });
    }

    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!validateForm(form)) {
                event.preventDefault();
            }
        });
    });

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                event.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading states to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.type === 'submit') {
                this.innerHTML = '<span class="loading"></span> Loading...';
                this.disabled = true;
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.card, .feature-card, .testimonial-card');
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Keyboard navigation improvements
    document.addEventListener('keydown', function(event) {
        // Close mobile menu with Escape key
        if (event.key === 'Escape' && navList && navList.classList.contains('active')) {
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            navList.classList.remove('active');
        }
    });
    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Enhanced search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                // Could implement live search suggestions here
                console.log('Search query:', this.value);
            }, 300);
        });
    }

    // FAB interaction
    const fab = document.querySelector('.fab');
    if (fab) {
        fab.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            this.appendChild(ripple);

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
            ripple.style.top = e.clientY - rect.top - size / 2 + 'px';

            setTimeout(() => ripple.remove(), 600);
        });
    }

    // Resource card hover effects
    const resourceCards = document.querySelectorAll('.resource-card');
    resourceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Form enhancement
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    });

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Check for messages from Django
    const messages = document.querySelectorAll('.messages li');
    messages.forEach(message => {
        const text = message.textContent.trim();
        const type = message.classList.contains('success') ? 'success' :
                    message.classList.contains('error') ? 'error' : 'info';
        showNotification(text, type);
    });

    // ========================================
    // New Functionality for Student Resource Exchange
    // ========================================

    // Global search functionality
    const globalSearchInput = document.getElementById('global-search');
    const globalSearchBtn = document.getElementById('global-search-btn');

    if (globalSearchBtn && globalSearchInput) {
        globalSearchBtn.addEventListener('click', () => {
            const query = globalSearchInput.value.trim();
            if (query) {
                // Search across all sections
                performGlobalSearch(query);
            }
        });

        globalSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                globalSearchBtn.click();
            }
        });
    }

    // Department Selection
    const departmentCards = document.querySelectorAll('.department-card');
    let selectedDepartment = 'all';

    departmentCards.forEach(card => {
        card.addEventListener('click', function() {
            departmentCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            selectedDepartment = this.dataset.department;
            filterResourcesByDepartment(selectedDepartment);
        });
    });

    // Question Papers Search and Filter
    const qpSearchInput = document.getElementById('question-paper-search');
    const qpDepartmentFilter = document.getElementById('qp-department-filter');
    const qpSemesterFilter = document.getElementById('qp-semester-filter');

    if (qpSearchInput) {
        qpSearchInput.addEventListener('input', debounce(() => {
            filterQuestionPapers();
        }, 300));
    }

    if (qpDepartmentFilter) {
        qpDepartmentFilter.addEventListener('change', filterQuestionPapers);
    }

    if (qpSemesterFilter) {
        qpSemesterFilter.addEventListener('change', filterQuestionPapers);
    }

    // Notes Search and Filter
    const notesSearchInput = document.getElementById('notes-search');
    const notesDepartmentFilter = document.getElementById('notes-department-filter');
    const notesSemesterFilter = document.getElementById('notes-semester-filter');

    if (notesSearchInput) {
        notesSearchInput.addEventListener('input', debounce(() => {
            filterNotes();
        }, 300));
    }

    if (notesDepartmentFilter) {
        notesDepartmentFilter.addEventListener('change', filterNotes);
    }

    if (notesSemesterFilter) {
        notesSemesterFilter.addEventListener('change', filterNotes);
    }

    // Textbooks Search and Filter
    const textbooksSearchInput = document.getElementById('textbooks-search');
    const textbooksDepartmentFilter = document.getElementById('textbooks-department-filter');
    const textbooksSemesterFilter = document.getElementById('textbooks-semester-filter');

    if (textbooksSearchInput) {
        textbooksSearchInput.addEventListener('input', debounce(() => {
            filterTextbooks();
        }, 300));
    }

    if (textbooksDepartmentFilter) {
        textbooksDepartmentFilter.addEventListener('change', filterTextbooks);
    }

    if (textbooksSemesterFilter) {
        textbooksSemesterFilter.addEventListener('change', filterTextbooks);
    }

    // Modal functionality
    const uploadNotesBtn = document.getElementById('upload-notes-btn');
    const uploadNotesModal = document.getElementById('upload-notes-modal');
    const uploadTextbooksBtn = document.getElementById('upload-textbooks-btn');
    const uploadTextbooksModal = document.getElementById('upload-textbooks-modal');
    const modalCloses = document.querySelectorAll('.modal-close');

    if (uploadNotesBtn && uploadNotesModal) {
        uploadNotesBtn.addEventListener('click', () => {
            uploadNotesModal.style.display = 'flex';
        });
    }

    if (uploadTextbooksBtn && uploadTextbooksModal) {
        uploadTextbooksBtn.addEventListener('click', () => {
            uploadTextbooksModal.style.display = 'flex';
        });
    }

    modalCloses.forEach(close => {
        close.addEventListener('click', () => {
            close.closest('.modal').style.display = 'none';
        });
    });

    // File upload drag and drop
    const fileUploadAreas = document.querySelectorAll('.file-upload-area');

    fileUploadAreas.forEach(area => {
        const input = area.parentNode.querySelector('input[type="file"]');
        const link = area.querySelector('.upload-link');

        if (link) {
            link.addEventListener('click', () => {
                input.click();
            });
        }

        area.addEventListener('dragover', (e) => {
            e.preventDefault();
            area.classList.add('dragover');
        });

        area.addEventListener('dragleave', () => {
            area.classList.remove('dragover');
        });

        area.addEventListener('drop', (e) => {
            e.preventDefault();
            area.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                input.files = files;
                updateFileUploadDisplay(area, files[0]);
            }
        });

        input.addEventListener('change', () => {
            if (input.files.length > 0) {
                updateFileUploadDisplay(area, input.files[0]);
            }
        });
    });

    // Form submissions
    const uploadNotesForm = document.getElementById('upload-notes-form');
    const uploadTextbooksForm = document.getElementById('upload-textbooks-form');

    if (uploadNotesForm) {
        uploadNotesForm.addEventListener('submit', handleNotesUpload);
    }

    if (uploadTextbooksForm) {
        uploadTextbooksForm.addEventListener('submit', handleTextbooksUpload);
    }

    // Chatbot functionality
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');

    if (chatbotToggle && chatbotContainer) {
        chatbotToggle.addEventListener('click', () => {
            const isVisible = chatbotContainer.style.display !== 'none';
            chatbotContainer.style.display = isVisible ? 'none' : 'flex';
        });
    }

    if (chatbotClose) {
        chatbotClose.addEventListener('click', () => {
            chatbotContainer.style.display = 'none';
        });
    }

    if (chatbotSend && chatbotInput) {
        chatbotSend.addEventListener('click', sendChatMessage);
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }

    // Focus management
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary)';
            this.style.outlineOffset = '2px';
        });

        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });

    // Initialize with sample data
    initializeSampleData();
});

// Form validation function
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        // Remove existing error messages
        const existingError = input.parentNode.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }

        // Check required fields
        if (input.hasAttribute('required') && !input.value.trim()) {
            showError(input, 'This field is required');
            isValid = false;
        }

        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                showError(input, 'Please enter a valid email address');
                isValid = false;
            }
        }

        // Password validation
        if (input.type === 'password' && input.value) {
            if (input.value.length < 8) {
                showError(input, 'Password must be at least 8 characters long');
                isValid = false;
            }
        }
    });

    return isValid;
}

function showError(input, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    errorElement.textContent = message;

    input.parentNode.appendChild(errorElement);
    input.style.borderColor = 'var(--error)';

    // Remove error styling after user starts typing
    input.addEventListener('input', function() {
        this.style.borderColor = '';
        const error = this.parentNode.querySelector('.form-error');
        if (error) {
            error.remove();
        }
    }, { once: true });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimization: Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
lazyLoadImages();

// ========================================
// New Functionality for Student Resource Exchange
// ========================================

    // Global search functionality
    const departmentCards = document.querySelectorAll('.department-card');
    let selectedDepartment = 'all';

    departmentCards.forEach(card => {
        card.addEventListener('click', function() {
            departmentCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            selectedDepartment = this.dataset.department;
            filterResourcesByDepartment(selectedDepartment);
        });
    });

    // Question Papers Search and Filter
    const qpSearchInput = document.getElementById('question-paper-search');
    const qpDepartmentFilter = document.getElementById('qp-department-filter');
    const qpSemesterFilter = document.getElementById('qp-semester-filter');

    if (qpSearchInput) {
        qpSearchInput.addEventListener('input', debounce(() => {
            filterQuestionPapers();
        }, 300));
    }

    if (qpDepartmentFilter) {
        qpDepartmentFilter.addEventListener('change', filterQuestionPapers);
    }

    if (qpSemesterFilter) {
        qpSemesterFilter.addEventListener('change', filterQuestionPapers);
    }

    // Notes Search and Filter
    const notesSearchInput = document.getElementById('notes-search');
    const notesDepartmentFilter = document.getElementById('notes-department-filter');
    const notesSemesterFilter = document.getElementById('notes-semester-filter');

    if (notesSearchInput) {
        notesSearchInput.addEventListener('input', debounce(() => {
            filterNotes();
        }, 300));
    }

    if (notesDepartmentFilter) {
        notesDepartmentFilter.addEventListener('change', filterNotes);
    }

    if (notesSemesterFilter) {
        notesSemesterFilter.addEventListener('change', filterNotes);
    }

    // Textbooks Search and Filter
    const textbooksSearchInput = document.getElementById('textbooks-search');
    const textbooksDepartmentFilter = document.getElementById('textbooks-department-filter');
    const textbooksSemesterFilter = document.getElementById('textbooks-semester-filter');

    if (textbooksSearchInput) {
        textbooksSearchInput.addEventListener('input', debounce(() => {
            filterTextbooks();
        }, 300));
    }

    if (textbooksDepartmentFilter) {
        textbooksDepartmentFilter.addEventListener('change', filterTextbooks);
    }

    if (textbooksSemesterFilter) {
        textbooksSemesterFilter.addEventListener('change', filterTextbooks);
    }

    // Modal functionality
    const uploadNotesBtn = document.getElementById('upload-notes-btn');
    const uploadNotesModal = document.getElementById('upload-notes-modal');
    const uploadTextbooksBtn = document.getElementById('upload-textbooks-btn');
    const uploadTextbooksModal = document.getElementById('upload-textbooks-modal');
    const modalCloses = document.querySelectorAll('.modal-close');

    if (uploadNotesBtn && uploadNotesModal) {
        uploadNotesBtn.addEventListener('click', () => {
            uploadNotesModal.style.display = 'flex';
        });
    }

    if (uploadTextbooksBtn && uploadTextbooksModal) {
        uploadTextbooksBtn.addEventListener('click', () => {
            uploadTextbooksModal.style.display = 'flex';
        });
    }

    modalCloses.forEach(close => {
        close.addEventListener('click', () => {
            close.closest('.modal').style.display = 'none';
        });
    });

    // File upload drag and drop
    const fileUploadAreas = document.querySelectorAll('.file-upload-area');

    fileUploadAreas.forEach(area => {
        const input = area.parentNode.querySelector('input[type="file"]');
        const link = area.querySelector('.upload-link');

        if (link) {
            link.addEventListener('click', () => {
                input.click();
            });
        }

        area.addEventListener('dragover', (e) => {
            e.preventDefault();
            area.classList.add('dragover');
        });

        area.addEventListener('dragleave', () => {
            area.classList.remove('dragover');
        });

        area.addEventListener('drop', (e) => {
            e.preventDefault();
            area.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                input.files = files;
                updateFileUploadDisplay(area, files[0]);
            }
        });

        input.addEventListener('change', () => {
            if (input.files.length > 0) {
                updateFileUploadDisplay(area, input.files[0]);
            }
        });
    });

    // Form submissions
    const uploadNotesForm = document.getElementById('upload-notes-form');
    const uploadTextbooksForm = document.getElementById('upload-textbooks-form');

    if (uploadNotesForm) {
        uploadNotesForm.addEventListener('submit', handleNotesUpload);
    }

    if (uploadTextbooksForm) {
        uploadTextbooksForm.addEventListener('submit', handleTextbooksUpload);
    }

    // Chatbot functionality
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');

    if (chatbotToggle && chatbotContainer) {
        chatbotToggle.addEventListener('click', () => {
            const isVisible = chatbotContainer.style.display !== 'none';
            chatbotContainer.style.display = isVisible ? 'none' : 'flex';
        });
    }

    if (chatbotClose) {
        chatbotClose.addEventListener('click', () => {
            chatbotContainer.style.display = 'none';
        });
    }

    if (chatbotSend && chatbotInput) {
        chatbotSend.addEventListener('click', sendChatMessage);
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }

    // Global search functionality
    const globalSearchInput = document.getElementById('global-search');
    const globalSearchBtn = document.getElementById('global-search-btn');

    if (globalSearchBtn && globalSearchInput) {
        globalSearchBtn.addEventListener('click', () => {
            const query = globalSearchInput.value.trim();
            if (query) {
                // Search across all sections
                performGlobalSearch(query);
            }
        });

        globalSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                globalSearchBtn.click();
            }
        });
    }

// ========================================
// Helper Functions
// ========================================

function filterResourcesByDepartment(department) {
    // This would filter all resources by department
    // For now, just update the filters
    const departmentFilters = document.querySelectorAll('select[id$="-department-filter"]');
    departmentFilters.forEach(filter => {
        if (department === 'all') {
            filter.value = '';
        } else {
            filter.value = department;
        }
        // Trigger change event
        filter.dispatchEvent(new Event('change'));
    });
}

function filterQuestionPapers() {
    const searchTerm = document.getElementById('question-paper-search').value.toLowerCase();
    const departmentFilter = document.getElementById('qp-department-filter').value;
    const semesterFilter = document.getElementById('qp-semester-filter').value;
    const grid = document.getElementById('question-papers-grid');
    const emptyState = document.getElementById('qp-empty-state');

    const cards = grid.querySelectorAll('.resource-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const title = card.querySelector('.resource-title').textContent.toLowerCase();
        const department = card.dataset.department;
        const semester = card.dataset.semester;
        const subject = card.dataset.subject.toLowerCase();

        const matchesSearch = !searchTerm || title.includes(searchTerm) || subject.includes(searchTerm);
        const matchesDepartment = !departmentFilter || department === departmentFilter;
        const matchesSemester = !semesterFilter || semester === semesterFilter;

        if (matchesSearch && matchesDepartment && matchesSemester) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    emptyState.style.display = visibleCount === 0 ? 'flex' : 'none';
}

function filterNotes() {
    const searchTerm = document.getElementById('notes-search').value.toLowerCase();
    const departmentFilter = document.getElementById('notes-department-filter').value;
    const semesterFilter = document.getElementById('notes-semester-filter').value;
    const grid = document.getElementById('notes-grid');
    const emptyState = document.getElementById('notes-empty-state');

    const cards = grid.querySelectorAll('.resource-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const title = card.querySelector('.resource-title').textContent.toLowerCase();
        const department = card.dataset.department;
        const semester = card.dataset.semester;
        const subject = card.dataset.subject.toLowerCase();

        const matchesSearch = !searchTerm || title.includes(searchTerm) || subject.includes(searchTerm);
        const matchesDepartment = !departmentFilter || department === departmentFilter;
        const matchesSemester = !semesterFilter || semester === semesterFilter;

        if (matchesSearch && matchesDepartment && matchesSemester) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    emptyState.style.display = visibleCount === 0 ? 'flex' : 'none';
}

function filterTextbooks() {
    const searchTerm = document.getElementById('textbooks-search').value.toLowerCase();
    const departmentFilter = document.getElementById('textbooks-department-filter').value;
    const semesterFilter = document.getElementById('textbooks-semester-filter').value;
    const grid = document.getElementById('textbooks-grid');
    const emptyState = document.getElementById('textbooks-empty-state');

    const cards = grid.querySelectorAll('.resource-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const title = card.querySelector('.resource-title').textContent.toLowerCase();
        const department = card.dataset.department;
        const semester = card.dataset.semester;
        const author = card.dataset.author.toLowerCase();
        const subject = card.dataset.subject.toLowerCase();

        const matchesSearch = !searchTerm || title.includes(searchTerm) || author.includes(searchTerm) || subject.includes(searchTerm);
        const matchesDepartment = !departmentFilter || department === departmentFilter;
        const matchesSemester = !semesterFilter || semester === semesterFilter;

        if (matchesSearch && matchesDepartment && matchesSemester) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    emptyState.style.display = visibleCount === 0 ? 'flex' : 'none';
}

function updateFileUploadDisplay(area, file) {
    const content = area.querySelector('.file-upload-content p');
    content.textContent = `Selected: ${file.name}`;
}

function handleNotesUpload(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const fileInput = form.querySelector('input[type="file"]');
    const file = fileInput.files[0];

    // Validate file
    if (!file) {
        showNotification('Please select a file to upload', 'error');
        return;
    }

    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
        showNotification('Please upload a PDF, DOC, DOCX, or TXT file', 'error');
        return;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        showNotification('File size must be less than 10MB', 'error');
        return;
    }

    // Validate form fields
    const title = formData.get('title');
    const subject = formData.get('subject');
    const department = formData.get('department');
    const semester = formData.get('semester');

    if (!title || !subject || !department || !semester) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Simulate upload
    showNotification('Notes uploaded successfully!', 'success');
    form.closest('.modal').style.display = 'none';
    form.reset();

    // In a real app, this would send data to server and refresh the notes list
    setTimeout(() => {
        location.reload(); // Temporary solution
    }, 1000);
}

function handleTextbooksUpload(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const fileInput = form.querySelector('input[type="file"]');
    const file = fileInput.files[0];

    // Validate file
    if (!file) {
        showNotification('Please select a file to upload', 'error');
        return;
    }

    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/epub+zip'];
    if (!allowedTypes.includes(file.type)) {
        showNotification('Please upload a PDF, DOC, DOCX, or EPUB file', 'error');
        return;
    }

    // Check file size (max 50MB for textbooks)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
        showNotification('File size must be less than 50MB', 'error');
        return;
    }

    // Validate form fields
    const title = formData.get('title');
    const author = formData.get('author');
    const subject = formData.get('subject');
    const department = formData.get('department');
    const semester = formData.get('semester');

    if (!title || !author || !subject || !department || !semester) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Simulate upload
    showNotification('Textbook uploaded successfully!', 'success');
    form.closest('.modal').style.display = 'none';
    form.reset();

    // In a real app, this would send data to server and refresh the textbooks list
    setTimeout(() => {
        location.reload(); // Temporary solution
    }, 1000);
}

function sendChatMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    if (!message) return;

    addChatMessage(message, 'user');
    input.value = '';

    // Simulate bot response
    setTimeout(() => {
        const response = getChatbotResponse(message);
        addChatMessage(response, 'bot');
    }, 1000);
}

function addChatMessage(message, type) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;

    messageDiv.innerHTML = `
        <div class="message-avatar">${type === 'bot' ? '🤖' : '👤'}</div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getChatbotResponse(message) {
    const responses = {
        'notes': 'You can find notes by selecting your department and using the search feature in the Notes section. You can also upload your own notes to help others!',
        'question papers': 'Check out the Previous Year Question Papers section. Filter by department and semester to find relevant papers.',
        'textbooks': 'Browse textbooks in the Textbooks section. You can search by title, author, or subject.',
        'upload': 'Click the "Upload" buttons in the Notes or Textbooks sections to share your materials with the community.',
        'department': 'Select your department at the top to filter resources specific to your course.',
        'help': 'I can help you find notes, question papers, textbooks, or guide you on how to upload materials. What do you need?',
        'default': 'I\'m here to help you with finding study materials, uploading resources, or answering questions about the platform. How can I assist you today?'
    };

    const lowerMessage = message.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }
    return responses.default;
}

function initializeSampleData() {
    // Sample question papers
    const questionPapers = [
        { title: 'Data Structures Mid-term 2023', subject: 'Data Structures', department: 'cse', semester: '4', examType: 'Mid-term' },
        { title: 'Database Systems Final 2023', subject: 'Database Systems', department: 'cse', semester: '5', examType: 'Final' },
        { title: 'Digital Electronics Quiz 2023', subject: 'Digital Electronics', department: 'ece', semester: '3', examType: 'Quiz' },
        { title: 'Thermodynamics Final 2022', subject: 'Thermodynamics', department: 'mechanical', semester: '6', examType: 'Final' },
        { title: 'Civil Engineering Drawing 2023', subject: 'Engineering Drawing', department: 'civil', semester: '2', examType: 'Mid-term' }
    ];

    const qpGrid = document.getElementById('question-papers-grid');
    if (qpGrid) {
        questionPapers.forEach(paper => {
            const card = createQuestionPaperCard(paper);
            qpGrid.appendChild(card);
        });
    }

    // Sample notes
    const notes = [
        { title: 'Algorithm Analysis Notes', subject: 'Algorithms', department: 'cse', semester: '6', uploader: 'John Doe', date: '2024-01-15' },
        { title: 'Circuit Theory Handwritten Notes', subject: 'Circuit Theory', department: 'ece', semester: '4', uploader: 'Jane Smith', date: '2024-01-10' },
        { title: 'Fluid Mechanics Study Guide', subject: 'Fluid Mechanics', department: 'mechanical', semester: '5', uploader: 'Bob Johnson', date: '2024-01-08' },
        { title: 'Structural Analysis Notes', subject: 'Structural Analysis', department: 'civil', semester: '7', uploader: 'Alice Brown', date: '2024-01-05' }
    ];

    const notesGrid = document.getElementById('notes-grid');
    if (notesGrid) {
        notes.forEach(note => {
            const card = createNotesCard(note);
            notesGrid.appendChild(card);
        });
    }

    // Sample textbooks
    const textbooks = [
        { title: 'Introduction to Algorithms', author: 'Cormen et al.', subject: 'Algorithms', department: 'cse', semester: '6', fileSize: '15.2 MB' },
        { title: 'Digital Design', author: 'Morris Mano', subject: 'Digital Electronics', department: 'ece', semester: '4', fileSize: '8.7 MB' },
        { title: 'Thermodynamics: An Engineering Approach', author: 'Cengel', subject: 'Thermodynamics', department: 'mechanical', semester: '5', fileSize: '22.1 MB' },
        { title: 'Structural Analysis', author: 'Hibbeler', subject: 'Structural Engineering', department: 'civil', semester: '7', fileSize: '18.5 MB' }
    ];

    const textbooksGrid = document.getElementById('textbooks-grid');
    if (textbooksGrid) {
        textbooks.forEach(book => {
            const card = createTextbookCard(book);
            textbooksGrid.appendChild(card);
        });
    }
}

function createQuestionPaperCard(paper) {
    const card = document.createElement('div');
    card.className = 'resource-card';
    card.dataset.department = paper.department;
    card.dataset.semester = paper.semester;
    card.dataset.subject = paper.subject;

    card.innerHTML = `
        <div class="resource-card-header">
            <h3 class="resource-title">${paper.title}</h3>
            <div class="resource-meta">
                <span class="resource-meta-item">${paper.subject}</span>
                <span class="resource-meta-item">${paper.examType}</span>
            </div>
        </div>
        <div class="resource-card-body">
            <div class="resource-meta">
                <span class="resource-meta-item">${getDepartmentName(paper.department)}</span>
                <span class="resource-meta-item">Semester ${paper.semester}</span>
            </div>
        </div>
        <div class="resource-card-footer">
            <button class="download-btn">Download PDF</button>
        </div>
    `;

    card.querySelector('.download-btn').addEventListener('click', () => {
        showNotification('Download started!', 'success');
    });

    return card;
}

function createNotesCard(note) {
    const card = document.createElement('div');
    card.className = 'resource-card';
    card.dataset.department = note.department;
    card.dataset.semester = note.semester;
    card.dataset.subject = note.subject;

    card.innerHTML = `
        <div class="resource-card-header">
            <h3 class="resource-title">${note.title}</h3>
            <div class="resource-meta">
                <span class="resource-meta-item">${note.subject}</span>
            </div>
        </div>
        <div class="resource-card-body">
            <div class="resource-meta">
                <span class="resource-meta-item">${getDepartmentName(note.department)}</span>
                <span class="resource-meta-item">Semester ${note.semester}</span>
            </div>
            <div class="resource-stats">
                <span>By ${note.uploader}</span>
                <span>${note.date}</span>
            </div>
        </div>
        <div class="resource-card-footer">
            <button class="download-btn">Download</button>
        </div>
    `;

    card.querySelector('.download-btn').addEventListener('click', () => {
        showNotification('Download started!', 'success');
    });

    return card;
}

function createTextbookCard(book) {
    const card = document.createElement('div');
    card.className = 'resource-card';
    card.dataset.department = book.department;
    card.dataset.semester = book.semester;
    card.dataset.author = book.author;
    card.dataset.subject = book.subject;

    card.innerHTML = `
        <div class="resource-card-header">
            <h3 class="resource-title">${book.title}</h3>
            <p class="resource-description">by ${book.author}</p>
        </div>
        <div class="resource-card-body">
            <div class="resource-meta">
                <span class="resource-meta-item">${book.subject}</span>
                <span class="resource-meta-item">${getDepartmentName(book.department)}</span>
                <span class="resource-meta-item">Semester ${book.semester}</span>
            </div>
            <div class="resource-stats">
                <span>File size: ${book.fileSize}</span>
            </div>
        </div>
        <div class="resource-card-footer">
            <button class="download-btn">Download</button>
        </div>
    `;

    card.querySelector('.download-btn').addEventListener('click', () => {
        showNotification('Download started!', 'success');
    });

    return card;
}

function getDepartmentName(department) {
    const names = {
        'cse': 'Computer Science',
        'ise': 'Information Science',
        'ece': 'Electronics & Communication',
        'eee': 'Electrical & Electronics',
        'mechanical': 'Mechanical',
        'civil': 'Civil',
        'other': 'Other'
    };
    return names[department] || department;
}

function performGlobalSearch(query) {
    const lowerQuery = query.toLowerCase();

    // Update all search inputs
    document.getElementById('question-paper-search').value = query;
    document.getElementById('notes-search').value = query;
    document.getElementById('textbooks-search').value = query;

    // Trigger all filters
    filterQuestionPapers();
    filterNotes();
    filterTextbooks();

    // Scroll to results
    document.getElementById('question-papers-section').scrollIntoView({ behavior: 'smooth' });

    showNotification(`Searching for "${query}" across all resources`, 'info');
}