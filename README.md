# EdgeWatch — Landing Page

Product landing page of **EdgeWatch**, the traceability and diagnostics platform for HVOF thermal spray processes, built by **WebRunners** for the 1ASI0730 Web Applications course (UPC, 2026-20).

- Live site: https://upc-pre-202620-1asi0730-16712-wrunners.github.io/edgewatch-website/
- Web application: https://edgewatch-webapp-gmbcexdpe0e8a2gv.eastus-01.azurewebsites.net
- About the Product: https://youtu.be/Axl4rCu7W7E · About the Team: https://youtu.be/4XBkfPlF6Lo

## Sections

Hero with the operations dashboard, problem, segments (HVOF service providers and asset owners) with call-to-actions that open the matching sign-up of the web application, solution, how it works, testimonials, alerts, plans, About the Product (video), About the Team (video), FAQ, and footer with contact details and social links.

## Stack

Static HTML5, CSS3 and vanilla JavaScript (no build step). Internationalization EN/ES through `js/translations.js` and `js/i18n.js`; accessible navigation, carousel, FAQ accordion and demo request modal in `js/index.js`. The visual language (navy `#0e1a2b`, orange `#d4781c`, system font stack) is shared with the web application.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Deployment

GitHub Pages serves the `gh-pages` branch, which mirrors `main` on every release. Git Flow: `main` (releases, tagged), `develop` (integration), `feature/*`, `release/*`.
