import { test, expect } from "../playwright-fixture";

test("command palette navigates, theme toggle persists, sections reveal on scroll", async ({ page }) => {
  await page.goto("/");

  // Command palette opens via Ctrl+K and navigates to a section
  await page.keyboard.press("Control+k");
  await expect(page.getByPlaceholder(/jump to a section/i)).toBeVisible();
  await page.getByRole("option", { name: "Experience" }).click();
  await expect(page.getByPlaceholder(/jump to a section/i)).not.toBeVisible();

  // Theme toggle switches and persists across reload
  const toggle = page.getByLabel("Switch to light theme");
  await toggle.click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).not.toHaveClass(/dark/);

  // A section reveals on scroll
  const aboutHeading = page.getByRole("heading", { name: "About Me", exact: true });
  await aboutHeading.scrollIntoViewIfNeeded();
  await expect(aboutHeading).toBeVisible();
});
