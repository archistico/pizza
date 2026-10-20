const CDN = 'https://cdn.jsdelivr.net/npm/vue@3.5.44/dist/vue.global.prod.js';

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const timeout = setTimeout(() => fail(), 5000);
    function fail() {
      clearTimeout(timeout);
      script.remove();
      reject(new Error(`Impossibile caricare ${src}`));
    }
    script.src = src;
    script.onload = () => { clearTimeout(timeout); resolve(); };
    script.onerror = fail;
    document.head.appendChild(script);
  });
}

export async function loadVue() {
  if (window.Vue) return;
  try { await loadScript(CDN); }
  catch { await loadScript('assets/vendor/vue.global.prod.js'); }
  if (!window.Vue) throw new Error('Vue non disponibile');
}
