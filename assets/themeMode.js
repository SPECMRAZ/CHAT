const toggleTheme = document.querySelector('.themeBtn')

let darkTheme = false;

if (window.matchMedia && window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  prefersDark ? darkTheme = true : darkTheme = false;
} else {
  darkTheme = false;
}

if (darkTheme) document.documentElement.setAttribute('data-theme', 'dark');

toggleTheme.innerHTML = darkTheme ? '<img src="/sunny.png" alt="" class="sunImg">' :  '<img src="/moon.png" alt="" class="moonImg">'


toggleTheme.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  toggleTheme.innerHTML = document.documentElement.getAttribute('data-theme') === 'dark' ? '<img src="/sunny.png" alt="" class="sunImg">' :  '<img src="/moon.png" alt="" class="moonImg">';
})