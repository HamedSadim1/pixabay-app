import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Routes whose UI renders without a real Pixabay API response, so the scan is
// deterministic in CI. `/image/:id` is skipped because it needs a live image.
const ROUTES = ["/", "/search", "/posts", "/location", "/profile"];

for (const route of ROUTES) {
  test(`axe scan ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState("networkidle");

    const { violations } = await new AxeBuilder({ page }).analyze();

    const summary = violations
      .map((v) => `${v.id} (${v.impact}): ${v.help}`)
      .join("\n");
    expect(violations, summary).toEqual([]);
  });
}
