
/**
 * GET https://poetrydb.org/author
 * Returns every author name in the database.
 * Example: { "authors": ["Emily Dickinson", "Walt Whitman", ...] }
 */
export interface AuthorListResponse {
  authors: string[];
}


/**
 * A complete poem with all fields populated.
 * linecount is a numeric string (e.g. "8"), not a number.
 */
export interface Poem {
  title: string;
  author: string;
  lines: string[];
  linecount: string;
}

/** Output: title + author */
export interface PoemTitleAuthor {
  title: string;
  author: string;
}

