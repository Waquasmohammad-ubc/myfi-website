# My-Fi Marketing Website

A modern, professional marketing website for My-Fi - an AI-powered personal finance advisor for Canadians.

## Tech Stack

- **Framework:** [Astro](https://astro.build) - Fast, content-focused static site generator
- **Styling:** Custom CSS with CSS Variables
- **Fonts:** Inter (Google Fonts)
- **Hosting:** AWS S3 + CloudFront

## Live URLs

- **Production:** https://www.my-fi.ca
- **CloudFront:** https://d1x49wgrtmchds.cloudfront.net
- **S3 Direct:** http://my-fi-website.s3-website.ca-central-1.amazonaws.com

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

---

## Deployment

### Quick Deploy (Most Common)

After making changes, run these commands to deploy:

```bash
# 1. Build the site
npm run build

# 2. Upload to S3
aws s3 sync dist/ s3://my-fi-website --delete

# 3. Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id EMAUVHU3B41XZ --paths "/*"
```

Changes will be live in 1-2 minutes after cache invalidation.

---

## AWS Infrastructure Details

### S3 Bucket

- **Bucket Name:** `my-fi-website`
- **Region:** `ca-central-1`
- **Website Endpoint:** http://my-fi-website.s3-website.ca-central-1.amazonaws.com

### CloudFront Distribution

- **Distribution ID:** `EMAUVHU3B41XZ`
- **Domain:** `d1x49wgrtmchds.cloudfront.net`
- **Alternate Domains:** `my-fi.ca`, `www.my-fi.ca`
- **SSL Certificate ARN:** `arn:aws:acm:us-east-1:548959629127:certificate/f00ebcd7-29a4-4194-8a0c-fbe5ace5f813`
- **Price Class:** `PriceClass_100` (North America & Europe)

### DNS Configuration (Bluehost)

| Type | Name | Value |
|------|------|-------|
| CNAME | `www` | `d1x49wgrtmchds.cloudfront.net` |
| A | `@` | `18.172.185.114` (CloudFront IP - may change) |
| CNAME | `_a68ea91e5cf249b27580fde65a5102e5` | `_dfe9584ff021ba91f6ee31a22a73e1d9.jkddzztszm.acm-validations.aws.` |
| CNAME | `_79bff83854a9f38da22084df570c0b69.www` | `_d004e1a10a11775dd782587c1d7882ec.jkddzztszm.acm-validations.aws.` |

**Note:** The A record IP may change. If `my-fi.ca` stops working, run:
```bash
dig +short d1x49wgrtmchds.cloudfront.net
```
And update the A record with one of the returned IPs.

---

## Initial Setup (Already Done)

These steps were used to set up the infrastructure initially. Only needed if recreating from scratch.

### 1. Create S3 Bucket

```bash
# Create bucket
aws s3 mb s3://my-fi-website --region ca-central-1

# Enable static website hosting
aws s3 website s3://my-fi-website --index-document index.html --error-document 404.html

# Disable block public access
aws s3api put-public-access-block --bucket my-fi-website --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# Set bucket policy for public read
aws s3api put-bucket-policy --bucket my-fi-website --policy '{
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
}'
```

### 2. Request SSL Certificate

```bash
# Request certificate (must be in us-east-1 for CloudFront)
aws acm request-certificate \
  --domain-name my-fi.ca \
  --subject-alternative-names "www.my-fi.ca" \
  --validation-method DNS \
  --region us-east-1

# Get validation records
aws acm describe-certificate --certificate-arn <CERTIFICATE_ARN> --region us-east-1
```

Add the CNAME validation records to DNS and wait for certificate to be issued.

### 3. Create CloudFront Distribution

Use the `cloudfront-config.json` file:

```bash
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

### 4. Configure DNS

Add DNS records pointing to CloudFront (see DNS Configuration section above).

---

## Useful Commands

### Check Deployment Status

```bash
# Check CloudFront distribution status
aws cloudfront get-distribution --id EMAUVHU3B41XZ --query 'Distribution.Status'

# Check invalidation status
aws cloudfront get-invalidation --distribution-id EMAUVHU3B41XZ --id <INVALIDATION_ID>
```

### View S3 Bucket Contents

```bash
aws s3 ls s3://my-fi-website --recursive
```

### Delete and Re-upload All Files

```bash
aws s3 rm s3://my-fi-website --recursive
aws s3 sync dist/ s3://my-fi-website
```

### Check SSL Certificate Status

```bash
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:us-east-1:548959629127:certificate/f00ebcd7-29a4-4194-8a0c-fbe5ace5f813 \
  --region us-east-1 \
  --query 'Certificate.Status'
```

---

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
- CloudFront edge caching worldwide

## Troubleshooting

### Site not updating after deploy

1. Make sure you ran `npm run build` before syncing
2. Invalidate CloudFront cache:
   ```bash
   aws cloudfront create-invalidation --distribution-id EMAUVHU3B41XZ --paths "/*"
   ```
3. Wait 1-2 minutes for invalidation to complete
4. Clear browser cache or test in incognito mode

### Root domain (my-fi.ca) not working

CloudFront IPs can change. Get current IPs and update A record:
```bash
dig +short d1x49wgrtmchds.cloudfront.net
```

### SSL Certificate issues

Check certificate status:
```bash
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:us-east-1:548959629127:certificate/f00ebcd7-29a4-4194-8a0c-fbe5ace5f813 \
  --region us-east-1
```

If expired, request a new one and update CloudFront distribution.

## License

Proprietary - My-Fi Inc.
