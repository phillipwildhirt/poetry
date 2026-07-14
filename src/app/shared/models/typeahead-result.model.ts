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

export const typeaheadSectionLabelSingular = {
  [TypeaheadSectionLabel.author] : 'Author',
  [TypeaheadSectionLabel.title]  : 'Title',
  [TypeaheadSectionLabel.line]   : 'Text',
};

export const sectionLabelRouteMap: Partial<Record<TypeaheadSectionLabel, TypeaheadSearchKind>> = {
  [TypeaheadSectionLabel.author]: TypeaheadResultKind.author,
  [TypeaheadSectionLabel.title] : TypeaheadResultKind.title,
  [TypeaheadSectionLabel.line]  : TypeaheadResultKind.line,
} as const;

export const kindSectionLabelMap: Partial<Record<AppState, TypeaheadSectionLabel>> = {
  [TypeaheadResultKind.author]: TypeaheadSectionLabel.author,
  [TypeaheadResultKind.title] : TypeaheadSectionLabel.title,
  [TypeaheadResultKind.line]  : TypeaheadSectionLabel.line,
  'exact-author'              : TypeaheadSectionLabel.author,
} as const;


// -----------------------------------------------------------------------
// TYPEAHEAD RESULT TYPES
// Dividers are gone — section labels are rendered via CSS ::before
// on the first item of each group using the `sectionLabel` property.
// -----------------------------------------------------------------------

export interface TypeaheadAuthorResult {
  kind: TypeaheadResultKind.author;
  name: string;
  sectionLabel?: TypeaheadSectionLabel.author;
  more?: TypeaheadSectionLabel.author;
}

export interface TypeaheadTitleResult {
  kind: TypeaheadResultKind.title;
  title: string;
  author: string;
  line?: string;
  sectionLabel?: TypeaheadSectionLabel.title;
  more?: TypeaheadSectionLabel.title;
}

export interface TypeaheadLineResult {
  kind: TypeaheadResultKind.line;
  title: string;
  author: string;
  line: string;
  sectionLabel?: TypeaheadSectionLabel.line;
  more?: TypeaheadSectionLabel.line;
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

/** The searchable kinds — everything except skeleton. */
export type TypeaheadSearchKind = Exclude<TypeaheadResultKind, TypeaheadResultKind.skeleton>;

/** Search state: a specific section kind, or 'search' for the combined typeahead, or 'exact-author' for a single author's titles. */
export type AppState = TypeaheadSearchKind | 'search' | 'exact-author' | 'poem';
