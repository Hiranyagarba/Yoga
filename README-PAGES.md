# Patañjali Yoga Sūtras — GitHub Pages

This is the presentation layer for the existing `patanjali-yoga-sutras` Markdown content.

## What it does

- Keeps the existing one-sūtra-per-Markdown-file structure untouched.
- Creates a single continuous reader page for each Pāda.
- Loads the existing Markdown files directly in the browser.
- Includes search, progress indicator, table of contents, responsive layout, and previous/next-style navigation through the Pāda contents.
- Uses the project's dark `#0A0502` and gold `#D4AF37` design.

## Repository placement

Extract these files into the **root of the existing `Hiranyagarba/Yoga` repository**. Do not put them inside `patanjali-yoga-sutras`.

Your existing structure should remain:

`patanjali-yoga-sutras/01-samadhi-pada/01-01.md`  
`patanjali-yoga-sutras/02-sadhana-pada/02-01.md`  
`patanjali-yoga-sutras/03-vibhuti-pada/03-01.md`  
`patanjali-yoga-sutras/04-kaivalya-pada/04-01.md`

## GitHub Pages

Use **Settings → Pages → Deploy from a branch → main → / (root)**.

Do not enter a Custom domain. The free project-site URL is:

`https://hiranyagarba.github.io/Yoga/`

GitHub Pages supports project sites at `https://<owner>.github.io/<repositoryname>`. 


## Important: Markdown loading

The reader pages load the existing public Markdown files from the repository's `main`
branch through GitHub's raw-content endpoint. This is intentional: GitHub Pages does
not expose a repository's `.md` files as raw Markdown at the same URL path.

Therefore, you can keep your existing one-sūtra-per-file structure unchanged.
