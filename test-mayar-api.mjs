// Test Mayar API connectivity
const MAYAR_API_KEY = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5ZGVmOGRkOC1iZDA1LTRjZjgtODdhYy1iZDFmYjMxYzJhYzkiLCJhY2NvdW50SWQiOiJjYzEyMmZkMi1lYWVkLTQ1NDAtODkzMi05ZGFiYmQ3ZjIzNGMiLCJjcmVhdGVkQXQiOiIxNzcyOTQyODI4NzU2Iiwicm9sZSI6ImRldmVsb3BlciIsInN1YiI6Im11aGlrbXVAZ21haWwuY29tIiwibmFtZSI6IkNlbmRyYSBMaW5nbyIsImxpbmsiOiJtdWhpay1tdS0zMzE0MCIsImlzU2VsZkRvbWFpbiI6ZmFsc2UsImlhdCI6MTc3Mjk0MjgyOH0.eN6pXyBADxYHrvYC9i3YibX1-81UhV1HfGNYfUZTXWd2SBfjJR47d6R6twY6BiKlOxsoTj97JuU5kRs7wchdAC1duWRrEPmyJ5yWUkGDLXKziL4mIEycTzB4peTfl8U6CmC3ehsdseQIniaeD27G7I-gBOF6DQyTUu1PybIuJDP1CXfwMJ6oAfGa8uNYzcCiGch8VwnKwHwkDSqnHpcgPgolCTgVTjU6an-RcJh9WZi7LLfPX7arUSrZGu1Y7nxAPIwgtgS-T6o44gfCncU3Q67H9pGcssCPM2pDUXXBf-G4b3wsjxgTkEWPb1-uGGzJ5_EFk5FJX75N1czemH5RjA';

async function testMayarAPI() {
    try {
        console.log('Testing Mayar API connectivity...\n');
        console.log('API Key:', MAYAR_API_KEY.substring(0, 20) + '...');

        // Test 1: Get account info
        console.log('\n=== TEST 1: Get Account Info ===');
        try {
            const accountResponse = await fetch('https://api.mayar.id/hl/v1/account', {
                headers: {
                    'Authorization': `Bearer ${MAYAR_API_KEY}`
                }
            });

            console.log('Status:', accountResponse.status, accountResponse.statusText);
            if (accountResponse.ok) {
                const accountData = await accountResponse.json();
                console.log('✅ Account info:', JSON.stringify(accountData, null, 2));
            } else {
                const errorText = await accountResponse.text();
                console.log('❌ Response:', errorText);
            }
        } catch (err) {
            console.error('❌ Account test failed:', err.message);
        }

        // Test 2: Get a sample invoice (using a test ID if available)
        console.log('\n=== TEST 2: Get Sample Invoice ===');
        console.log('Note: This test requires a valid mayar_id from your transactions');
        console.log('Check your database for a transaction with mayar_id:');
        console.log('  SELECT mayar_id FROM transactions WHERE mayar_id IS NOT NULL LIMIT 1;');

        // You can manually test with a specific invoice ID if you have one
        // const testInvoiceId = 'your-invoice-id-here';
        // const invoiceResponse = await fetch(`https://api.mayar.id/hl/v1/invoice/${testInvoiceId}`, {
        //     headers: { 'Authorization': `Bearer ${MAYAR_API_KEY}` }
        // });
        // console.log('Invoice status:', invoiceResponse.status);

        console.log('\n✅ Mayar API test completed!');
        console.log('\nConclusion:');
        console.log('- If account info returned 200 OK, your API key is valid');
        console.log('- If you get 401/403, your API key may be invalid or expired');
        console.log('- If you get network errors, check your internet connection');

    } catch (error) {
        console.error('❌ Mayar API test failed:', error);
        process.exit(1);
    }
}

testMayarAPI();