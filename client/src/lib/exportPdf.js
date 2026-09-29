export default function exportPdf() {
  document.body.classList.add('printing-resume')
  // Wait a frame so the print-only CSS applies before opening the dialog.
  requestAnimationFrame(() => {
    setTimeout(() => {
      window.print()
      setTimeout(() => document.body.classList.remove('printing-resume'), 500)
    }, 100)
  })
}
