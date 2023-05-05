const fs = require('fs');
const dayjs = require('dayjs');
/*
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

   <url>

      <loc>http://www.example.com/</loc>

      <lastmod>2005-01-01</lastmod>

      <changefreq>monthly</changefreq>

      <priority>0.8</priority>

   </url>

</urlset> 

*/

const start = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

const end = `
  </urlset>
 `;

const URL = 'https://jjongtaeng.github.io/linkevery/';
const lastmod = dayjs().format('YYYY-MM-DD');
const changefreq = 'monthly';
const priority = 0.5;

const url = `
<url>
  <loc>${URL}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>${changefreq}</changefreq>
  <priority>${priority}</priority>
</url>

`;

fs.writeFile('./public/sitemap.xml', start + url + end, (err) => {
  console.log(err);
});
