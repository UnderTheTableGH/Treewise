
# Treewise — U.S. Tree Identification

Treewise is an educational tree-identification website covering tree species found throughout the United States.

## Features

- Nationwide tree catalog with common and scientific names.
- Tree categories including deciduous, coniferous, broadleaf evergreen, and palm.
- Broad geographic regions.
- Searchable tree library.
- Configurable quizzes with 10, 25, 50, or 100 questions.
- Beginner, intermediate, and advanced quiz settings.
- Immediate answer feedback.
- Rolling accuracy across the last 50 questions.
- Overall species-based proficiency.
- Category-specific performance statistics.
- Individual species identification history.
- Persistent learning history using browser localStorage.
- Responsive desktop and mobile layout.

## Project files

- `index.html` — website structure.
- `styles.css` — presentation and responsive layout.
- `app.js` — species catalog, quizzes, statistics, and storage.

## Running locally

Open `index.html` in a modern web browser.

No server, build process, database, or API key is required.

## Publishing with GitHub Pages

1. Upload all project files to the root of your GitHub repository.
2. Open repository Settings.
3. Select Pages.
4. Select Deploy from a branch.
5. Choose the main branch and root folder.
6. Save the settings.
7. Wait for GitHub Pages to publish the website.

## Persistent data

Treewise uses the browser's localStorage API.

Storage key:

`treewise.us.v2`

The stored data includes:

- Individual quiz answers.
- Correct and incorrect responses.
- Timestamps.
- Per-species correct answer counts.
- Per-species attempts.
- Completed quiz count.

The website retains up to 5,000 individual answers.

The rolling average uses the most recent 50 answers, or all available answers if fewer than 50 exist.

Species proficiency is calculated from the visitor's historical performance for that species.

A species is considered mastered when the visitor has answered at least five questions about it and achieved at least 80% accuracy.

## Privacy and security

- No user accounts or passwords.
- No backend or database.
- No API keys or secrets.
- No third-party JavaScript libraries.
- Quiz history is stored locally in the visitor's browser.
- The website does not transmit quiz results to a server.
- User input is escaped before insertion into generated HTML.
- Browser storage errors are handled without crashing the application.
- GitHub Pages provides HTTPS when configured normally.

The Google Fonts stylesheet is an external request. Remove its import from `styles.css` if a completely self-contained website is required.

## Limitations

- Progress does not synchronize between devices or browsers.
- Clearing browser data removes saved progress.
- Geographic regions are broad educational groupings, not precise distribution maps.
- Species information should be checked against authoritative botanical references before being used for professional identification.
- Quiz questions are text-clue based; this version does not include photographic identification.

## Data version

Treewise nationwide catalog, version 2.
