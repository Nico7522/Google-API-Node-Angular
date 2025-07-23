/**
 * Removes all HTML tags from a string and returns plain text
 * @param htmlContent - The HTML content to strip tags from
 * @returns Plain text without HTML tags
 */
export function removeHtmlTags(htmlContent: string): string {
  if (!htmlContent) return "";

  // Remove HTML tags using regex
  return htmlContent.replace(/<[^>]*>/g, "");
}

/**
 * Parses AI response string containing array-like data into actual array
 * @param aiResponse - The AI response string (e.g., "['id1', 'id2']" or "[id1,id2]")
 * @returns Array of strings
 */
export function parseAIResponseToArray(aiResponse: string): string[] {
  if (!aiResponse) return [];

  try {
    // Remove any extra whitespace and newlines
    const cleanedResponse = aiResponse.trim();

    // Handle the specific format: ['id1', 'id2', 'id3']
    if (cleanedResponse.startsWith("['") && cleanedResponse.endsWith("']")) {
      // Extract content between the outer brackets
      const content = cleanedResponse.slice(2, -2); // Remove [' and ']
      return content
        .split("', '")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }

    // Try to parse as JSON first (for proper array format)
    if (cleanedResponse.startsWith("[") && cleanedResponse.endsWith("]")) {
      return JSON.parse(cleanedResponse);
    }

    // Fallback: extract IDs from string like "['id1', 'id2']"
    const match = cleanedResponse.match(/\[(.*)\]/);
    if (match) {
      const content = match[1];
      // Split by comma and clean up quotes and whitespace
      return content
        .split(",")
        .map((item) => item.trim().replace(/['"]/g, ""))
        .filter((item) => item.length > 0);
    }

    // If no array format found, try comma-separated values
    return cleanedResponse
      .split(",")
      .map((item) => item.trim().replace(/['"]/g, ""))
      .filter((item) => item.length > 0);
  } catch (error) {
    console.error("Error parsing AI response:", error, "Response:", aiResponse);
    return [];
  }
}
