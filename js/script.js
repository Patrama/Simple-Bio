const grid = document.getElementById('grid');
const gridBtn = document.getElementById('gridBtn');
const listBtn = document.getElementById('listBtn');

gridBtn.addEventListener('click', () => {
  grid.classList.remove('list-view');
  gridBtn.classList.add('active'); gridBtn.setAttribute('aria-pressed','true');
  listBtn.classList.remove('active'); listBtn.setAttribute('aria-pressed','false');
});

listBtn.addEventListener('click', () => {
  grid.classList.add('list-view');
  listBtn.classList.add('active'); listBtn.setAttribute('aria-pressed','true');
  gridBtn.classList.remove('active'); gridBtn.setAttribute('aria-pressed','false');
});
