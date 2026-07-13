// Runs immediately in <head>, before CSS paints, so there's no flash
// of the wrong theme on load.
(function () {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  if (theme === 'dark') document.documentElement.classList.add('dark');
})();
