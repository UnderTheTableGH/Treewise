# Treewise — Utah Tree ID Practice

A responsive, interactive, static website for practicing identification of eight common Utah tree species.

## Features
- Study cards for four broadleaf trees and four evergreen conifers
- Filters for broadleaf / evergreen / all species
- Randomized multiple-choice quiz with instant feedback and score tracking
- Responsive layout and keyboard-operable buttons
- No account, backend, external JavaScript, or third-party runtime dependency

## Run locally
Open `index.html` in a browser. For a local server, run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages
1. Create a GitHub account and a new **public** repository, e.g. `treewise`.
2. Upload `index.html`, `styles.css`, and `app.js` to the repository root.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose branch `main` and folder `/(root)`, then click **Save**.
6. Wait for GitHub Pages to publish. The site URL will be shown in the Pages settings, usually `https://YOUR-USERNAME.github.io/treewise/`.

## Security review
This project is a static client-side site:
- No server, database, login, secrets, API keys, or form submissions
- No external JavaScript libraries or executable third-party embeds
- User-visible content is inserted with `textContent`; there is no `eval`, `Function`, or dynamic script execution
- Quiz answers are fixed local data; localStorage and cookies are not used
- External reference link opens in a new tab with `rel="noopener noreferrer"`

### Remaining hardening opportunities
- The stylesheet imports Google Fonts. This is not required for functionality; remove the `@import` line to avoid that third-party request and use local system fonts if you want a fully self-contained site.
- GitHub Pages serves the site over HTTPS. A strict Content Security Policy is best configured with response headers, which GitHub Pages does not provide through repository settings. Because this is a static educational site with no user-generated HTML or scripts, the practical attack surface is small.
- Keep the repository free of credentials and private information.

## Tree information and references
The species set and identification clues are introductory, not a definitive key. Confirm uncertain identifications with more than one feature and a regional guide.

- Utah State University Extension, [Tree Browser](https://extension.usu.edu/treebrowser/) — descriptions and photographs for Utah and Intermountain West trees.
- Utah State University Extension, [Tree Identification Resources](https://extension.usu.edu/forestry/tree-identification/index) — regional identification resources.
- Utah State University Extension, [Utah Forest Types](https://extension.usu.edu/forestry/publications/utah-forest-facts/011-utah-forest-types-an-introduction-to-utah-forests) — context on Utah forest and woodland types.
