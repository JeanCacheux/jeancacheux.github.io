# Jean Cacheux — definitive GitHub Pages website

## Upload these files

Upload all of the following files to the root of the `jeancacheux.github.io` repository:

- `index.html`
- `styles.css`
- `script.js`
- `laas-cnrs-logo.jpg`
- `crct-logo.jpg`
- `portrait-jean-cacheux.jpg`

Then press **Commit changes**.

## What is included

- English-language design
- full-width transparent header
- LAAS-CNRS branding
- CRCT logo and collaboration section
- filtered portrait using the uploaded photograph
- smaller portrait on the home page
- animated particles inspired by fluid transport
- automatic publication loading via OpenAlex and ORCID
- two publication modes:
  - newest journal articles
  - papers where Jean Cacheux is first, last or penultimate author
- conference papers, proceedings, posters, books and non-journal preprints excluded

## Profile identifiers

- Google Scholar: `5zyfPC8AAAAJ`
- HAL: `jean-cacheux`
- ORCID: `0000-0001-6671-5533`

## Notes

The automatic publication section depends on OpenAlex. If the service is temporarily
unavailable, the site displays a direct link to Google Scholar instead.


## Static publications version

The publication list is now written directly into `index.html`, so it appears
immediately and does not wait for OpenAlex or another external API.

It currently contains six peer-reviewed journal articles from 2023–2025, plus a
button linking to the complete Google Scholar profile.


## Four manually curated recent publications

The site now contains only four recent peer-reviewed journal articles (2024–2025).
There is no publication API or automatic loading, so the page appears immediately.


## Display bug fixed

A stray character at the beginning of `script.js` caused a JavaScript syntax error.
Because the page used JavaScript to reveal section content, headings appeared but the
section contents stayed invisible.

This version removes that error and makes all content visible by default, even if
JavaScript is disabled or fails to load.
