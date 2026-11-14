
'use strict';

// Entire portfolio is dependency-free: a simple website that works on GitHub Pages.
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// Accessible, reduced-motion-friendly mobile navigation.
const menuButton = $('#menu-button');
const mainNav = $('#main-nav');
if (menuButton && mainNav) {
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    mainNav.classList.remove('is-open');
  };
  menuButton.addEventListener('click', () => {
    const shouldOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(shouldOpen));
    menuButton.setAttribute('aria-label', shouldOpen ? 'Close navigation' : 'Open navigation');
    mainNav.classList.toggle('is-open', shouldOpen);
  });
  $$('a', mainNav).forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
}

// A real, interactive chart with intentionally fictional sample data.
const demoRanges = {
  7: { users: '6,218', flows: '2,046', usersTrend: '+4.8%', flowsTrend: '+3.6%', bars: [43, 68, 57, 70, 81, 67, 91, 85, 78, 96] },
  30: { users: '24,680', flows: '8,492', usersTrend: '+12.4%', flowsTrend: '+8.1%', bars: [44, 62, 53, 73, 65, 86, 78, 93, 72, 96] },
  90: { users: '68,340', flows: '26,104', usersTrend: '+17.6%', flowsTrend: '+11.2%', bars: [30, 42, 49, 44, 59, 64, 75, 72, 86, 97] },
};
const dashboardChart = $('#chart-bars');
function updateDemo(range) {
  const data = demoRanges[range];
  if (!data || !dashboardChart) return;
  $('#metric-users').textContent = data.users;
  $('#metric-flows').textContent = data.flows;
  $('#metric-users-trend').textContent = `↗ ${data.usersTrend}`;
  $('#metric-flows-trend').textContent = `↗ ${data.flowsTrend}`;
  $$('#chart-bars span').forEach((bar, index) => bar.style.setProperty('--height', `${data.bars[index]}%`));
  $('#demo-chart').setAttribute('aria-label', `Fictional engagement bar chart over ${range} days`);
  $$('[data-range]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.range === String(range))));
}
$$('[data-range]').forEach((button) => button.addEventListener('click', () => updateDemo(button.dataset.range)));

// Project filters retain cards in the DOM for search engines and accessibility.
$$('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    $$('[data-filter]').forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    $$('.project-card').forEach((card) => { card.hidden = selected !== 'all' && card.dataset.stack !== selected; });
  });
});

const caseStudies = {
  analytics: {
    id: '01 / DATA PRODUCTS', category: 'REACT · TYPESCRIPT · REDUX', title: 'Financial analytics dashboard',
    summary: 'Giving enterprise users a clearer way to explore financial and operational information.',
    challenge: 'The interface needed to handle large, changing datasets without making filtering, sorting or drill-down exploration frustrating.',
    contribution: 'Worked on interactive charts, multi-criteria filtering and data-rich interfaces in React and TypeScript. Applied virtual windowing, debouncing and throttling to keep common interactions responsive, and used typed data contracts when integrating APIs.',
    takeaway: 'Good data interfaces make complexity manageable. The goal was to support fast, trustworthy decisions without overwhelming the user.',
    tech: ['React', 'TypeScript', 'Redux', 'Material UI', 'REST APIs', 'Jest'],
  },
  movie: {
    id: '02 / PERSONAL REACT PROJECT', category: 'REACT · REDUX · TAILWIND CSS', title: 'Movie discovery & search UI',
    summary: 'A personal React practice project exploring film discovery, responsive browsing and an experimental AI-powered search interface.',
    challenge: 'The goal was to practise building a component-based browsing experience, with route navigation, shared state and data from external movie APIs.',
    contribution: 'Built a React interface with browse and login routes, Redux Toolkit state management, Tailwind CSS layouts and components for movie lists and cards. Explored an OpenAI-based search request as an experiment; the search and recommendations flow is still a prototype.',
    takeaway: 'This side project helped me experiment with React architecture, shared state, external APIs and responsive design outside client work.',
    tech: ['React', 'Redux Toolkit', 'Tailwind CSS', 'React Router', 'REST APIs'],
  },
  tutor: {
    id: '03 / LEARNING EXPERIENCE', category: 'ANGULAR · RESPONSIVE DESIGN', title: 'AI Tutor learning app',
    summary: 'A responsive learning experience designed to work across web and mobile.',
    challenge: 'Learning journeys needed to stay clear and engaging on different screen sizes, with an interface suited to students rather than technical users.',
    contribution: 'Built responsive Angular 8 interfaces for web and mobile, translated product needs into UI components and helped deliver consistent interaction patterns across devices.',
    takeaway: 'Educational technology works best when the interface supports the learning — instead of becoming another thing the student has to learn.',
    tech: ['Angular 8', 'JavaScript', 'HTML', 'CSS', 'Responsive UI'],
  },
  student: {
    id: '04 / CUSTOMER PORTALS', category: 'ANGULAR · FORMS · API INTEGRATION', title: 'Student financial portal',
    summary: 'Clearer digital journeys for tuition and other student payments.',
    challenge: 'Payment-related workflows needed structured steps, useful form validation and dependable integration between the interface and backend services.',
    contribution: 'Worked on Angular frontend features for student payment journeys, including dynamic forms, validation, reusable interface elements and REST integrations.',
    takeaway: 'For important workflows, clarity, correctness and helpful feedback matter far more than decorative complexity.',
    tech: ['Angular', 'TypeScript', 'HTML', 'SCSS', 'Forms', 'REST APIs'],
  },
};
const dialog = $('#case-dialog');
if (dialog) {
  $$('[data-project]').forEach((button) => button.addEventListener('click', () => {
    const item = caseStudies[button.dataset.project];
    if (!item) return;
    $('#dialog-index').textContent = item.id;
    $('#dialog-category').textContent = item.category;
    $('#dialog-title').textContent = item.title;
    $('#dialog-summary').textContent = item.summary;
    $('#dialog-challenge').textContent = item.challenge;
    $('#dialog-contribution').textContent = item.contribution;
    $('#dialog-takeaway').textContent = item.takeaway;
    const tags = $('#dialog-tech');
    tags.replaceChildren(...item.tech.map((name) => {
      const chip = document.createElement('span');
      chip.textContent = name;
      return chip;
    }));
    dialog.showModal();
  }));
  $('#dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
}

// Resume printing only applies on resume.html.
$('#print-resume')?.addEventListener('click', () => window.print());

