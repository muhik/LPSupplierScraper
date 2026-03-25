async function run() {
    try {
        console.log("Fetching prod API...");
        const res = await fetch('https://officialsupplierscrape.my.id/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({password: 'admin123'})
        });
        const status = res.status;
        const text = await res.text();
        console.log("STATUS:", status);
        console.log("BODY:", text);
    } catch(e) {
        console.error("Fetch failed:", e);
    }
}
run();
