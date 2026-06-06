# Aslı & Tunahan Düğün Davetiyesi

Dijital düğün davetiyesi sitesi.

## Proje yapısı

- `website/` — Canlı site (cPanel `public_html` buraya deploy edilir)
  - `index.html`
  - `styles.css`
  - `script.js`
  - `assets/` — Görseller ve videolar
- `ornek/` — Referans CSS (geliştirme için)

## cPanel + GitHub kurulumu

1. cPanel → **Git Version Control** → **Create**
2. Clone URL: `https://github.com/atillakesicioglu/aslivetunahan.git`
3. Repository Path: örn. `aslivetunahan` (cPanel önerdiği yol)
4. **Create** ile klonla
5. **Manage** → **Pull or Deploy** → **Deploy HEAD Commit**

`.cpanel.yml` dosyası `website/` içeriğini otomatik olarak `public_html/` altına kopyalar.

### Güncelleme akışı

1. Bilgisayarda değişiklik yap
2. `git add .` → `git commit` → `git push`
3. cPanel'de **Pull or Deploy** → **Update from Remote** → **Deploy HEAD Commit**

## Yerel önizleme

`website/index.html` dosyasını tarayıcıda aç veya `website` klasöründe basit bir HTTP sunucusu çalıştır.
