export enum TypeaheadResultKind {
  author   = 'author',
  title    = 'title',
  line     = 'line',
  skeleton = 'skeleton',
}

export enum TypeaheadSectionLabel {
  author   = 'Authors',
  title    = 'Poems by Title',
  line     = 'Poems by Text',
}

// -----------------------------------------------------------------------
// TYPEAHEAD RESULT TYPES
// Dividers are gone — section labels are rendered via CSS ::before
// on the first item of each group using the `sectionLabel` property.
// -----------------------------------------------------------------------

export interface TypeaheadAuthorResult {
  kind: TypeaheadResultKind.author;
  name: string;
  sectionLabel?: TypeaheadSectionLabel.author;
}

export interface TypeaheadTitleResult {
  kind: TypeaheadResultKind.title;
  title: string;
  author: string;
  line?: string;
  sectionLabel?: TypeaheadSectionLabel.title;
}

export interface TypeaheadLineResult {
  kind: TypeaheadResultKind.line;
  title: string;
  author: string;
  line: string;
  sectionLabel?: TypeaheadSectionLabel.line;
}

export interface TypeaheadSkeletonResult {
  kind: TypeaheadResultKind.skeleton;
  sectionLabel?: TypeaheadSectionLabel.author | TypeaheadSectionLabel.title | TypeaheadSectionLabel.line;
}

export type TypeaheadResult = TypeaheadAuthorResult | TypeaheadTitleResult | TypeaheadLineResult | TypeaheadSkeletonResult;

export const isAuthor = (result: TypeaheadResult): result is TypeaheadAuthorResult =>
  result?.kind === TypeaheadResultKind.author;

export const isTitle = (result: TypeaheadResult): result is TypeaheadTitleResult =>
  result?.kind === TypeaheadResultKind.title;

export const isLine = (result: TypeaheadResult): result is TypeaheadLineResult =>
  result?.kind === TypeaheadResultKind.line;

export const isSkeleton = (result: TypeaheadResult): result is TypeaheadSkeletonResult =>
  result?.kind === TypeaheadResultKind.skeleton;

export const isAuthorResults = (results: TypeaheadResult[]): results is TypeaheadAuthorResult[] =>
  results.every(isAuthor);

export const isTitleResults = (results: TypeaheadResult[]): results is TypeaheadTitleResult[] =>
  results.every(isTitle);

export const isLineResults = (results: TypeaheadResult[]): results is TypeaheadLineResult[] =>
  results.every(isLine);

/** The searchable kinds — everything except skeleton. */
export type TypeaheadSearchKind = Exclude<TypeaheadResultKind, TypeaheadResultKind.skeleton>;

/** Search mode: a specific section kind, or 'search' for the combined typeahead, or 'exact-author' for a single author's titles. */
export type SearchMode = TypeaheadSearchKind | 'search' | 'exact-author';
