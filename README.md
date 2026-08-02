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


## Homepage and particle update

- portrait removed from the homepage
- portrait retained only in section 04, About
- header now displays “Jean Cacheux — Senior Researcher · LAAS–CNRS”
- particle canvas moved above the page background and below the content
- particles made slightly more visible while remaining subtle


## Automatic publication refresh

The page always displays four curated publications immediately. After loading, it makes
one lightweight OpenAlex request using ORCID `0000-0001-6671-5533`.

Selection rules:

1. journal articles only;
2. retracted works excluded;
3. first, last and penultimate-author papers are prioritised;
4. remaining places are completed with the newest journal articles;
5. four publications are displayed;
6. if the API is slow or unavailable after four seconds, the static list remains visible.

This avoids an empty or permanently loading Publications section.


## Final wording corrections

- no portrait on the homepage
- header now reads exactly:
  - Jean Cacheux
  - CNRS Researcher
- publication section presented as automatically updated
- no “manually curated” wording in the visible page


## Collaboration section update

The collaboration section is now organised in two clearly separated stages:

1. **LAAS–CNRS · MechaBiofluidics**
   - primary affiliation
   - Aurélien Abancaud
   - Thomas Quenan
   - Adélie Barnetche
   - Amélie Albon

2. **CRCT · ImPACT**
   - major research collaboration
   - Pierre Cordelier
   - Aurélie Gomes
   - Silvia Ferrer Royo


## Final collaboration layout correction

- Jean Cacheux and “CNRS Researcher” now appear prominently on the homepage.
- Team name corrected to **MechaBiofluidics**.
- LAAS–CNRS appears first with its four collaborators.
- The CRCT logo and CRCT collaborators appear only after the complete LAAS–CNRS list.
- LAAS–CNRS and CRCT are visually separated into two sequential blocks.


## Final polished version

- the homepage now starts with Jean Cacheux, CNRS Researcher, and the MechaBiofluidics affiliation;
- a concise About-style research profile appears directly with the main research title;
- every occurrence of the team name has been normalised to **MechaBiofluidics**;
- LAAS–CNRS collaborators remain first, followed by the CRCT logo and CRCT collaborators;
- final visual spacing, hover effects and typography have been refined;
- the homepage contains no portrait; the portrait remains only in the Profile section.
