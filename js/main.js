(function () {
  'use strict';

  var CONFIG = window.SNM_CONFIG || { leads: { provider: 'console' }, analytics: {} };
  var CONSENT_KEY = 'snm_consent';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Armazenamento seguro (modo anônimo pode bloquear) ---------- */
  function storageGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function storageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* ignora */ }
  }

  /* ---------- Header: estado ao rolar ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu mobile ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  navToggle.addEventListener('click', function () {
    var open = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) {
      navToggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    }
  });

  /* ---------- Revelar seções ao rolar ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Mockup: demonstração de busca ---------- */
  var DEMOS = [
    { query: 'ABC1D23', result: 'auto' },
    { query: '123.456.789-09', result: 'all' },
    { query: 'Mariana Oliv', result: 'all' },
  ];
  var searchText = document.getElementById('demo-query');
  var resultsEl = document.getElementById('demo-results');
  var countEl = document.getElementById('demo-count');

  function showResults(kind) {
    var cards = resultsEl.querySelectorAll('[data-kind]');
    var visible = 0;
    cards.forEach(function (card) {
      var show = kind === 'all' || card.getAttribute('data-kind') === kind;
      card.hidden = !show;
      if (show) visible++;
    });
    countEl.textContent = visible === 1 ? '1 apólice encontrada' : visible + ' apólices encontradas';
    resultsEl.classList.add('is-ready');
  }

  function runDemo(index) {
    var demo = DEMOS[index % DEMOS.length];
    var i = 0;
    resultsEl.classList.remove('is-ready');
    searchText.textContent = '';
    var typer = setInterval(function () {
      i++;
      searchText.textContent = demo.query.slice(0, i);
      if (i >= demo.query.length) {
        clearInterval(typer);
        setTimeout(function () { showResults(demo.result); }, 280);
        setTimeout(function () { runDemo(index + 1); }, 4200);
      }
    }, 95);
  }

  if (searchText && resultsEl) {
    if (reduceMotion) {
      searchText.textContent = DEMOS[0].query;
      showResults(DEMOS[0].result);
    } else {
      runDemo(0);
    }
  }

  /* ---------- Formulário de lista de espera ---------- */
  var form = document.getElementById('lead-form');
  var phoneInput = document.getElementById('lead-whatsapp');
  var statusEl = document.getElementById('lead-status');
  var submitBtn = form.querySelector('button[type="submit"]');

  function formatPhone(value) {
    var d = value.replace(/\D/g, '').slice(0, 11);
    if (d.length === 0) return '';
    if (d.length <= 2) return '(' + d;
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }
  phoneInput.addEventListener('input', function () {
    phoneInput.value = formatPhone(phoneInput.value);
  });

  function setFieldError(input, message) {
    var field = input.closest('.field');
    var msg = field.querySelector('.field-error');
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    field.classList.toggle('has-error', Boolean(message));
    if (msg) msg.textContent = message || '';
  }

  function validate(data) {
    var errors = {};
    if (data.nome.trim().length < 2) errors.nome = 'Informe seu nome.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) errors.email = 'Informe um e-mail válido.';
    var digits = data.whatsapp.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 11 || Number(digits.slice(0, 2)) < 11) {
      errors.whatsapp = 'Informe um WhatsApp com DDD.';
    } else if (digits.length === 11 && digits[2] !== '9') {
      errors.whatsapp = 'Celular deve começar com 9 após o DDD.';
    }
    if (!data.consentimento) errors.consentimento = 'Precisamos do seu consentimento para entrar em contato.';
    return errors;
  }

  function getUtm() {
    var params = new URLSearchParams(window.location.search);
    var utm = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(function (k) {
      if (params.get(k)) utm[k] = params.get(k);
    });
    return utm;
  }

  function sendLead(payload) {
    var leads = CONFIG.leads || {};
    if (leads.provider === 'webhook' && leads.webhookUrl) {
      return fetch(leads.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
      });
    }
    console.info('[SeguroNaMão] Lead (modo console — nada foi enviado):', payload);
    return new Promise(function (resolve) { setTimeout(resolve, 600); });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    // Honeypot anti-spam: humanos não veem este campo.
    if (form.elements.empresa_site.value) return;

    var data = {
      nome: form.elements.nome.value,
      email: form.elements.email.value,
      whatsapp: form.elements.whatsapp.value,
      consentimento: form.elements.consentimento.checked,
    };
    var errors = validate(data);
    setFieldError(form.elements.nome, errors.nome);
    setFieldError(form.elements.email, errors.email);
    setFieldError(form.elements.whatsapp, errors.whatsapp);
    setFieldError(form.elements.consentimento, errors.consentimento);

    var firstInvalid = ['nome', 'email', 'whatsapp', 'consentimento'].filter(function (k) { return errors[k]; })[0];
    if (firstInvalid) {
      form.elements[firstInvalid].focus();
      return;
    }

    var payload = {
      nome: data.nome.trim(),
      email: data.email.trim().toLowerCase(),
      whatsapp: '+55' + data.whatsapp.replace(/\D/g, ''),
      consentimento: true,
      consentimento_em: new Date().toISOString(),
      origem: 'landing-lista-espera',
      pagina: window.location.href.split('?')[0],
      utm: getUtm(),
    };

    submitBtn.disabled = true;
    submitBtn.classList.add('is-loading');

    sendLead(payload)
      .then(function () {
        form.classList.add('is-done');
        document.getElementById('lead-success').hidden = false;
        document.getElementById('lead-success-name').textContent = payload.nome.split(' ')[0];
        trackLead();
      })
      .catch(function () {
        statusEl.textContent = 'Não conseguimos registrar agora. Tente novamente em instantes.';
        statusEl.className = 'form-status is-error';
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.classList.remove('is-loading');
      });
  });

  /* ---------- Consentimento de cookies + analytics ---------- */
  var analytics = CONFIG.analytics || {};
  var hasAnalytics = Boolean(analytics.ga4Id || analytics.metaPixelId);
  var banner = document.getElementById('cookie-banner');

  function loadScript(src) {
    var s = document.createElement('script');
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  }

  function loadAnalytics() {
    if (analytics.ga4Id) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', analytics.ga4Id, { anonymize_ip: true });
      loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(analytics.ga4Id));
    }
    if (analytics.metaPixelId) {
      /* Snippet oficial do Meta Pixel */
      !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
        t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
      }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', analytics.metaPixelId);
      window.fbq('track', 'PageView');
    }
  }

  function trackLead() {
    if (window.gtag) window.gtag('event', 'generate_lead', { method: 'lista_espera' });
    if (window.fbq) window.fbq('track', 'Lead');
  }

  function setConsent(value) {
    storageSet(CONSENT_KEY, value);
    banner.hidden = true;
    if (value === 'granted') loadAnalytics();
  }

  if (hasAnalytics) {
    var consent = storageGet(CONSENT_KEY);
    if (consent === 'granted') loadAnalytics();
    else if (consent !== 'denied') banner.hidden = false;

    document.getElementById('cookie-accept').addEventListener('click', function () { setConsent('granted'); });
    document.getElementById('cookie-decline').addEventListener('click', function () { setConsent('denied'); });
  }

  var manage = document.getElementById('cookie-manage');
  if (manage) {
    manage.hidden = !hasAnalytics;
    manage.addEventListener('click', function (e) {
      e.preventDefault();
      banner.hidden = false;
    });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
