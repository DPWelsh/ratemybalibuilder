import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = './public';
const BRANDING_DIR = './public/branding';

// Ensure branding directory exists
if (!fs.existsSync(BRANDING_DIR)) {
  fs.mkdirSync(BRANDING_DIR, { recursive: true });
}

// Read SVG files
const iconSvg = fs.readFileSync(path.join(PUBLIC_DIR, 'icon.svg'));
const logoSvg = fs.readFileSync(path.join(PUBLIC_DIR, 'logo.svg'));
const logoDarkSvg = fs.readFileSync(path.join(PUBLIC_DIR, 'logo-dark.svg'));

// Helper to create icon with padding on colored background
async function createIconWithBackground(size, bgColor, outputPath) {
  const padding = Math.round(size * 0.1);
  const iconSize = size - (padding * 2);

  const resizedIcon = await sharp(iconSvg)
    .resize(iconSize, iconSize)
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: bgColor
    }
  })
    .composite([{ input: resizedIcon, left: padding, top: padding }])
    .png()
    .toFile(outputPath);

  console.log(`Created: ${outputPath}`);
}

// Helper to create OG image with logo centered
async function createOgImage(width, height, outputPath) {
  const logoWidth = Math.round(width * 0.5);
  const logoHeight = Math.round(logoWidth * (48 / 280));

  const resizedLogo = await sharp(logoSvg)
    .resize(logoWidth, logoHeight)
    .toBuffer();

  const left = Math.round((width - logoWidth) / 2);
  const top = Math.round((height - logoHeight) / 2);

  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite([{ input: resizedLogo, left, top }])
    .png()
    .toFile(outputPath);

  console.log(`Created: ${outputPath}`);
}

async function main() {
  console.log('Generating logo assets...\n');

  // Favicon PNGs
  console.log('--- Favicons ---');
  await sharp(iconSvg).resize(16, 16).png().toFile(path.join(PUBLIC_DIR, 'favicon-16x16.png'));
  console.log('Created: favicon-16x16.png');

  await sharp(iconSvg).resize(32, 32).png().toFile(path.join(PUBLIC_DIR, 'favicon-32x32.png'));
  console.log('Created: favicon-32x32.png');

  await sharp(iconSvg).resize(48, 48).png().toFile(path.join(PUBLIC_DIR, 'favicon-48x48.png'));
  console.log('Created: favicon-48x48.png');

  // Apple Touch Icon (with white background and padding)
  console.log('\n--- Mobile Icons ---');
  await createIconWithBackground(180, { r: 255, g: 255, b: 255, alpha: 1 }, path.join(PUBLIC_DIR, 'apple-touch-icon.png'));

  // Android Chrome icons
  await createIconWithBackground(192, { r: 255, g: 255, b: 255, alpha: 1 }, path.join(PUBLIC_DIR, 'android-chrome-192x192.png'));
  await createIconWithBackground(512, { r: 255, g: 255, b: 255, alpha: 1 }, path.join(PUBLIC_DIR, 'android-chrome-512x512.png'));

  // OG Image
  console.log('\n--- Social Sharing ---');
  await createOgImage(1200, 630, path.join(PUBLIC_DIR, 'og-image.png'));

  // Social media icons (square, with padding)
  console.log('\n--- Social Media Profiles ---');
  await createIconWithBackground(320, { r: 255, g: 255, b: 255, alpha: 1 }, path.join(BRANDING_DIR, 'social-instagram.png'));
  await createIconWithBackground(400, { r: 255, g: 255, b: 255, alpha: 1 }, path.join(BRANDING_DIR, 'social-linkedin.png'));
  await createIconWithBackground(400, { r: 255, g: 255, b: 255, alpha: 1 }, path.join(BRANDING_DIR, 'social-twitter.png'));

  // Print logos (high res)
  console.log('\n--- Print Assets ---');
  const printWidth = 2000;
  const printHeight = Math.round(printWidth * (48 / 280));

  await sharp(logoSvg)
    .resize(printWidth, printHeight)
    .png()
    .toFile(path.join(BRANDING_DIR, 'logo-print.png'));
  console.log('Created: branding/logo-print.png');

  await sharp(logoDarkSvg)
    .resize(printWidth, printHeight)
    .png()
    .toFile(path.join(BRANDING_DIR, 'logo-print-dark.png'));
  console.log('Created: branding/logo-print-dark.png');

  console.log('\n✓ All assets generated successfully!');
}

main().catch(console.error);
