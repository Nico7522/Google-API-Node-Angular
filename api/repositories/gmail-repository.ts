import { gmail_v1 } from "googleapis";
import { MailSumarryDTO } from "../interfaces/mail-interfaces";

/**
 * Repository interface for Gmail operations
 *
 * This interface defines the contract for all Gmail-related data access operations.
 * It provides methods for retrieving messages, message details, and AI-powered filtering.
 *
 * @interface GmailRepository
 */
export interface GmailRepository {
  /**
   * Retrieve a list of Gmail messages for a user
   *
   * Fetches messages from the user's Gmail account with optional filtering and pagination.
   * Each message is converted to a summary DTO containing essential information.
   *
   * @param {string} userId - The unique identifier of the user
   * @param {Object} options - Query options for message retrieval
   * @param {number} [options.maxResults=10] - Maximum number of messages to return
   * @param {string} [options.pageToken] - Token for pagination to get next page of results
   * @param {string} [options.q] - Search query to filter messages (Gmail search syntax)
   * @returns {Promise<{ messages: MailSumarryDTO[]; nextPageToken: string | null }>}
   *
   * @example
   * ```typescript
   * const result = await gmailRepository.listMessages("user123", {
   *   maxResults: 20,
   *   q: "from:example@gmail.com"
   * });
   * // Returns: { messages: [...], nextPageToken: "next_page_token" }
   * ```
   *
   * @throws {Error} When user is not authenticated
   * @throws {Error} When Gmail API returns an error
   */
  listMessages(
    userId: string,
    options: {
      maxResults?: number;
      pageToken?: string;
      q?: string;
    }
  ): Promise<{ messages: MailSumarryDTO[]; nextPageToken: string | null }>;

  /**
   * Retrieve a specific Gmail message by ID
   *
   * Fetches the complete details of a single message including its content,
   * headers, and processed email data (HTML content and CSS styles).
   *
   * @param {string} userId - The unique identifier of the user
   * @param {string} messageId - The unique identifier of the message
   * @returns {Promise<{ mailInfo: MailSumarryDTO; processedEmail: { htmlContent: string | null; cssStyles: string | null; hasStyles: boolean; } } | null>}
   *
   * @example
   * ```typescript
   * const result = await gmailRepository.getMessageById("user123", "message456");
   * // Returns: {
   * //   mailInfo: { id: "message456", subject: "...", ... },
   * //   processedEmail: { htmlContent: "...", cssStyles: "...", hasStyles: true }
   * // }
   * ```
   *
   * @throws {Error} When user is not authenticated
   * @throws {Error} When message is not found
   * @throws {Error} When Gmail API returns an error
   */
  getMessageById(
    userId: string,
    messageId: string
  ): Promise<{
    mailInfo: MailSumarryDTO;
    processedEmail: {
      htmlContent: string | null;
      cssStyles: string | null;
      hasStyles: boolean;
    };
  } | null>;

  /**
   * Filter Gmail messages using AI
   *
   * Retrieves multiple messages and uses AI to filter them based on a user prompt.
   * The AI analyzes the content of each message and returns IDs of messages that match the criteria.
   *
   * @param {string} userId - The unique identifier of the user
   * @param {string[]} messageIds - Array of message IDs to analyze
   * @param {string} userPrompt - The AI prompt describing what to filter for
   * @returns {Promise<string[]>} Array of message IDs that match the AI criteria
   *
   * @example
   * ```typescript
   * const filteredIds = await gmailRepository.getFilteredMailsByAI(
   *   "user123",
   *   ["msg1", "msg2", "msg3"],
   *   "Find emails about project updates"
   * );
   * // Returns: ["msg1", "msg3"] - IDs of messages matching the criteria
   * ```
   *
   * @throws {Error} When user is not authenticated
   * @throws {Error} When AI service fails
   * @throws {Error} When Gmail API returns an error
   */
  getFilteredMailsByAI(
    userId: string,
    messageIds: string[],
    userPrompt: string
  ): Promise<string[]>;
}
