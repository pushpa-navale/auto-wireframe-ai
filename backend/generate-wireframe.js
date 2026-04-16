// Enhanced wireframe generation script with GitHub issue integration
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const params = {};
args.forEach(arg => {
  const [key, value] = arg.split('=');
  if (key && value) {
    params[key] = value;
  }
});

// Template configurations for different e-commerce pages
const templates = {
  'product-listing': {
    width: 800,
    height: 600,
    title: 'Product Listing',
    description: 'Grid layout showing multiple products with images, prices, and add to cart buttons',
    keywords: ['product', 'listing', 'grid', 'catalog', 'shop', 'store', 'category', 'products', 'items', 'browse']
  },
  'shopping-cart': {
    width: 800,
    height: 600,
    title: 'Shopping Cart',
    description: 'Cart summary with items, quantities, prices, and checkout button',
    keywords: ['cart', 'shopping', 'basket', 'checkout', 'order', 'items', 'quantity', 'total', 'summary']
  },
  'checkout': {
    width: 800,
    height: 700,
    title: 'Checkout',
    description: 'Multi-step checkout with shipping, payment, and order summary',
    keywords: ['checkout', 'payment', 'shipping', 'billing', 'address', 'order', 'purchase', 'buy', 'complete']
  },
  'user-profile': {
    width: 800,
    height: 600,
    title: 'User Profile',
    description: 'Account management page with personal info and preferences',
    keywords: ['profile', 'account', 'user', 'settings', 'personal', 'information', 'preferences', 'login', 'register']
  }
};

// Issue analysis function
function analyzeIssue(issueTitle, issueDescription = '') {
  const content = (issueTitle + ' ' + issueDescription).toLowerCase();

  // Score each template based on keyword matches
  const scores = {};
  Object.keys(templates).forEach(templateName => {
    const template = templates[templateName];
    let score = 0;

    template.keywords.forEach(keyword => {
      // Count occurrences of each keyword
      const regex = new RegExp(keyword, 'gi');
      const matches = content.match(regex);
      if (matches) {
        score += matches.length;
      }
    });

    scores[templateName] = score;
  });

  // Find the template with the highest score
  let bestTemplate = 'basic';
  let highestScore = 0;

  Object.keys(scores).forEach(templateName => {
    if (scores[templateName] > highestScore) {
      highestScore = scores[templateName];
      bestTemplate = templateName;
    }
  });

  // If no good matches, try to infer from common patterns
  if (highestScore === 0) {
    if (content.includes('login') || content.includes('sign') || content.includes('auth')) {
      bestTemplate = 'user-profile';
    } else if (content.includes('buy') || content.includes('purchase') || content.includes('order')) {
      bestTemplate = 'checkout';
    } else if (content.includes('list') || content.includes('show') || content.includes('display')) {
      bestTemplate = 'product-listing';
    }
  }

  return {
    template: bestTemplate,
    confidence: highestScore,
    scores: scores
  };
}

// Export functions for testing
module.exports = {
  analyzeIssue,
  extractCustomizations,
  templates
};

// Extract customizations from issue content
function extractCustomizations(issueTitle, issueDescription = '') {
  const content = (issueTitle + ' ' + issueDescription).toLowerCase();
  const customizations = {};

  // Extract dimensions if mentioned
  const dimensionMatch = content.match(/(\d+)\s*x\s*(\d+)/i);
  if (dimensionMatch) {
    customizations.width = parseInt(dimensionMatch[1]);
    customizations.height = parseInt(dimensionMatch[2]);
  }

  // Extract specific page types
  if (content.includes('mobile') || content.includes('responsive')) {
    customizations.width = 375; // Mobile width
    customizations.height = 667;
  }

  // Extract color preferences
  if (content.includes('dark')) {
    customizations.theme = 'dark';
  } else if (content.includes('light')) {
    customizations.theme = 'light';
  }

  return customizations;
}

function loadTemplate(templateName) {
  const templatePath = path.join(__dirname, 'wireframe-templates', `${templateName}.svg`);
  if (fs.existsSync(templatePath)) {
    return fs.readFileSync(templatePath, 'utf8');
  }
  return null;
}

function customizeTemplate(templateSvg, customizations = {}) {
  let svg = templateSvg;

  // Apply customizations
  if (customizations.title) {
    // Replace title placeholders in the SVG
    svg = svg.replace(/Product Name|Wireframe|E-Commerce Store/g, customizations.title);
  }

  if (customizations.width && customizations.height) {
    // Update SVG dimensions
    svg = svg.replace(/width="\d+"/, `width="${customizations.width}"`);
    svg = svg.replace(/height="\d+"/, `height="${customizations.height}"`);
  }

  // Apply theme changes
  if (customizations.theme === 'dark') {
    // Convert light colors to dark theme
    svg = svg.replace(/#ffffff/g, '#2c3e50'); // White to dark blue
    svg = svg.replace(/#f8f9fa/g, '#34495e'); // Light gray to darker blue
    svg = svg.replace(/#2c3e50/g, '#ffffff'); // Dark blue headers to white
  }

  return svg;
}

function generateWireframe(options = {}) {
  const {
    template = 'basic',
    width = 400,
    height = 300,
    title = 'Wireframe',
    style = 'basic',
    output = path.join(__dirname, '../frontend-demo/public/wireframe.svg'),
    customizations = {},
    issueTitle = '',
    issueDescription = '',
    issueNumber = ''
  } = options;

  let outputContent = '';

  // If issue information is provided, analyze it
  let selectedTemplate = template;
  if (issueTitle) {
    const analysis = analyzeIssue(issueTitle, issueDescription);
    selectedTemplate = analysis.template;
    console.log(`Issue analysis: Selected template '${selectedTemplate}' with confidence ${analysis.confidence}`);

    // Extract additional customizations from issue
    const issueCustomizations = extractCustomizations(issueTitle, issueDescription);
    Object.assign(customizations, issueCustomizations);

    // Use issue title as wireframe title if no specific title provided
    if (!customizations.title) {
      customizations.title = issueTitle.length > 30 ? issueTitle.substring(0, 30) + '...' : issueTitle;
    }
  }

  // Check if using a template
  if (templates[selectedTemplate]) {
    const templateSvg = loadTemplate(selectedTemplate);
    if (templateSvg) {
      outputContent = customizeTemplate(templateSvg, {
        ...customizations,
        title: customizations.title || templates[selectedTemplate].title,
        width: width || templates[selectedTemplate].width,
        height: height || templates[selectedTemplate].height
      });
    } else {
      console.log(`Template '${selectedTemplate}' not found, falling back to generated wireframe`);
      style = 'components'; // Fallback
    }
  }

  // Generate from scratch if no template
  if (!outputContent) {
    if (style === 'basic') {
      outputContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="${width-40}" height="${height-40}" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2" rx="8"/>
        <text x="${width/2}" y="${height/2}" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="#6c757d">${title}</text>
      </svg>`;
    } else if (style === 'components') {
      outputContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <!-- Header -->
        <rect x="0" y="0" width="${width}" height="60" fill="#2c3e50" stroke="#34495e" stroke-width="1"/>
        <text x="20" y="35" font-family="Arial, sans-serif" font-size="20" fill="white">${title}</text>

        <!-- Content Area -->
        <rect x="20" y="80" width="${width-40}" height="${height-160}" fill="#ffffff" stroke="#dee2e6" stroke-width="1"/>
        <text x="${width/2}" y="${height/2}" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#6c757d">Content Area</text>

        <!-- Button -->
        <rect x="${width/2-60}" y="${height-70}" width="120" height="40" fill="#27ae60" stroke="#229954" stroke-width="1" rx="4"/>
        <text x="${width/2}" y="${height-45}" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="white">Action Button</text>
      </svg>`;
    }
  }

  // Create directory if it doesn't exist
  const outputDir = path.dirname(output);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(output, outputContent);

  const finalTitle = customizations.title || title;
  console.log(`Wireframe generated at ${output}`);
  console.log(`Template: ${selectedTemplate}, Dimensions: ${width}x${height}, Title: ${finalTitle}`);

  if (issueNumber) {
    console.log(`Generated for GitHub issue #${issueNumber}`);
  }

  // List available templates if requested
  if (params.list === 'templates') {
    console.log('\nAvailable templates:');
    Object.keys(templates).forEach(tmpl => {
      console.log(`- ${tmpl}: ${templates[tmpl].description}`);
    });
  }
}

// Use command line parameters or defaults
const template = params.template || 'basic';
const options = {
  template,
  width: parseInt(params.width) || (templates[template] ? templates[template].width : 400),
  height: parseInt(params.height) || (templates[template] ? templates[template].height : 300),
  title: params.title || (templates[template] ? templates[template].title : 'Wireframe'),
  style: params.style || 'basic',
  output: params.output || path.join(__dirname, '../frontend-demo/public/wireframe.svg'),
  customizations: params,
  issueTitle: params.issueTitle || '',
  issueDescription: params.issueDescription || '',
  issueNumber: params.issueNumber || ''
};

generateWireframe(options);
