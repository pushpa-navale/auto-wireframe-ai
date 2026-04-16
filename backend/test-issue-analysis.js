// Test script for issue analysis functionality
const { analyzeIssue } = require('./generate-wireframe.js');

// Test cases for different types of issues
const testCases = [
  {
    title: "Need a shopping cart page",
    description: "Users should be able to view their selected items, change quantities, and proceed to checkout",
    expected: "shopping-cart"
  },
  {
    title: "Product detail page design",
    description: "Create a page to show individual product information with image, price, and add to cart button",
    expected: "product-detail"
  },
  {
    title: "Checkout flow improvement",
    description: "Users need a better checkout experience with shipping and payment information",
    expected: "checkout"
  },
  {
    title: "User profile and account management",
    description: "Need a page for users to manage their account settings and personal information",
    expected: "user-profile"
  },
  {
    title: "Product listing page",
    description: "Show all products in a grid layout with filtering and sorting options",
    expected: "product-listing"
  },
  {
    title: "Login and registration forms",
    description: "Users need to be able to sign up and log into their accounts",
    expected: "user-profile"
  },
  {
    title: "Mobile responsive design",
    description: "Make sure all pages work well on mobile devices",
    expected: "basic" // Will use mobile dimensions
  }
];

console.log("🧪 Testing issue analysis functionality:\n");

let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach((testCase, index) => {
  const result = analyzeIssue(testCase.title, testCase.description);
  const isCorrect = result.template === testCase.expected;
  const status = isCorrect ? "✅" : "❌";

  if (isCorrect) passedTests++;

  console.log(`${status} Test ${index + 1}: "${testCase.title}"`);
  console.log(`   Expected: ${testCase.expected}, Got: ${result.template}, Confidence: ${result.confidence}`);
  if (!isCorrect) {
    console.log(`   Scores: ${JSON.stringify(result.scores)}`);
  }
  console.log("");
});

console.log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`);
console.log("\n🎯 Issue analysis test completed!");