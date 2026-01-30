# My-Fi Marketing Website

A modern, professional marketing website for My-Fi - an AI-powered personal finance advisor for Canadians.

## Tech Stack

- **Framework:** [Astro](https://astro.build) - Fast, content-focused static site generator
- **Styling:** Custom CSS with CSS Variables
- **Fonts:** Inter (Google Fonts)
- **Hosting:** AWS S3 + CloudFront (recommended)

## Project Structure

```
myfi-website/
├── public/
│   ├── logo.png             # Site logo and favicon
│   ├── robots.txt           # SEO robots file
│   └── _headers             # Cache and security headers
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro # Shared layout (header, footer, meta)
│   ├── pages/
│   │   ├── index.astro      # Home/Landing page
│   │   ├── about.astro      # About page
│   │   ├── privacy.astro    # Privacy Policy
│   │   └── terms.astro      # Terms of Service
│   └── styles/
│       └── global.css       # Global styles and CSS variables
├── astro.config.mjs         # Astro configuration
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## Local Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:4321](http://localhost:4321) in your browser

### Build for Production

```bash
npm run build
```

The built site will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment to AWS S3 + CloudFront

### Option 1: AWS CLI (Recommended)

1. **Build the site:**
   ```bash
   npm run build
   ```

2. **Create an S3 bucket:**
   ```bash
   aws s3 mb s3://my-fi-website --region ca-central-1
   ```

3. **Configure bucket for static website hosting:**
   ```bash
   aws s3 website s3://my-fi-website --index-document index.html --error-document 404.html
   ```

4. **Set bucket policy for public access:**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::my-fi-website/*"
       }
     ]
   }
   ```

5. **Sync the dist folder to S3:**
   ```bash
   aws s3 sync dist/ s3://my-fi-website --delete
   ```

6. **Create CloudFront distribution:**
   - Origin: `my-fi-website.s3.ca-central-1.amazonaws.com`
   - Default root object: `index.html`
   - Enable HTTPS (use AWS Certificate Manager for custom domain)
   - Add custom domain (my-fi.ca) as alternate domain name

### Option 2: Manual Upload

1. Build the site (`npm run build`)
2. Log into AWS Console
3. Create S3 bucket and enable static website hosting
4. Upload contents of `dist/` folder
5. Configure CloudFront distribution pointing to the S3 bucket

### Cache Invalidation

After deploying updates, invalidate the CloudFront cache:

```bash
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Image Placeholders

The site uses SVG illustrations. For production, consider adding:

1. **Hero Section:** Dashboard mockup or illustration showing:
   - Financial charts/graphs
   - Mobile app preview
   - Savings goal tracker

2. **OG Image (`/public/og-image.png`):**
   - Size: 1200x630px
   - My-Fi logo + tagline + brand colors

3. **Apple Touch Icon (`/public/apple-touch-icon.png`):**
   - Size: 180x180px
   - My-Fi logo on purple gradient background

## Brand Colors

| Usage | Color | Hex |
|-------|-------|-----|
| Primary (buttons, headings) | Purple | #7C3AED |
| Primary Dark | Purple Dark | #6D28D9 |
| Secondary (accents) | Green | #10B981 |
| Secondary Dark | Green Dark | #059669 |
| Background | White | #FFFFFF |
| Light sections | Off-white | #F9FAFB |
| Text | Dark gray | #1F2937 |

## Customization

### Updating Content

- **Homepage:** Edit `src/pages/index.astro`
- **About page:** Edit `src/pages/about.astro`
- **Legal pages:** Edit `src/pages/privacy.astro` and `src/pages/terms.astro`

### Updating Styles

- **Global styles:** Edit `src/styles/global.css`
- **CSS Variables:** Defined at the top of `global.css`

### Updating Layout

- **Header/Footer:** Edit `src/layouts/BaseLayout.astro`

## SEO

The site includes:

- Meta descriptions on all pages
- Open Graph tags for social sharing
- Twitter card meta tags
- Canonical URLs
- robots.txt
- Semantic HTML structure
- Mobile-responsive design

## Performance

- Minimal JavaScript (only for mobile menu toggle)
- CSS-only animations and transitions
- Optimized for fast loading
- Astro compresses HTML in production

## License

Proprietary - My-Fi Inc.
