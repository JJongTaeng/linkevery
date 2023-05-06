const fs = require('fs');
const dayjs = require('dayjs');

const start = `---
---
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

const end = `
  </urlset>
 `;

const URL = 'https://jjongtaeng.github.io/linkevery/';
const lastmod = dayjs().format('YYYY-MM-DDTHH:mm:ss+00:00');
const changefreq = 'daily';
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
