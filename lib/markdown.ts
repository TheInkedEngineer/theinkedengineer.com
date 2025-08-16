// Utility functions for markdown processing
export function parseMarkdown(content: string) {
  // In a real application, you would use a proper markdown parser like 'marked' or 'remark'
  // This is a simplified version for demonstration

  const lines = content.split("\n")
  const parsed = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith("# ")) {
      parsed.push({ type: "h1", content: line.substring(2) })
    } else if (line.startsWith("## ")) {
      parsed.push({ type: "h2", content: line.substring(3) })
    } else if (line.startsWith("### ")) {
      parsed.push({ type: "h3", content: line.substring(4) })
    } else if (line.startsWith("```")) {
      // Handle code blocks
      const language = line.substring(3)
      const codeLines = []
      i++
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i])
        i++
      }
      parsed.push({ type: "code", language, content: codeLines.join("\n") })
    } else if (line.trim() !== "") {
      parsed.push({ type: "paragraph", content: line })
    }
  }

  return parsed
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
