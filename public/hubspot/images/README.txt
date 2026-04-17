Drop the following image files into this folder. Filenames must match exactly —
landing.html references them directly.

Hero / byline / testimonial
---------------------------
phone-newsletter.png      iPhone mockup of the newsletter (the "GROWING THE
                          SMART WAY" screenshot). ~320×620, transparent or
                          white background.
author-chris.jpg          Chris Miquel headshot. Square, 80×80 or larger.
testimonial-matt.jpg      Matt Paulson headshot. Square, 72×72 or larger.

Trusted-by logos (grayscale; CSS already applies filter: grayscale())
--------------------------------------------------------------------
logo-theflyover.svg
logo-goldco.svg
logo-gundrymd.svg
logo-marketbeat.svg
logo-nursingbeat.svg
logo-oan.svg
logo-paleohacks.svg

Logos should be roughly 28px tall when rendered. SVGs scale cleanly; PNGs are
fine too (update the extension in landing.html if so).

Porting to HubSpot
------------------
1. Upload these same files to HubSpot → Marketing → Files and Templates → Files.
2. Copy each hosted URL.
3. In the pasted landing.html, find-and-replace `./images/` with the HubSpot
   file URL prefix (each image may need its own URL if HubSpot doesn't keep a
   shared folder path).
