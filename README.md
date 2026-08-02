# Jean Cacheux — website v2

A completely redesigned English-language website for GitHub Pages.

## What changed

- no green palette
- white, navy, cyan and red LAAS-CNRS visual language
- much larger editorial typography
- full-screen opening section
- animated particles inspired by fluid transport
- particles react gently to mouse or touch movement
- sections appear gradually while scrolling
- official LAAS-CNRS image supplied in the package

## Upload to GitHub

Upload these four files to the root of the `jeancacheux.github.io` repository:

- `index.html`
- `styles.css`
- `script.js`
- `laas-cnrs-logo.jpg`

Replace the previous files, then press **Commit changes**.

## Personal details to replace

Open `index.html` and update:

- `firstname.lastname@laas.fr`
- publication titles, authors and links
- HAL / Google Scholar / ORCID links
- team members
- any research wording you wish to refine


## Version 3 changes

- larger header spanning the full browser width
- more transparent glass effect
- larger LAAS-CNRS logo
- verified public profile links:
  - Google Scholar: https://scholar.google.com/citations?user=5zyfPC8AAAAJ
  - HAL ID: jean-cacheux
  - ORCID: 0000-0001-6671-5533
- contact email: jean.cacheux@laas.fr


## Version 4 changes

- Team section renamed “Team & collaborations”
- separate LAAS-CNRS and CRCT collaboration groups
- CRCT ImPACT collaborators added:
  - Pierre Cordelier
  - Aurélie Gomes
  - Silvia Ferrer Royo
- links to official CRCT profiles and the ImPACT team page


## Version 5 changes

- new **About** section
- professional portrait placeholder added
- short academic biography included
- direct links to Google Scholar, HAL and ORCID
- note explaining how to add a CV later

## Add your portrait

Replace `portrait-placeholder.svg` with your own image, ideally named `portrait.jpg`,
then change this line in `index.html`:

`src="portrait-placeholder.svg"`

to:

`src="portrait.jpg"`

## Add your CV later

Place a file named `cv.pdf` in the repository. You can then replace the CV note in
`index.html` with:

`<a href="cv.pdf" target="_blank">Download CV ↓</a>`
