// MyOS Pomodoro — focus/break cycles.
const KEY = 'myos.pomodoro.count';
const modeEl = document.getElementById('pm-mode');
const timeEl = document.getElementById('pm-time');
const startBtn = document.getElementById('pm-start');
const resetBtn = document.getElementById('pm-reset');
const countEl = document.getElementById('pm-count');
const workIn = document.getElementById('pm-work');
const breakIn = document.getElementById('pm-break');

if (timeEl) {
  let mode = 'Focus', remaining = 25 * 60, running = false, timer = null, done = 0;
  try { done = parseInt(localStorage.getItem(KEY), 10) || 0; } catch (e) {}
  const pad = (n) => String(n).padStart(2, '0');
  const mins = () => (mode === 'Focus' ? parseInt(workIn.value, 10) : parseInt(breakIn.value, 10)) || 1;

  function show() {
    timeEl.textContent = pad(Math.floor(remaining / 60)) + ':' + pad(remaining % 60);
    modeEl.textContent = mode; modeEl.classList.toggle('break', mode === 'Break');
    countEl.textContent = done + (done === 1 ? ' focus session done' : ' focus sessions done');
  }
  function setMode(m) { mode = m; remaining = mins() * 60; show(); }
  function tick() {
    remaining--;
    if (remaining < 0) {
      if (mode === 'Focus') { done++; try { localStorage.setItem(KEY, done); } catch (e) {} setMode('Break'); }
      else setMode('Focus');
      return;
    }
    show();
  }
  startBtn.addEventListener('click', () => {
    running = !running;
    startBtn.textContent = running ? 'Pause' : 'Start';
    if (running) timer = setInterval(tick, 1000); else clearInterval(timer);
  });
  resetBtn.addEventListener('click', () => { clearInterval(timer); running = false; startBtn.textContent = 'Start'; setMode('Focus'); });
  [workIn, breakIn].forEach((el) => el.addEventListener('change', () => { if (!running) remaining = mins() * 60, show(); }));
  setMode('Focus');
}
