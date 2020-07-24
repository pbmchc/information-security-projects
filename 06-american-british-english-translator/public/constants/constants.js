export const AMERICAN_ENGLISH_TIME_REGEX = /(?:[01]{0,1}\d|2[0123]):(?:[012345]\d)/;
export const BRITISH_ENGLISH_TIME_REGEX = /(?:[01]{0,1}\d|2[0123])\.(?:[012345]\d)/;
export const IGNORED_CHARACTERS_REGEX = /[^\w-']/g;
export const TARGET_LOCALE = {
  GB: 'american-to-british',
  US: 'british-to-american'
};