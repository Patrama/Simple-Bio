This page currently uses the system default font stack (via
Tailwind), so no font files are required.

If you want a custom font later:
1. Add the .woff2 file(s) here.
2. In css/style.css, add:

   @font-face {
     font-family: 'YourFont';
     src: url('../font/YourFont.woff2') format('woff2');
   }

3. Apply it with a Tailwind arbitrary class, e.g.
   class="font-['YourFont']"
