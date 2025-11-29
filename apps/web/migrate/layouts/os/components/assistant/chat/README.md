# Chat Assistant with App Intent Detection

Chat assistant yang bisa membuka aplikasi berdasarkan perintah natural language.

## Fitur

- Deteksi intent untuk membuka aplikasi
- Support bahasa Indonesia dan Inggris
- Keyword matching yang fleksibel

## Contoh Penggunaan

User bisa mengetik perintah seperti:

### Bahasa Indonesia
- "buka article"
- "buka artikel"
- "saya ingin membuka article"
- "jalankan article manager"
- "open article app"

### Bahasa Inggris
- "open article"
- "launch articles"
- "start article manager"
- "i want to open article"

## Aplikasi yang Didukung

- **Articles** (`articles`) - keywords: article, artikel, post, blog
- **Notes** (`notes`) - keywords: note, notes, catatan, notepad
- **Settings Hub** (`settings-hub`) - keywords: settings, setting, pengaturan, config
- **Desktop Settings** (`desktop-settings`) - keywords: desktop, wallpaper, background, tema
- **Website Builder** (`website-builder`) - keywords: website, site, builder, web, situs
- **Vibe Coding** (`vibe-coding`) - keywords: code, coding, kode, editor, vibe

## Menambah Aplikasi Baru

Edit file `intent-detector.ts` dan tambahkan mapping baru di array `APP_MAPPINGS`:

```typescript
{
  id: 'app-id',
  keywords: ['keyword1', 'keyword2'],
  aliases: ['full app name', 'alternative name'],
}
```
