function loadUsabilityStyles() {
  if (document.querySelector('link[data-sunshine-usability]')) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'usability.css?v=20261027-1';
  link.dataset.sunshineUsability = 'true';
  document.head.appendChild(link);
}

function getVisibleCopyText(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return '';

  return element.textContent
    .replace(/\u00a0/g, ' ')
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function copyBlock(elementId, successMessage) {
  const text = getVisibleCopyText(elementId);

  if (!text) {
    showToast('Nothing to copy yet');
    return;
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => showToast(successMessage))
      .catch(() => fallbackCopy(text, successMessage));
  } else {
    fallbackCopy(text, successMessage);
  }
}

function fallbackCopy(text, successMessage) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  showToast(successMessage);
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = '✅ ' + message;
  toast.classList.add('show');

  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

function enhanceNavigation() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const firstStepLink = nav.querySelector('a[href="#firststep"]');
  const chapter5Link = nav.querySelector('a[href="#chapter5"]');
  if (firstStepLink && chapter5Link) {
    nav.insertBefore(firstStepLink, chapter5Link);
  }

  const chat1Link = nav.querySelector('a[href="#chat1"]');
  const chat2Link = nav.querySelector('a[href="#chat2"]');
  if (chat1Link) chat1Link.textContent = '📋 Copy Announcements 1';
  if (chat2Link) chat2Link.textContent = '📋 Copy Announcements 2';
}

function enhanceQuickGuide() {
  const card = document.getElementById('start');
  const content = card?.querySelector('.content');
  if (!card || !content) return;

  card.classList.add('compact-legend-card');
  content.innerHTML = `
    <div class="quick-guide-row">
      <h2 class="quick-guide-title">Quick Guide</h2>
      <div class="legend-pills" aria-label="Dashboard key">
        <span class="legend-pill legend-say">💬 <strong>SAY</strong><span>read aloud</span></span>
        <span class="legend-pill legend-do">✅ <strong>DO</strong><span>leader action</span></span>
        <span class="legend-pill legend-copy">📋 <strong>COPY</strong><span>paste to Zoom</span></span>
      </div>
    </div>
    <details class="guide-details">
      <summary>What do these mean?</summary>
      <div class="guide-details-body">
        <p><strong>SAY</strong> means read the text out loud.</p>
        <p><strong>DO</strong> means leader directions only. Do not read them out loud.</p>
        <p><strong>COPY</strong> means use the copy button and paste the text into Zoom chat.</p>
      </div>
    </details>
  `;
}

function enhanceBeforeMeeting() {
  const card = document.getElementById('before');
  const content = card?.querySelector('.content');
  if (!content) return;

  content.innerHTML = `
    <h2>Before the Meeting Starts</h2>
    <p class="before-intro">Open these three pages before the meeting begins:</p>
    <div class="before-actions">
      <a class="before-action" href="https://www.aa.org/sites/default/files/2021-11/en_bigbook_chapt5.pdf" target="_blank" rel="noopener">
        <span class="before-action-icon">📖</span>
        <span><strong>Open Chapter 5</strong><small>How It Works</small></span>
      </a>
      <a class="before-action" href="https://www.aa.org/daily-reflections" target="_blank" rel="noopener">
        <span class="before-action-icon">⭐</span>
        <span><strong>Open Daily Reflection</strong><small>Today's reading</small></span>
      </a>
      <a class="before-action" href="https://docs.google.com/document/d/1NadSeUQ7gs01p3T3j9mKy98ddi4QYPoduhAAmuck3Oc/edit?usp=sharing" target="_blank" rel="noopener">
        <span class="before-action-icon">📄</span>
        <span><strong>Open Full Script</strong><small>Backup Google Doc</small></span>
      </a>
    </div>
    <p class="before-note">✓ You do not need to claim host or ask for readers before the meeting starts. Those happen during the meeting.</p>
  `;
}

function enhanceHero() {
  const hero = document.querySelector('.hero.hero-banner-wrap');
  if (!hero || hero.querySelector('.hero-signup-button')) return;

  const button = document.createElement('a');
  button.className = 'hero-signup-button';
  button.href = 'https://signup.com/go/HtoYOkj';
  button.target = '_blank';
  button.rel = 'noopener';
  button.textContent = '🙋 Sign Up to Lead a Meeting';
  hero.appendChild(button);
}

function fixStepNumbers() {
  const closingHeading = document.querySelector('#closing h2');
  const hostHeading = document.querySelector('#host h2');

  if (closingHeading) closingHeading.textContent = '9. Close at 8:30 AM';
  if (hostHeading) hostHeading.textContent = '10. Host Reminder';
}

function setupScrollSpy() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const items = links
    .map(link => ({
      link,
      section: document.querySelector(link.getAttribute('href'))
    }))
    .filter(item => item.section);

  if (!items.length) return;

  let ticking = false;
  let lastActive = null;

  function keepActiveLinkVisible(link) {
    if (nav.scrollHeight <= nav.clientHeight) return;

    const linkTop = link.offsetTop;
    const linkBottom = linkTop + link.offsetHeight;
    const visibleTop = nav.scrollTop + 12;
    const visibleBottom = nav.scrollTop + nav.clientHeight - 12;

    if (linkTop < visibleTop || linkBottom > visibleBottom) {
      const target = linkTop - (nav.clientHeight / 2) + (link.offsetHeight / 2);
      nav.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
    }
  }

  function updateActiveLink() {
    let current = items[0];

    items.forEach(item => {
      if (item.section.getBoundingClientRect().top < 180) current = item;
    });

    items.forEach(item => {
      const isActive = item === current;
      item.link.classList.toggle('active', isActive);
      if (isActive) {
        item.link.setAttribute('aria-current', 'step');
      } else {
        item.link.removeAttribute('aria-current');
      }
    });

    if (current.link !== lastActive) {
      keepActiveLinkVisible(current.link);
      lastActive = current.link;
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateActiveLink();
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateActiveLink();
}

function initializeDashboardEnhancements() {
  loadUsabilityStyles();
  enhanceNavigation();
  enhanceQuickGuide();
  enhanceBeforeMeeting();
  enhanceHero();
  fixStepNumbers();
  setupScrollSpy();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDashboardEnhancements);
} else {
  initializeDashboardEnhancements();
}

function copyAndOpen(blockId, detailsId, message) {
  copyBlock(blockId, message);

  const details = document.getElementById(detailsId);
  if (details) details.open = true;
}
