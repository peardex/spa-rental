# spa-rental

The website for **Juniper House**, a hillside rental home with a private spa.

A plain HTML/CSS/JS site with no build step:

- `site/index.html`: the page content
- `site/styles.css`: the design tokens (colors, fonts) at the top, then the layout
- `site/app.js`: the mobile menu, scroll reveals and the enquiry form

It is served as a static environment (`.basable/config.yaml`): the `dev` branch deploys
to preview and `main` to live, straight from `site/`.

## Making it yours

- Replace the name, location, rates and copy in `site/index.html`.
- Set your booking email in `site/app.js` (`BOOKING_EMAIL`) and the nightly rate (`NIGHTLY_RATE`).
- Photos: drop image files into `site/` and reference them from `index.html`.
