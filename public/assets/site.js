for (const button of document.querySelectorAll("[data-copy]")) {
  button.addEventListener("click", async () => {
    const source = document.getElementById(button.dataset.copy);
    const status = button
      .closest(".command-container")
      ?.querySelector(".copy-status");
    if (!source || !status) return;
    try {
      await navigator.clipboard.writeText(source.textContent.trim());
      status.textContent = "Copied. Paste into your terminal when ready.";
      button.textContent = "Copied";
    } catch {
      const range = document.createRange();
      range.selectNodeContents(source);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      status.textContent =
        "Command selected. Copy it using your browser or keyboard.";
    }
  });
}
