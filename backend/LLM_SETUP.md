# Free LLM-Based Wireframe Generation Setup (Ollama)

The wireframe generation now uses **Ollama** - a completely free, local LLM that runs on your machine. No API keys, no costs, no internet required after initial setup!

## Why Ollama?

✅ **Completely Free** - No API costs, no credits to manage
✅ **Runs Locally** - Your data stays private
✅ **No API Keys** - Just install and run
✅ **Works Offline** - Generate wireframes without internet
✅ **Easy Setup** - Download and install like any app

## Prerequisites

1. **Node.js** v14+ installed
2. **Ollama** installed and running
3. **A good LLM model** downloaded

## Setup Instructions (5 minutes)

### 1. Install Ollama

**Windows:**
```bash
# Download from: https://ollama.ai/download
# Run the installer
```

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### 2. Start Ollama Service

```bash
# Start Ollama in background
ollama serve
```

### 3. Download a Model

Choose one of these models (we recommend `llama3.2` for best results):

```bash
# Best for wireframes (balanced quality/speed)
ollama pull llama3.2

# Alternative options:
ollama pull llama3        # More capable but slower
ollama pull codellama     # Good for technical content
ollama pull mistral       # Fast and capable
ollama pull phi-3         # Microsoft's efficient model
```

### 4. Verify Installation

```bash
# Check if Ollama is running
ollama list

# Test the model
ollama run llama3.2 "Hello"
```

## Usage

### Basic Wireframe Generation

```bash
# Generate a wireframe from issue information
node generate-wireframe.js \
  issueTitle="Product Listing Page" \
  issueDescription="Create a responsive product grid with filters"
```

### With Customizations

```bash
# Specify dimensions
node generate-wireframe.js \
  issueTitle="Mobile Checkout" \
  width=375 \
  height=667 \
  output=./mobile-checkout.svg

# Use different model
OLLAMA_MODEL=codellama node generate-wireframe.js \
  issueTitle="Dashboard" \
  issueDescription="Admin dashboard with charts"
```

### Programmatic Usage

```javascript
const { generateWireframe } = require('./generate-wireframe');

const result = await generateWireframe({
  issueTitle: 'Product Detail Page',
  issueDescription: 'Show product image, price, and add to cart button',
  width: 800,
  height: 600,
  output: './product-detail.svg'
});

console.log('Generated at:', result.path);
```

## How It Works

1. **Local Processing**: Your requirements are sent to the local Ollama server
2. **LLM Generation**: The model understands your wireframe needs
3. **SVG Creation**: Clean, professional SVG markup is generated
4. **File Output**: Saved directly to your specified location

## Model Recommendations

| Model | Best For | Speed | Quality |
|-------|----------|-------|---------|
| `llama3.2` | General wireframes | Fast | Good |
| `llama3` | Complex layouts | Medium | Excellent |
| `codellama` | Technical UIs | Fast | Good |
| `mistral` | Creative designs | Fast | Good |

## Troubleshooting

### "Failed to connect to Ollama: ECONNREFUSED"
- Make sure Ollama is running: `ollama serve`
- Check if port 11434 is available
- Try restarting Ollama

### "Invalid SVG output from LLM"
- Try a different model: `OLLAMA_MODEL=llama3 node generate-wireframe.js ...`
- Rephrase your issue description more clearly
- Some models work better than others for creative tasks

### "Model not found"
- Pull the model first: `ollama pull llama3.2`
- Check available models: `ollama list`

### Performance Issues
- Use smaller models for faster generation
- Close other applications using GPU memory
- Try `phi-3` for better performance on limited hardware

## Advanced Configuration

### Custom Model

Set a different model in your `.env` file:
```bash
OLLAMA_MODEL=llama3
```

### Custom Ollama Server

If running Ollama on a different machine/port:
```bash
OLLAMA_BASE_URL=http://192.168.1.100:11434
```

### Model Parameters

The code uses optimized settings, but you can modify `temperature` and `top_p` in the request for different creativity levels.

## Cost Comparison

| Service | Setup Cost | Per Wireframe | Monthly Limit |
|---------|------------|----------------|---------------|
| **Ollama** | $0 | $0 | Unlimited |
| Anthropic | $0 | $0.01-0.05 | $5 free credits |
| OpenAI | $0 | $0.01-0.05 | $5 free credits |

## Next Steps

1. **Test the setup** with a simple wireframe
2. **Try different models** to find your favorite
3. **Integrate with your workflow** (scripts, CI/CD)
4. **Experiment with prompts** for better results

## Switching Models

Want to try a different model? Just run:

```bash
# Pull a new model
ollama pull codellama

# Use it for generation
OLLAMA_MODEL=codellama node generate-wireframe.js issueTitle="Your idea"
```

Enjoy completely free wireframe generation! 🎨
