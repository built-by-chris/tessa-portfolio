# Portfolio maintenance checklist

Plan for a 10–15 minute monthly review plus updates after significant milestones. Use a feature branch and review the Cloudflare preview before merging.

## Monthly review

- [ ] Check the About page's **Now** section; update the "Updated" month only when the content changes.
- [ ] Distinguish **completed**, **currently enrolled**, and **planned** courses and dates.
- [ ] Verify career-status statements, including Graduate Student Assistant placement. Never present an interview, pending appointment, or application as confirmed.
- [ ] Compare the résumé page and downloadable PDF (public/files/tessa-rouse-resume.pdf) against the latest approved résumé: dates, employers, education, links.
- [ ] Review homepage, featured writing, and projects for stale or unsupported claims and attribution.
- [ ] Check the contact email, LinkedIn, institutional verifications, and linked published research.
- [ ] Run quality checks; inspect desktop and mobile layouts, navigation, and keyboard focus.

## After confirmed milestones

For final course grades, a confirmed appointment, new employment, a finished work sample, publication, or degree:
1. Confirm the milestone and what evidence supports publication.
2. Update the appropriate About, home, résumé, or portfolio entry.
3. Publish a project only when a real analysis or deliverable exists; distinguish **proposed** research from **implemented** work.
4. Synchronize the résumé PDF and page if career or education details change.
5. Check build, internal links, accessibility, mobile layout, and social-sharing previews in the PR.
6. Merge after review and explicit approval.

## Before merging a pull request

- [ ] npm ci, npm run build, and npm run test:site pass.
- [ ] The GitHub Actions browser tests pass (mobile menu, widths, and automated accessibility scan).
- [ ] Review responsive image quality, desktop typography, phone layout, and keyboard navigation.
- [ ] No unconfirmed professional or academic achievements are stated as facts.

The site is a curated portfolio, not a monthly publishing obligation.
