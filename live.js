// LIVE status: public data/live-status.json, updated by scheduled automation after deployment.
(() => {
  const banner = document.getElementById('live-banner');
  const link = document.getElementById('live-link');
  const title = document.getElementById('live-title');
  if (!banner || !link || !title) return;
  const channelLive = 'https://www.youtube.com/@Hakuro_Mashiro/live';
  async function refresh() {
    try {
      // The test parameter is for local preview only; never used on normal visits.
      const test = new URLSearchParams(location.search).get('live_test');
      if (test === 'on') { show({live:true,title:'【表示テスト】配信中の表示例',url:channelLive}); return; }
      if (test === 'off') { banner.hidden = true; return; }
      const response = await fetch('data/live-status.json?t=' + Date.now(), {cache:'no-store'});
      if (!response.ok) throw new Error('Status unavailable');
      const data = await response.json();
      // A stale status must not leave a false LIVE indicator visible indefinitely.
      const checked = Date.parse(data.checkedAt);
      if (!Number.isFinite(checked) || Date.now() - checked > 20 * 60 * 1000 || checked > Date.now() + 60 * 1000) throw new Error('Stale status');
      show(data);
    } catch (_) { banner.hidden = true; }
  }
  function show(data) {
    const validUrl = typeof data.url === 'string' && /^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(data.url);
    if (data.live !== true || !validUrl) { banner.hidden = true; return; }
    title.textContent = typeof data.title === 'string' && data.title.trim() ? data.title.slice(0,140) : 'YouTubeで配信を見る';
    link.href = data.url;
    banner.hidden = false;
  }
  refresh();
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  setInterval(() => { if (!document.hidden) refresh(); }, 60 * 1000);
})();
