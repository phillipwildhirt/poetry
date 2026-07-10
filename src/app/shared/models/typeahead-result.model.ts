export enum TypeaheadResultKind {
  author   = 'author',
  title    = 'title',
  skeleton = 'skeleton',
}

// -----------------------------------------------------------------------
// TYPEAHEAD RESULT TYPES
// Dividers are gone — section labels are rendered via CSS ::before
// on the first item of each group using the `sectionLabel` property.
// -----------------------------------------------------------------------

export interface TypeaheadAuthorResult {
  kind: TypeaheadResultKind.author;
  name: string;
  sectionLabel?: string;
}

export interface TypeaheadTitleResult {
  kind: TypeaheadResultKind.title;
  title: string;
  author: string;
  sectionLabel?: string;
}

export interface TypeaheadSkeletonResult {
  kind: TypeaheadResultKind.skeleton;
  sectionLabel?: string;
}

export type TypeaheadResult = TypeaheadAuthorResult | TypeaheadTitleResult | TypeaheadSkeletonResult;
