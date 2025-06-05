// Test script to validate Base64 logo functionality
const testData = {
  validLogo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEQgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  invalidFormat: "not-a-data-url",
  invalidMimeType: "data:text/plain;base64,SGVsbG8gd29ybGQ=",
  invalidBase64: "data:image/png;base64,invalid-base64-data!!!"
};

const sampleInvoice = {
  invoiceNumber: "TEST-001",
  date: "2025-06-06",
  dueDate: "2025-07-06",
  companyName: "Test Company",
  fromName: "Test Sender",
  fromEmail: "sender@test.com",
  fromAddress: "123 Test St",
  toName: "Test Recipient",
  toEmail: "recipient@test.com",
  toAddress: "456 Test Ave",
  items: [{
    id: "1",
    description: "Test Item",
    quantity: 1,
    price: 100,
    currency: "USD",
    exchangeRate: 1,
    discountType: "percentage",
    discountValue: 0
  }],
  taxRate: 0,
  currency: "USD",
  discountType: "percentage",
  discountValue: 0,
  applyInvoiceDiscountToDiscountedItems: false
};

async function testLogo(logo, description) {
  console.log(`\n🧪 Testing: ${description}`);
  
  const testInvoice = { ...sampleInvoice, companyLogo: logo };
  
  try {
    const response = await fetch('http://localhost:3000/api/invoices/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testInvoice)
    });
    
    if (response.ok) {
      console.log(`✅ Success: PDF generated (${response.headers.get('content-length')} bytes)`);
    } else {
      const error = await response.json();
      console.log(`❌ Error: ${error.error}`);
    }
  } catch (err) {
    console.log(`💥 Request failed: ${err.message}`);
  }
}

async function runTests() {
  console.log("🚀 Starting Base64 Logo Validation Tests\n");
  
  await testLogo(testData.validLogo, "Valid Base64 PNG logo");
  await testLogo(testData.invalidFormat, "Invalid format (not a data URL)");
  await testLogo(testData.invalidMimeType, "Invalid MIME type (text/plain)");
  await testLogo(testData.invalidBase64, "Invalid Base64 data");
  await testLogo("", "Empty logo (should work)");
  await testLogo(null, "Null logo (should work)");
  
  console.log("\n✨ Tests completed!");
}

// Run the tests
runTests().catch(console.error);
