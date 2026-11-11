# Configure state panels

Edit one JSON file per state in `state-data/states/`. The file name is the two-letter state code, for example `CA.json` for California.

Each file has these fields:

- `title`: main heading in the information panel.
- `subtitle`: line below the heading.
- `image`: information-panel picture file name in `source/images/states/<CODE>/`.
- `icon`: map-marker picture file name in the same folder.
- `sections`: ordered information sections. Each section has a `title`, optional `subtitle`, and an `items` list. Each item has a `subtitle` and `content`.

Example:

```json
{
  "title": "California",
  "subtitle": "第三十一区公司 · Pacific Region",
  "image": "cover.jpg",
  "icon": "icon.png",
  "sections": [
    {
      "title": "01 / Overview",
      "subtitle": "State profile",
      "items": [
        { "subtitle": "Capital", "content": "Sacramento" },
        { "subtitle": "Nickname", "content": "The Golden State" }
      ]
    }
  ]
}
```

To change a state's pictures, open `source/images/states/<CODE>/` in File Explorer and copy files there. Set `image` for the large information-panel picture and `icon` for the small map marker. For example, `CA.json` with `"image": "cover.jpg"` and `"icon": "icon.png"` uses `source/images/states/CA/cover.jpg` and `source/images/states/CA/icon.png`. Supported formats include PNG, JPG/JPEG, GIF, and WebP. If a file is missing, the site uses the shared placeholder image.

Use UTF-8 when saving JSON. Keep the JSON syntax valid (double quotes around keys and text, commas between entries). Run `publish.bat` after editing; it regenerates the site and uploads the changed profiles and images.
