const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');
const Branch = require('./models/Branch');
const User = require('./models/User');

const seedData = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('MONGODB_URI missing from .env!');
      process.exit(1);
    }

    console.log('[Seeder] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoURI);
    console.log('[Seeder] Connected successfully!');

    // 1. Seed Kerala Branch Depots
    await Branch.deleteMany({});
    const branches = [
      {
        slug: 'kochi-ho',
        title: 'Southern Impex Kochi (Head Office)',
        subtitle: 'Central Master Supply Depot & Executive Head Office',
        badge: 'HEAD OFFICE',
        badgeClass: 'hq',
        address: 'Metro Pillar 420, Kalamassery, Kochi, Kerala 682033',
        phone: '+91 98470 12345 / 0484 2555777',
        email: 'sales.kochi@southernimpex.com',
        embedUrl: 'https://maps.google.com/maps?q=Southern+Impex,+Kochi,+Kerala&t=&z=15&ie=UTF8&iwloc=&output=embed',
        directUrl: 'https://www.google.com/maps/search/?api=1&query=Southern+Impex+Kochi+Kerala'
      },
      {
        slug: 'kochi-tech',
        title: 'Southern Sign Technology (Kochi)',
        subtitle: 'Signage Hardware & Technical Support Center',
        badge: 'SIGN TECH',
        badgeClass: 'tech',
        address: 'MG Road, Ernakulam, Kochi, Kerala 682016',
        phone: '+91 98470 23456 / 0484 2366888',
        email: 'tech.kochi@southernimpex.com',
        embedUrl: 'https://maps.google.com/maps?q=Southern+Sign+Technology,+Kochi,+Kerala&t=&z=15&ie=UTF8&iwloc=&output=embed',
        directUrl: 'https://www.google.com/maps/search/?api=1&query=Southern+Sign+Technology+Kochi+Kerala'
      },
      {
        slug: 'calicut',
        title: 'Southern Sales Corporation (Calicut)',
        subtitle: 'Malabar Regional Master Supply Depot',
        badge: 'MALABAR HUB',
        badgeClass: 'calicut',
        address: 'Mavoor Road Trade Hub, Calicut, Kerala 673004',
        phone: '+91 98470 34567 / 0495 2722999',
        email: 'calicut@southernimpex.com',
        embedUrl: 'https://maps.google.com/maps?q=Southern+Sales+Corporation,+Calicut,+Kerala&t=&z=15&ie=UTF8&iwloc=&output=embed',
        directUrl: 'https://www.google.com/maps/search/?api=1&query=Southern+Sales+Corporation+Calicut+Kerala'
      },
      {
        slug: 'trivandrum',
        title: 'Southern Impex Trivandrum',
        subtitle: 'South Kerala Regional Wholesale Depot',
        badge: 'SOUTH KERALA HUB',
        badgeClass: 'tvm',
        address: 'TC Road Industrial Zone, Trivandrum, Kerala 695001',
        phone: '+91 98470 45678 / 0471 2477111',
        email: 'tvm@southernimpex.com',
        embedUrl: 'https://maps.google.com/maps?q=Southern+Impex,+Trivandrum,+Kerala&t=&z=15&ie=UTF8&iwloc=&output=embed',
        directUrl: 'https://www.google.com/maps/search/?api=1&query=Southern+Impex+Trivandrum+Kerala'
      }
    ];
    await Branch.insertMany(branches);
    console.log(`[Seeder] Seeded ${branches.length} Branch Depots.`);

    // 2. Seed Master Signage Products
    await Product.deleteMany({});
    const products = [
      {
        title: 'ASTRYX™ Premium Cast Acrylic Sheets',
        slug: 'astryx-cast-acrylic-sheets',
        category: 'Acrylic Sheets',
        brand: 'ASTRYX™',
        tagline: '93% Light Transmission Ultra-Clear Cast Acrylic',
        description: 'Virgin MMA monomer cast acrylic sheets offering crystal clarity, superior laser cutting behavior, and UV weather resistance.',
        stockStatus: 'Wholesale Bulk Available',
        isFeatured: true,
        specifications: [
          { key: 'Standard Gauge Thickness', value: '1.5mm - 50mm' },
          { key: 'Sheet Dimensions', value: '8x4 ft (2440x1220mm), 10x6 ft' },
          { key: 'Optical Transparency', value: '93% Light Transmittance' },
          { key: 'Surface Finishes', value: 'High Gloss, Frosted, Opaque Colors' }
        ]
      },
      {
        title: 'Starflex Super Gloss Self-Adhesive Vinyl',
        slug: 'starflex-self-adhesive-vinyl',
        category: 'Vinyl Media',
        brand: 'Starflex',
        tagline: 'High-Tack Polymeric Vinyl for Vehicle Wraps & Outdoor Displays',
        description: 'Commercial grade print vinyl with clear permanent adhesive, bubble-free release liner, and Eco-Solvent / UV ink compatibility.',
        stockStatus: 'Wholesale Bulk Available',
        isFeatured: true,
        specifications: [
          { key: 'Film Thickness', value: '80 Micron Polymeric PVC' },
          { key: 'Adhesive Type', value: 'Solvent Acrylic Clear Permanent' },
          { key: 'Roll Widths', value: '3ft, 4ft, 5ft x 50m' },
          { key: 'Outdoor Durability', value: 'up to 3 Years' }
        ]
      },
      {
        title: 'Qrex High-Grade Frontlit & Backlit Flex Media',
        slug: 'qrex-flex-media',
        category: 'Flex Media',
        brand: 'Qrex',
        tagline: 'High-Tear-Strength Banner Substrates',
        description: 'Premium laminated and coated PVC flex banners crafted for high-speed solvent and UV billboard printing.',
        stockStatus: 'Wholesale Bulk Available',
        isFeatured: true,
        specifications: [
          { key: 'GSM Weight Spectrum', value: '240 GSM to 510 GSM' },
          { key: 'Weave Denier', value: '200x300D / 500x500D / 1000x1000D' },
          { key: 'Finish Options', value: 'Vibrant Gloss & Non-Reflective Matte' }
        ]
      },
      {
        title: 'Alucobond & ACP Composite Facade Panels',
        slug: 'acp-composite-facade-panels',
        category: 'ACP Facade',
        brand: 'Southern Impex ACP',
        tagline: 'PVDF Coated Exterior Architectural Panels',
        description: 'Heavy duty aluminum composite panels designed for corporate exterior cladding, signage, and modern building fascia.',
        stockStatus: 'Wholesale Bulk Available',
        isFeatured: false,
        specifications: [
          { key: 'Panel Thickness', value: '3mm / 4mm' },
          { key: 'Aluminum Skin', value: '0.25mm / 0.50mm PVDF' },
          { key: 'Color Shades', value: 'Metals, Wooden Finish, Sparkle, Brush' }
        ]
      },
      {
        title: 'Samsung Signage LED Modules & Power Packs',
        slug: 'samsung-signage-led-modules',
        category: 'LED Signage',
        brand: 'Samsung LED',
        tagline: 'IP68 Waterproof High-Efficiency LED Injection Modules',
        description: 'Original Samsung chip LED modules for channel letters, lightboxes, and 3D acrylic signs with 5-year commercial warranty.',
        stockStatus: 'In Stock',
        isFeatured: true,
        specifications: [
          { key: 'Chipset', value: 'Samsung 2835 SMD High Lumen' },
          { key: 'Protection Rating', value: 'IP68 Full Waterproof Injection' },
          { key: 'Beam Angle', value: '160° Wide Lens' },
          { key: 'Voltage', value: '12V DC Low Power Consumption' }
        ]
      },
      {
        title: 'High-Density PVC Foam Board & Sunboard',
        slug: 'pvc-foam-board-sunboard',
        category: 'PVC Boards',
        brand: 'Southern Impex PVC',
        tagline: 'Celuka Rigid PVC Sheets for CNC Routing & Printing',
        description: 'Smooth white high-density PVC foam boards resistant to moisture, chemicals, and termites. Ideal for direct flatbed UV printing.',
        stockStatus: 'In Stock',
        isFeatured: false,
        specifications: [
          { key: 'Thickness Options', value: '1mm to 25mm' },
          { key: 'Density Range', value: '0.45 g/cm³ to 0.70 g/cm³' },
          { key: 'Sheet Size', value: '8x4 ft (2440x1220mm)' }
        ]
      }
    ];
    await Product.insertMany(products);
    console.log(`[Seeder] Seeded ${products.length} Products.`);

    // 3. Seed Default Admin User
    await User.deleteMany({});
    const adminUser = await User.create({
      name: 'Southern Impex Admin',
      email: 'admin@southernimpex.com',
      password: 'AdminPassword123!',
      role: 'admin'
    });
    console.log(`[Seeder] Seeded Admin User: ${adminUser.email} (Password: AdminPassword123!)`);

    console.log('[Seeder] Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedData();
