# ydw011.github.io

Personal homepage of DongWook Yang — a one-page academic portfolio (Hero → About → Research → Projects → Contact) served by GitHub Pages.

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | The one-page site |
| `talk.html` | "Ask Me Anything" guestbook (utterances, GitHub Issues) |
| `styles.css` | All styles; color tokens at the top (`:root` = dark, `[data-theme="light"]` = light) |
| `script.js` | Theme toggle, nav highlight, scroll reveal, and rendering of the JSON content below |
| `about.html`, `research.html`, `projects.html`, `social.html`, `hobbies.html` | Redirects to the matching section, so old links keep working |

## Editing content

Most updates only need a JSON edit — no HTML changes.

**`publications.json`** — sorted by `year` (newest first). Your name is bolded automatically.

```json
{
  "title": "Paper title",
  "authors": "A. Author, Dong-Wook Yang, B. Author",
  "venue": "IEEE Robotics and Automation Letters",
  "year": 2024,
  "scope": "International",
  "role": "Lead Author",
  "link": "https://doi.org/..."
}
```

`role` containing "Lead" or "First" gets the highlighted tag.

**`projectslist.json`** — an empty array shows a "Write-ups in preparation" card. `period`, `summary`, `tags`, `link`, and `image` are optional.

```json
{
  "title": "Project name",
  "period": "2024 – 2025",
  "summary": "One or two sentences.",
  "tags": ["Origami", "Rover"],
  "link": "https://github.com/ydw011/...",
  "image": "image/project-name.jpg"
}
```

**`aboutinfo.json`** — `education` and `career` are lists of `{ "period", "title", "org" }`. An empty `career` list hides that column.

## Cache busting

`index.html` and `talk.html` load `styles.css?v=42` and `script.js?v=42`. Bump the number in both files after changing CSS or JS so visitors get the new version.

## Local preview

JSON is loaded with `fetch`, so open the site through a server rather than as a file:

```bash
python -m http.server 8765
```
