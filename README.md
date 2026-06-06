# Aslı & Tunahan Düğün Davetiyesi

Dijital düğün davetiyesi sitesi.

## Proje yapısı

- `index.html`, `styles.css`, `script.js` — Canlı site (kök dizin)
- `assets/` — Görseller ve videolar
- `ornek/` — Referans CSS (sadece geliştirme, deploy edilmez)

## cPanel + GitHub

1. cPanel → **Git Version Control** → **Create**
2. Clone URL: `https://github.com/atillakesicioglu/aslivetunahan.git`
3. **Manage** → **Pull or Deploy** → **Deploy HEAD Commit**

`.cpanel.yml` site dosyalarını `public_html/` altına kopyalar (`ornek/` hariç).

### Güncelleme

```bash
git add .
git commit -m "mesaj"
git push
```

cPanel'de **Update from Remote** → **Deploy HEAD Commit**
