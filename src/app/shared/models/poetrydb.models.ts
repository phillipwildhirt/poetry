// -----------------------------------------------------------------------
// LISTING ENDPOINTS
// These return flat arrays of strings, not poem objects.
// -----------------------------------------------------------------------

import { TypeaheadResultKind } from '@app/shared/models/typeahead-result.model';

/**
 * GET https://poetrydb.org/author
 * Returns every author name in the database.
 * Example: { "authors": ["Emily Dickinson", "Walt Whitman", ...] }
 */
export interface AuthorListResponse {
  authors: string[];
}

/**
 * GET https://poetrydb.org/title
 * Returns every poem title in the database.
 * Example: { "titles": ["A Bird came down the Walk", ...] }
 */
export interface TitleListResponse {
  titles: string[];
}


// -----------------------------------------------------------------------
// FULL POEM — all four fields present
// Returned when no output field filter is applied (the default).
// e.g. GET /author/Dickinson  or  GET /random
// -----------------------------------------------------------------------

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

// -----------------------------------------------------------------------
// PARTIAL POEM SHAPES
// PoetryDB lets you filter output fields via a trailing path segment:
//   GET /author/{author}/{outputFields}
// e.g. /author/Dickinson/title,author  →  [{ title, author }]
//
// Each interface below matches exactly one possible combination of fields
// you might request.
// -----------------------------------------------------------------------

/** Output: title only — e.g. GET /author/Dickinson/title */
export interface PoemTitle {
  title: string;
}

/** Output: author only — e.g. GET /title/Fog/author */
export interface PoemAuthor {
  author: string;
}

/** Output: lines only — e.g. GET /title/Fog/lines */
export interface PoemLines {
  lines: string[];
}

/** Output: linecount only — e.g. GET /title/Fog/linecount */
export interface PoemLinecount {
  linecount: string;
}

/** Output: title + author */
export interface PoemTitleAuthor {
  title: string;
  author: string;
}

/** Output: title + lines */
export interface PoemTitleLines {
  title: string;
  lines: string[];
}

/** Output: title + linecount */
export interface PoemTitleLinecount {
  title: string;
  linecount: string;
}

/** Output: author + lines */
export interface PoemAuthorLines {
  author: string;
  lines: string[];
}

/** Output: author + linecount */
export interface PoemAuthorLinecount {
  author: string;
  linecount: string;
}

/** Output: lines + linecount */
export interface PoemLinesLinecount {
  lines: string[];
  linecount: string;
}

/** Output: title + author + lines (everything except linecount) */
export interface PoemTitleAuthorLines {
  title: string;
  author: string;
  lines: string[];
}

/** Output: title + author + linecount (everything except lines) */
export interface PoemTitleAuthorLinecount {
  title: string;
  author: string;
  linecount: string;
}

/** Output: title + lines + linecount (everything except author) */
export interface PoemTitleLinesLinecount {
  title: string;
  lines: string[];
  linecount: string;
}

/** Output: author + lines + linecount (everything except title) */
export interface PoemAuthorLinesLinecount {
  author: string;
  lines: string[];
  linecount: string;
}

// -----------------------------------------------------------------------
// SEARCH INPUT / OUTPUT FIELD TYPES
// -----------------------------------------------------------------------

/**
 * Valid input fields for PoetryDB search.
 * Used to build multi-field search URLs:
 *   GET /author,title/{authorValue};{titleValue}
 */
export type PoetrySearchField = 'title' | 'author' | 'lines' | 'linecount';

/**
 * Valid output fields to request in a response.
 * Used as a trailing path segment:
 *   GET /author/{author}/title,lines
 * Use 'all' to explicitly request every field (same as the default).
 */
export type PoetryOutputField = 'title' | 'author' | 'lines' | 'linecount' | 'all';

// -----------------------------------------------------------------------
// ERROR RESPONSE
// -----------------------------------------------------------------------

/**
 * Returned by PoetryDB when no poems match the query.
 * Note: This is NOT an HTTP error — the status code is 200,
 * but the body contains this object instead of an array.
 * Example: { "status": 404, "reason": "Not found" }
 */
export interface PoetryDbErrorResponse {
  status: 200 | 404;
  reason: string;
}

// -----------------------------------------------------------------------
// GENERIC WRAPPER & TYPE GUARD
// -----------------------------------------------------------------------

/**
 * Wraps any expected poem response type T with the possible error shape.
 * Use this as the HttpClient generic when you need to handle not-found cases.
 *
 * Example:
 *   this.http.get<PoetryDbResponse<Poem[]>>('/author/Unknown')
 */
export type PoetryDbResponse<T> = T | PoetryDbErrorResponse;

/**
 * Type guard — narrows a PoetryDbResponse to PoetryDbErrorResponse.
 *
 * Example:
 *   if (isPoetryDbError(res)) { console.error(res.reason); }
 */
export function isPoetryDbError(response: unknown): response is PoetryDbErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'status' in response &&
    'reason' in response
  );
}

