// Today’s stream: one manually registered YouTube watch URL; no API calls.
(() => {
  const root = document.getElementById('today-stream');
  const dateEl = document.getElementById('stream-date');
  const titleEl = document.getElementById('stream-title');
  const videoEl = document.getElementById('stream-video');
  const linkEl = document.getElementById('stream-link');
  if (!root || !dateEl || !titleEl || !videoEl || !linkEl) return;
  const jstDate = (date) => new Intl.DateTimeFormat('sv-SE', {timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
  function videoId(url) {
    try {
      const u = new URL(url);
      if (u.protocol !== 'https:') return null;
      let id = null;
      if (['www.youtube.com','youtube.com','m.youtube.com'].includes(u.hostname)) {
        if (u.pathname === '/watch') id = u.searchParams.get('v');
        else if (/^\/(live|embed|shorts)\//.test(u.pathname)) id = u.pathname.split('/')[2];
      } else if (u.hostname === 'youtu.be') id = u.pathname.split('/')[1];
      return /^[a-zA-Z0-9_-]{11}$/.test(id || '') ? id : null;
    } catch { return null; }
  }
  let config = null;
  function render() {
    const id = config && videoId(config.url);
    const day = config && /^\d{4}-\d{2}-\d{2}$/.test(config.date || '') ? config.date : null;
    if (!id || !day || !Number.isFinite(Date.parse(day+'T00:00:00+09:00'))) { root.hidden=true; videoEl.replaceChildren(); return; }
    const now = Date.now();
    const start = Date.parse(day+'T00:00:00+09:00');
    const end = start + 29 * 60 * 60 * 1000; // next day 05:00 JST
    if (now < start || now >= end) { root.hidden=true; videoEl.replaceChildren(); return; }
    dateEl.textContent = day.replaceAll('-','.') + '（JST）';
    titleEl.textContent = typeof config.title === 'string' && config.title.trim() ? config.title : '本日の配信待機所';
    linkEl.href = 'https://www.youtube.com/watch?v=' + id;
    if (!videoEl.firstElementChild) {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + id;
      iframe.title = '本日のYouTube配信';
      iframe.loading = 'lazy';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      videoEl.append(iframe);
    }
    root.hidden = false;
  }
  fetch('data/today-stream.json?t='+Date.now(), {cache:'no-store'})
    .then(r => {if (!r.ok) throw new Error('No stream'); return r.json();})
    .then(data => {config=data; render();})
    .catch(() => {root.hidden=true;});
  document.addEventListener('visibilitychange', () => {if (!document.hidden) render();});
  setInterval(render, 30 * 1000);
})();
