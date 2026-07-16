import { chromium } from "playwright";

const consoleErrors = [];
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage();
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (err) => consoleErrors.push(`pageerror: ${err.message}`));

async function shot(name) {
  await page.screenshot({ path: `/tmp/claude-1000/-workspaces-dispoinvoice-smart-pae-/89334394-3cab-4bed-81aa-bdd7a936952c/scratchpad/${name}.png`, fullPage: true });
}

try {
  await page.goto("http://localhost:3000/purchase-order", { waitUntil: "networkidle" });
  await page.waitForSelector("text=Buat Purchase Order");

  // Fill PO number (already has default), fill supplier via manual mode to avoid depending on seeded data
  await page.click("text=Input Manual");
  await page.fill("#" + (await page.getAttribute("label:has-text('Nama Pemasok') + input, input", "id")) || "input", "").catch(() => {});

  // More robust: locate manual fields by label text
  const nameInput = page.locator("label:has-text('Nama Pemasok')").locator("xpath=following-sibling::input[1]");
  await nameInput.fill("PT Verifikasi Otomatis");
  const contactInput = page.locator("label:has-text('Kontak')").locator("xpath=following-sibling::input[1]");
  await contactInput.fill("0812-0000-0000");
  const addressInput = page.locator("label:has-text('Alamat')").locator("xpath=following-sibling::input[1]");
  await addressInput.fill("Jl. Verifikasi No. 1, Jakarta");

  // Fill first item description
  const descInput = page.locator("input[placeholder='Nama barang atau jasa']").first();
  await descInput.fill("Item Verifikasi Otomatis");

  await shot("01-po-form-filled");

  // Click "Simpan PO"
  await page.click("button:has-text('Simpan PO')");

  // Wait for navigation to detail page
  await page.waitForURL(/\/purchase-order\/[a-f0-9-]+$/, { timeout: 15000 });
  await page.waitForLoadState("networkidle");

  const bodyText = await page.textContent("body");
  const notFound = bodyText.includes("Purchase order tidak ditemukan");

  await shot("02-po-detail-page");

  console.log("DETAIL_URL:", page.url());
  console.log("NOT_FOUND_SHOWN:", notFound);
  console.log("HAS_SUPPLIER_NAME:", bodyText.includes("PT Verifikasi Otomatis"));
  console.log("HAS_ITEM:", bodyText.includes("Item Verifikasi Otomatis"));

  // Open Bagikan dialog
  await page.click("button:has-text('Bagikan')");
  await page.waitForSelector("text=Bagikan Purchase Order");
  await page.waitForFunction(() => {
    const input = document.querySelector("#\\:r0\\:-share-link, input[id$='-share-link']");
    return input && input.value && input.value.length > 0;
  }, { timeout: 10000 }).catch(() => {});

  const shareLinkValue = await page.locator("input[id$='-share-link']").inputValue();
  console.log("SHARE_LINK:", shareLinkValue);

  await shot("03-share-dialog");

  if (shareLinkValue) {
    await page.goto(shareLinkValue, { waitUntil: "networkidle" });
    const publicBody = await page.textContent("body");
    console.log("PUBLIC_PAGE_HAS_SUPPLIER:", publicBody.includes("PT Verifikasi Otomatis"));
    console.log("PUBLIC_PAGE_INVALID_LINK:", publicBody.includes("Tautan tidak valid"));
    await shot("04-public-po-page");
  }

  console.log("CONSOLE_ERRORS:", JSON.stringify(consoleErrors));
} catch (err) {
  console.error("SCRIPT_ERROR:", err.message);
  await shot("99-error-state");
  console.log("CONSOLE_ERRORS:", JSON.stringify(consoleErrors));
} finally {
  await browser.close();
}
