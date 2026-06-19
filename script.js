// Presentation Setup
let currentSlideIndex = 1;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

const sidebar = document.getElementById('sidebar');
const sidebarNav = document.getElementById('sidebar-nav');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progress = document.getElementById('progress-bar');
const indicator = document.getElementById('slide-indicator');
const toggleSidebarBtn = document.getElementById('toggle-sidebar');

// Initialize Presentation
function initPresentation() {
    buildSidebarMenu();
    updateSlideViewState();
    
    // Keyboard Event Handlers
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return; // Don't intercept typing in inputs
        }
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
            nextSlide();
        } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
            prevSlide();
        } else if (e.key === 'Tab') {
            e.preventDefault();
            toggleSidebar();
        }
    });

    // Sidebar toggler
    toggleSidebarBtn.addEventListener('click', toggleSidebar);
}

// Build Sidebar list dynamically based on slide headers
function buildSidebarMenu() {
    sidebarNav.innerHTML = '';
    slides.forEach((slide, index) => {
        const slideNum = index + 1;
        let title = `Slide ${slideNum}`;
        const header = slide.querySelector('.slide-title');
        if (header) {
            title = header.textContent;
        }

        const navItem = document.createElement('a');
        navItem.className = `nav-item ${slideNum === currentSlideIndex ? 'active' : ''}`;
        navItem.innerHTML = `<span class="nav-number">${slideNum}</span> <span class="nav-title">${title}</span>`;
        navItem.addEventListener('click', () => {
            goToSlide(slideNum);
        });
        sidebarNav.appendChild(navItem);
    });
}

// Navigation Controls
function goToSlide(index) {
    if (index < 1 || index > totalSlides) return;
    
    // Remove positioning classes from all
    slides.forEach(slide => {
        slide.classList.remove('active', 'prev', 'next');
    });

    currentSlideIndex = index;
    updateSlideViewState();
}

function prevSlide() {
    if (currentSlideIndex > 1) {
        goToSlide(currentSlideIndex - 1);
    }
}

function nextSlide() {
    if (currentSlideIndex < totalSlides) {
        goToSlide(currentSlideIndex + 1);
    }
}

function updateSlideViewState() {
    slides.forEach((slide, index) => {
        const slideNum = index + 1;
        if (slideNum === currentSlideIndex) {
            slide.classList.add('active');
        } else if (slideNum < currentSlideIndex) {
            slide.classList.add('prev');
        } else {
            slide.classList.add('next');
        }
    });

    // Update buttons state
    prevBtn.disabled = currentSlideIndex === 1;
    nextBtn.disabled = currentSlideIndex === totalSlides;

    // Progress bar width
    const percentage = ((currentSlideIndex - 1) / (totalSlides - 1)) * 100;
    progress.style.width = `${percentage}%`;

    // Indicator label text
    indicator.textContent = `Slide ${currentSlideIndex} / ${totalSlides}`;

    // Update Sidebar active items
    const navItems = sidebarNav.querySelectorAll('.nav-item');
    navItems.forEach((item, index) => {
        if (index + 1 === currentSlideIndex) {
            item.classList.add('active');
            item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else {
            item.classList.remove('active');
        }
    });

    // Reset scroll position of the slides viewport
    const viewport = document.getElementById('slides-viewport');
    if (viewport) {
        viewport.scrollTop = 0;
        viewport.scrollLeft = 0;
    }
}

function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
}

// Fullscreen API Handling
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            alert(`Error attempting to enable fullscreen mode: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Copy Code Snippet Helper
function copyCode(btn) {
    const code = btn.parentNode.querySelector('code').innerText;
    navigator.clipboard.writeText(code).then(() => {
        const originalText = btn.innerText;
        btn.innerText = 'Copied!';
        btn.style.background = '#10b981';
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = '';
        }, 1500);
    });
}

// --- INTERACTIVE SIMULATORS LOGIC ---

// 1. History Timeline Cards selection
function selectTimeline(year) {
    let message = '';
    switch(year) {
        case 2011:
            message = "In 2011, Jordan Walke, a software engineer at Facebook, created FaxJS, which later evolved into React. It was first deployed on Facebook's News Feed to streamline continuous state updates.";
            break;
        case 2013:
            message = "React was officially open-sourced at JSConf US in May 2013. The combination of JavaScript logic and markup (JSX) was met with extreme skepticism, but proved to be highly productive.";
            break;
        case 2015:
            message = "Facebook released React Native, triggering a revolution in mobile development by enabling native Android and iOS applications with single shared JavaScript layouts.";
            break;
        case 2026:
            message = "Currently the most widely used frontend component library, boasting a massive ecosystem (Next.js, Remix, Redux) and trusted for high-traffic platforms like Netflix, Airbnb, and Instagram.";
            break;
    }
    alert(`📅 Year Details (${year}):\n\n${message}`);
}

// 2. Tab switching helper
function switchTab(groupName, tabId) {
    const headers = event.target.parentNode.querySelectorAll('.tab-header');
    headers.forEach(header => header.classList.remove('active'));
    event.target.classList.add('active');

    const contents = event.target.parentNode.parentNode.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));
    
    const targetContent = document.getElementById(`tab-${groupName}-${tabId}`);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

// 3. Folder Tree Details Explorer
const explorerDetails = {
    'node_modules': {
        title: '📁 node_modules/',
        text: 'This folder contains the complete, cached raw libraries (like React, React-DOM, compilers) download from NPM. Never edit files in this folder manually, and always add this path to your .gitignore file.'
    },
    'public': {
        title: '📁 public/',
        text: 'Holds public resources like logos, icons, favicon, or global configuration manifests. Webpack/Vite compiles them into the final builds directly without mapping dependencies.'
    },
    'index_html': {
        title: '📄 public/index.html',
        text: 'The single web document file of your single-page app. Contains a core root tag: &lt;div id="root"&gt;&lt;/div&gt;, where React injects all your virtual components dynamically.'
    },
    'src': {
        title: '📁 src/',
        text: 'The main coding directory. Contains all Javascript components, CSS files, custom modules, context models, assets, routing paths, or custom helpers.'
    },
    'assets': {
        title: '📁 src/assets/',
        text: 'A directory inside src reserved for images, fonts, logo SVGs, or external resources that are imported directly inside components for Vite compilation.'
    },
    'components': {
        title: '📁 src/components/',
        text: 'The custom standard folder where modular, reusable layouts (like Button, Navbar, Footer, Modal, Card) are written and exported.'
    },
    'app_jsx': {
        title: '⚛️ src/App.jsx',
        text: 'The core component of your app, functioning as the primary root controller where other children layouts are combined, mapped, or conditionally rendered.'
    },
    'app_css': {
        title: '🎨 src/App.css',
        text: 'The default CSS stylesheet that applies styling configurations to App.jsx elements.'
    },
    'main_jsx': {
        title: '⚛️ src/main.jsx (Vite) / index.js (CRA)',
        text: 'The entry point of your Javascript runtime environment. Connects the root element of index.html to the react-dom engine, rendering App.jsx inside the browser viewport.'
    },
    'package_json': {
        title: '⚙️ package.json',
        text: 'The manifest file tracking meta settings, compilation script calls (dev, build, start), and npm dependencies (React, React Router, Redux, etc.).'
    },
    'vite_config': {
        title: '⚙️ vite.config.js',
        text: 'The system configuration file for Vite setups, setting plugins (like @vitejs/plugin-react) and dev server bindings.'
    }
};

function exploreFolder(key) {
    // Highlight tree items
    const treeItems = document.querySelectorAll('.tree-item');
    treeItems.forEach(item => item.classList.remove('selected'));
    
    // Highlight selected item
    event.currentTarget.classList.add('selected');

    const detail = explorerDetails[key];
    if (detail) {
        document.getElementById('explorer-title').innerHTML = detail.title;
        document.getElementById('explorer-text').innerHTML = detail.text;
    }
}

// 4. Conditional Rendering State Toggle
let isCondDemoLogin = false;
let isCondDemoAdmin = false;

function toggleCondDemo(type) {
    const stateDisplay = document.getElementById('conditional-demo-state');
    const authBtn = document.getElementById('cond-auth-btn');
    const adminBtn = document.getElementById('cond-admin-btn');
    const renderDisplay = document.getElementById('cond-render-display');

    if (type === 'auth') {
        isCondDemoLogin = !isCondDemoLogin;
        if (!isCondDemoLogin) {
            isCondDemoAdmin = false;
        }
    } else if (type === 'admin') {
        isCondDemoAdmin = !isCondDemoAdmin;
    }

    // Update buttons
    authBtn.innerText = isCondDemoLogin ? 'Log Out' : 'Log In';
    adminBtn.style.display = isCondDemoLogin ? 'inline-block' : 'none';
    adminBtn.innerText = isCondDemoAdmin ? 'Hide Admin' : 'Show Admin Control';

    // Update display outputs
    if (isCondDemoLogin) {
        stateDisplay.innerText = 'Status: Logged In ✅';
        let adminBadge = isCondDemoAdmin ? '<div class="card-panel" style="background: rgba(16,185,129,0.1); border-color: var(--accent); margin-top: 10px; padding: 10px;"><h4>👑 Admin Settings Opened</h4></div>' : '';
        renderDisplay.innerHTML = `
            <h3>Welcome back, User!</h3>
            <p>You can now see authenticated student features.</p>
            ${adminBadge}
        `;
    } else {
        stateDisplay.innerText = 'Status: Logged Out ❌';
        renderDisplay.innerHTML = `<p>Please log in to see content.</p>`;
    }
}

// 5. useState score counter scoreboard
let cricketScoreVal = 0;
function updateCricketScore(val) {
    const display = document.getElementById('cricket-score');
    if (val === 0) {
        cricketScoreVal = 0;
    } else {
        cricketScoreVal += val;
    }
    display.textContent = cricketScoreVal;
}

// 6. useState change color
function changeDemoColor(color) {
    const swatch = document.getElementById('color-swatch');
    const text = document.getElementById('color-swatch-text');
    
    if (color === 'red') {
        swatch.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
        swatch.style.borderColor = '#ef4444';
        text.style.color = '#ef4444';
        text.innerText = 'Red State Activated!';
    } else if (color === 'blue') {
        swatch.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
        swatch.style.borderColor = '#3b82f6';
        text.style.color = '#3b82f6';
        text.innerText = 'Blue State Activated!';
    } else if (color === 'green') {
        swatch.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
        swatch.style.borderColor = '#10b981';
        text.style.color = '#10b981';
        text.innerText = 'Green State Activated!';
    } else {
        swatch.style.backgroundColor = '';
        swatch.style.borderColor = '';
        text.style.color = '';
        text.innerText = 'This text changes color!';
    }
}

// 7. Props Product card playground
function updatePropsPlayground() {
    const inputName = document.getElementById('prop-input-name').value;
    const inputPrice = document.getElementById('prop-input-price').value;
    const inputStock = document.getElementById('prop-input-stock').checked;

    const previewName = document.getElementById('prop-preview-name');
    const previewPrice = document.getElementById('prop-preview-price');
    const previewStock = document.getElementById('prop-preview-stock');

    previewName.textContent = inputName || 'Unnamed Product';
    previewPrice.textContent = inputPrice || '0';

    if (inputStock) {
        previewStock.textContent = 'In Stock ✅';
        previewStock.className = 'stock-badge stock-in';
    } else {
        previewStock.textContent = 'Out of Stock ❌';
        previewStock.className = 'stock-badge stock-out';
    }
}

// 8. Event Handling sandbox logger
function logEvent(name, detail) {
    const consoleBox = document.getElementById('event-console-output');
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    const logEl = document.createElement('div');
    logEl.className = 'event-log-entry';
    logEl.innerHTML = `<span class="event-log-time">[${timeStr}]</span> <span class="event-log-name">on${name}</span>: <span class="event-log-detail">${detail}</span>`;
    
    consoleBox.appendChild(logEl);
    consoleBox.scrollTop = consoleBox.scrollHeight;
}

// 9. Tailwind class switcher
function toggleTailwindClass(className) {
    const preview = document.getElementById('tailwind-preview-box');
    if (className === 'p-6') {
        preview.classList.toggle('tw-p-6');
    } else if (className === 'bg-slate-800') {
        preview.classList.toggle('tw-bg-slate-800');
    } else if (className === 'rounded-xl') {
        preview.classList.toggle('tw-rounded-xl');
    } else if (className === 'hover-scale') {
        preview.classList.toggle('tw-hover-scale');
    }
}

// 10. useEffect API Fetch simulator logic
let fetchDebounceTimer = null;
function simulateApiFetch() {
    const query = document.getElementById('effect-api-query').value.trim();
    const results = document.getElementById('api-fetch-results');

    if (!query) {
        results.innerHTML = '<p>Type above to simulate API fetch side-effects.</p>';
        return;
    }

    results.innerHTML = `
        <div style="text-align: center;">
            <div class="pulse-element" style="color: var(--primary); margin-bottom: 8px;">⏳ Fetching from API...</div>
            <p style="font-size: 0.8rem; color: var(--text-secondary);">Query: "${query}"</p>
        </div>
    `;

    clearTimeout(fetchDebounceTimer);
    fetchDebounceTimer = setTimeout(() => {
        results.innerHTML = `
            <div style="text-align: left; width: 100%;">
                <h4 style="color: var(--accent); margin-bottom: 6px;">🟢 API Fetch Complete:</h4>
                <ul style="margin: 0; padding-left: 16px; font-size: 0.85rem;">
                    <li>Result 1: React context details for "${query}"</li>
                    <li>Result 2: Hook useState files referencing "${query}"</li>
                    <li>Result 3: Advanced custom layouts mapped</li>
                </ul>
            </div>
        `;
        logEvent('APIResponse', `Loaded data for query: "${query}"`);
    }, 1000);
}

// 11. useContext prop drilling path animation
function toggleDrillVisual(type) {
    if (type === 'drill') {
        alert("Normal Props: Data must be written into the state variables of Parent, passed to Sibling, forwarded through Intermediary, and finally returned in Leaf component. Intermediary component is bloated with unnecessary props!");
    } else {
        alert("useContext Hook: Data is stored in context value wrapper. Leaf component calls useContext() to access data. Intermediary and Sibling components are skipped entirely!");
    }
}

// 12. Mock Router page navigation
function navigateMockRouter(path) {
    const urlSpan = document.getElementById('browser-url-path');
    const content = document.getElementById('mock-router-body');

    urlSpan.textContent = path;

    if (path === '/') {
        content.innerHTML = `
            <h3>🏡 Welcome to Home Page</h3>
            <p>This is dynamic components injected without browser refresh cycles.</p>
        `;
    } else if (path === '/about') {
        content.innerHTML = `
            <h3>ℹ️ About React Router</h3>
            <p>Client-side routing intercepts requests, updates browser path history, and re-renders components locally.</p>
        `;
    } else if (path === '/dashboard') {
        content.innerHTML = `
            <h3>📊 Interactive Student Dashboard</h3>
            <p>Only users who have context tokens can view dashboard statistics.</p>
        `;
    }
}

// 13. React Hook Form mock action
function submitHookFormMock(e) {
    e.preventDefault();
    const email = document.getElementById('form-mock-email').value;
    const password = document.getElementById('form-mock-password').value;

    const emailErr = document.getElementById('form-error-email');
    const passwordErr = document.getElementById('form-error-password');

    let isValid = true;

    if (!email || !email.includes('@')) {
        emailErr.style.display = 'block';
        isValid = false;
    } else {
        emailErr.style.display = 'none';
    }

    if (!password || password.length < 6) {
        passwordErr.style.display = 'block';
        isValid = false;
    } else {
        passwordErr.style.display = 'none';
    }

    if (isValid) {
        alert(`🎉 Form validated and submitted successfully!\n\nEmail: ${email}\nPassword: [Secured]`);
        document.getElementById('form-mock-email').value = '';
        document.getElementById('form-mock-password').value = '';
    }
}

// 14. Redux global store mock dispatcher
let reduxMockCountVal = 0;
function dispatchReduxMock(actionType) {
    const countDisplay = document.getElementById('redux-mock-count');
    if (actionType === 'increment') {
        reduxMockCountVal += 1;
        countDisplay.textContent = reduxMockCountVal;
        alert(`Redux: Action { type: 'counter/increment' } dispatched.\nStore value updated to: ${reduxMockCountVal}`);
    }
}

// 15. Mini Project "PASTE" mock notes saver
let pasteNotes = [];
function addPasteAppNote() {
    const titleInput = document.getElementById('paste-title-input');
    const contentInput = document.getElementById('paste-content-input');
    const notesList = document.getElementById('paste-notes-list');

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
        alert("Please write a title and paste some contents!");
        return;
    }

    const note = { id: Date.now(), title, content };
    pasteNotes.push(note);

    // Refresh UI list
    renderPasteAppNotes();

    titleInput.value = '';
    contentInput.value = '';
}

function renderPasteAppNotes() {
    const notesList = document.getElementById('paste-notes-list');
    
    if (pasteNotes.length === 0) {
        notesList.innerHTML = '<p style="font-size: 0.75rem; color: var(--text-secondary); text-align: center;">No pastes saved yet. Add one above!</p>';
        return;
    }

    notesList.innerHTML = '';
    pasteNotes.forEach(note => {
        const item = document.createElement('div');
        item.style.background = 'rgba(255,255,255,0.05)';
        item.style.border = '1px solid rgba(255,255,255,0.1)';
        item.style.borderRadius = '6px';
        item.style.padding = '8px';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.marginBottom = '4px';

        item.innerHTML = `
            <div>
                <h5 style="margin: 0; color: #fff;">${note.title}</h5>
                <p style="margin: 0; font-size: 0.7rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;">${note.content}</p>
            </div>
            <button class="interactive-btn" style="margin: 0; padding: 4px 8px; font-size: 0.7rem;" onclick="copySinglePaste(${note.id})">Copy</button>
        `;
        notesList.appendChild(item);
    });
}

function copySinglePaste(id) {
    const note = pasteNotes.find(n => n.id === id);
    if (note) {
        navigator.clipboard.writeText(note.content).then(() => {
            alert(`Copied "${note.title}" paste content to clipboard!`);
        });
    }
}

// Parent/Child communicator state lifter callback simulator
function liftStateFromChild(value) {
    const parentDisplay = document.getElementById('lifting-parent-state');
    const childDisplay = document.getElementById('lifting-child-display');
    
    const displayVal = value.trim() || 'Default';
    parentDisplay.textContent = `Current Message: ${displayVal}`;
    childDisplay.textContent = displayVal;
}

// Start presentation setup
window.addEventListener('DOMContentLoaded', initPresentation);
