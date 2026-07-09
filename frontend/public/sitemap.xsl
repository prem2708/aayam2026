<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9" exclude-result-prefixes="s">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>XML Sitemap | Aayam TechFest</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Outfit:wght@600;700;800&amp;display=swap" rel="stylesheet" />
        <style>
          body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background-color: #0b0f19;
            background-image: 
              radial-gradient(at 50% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
              radial-gradient(at 0% 0%, rgba(139, 92, 246, 0.08) 0px, transparent 40%),
              radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.05) 0px, transparent 40%);
            background-attachment: fixed;
            color: #e2e8f0;
            margin: 0;
            padding: 60px 20px;
            min-height: 100vh;
            box-sizing: border-box;
          }
          *, *::before, *::after {
            box-sizing: inherit;
          }
          .container {
            max-width: 1100px;
            margin: 0 auto;
          }
          header {
            margin-bottom: 40px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            padding-bottom: 30px;
          }
          h1 {
            font-family: 'Outfit', sans-serif;
            font-size: 2.75rem;
            font-weight: 800;
            margin: 0 0 12px 0;
            background: linear-gradient(135deg, #a5b4fc 0%, #c084fc 50%, #f472b6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -0.02em;
          }
          p.description {
            color: #94a3b8;
            font-size: 1.1rem;
            margin: 0 0 24px 0;
            line-height: 1.6;
          }
          .stats {
            display: flex;
            gap: 20px;
            margin-bottom: 10px;
          }
          .stat-card {
            background: rgba(30, 41, 59, 0.45);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            padding: 20px 24px;
            flex: 1;
            backdrop-filter: blur(16px);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
            transition: transform 0.2s ease, border-color 0.2s ease;
          }
          .stat-card:hover {
            transform: translateY(-2px);
            border-color: rgba(99, 102, 241, 0.3);
          }
          .stat-card .label {
            font-size: 0.8rem;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.07em;
            margin-bottom: 6px;
            font-weight: 600;
          }
          .stat-card .value {
            font-size: 2rem;
            font-weight: 700;
            color: #f8fafc;
            font-family: 'Outfit', sans-serif;
          }
          .table-wrapper {
            background: rgba(15, 23, 42, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(20px);
            margin-top: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
          }
          th {
            background: rgba(255, 255, 255, 0.03);
            color: #94a3b8;
            padding: 18px 24px;
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }
          tr {
            transition: background-color 0.15s ease;
          }
          tr:hover {
            background: rgba(255, 255, 255, 0.025);
          }
          tr:last-child td {
            border-bottom: none;
          }
          td {
            padding: 18px 24px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            font-size: 0.95rem;
            color: #cbd5e1;
            word-break: break-all;
          }
          td a {
            color: #818cf8;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.15s ease;
          }
          td a:hover {
            color: #a5b4fc;
            text-decoration: underline;
          }
          .priority-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 6px 12px;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.02em;
          }
          .priority-10 {
            background: rgba(16, 185, 129, 0.1);
            color: #34d399;
            border: 1px solid rgba(16, 185, 129, 0.25);
          }
          .priority-09 {
            background: rgba(99, 102, 241, 0.1);
            color: #818cf8;
            border: 1px solid rgba(99, 102, 241, 0.25);
          }
          .priority-08 {
            background: rgba(59, 130, 246, 0.1);
            color: #60a5fa;
            border: 1px solid rgba(59, 130, 246, 0.25);
          }
          .priority-07 {
            background: rgba(139, 92, 246, 0.1);
            color: #a78bfa;
            border: 1px solid rgba(139, 92, 246, 0.25);
          }
          .priority-low {
            background: rgba(100, 116, 139, 0.1);
            color: #94a3b8;
            border: 1px solid rgba(100, 116, 139, 0.25);
          }
          .footer-text {
            text-align: center;
            margin-top: 50px;
            color: #4b5563;
            font-size: 0.85rem;
            font-weight: 500;
          }
          .footer-text a {
            color: #6366f1;
            text-decoration: none;
            transition: color 0.15s ease;
          }
          .footer-text a:hover {
            color: #818cf8;
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>XML Sitemap</h1>
            <p class="description">
              This XML Sitemap is generated dynamically for search engines like Google, Bing, and Yandex to index the Aayam TechFest Portal. This styled version provides a human-readable list of all accessible URLs in the application.
            </p>
            <div class="stats">
              <div class="stat-card">
                <div class="label">Total Pages</div>
                <div class="value">
                  <xsl:value-of select="count(s:urlset/s:url)"/>
                </div>
              </div>
              <div class="stat-card">
                <div class="label">Static Routes</div>
                <div class="value">5</div>
              </div>
              <div class="stat-card">
                <div class="label">Dynamic Event Pages</div>
                <div class="value">
                  <xsl:value-of select="count(s:urlset/s:url) - 5"/>
                </div>
              </div>
            </div>
          </header>

          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th style="width: 55%;">URL Location</th>
                  <th style="width: 12%;">Priority</th>
                  <th style="width: 15%;">Change Freq.</th>
                  <th style="width: 18%;">Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="s:urlset/s:url">
                  <xsl:sort select="s:priority" data-type="number" order="descending"/>
                  <tr>
                    <td>
                      <a>
                        <xsl:attribute name="href">
                          <xsl:value-of select="s:loc"/>
                        </xsl:attribute>
                        <xsl:value-of select="s:loc"/>
                      </a>
                    </td>
                    <td>
                      <span>
                        <xsl:attribute name="class">
                          <xsl:choose>
                            <xsl:when test="s:priority = '1.0' or s:priority = '1'">priority-badge priority-10</xsl:when>
                            <xsl:when test="s:priority = '0.9'">priority-badge priority-09</xsl:when>
                            <xsl:when test="s:priority = '0.8'">priority-badge priority-08</xsl:when>
                            <xsl:when test="s:priority = '0.7'">priority-badge priority-07</xsl:when>
                            <xsl:otherwise>priority-badge priority-low</xsl:otherwise>
                          </xsl:choose>
                        </xsl:attribute>
                        <xsl:value-of select="s:priority"/>
                      </span>
                    </td>
                    <td style="text-transform: capitalize;">
                      <xsl:value-of select="s:changefreq"/>
                    </td>
                    <td>
                      <xsl:choose>
                        <xsl:when test="contains(s:lastmod, 'T')">
                          <xsl:value-of select="substring-before(s:lastmod, 'T')"/>&#160;<xsl:value-of select="substring(substring-after(s:lastmod, 'T'), 1, 8)"/>
                        </xsl:when>
                        <xsl:otherwise>
                          <xsl:value-of select="s:lastmod"/>
                        </xsl:otherwise>
                      </xsl:choose>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <div class="footer-text">
            Generated by the <a href="https://aayamtechfest2026.vercel.app">Aayam TechFest Platform</a>.
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
