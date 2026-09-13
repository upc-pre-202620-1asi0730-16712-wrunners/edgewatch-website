const DEFAULT_LANG = 'en_US';
const STORAGE_KEY = 'edgewatch_lang';

function getCurrentLanguage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && translations[stored]) {
    return stored;
  }
  return DEFAULT_LANG;
}

function setLanguage(lang) {
  if (!translations[lang]) {
    console.warn(`[i18n] Language "${lang}" is not supported. Falling back to "${DEFAULT_LANG}".`);
    lang = DEFAULT_LANG;
  }

  const dict = translations[lang];

  document.documentElement.lang = lang === 'es_419' ? 'es-419' : 'en-US';

  if (dict.doc_title) {
    document.title = dict.doc_title;
  }
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && dict.doc_desc) {
    metaDesc.setAttribute('content', dict.doc_desc);
  }

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      el.textContent = dict[key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key] !== undefined) {
      el.setAttribute('placeholder', dict[key]);
    }
  });

  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    if (dict[key] !== undefined) {
      el.setAttribute('aria-label', dict[key]);
    }
  });

  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const key = el.getAttribute('data-i18n-alt');
    if (dict[key] !== undefined) {
      el.setAttribute('alt', dict[key]);
    }
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    const btnLang = btn.getAttribute('data-lang');
    const isActive = btnLang === lang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (e) {
    console.warn('[i18n] Could not save language to localStorage:', e);
  }

  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang, dict } }));
}

document.addEventListener('DOMContentLoaded', () => {
  const initialLang = getCurrentLanguage();
  setLanguage(initialLang);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetLang = btn.getAttribute('data-lang');
      if (targetLang) {
        setLanguage(targetLang);
      }
    });
  });
});
