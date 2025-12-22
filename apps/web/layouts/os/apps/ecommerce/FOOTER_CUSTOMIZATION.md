# Footer Customization Feature

## Overview
Added the ability to customize footer information in the ecommerce dashboard. Shop owners can now edit contact details and social media links that appear in their storefront footer.

## Changes Made

### 1. Database Schema (`convex/schema.ts`)
Added new optional fields to the `shops` table:
- `footerEmail` - Contact email displayed in footer
- `footerPhone` - Contact phone number displayed in footer
- `footerAddress` - Business address displayed in footer
- `footerFacebook` - Facebook profile URL
- `footerInstagram` - Instagram profile URL
- `footerTwitter` - Twitter/X profile URL
- `footerLinkedin` - LinkedIn profile URL

### 2. Convex Functions (`convex/shops.ts`)
Updated `create` and `update` mutations to accept and store footer fields.

### 3. TypeScript Types (`layouts/os/apps/ecommerce/types.ts`)
Updated `Shop`, `ShopInput`, and `ShopUpdateInput` interfaces to include footer fields.

### 4. Shop Settings Component (`layouts/os/apps/ecommerce/components/shop-settings.tsx`)
Added a new "Footer Information" section with:
- Contact Email input
- Contact Phone input
- Business Address input
- Social Media Links section (Facebook, Instagram, Twitter, LinkedIn)

All fields are optional and include helpful placeholder text.

### 5. Storefront Footer Component (`app/ecommerce/[shopname]/components/storefront-footer.tsx`)
Updated to display dynamic footer information:
- Shows contact email, phone, and address only if provided
- Displays social media icons only if URLs are provided
- All links are clickable and open in new tabs (for social media)
- Email and phone are clickable with `mailto:` and `tel:` links

## How to Use

1. Open the ecommerce app in the dashboard
2. Go to "Shop Settings"
3. Scroll down to the "Footer Information" section
4. Fill in any or all of the footer fields:
   - Contact Email
   - Contact Phone
   - Business Address
   - Social Media URLs (Facebook, Instagram, Twitter, LinkedIn)
5. Click "Save Changes"
6. Visit your storefront to see the updated footer

## Features

- All footer fields are optional
- Social media icons only appear if URLs are provided
- Contact information only displays if filled in
- URLs are validated as proper URLs
- Email addresses are validated
- Social links open in new tabs with security attributes
- Responsive design matches existing footer styling
