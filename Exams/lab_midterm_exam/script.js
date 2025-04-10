
    let currentTask = '';
    let currentView = 'desktop';

    function loadTask(taskPath) {
        // Store current task path
        currentTask = taskPath;

    // Get the iframe and placeholder elements
    const iframe = document.getElementById('task-frame');
    const placeholder = document.getElementById('placeholder-message');

    // Set the iframe source
    iframe.src = taskPath;

    // Apply the current view settings
    applyViewSettings();

    // Hide placeholder and show iframe
    placeholder.style.display = 'none';
    iframe.style.display = 'block';

    // Add a loading indicator if needed
    iframe.onload = function () {
        console.log('Task loaded successfully');
            };

    iframe.onerror = function () {
        console.error('Failed to load task');
    placeholder.textContent = 'Failed to load task. Please try again.';
    placeholder.style.display = 'flex';
    iframe.style.display = 'none';
            };
        }

    function changeView(viewType) {
        // Update current view
        currentView = viewType;

    // Update active button
    document.getElementById('mobile-view').classList.remove('btn-active');
    document.getElementById('tablet-view').classList.remove('btn-active');
    document.getElementById('desktop-view').classList.remove('btn-active');
    document.getElementById(viewType + '-view').classList.add('btn-active');

    // If a task is already loaded, apply the new view settings
    if (currentTask) {
        applyViewSettings();
            }
        }

    function applyViewSettings() {
            const iframe = document.getElementById('task-frame');

    // Apply different width based on view type
    switch (currentView) {
                case 'mobile':
    iframe.style.width = '375px';
    iframe.style.height = '667px';
    iframe.style.margin = '0 auto';
    iframe.style.display = 'block';
    break;
    case 'tablet':
    iframe.style.width = '768px';
    iframe.style.height = '1024px';
    iframe.style.margin = '0 auto';
    iframe.style.display = 'block';
    break;
    case 'desktop':
    default:
    iframe.style.width = '100%';
    iframe.style.height = '600px';
    iframe.style.margin = '0';
    break;
            }
        }
