// Wireframe generation script with Ollama LLM integration (Free & Local)
const fs = require('fs');
const path = require('path');
const http = require('http');

// Parse command line arguments
const args = process.argv.slice(2);
const params = {};
args.forEach(arg => {
  const [key, value] = arg.split('=');
  if (key && value) {
    params[key] = value;
  }
});

// Select appropriate template based on issue content
function selectTemplate(issueTitle, issueDescription = '') {
  const content = (issueTitle + ' ' + issueDescription).toLowerCase();
  const templatesDir = path.join(__dirname, 'wireframe-templates');

  if (content.includes('product') && content.includes('list')) {
    return path.join(templatesDir, 'product-listing.svg');
  } else if (content.includes('cart') || content.includes('shopping')) {
    return path.join(templatesDir, 'shopping-cart.svg');
  } else if (content.includes('checkout') || content.includes('payment')) {
    return path.join(templatesDir, 'checkout.svg');
  } else if (content.includes('profile') || content.includes('account') || content.includes('user')) {
    return path.join(templatesDir, 'user-profile.svg');
  } else {
    // Default to product listing if no match
    return path.join(templatesDir, 'product-listing.svg');
  }
}

// Load template SVG content
function loadTemplate(templatePath) {
  if (fs.existsSync(templatePath)) {
    return fs.readFileSync(templatePath, 'utf8');
  }
  return null;
}

// Call Ollama API to generate wireframe SVG
async function generateWireframeWithLLM(issueTitle, issueDescription = '', customizations = {}, templateSvg = null) {
  const systemPrompt = `You are an expert UI/UX wireframe designer. Generate clean, professional SVG wireframes based on requirements.

Guidelines:
- Generate valid SVG markup only
- Use a professional color palette (#2c3e50, #3498db, #ecf0f1, #95a5a6)
- Include headers, content areas, buttons, and forms as appropriate
- Add proper spacing and typography
- Make wireframes responsive and clear
- Include placeholder text like "Header", "Content", "Button", etc.
- Maintain aspect ratio based on specified dimensions
- Return ONLY the SVG markup, no explanations or markdown${templateSvg ? '\n- Use the provided template as a reference for layout and components' : ''}`;

  const userPrompt = `Create an SVG wireframe for the following requirement:
Title: ${issueTitle}
${issueDescription ? `Description: ${issueDescription}` : ''}
${customizations.width ? `Preferred Width: ${customizations.width}px` : 'Default Width: 800px'}
${customizations.height ? `Preferred Height: ${customizations.height}px` : 'Default Height: 600px'}
${customizations.theme ? `Theme: ${customizations.theme}` : 'Theme: light'}
${templateSvg ? `\nReference Template:\n${templateSvg}` : ''}

Return ONLY valid SVG markup:`;

  return new Promise((resolve, reject) => {
    const requestData = {
      model: process.env.OLLAMA_MODEL || 'llama3', // Default to llama3.2, can be overridden
      prompt: userPrompt,
      system: systemPrompt,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        num_predict: 2048
      }
    };

    const options = {
      hostname: 'localhost',
      port: 11434, // Default Ollama port
      path: '/api/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            reject(new Error(`Ollama API Error (${res.statusCode}): ${data}`));
            return;
          }

          const response = JSON.parse(data);
          const svgContent = response.response;

          // Validate SVG output
          if (!svgContent || !svgContent.includes('<svg')) {
            reject(new Error('Invalid SVG output from LLM. Response does not contain SVG markup.'));
            return;
          }

          resolve(svgContent);
        } catch (error) {
          reject(new Error(`Failed to parse Ollama response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Failed to connect to Ollama: ${error.message}. Make sure Ollama is running on localhost:11434`));
    });

    req.write(JSON.stringify(requestData));
    req.end();
  });
}

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

  // Extract specific page types and set dimensions
  if (content.includes('mobile') || content.includes('responsive')) {
    customizations.width = 375;
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

// Export functions for testing
module.exports = {
  generateWireframeWithLLM,
  extractCustomizations,
  selectTemplate,
  loadTemplate
};


// Main async function to generate wireframe
async function generateWireframe(options = {}) {
  const {
    template = 'basic',
    width = 800,
    height = 600,
    title = 'Wireframe',
    output = path.join(__dirname, '../frontend-demo/public/wireframe.svg'),
    customizations = {},
    issueTitle = '',
    issueDescription = '',
    issueNumber = ''
  } = options;

  try {
    console.log('Generating wireframe using Ollama API...');

    // Select and load template
    const templatePath = selectTemplate(issueTitle, issueDescription);
    const templateSvg = loadTemplate(templatePath);
    if (templateSvg) {
      console.log(`Using template: ${path.basename(templatePath)}`);
    }

    // Extract customizations from issue content
    const issueCustomizations = extractCustomizations(issueTitle, issueDescription);
    const finalCustomizations = {
      ...customizations,
      ...issueCustomizations,
      width: width || issueCustomizations.width || 800,
      height: height || issueCustomizations.height || 600
    };

    // Generate SVG using LLM
    const svgContent = await generateWireframeWithLLM(
      issueTitle || title,
      issueDescription,
      finalCustomizations,
      templateSvg
    );

    // Validate SVG output
    if (!svgContent || !svgContent.includes('<svg')) {
      throw new Error('Invalid SVG output from LLM. Response does not contain SVG markup.');
    }

    // Create directory if it doesn't exist
    const outputDir = path.dirname(output);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write to file
    fs.writeFileSync(output, svgContent);

    const finalTitle = issueTitle || title;
    console.log(`✓ Wireframe generated at ${output}`);
    console.log(`  Dimensions: ${finalCustomizations.width}x${finalCustomizations.height}`);
    console.log(`  Title: ${finalTitle}`);

    if (issueNumber) {
      console.log(`  Generated for GitHub issue #${issueNumber}`);
    }

    return {
      success: true,
      path: output,
      dimensions: {
        width: finalCustomizations.width,
        height: finalCustomizations.height
      }
    };
  } catch (error) {
    console.error('Error generating wireframe:', error.message);
    process.exit(1);
  }
}

// Use command line parameters or defaults
const options = {
  template: params.template || 'basic',
  width: parseInt(params.width) || 800,
  height: parseInt(params.height) || 600,
  title: params.title || 'Wireframe',
  output: params.output || path.join(__dirname, '../frontend-demo/public/wireframe.svg'),
  customizations: params,
  issueTitle: params.issueTitle || '',
  issueDescription: params.issueDescription || '',
  issueNumber: params.issueNumber || ''
};

// Run if this is the main module
if (require.main === module) {
  generateWireframe(options);
}
