import { test, expect } from '@playwright/test'

test.describe('SpecSnap full flow', () => {
  test('create, edit, export, and find a Snap', async ({ page }) => {
    // 1. Open app — the intro shows on first load.
    await page.goto('/')

    // 2. Skip the intro.
    await page.getByRole('button', { name: /skip intro/i }).click()
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/messy notes/i)

    // 3. Start a Study Notes Snap.
    await page.getByRole('link', { name: /create snap/i }).click()
    await expect(page).toHaveURL(/\/new/)
    await page.getByRole('radio', { name: /study notes/i }).click()

    // 4. Paste notes.
    await page
      .getByPlaceholder(/paste anything messy/i)
      .fill(
        `Photosynthesis basics\n\nPhotosynthesis is the process plants use to convert light energy into chemical energy stored as glucose. It takes place in the chloroplasts of leaf cells and underpins nearly every food chain.\n\nChlorophyll: green pigment that absorbs light\nStomata: pores that exchange gases\n\n- Light reactions happen in the thylakoids\n- The Calvin cycle fixes carbon dioxide\n- Oxygen is a by-product`,
      )

    // 5. Generate the page.
    await page.getByRole('button', { name: /generate page/i }).click()
    await expect(page).toHaveURL(/\/editor\//, { timeout: 10_000 })
    await expect(page.getByTestId('editor')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/photosynthesis/i)

    // 6. Edit a block via the inspector.
    await page.getByRole('navigation', { name: /blocks/i }).getByText(/at a glance/i).click()
    const summaryField = page.getByRole('textbox', { name: 'Summary' })
    await summaryField.fill('An edited summary written during the E2E test.')
    await expect(page.locator('section', { hasText: 'At a glance' }).first()).toContainText(
      'edited summary written during the E2E test',
    )

    // 7. Switch accent to River.
    await page.getByRole('radio', { name: /river palette/i }).click()
    await expect(page.locator('html')).toHaveAttribute('data-accent', 'river')

    // 8. Export Markdown.
    await page.getByRole('button', { name: /export/i }).first().click()
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: /markdown/i }).click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/\.md$/)

    // 9–10. Gallery shows the saved Snap.
    const nav = page.getByRole('navigation', { name: 'Main navigation' })
    await nav.getByRole('link', { name: 'Gallery' }).click()
    await expect(page).toHaveURL(/\/gallery/)
    await expect(page.getByText(/photosynthesis basics/i)).toBeVisible({ timeout: 5000 })

    // 11–12. Exports page lists the export record.
    await nav.getByRole('link', { name: 'Exports' }).click()
    await expect(page).toHaveURL(/\/exports/)
    await expect(page.getByText(/export history/i)).toBeVisible()
    await expect(page.locator('text=markdown').first()).toBeVisible({ timeout: 5000 })
  })

  test('settings, reduced motion, and asset manifest', async ({ page }) => {
    await page.goto('/')
    const skip = page.getByRole('button', { name: /skip intro/i })
    if (await skip.isVisible().catch(() => false)) await skip.click()

    const nav = page.getByRole('navigation', { name: 'Main navigation' })
    await nav.getByRole('link', { name: 'Settings' }).click()
    await page.getByRole('checkbox', { name: /reduce motion/i }).check()
    await expect(page.locator('html')).toHaveAttribute('data-reduced-motion', 'true')

    await nav.getByRole('link', { name: 'Exports' }).click()
    await expect(page.getByText(/40.*SVG/i).first()).toBeVisible({ timeout: 5000 })
  })
})
