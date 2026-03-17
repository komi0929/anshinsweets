/**
 * Application-wide constants
 */

export const APP_NAME = 'あんしんスイーツ';
export const APP_NAME_EN = 'Allergy-Free Sweets Finder';
export const APP_DESCRIPTION = 'アレルギーを持つ子どもの親を救う、アレルギー対応スイーツ特化ポータル';

export const PRODUCT_CATEGORIES = [
  { value: 'cake', label: 'ケーキ', icon: '🎂' },
  { value: 'cookie', label: 'クッキー', icon: '🍪' },
  { value: 'chocolate', label: 'チョコレート', icon: '🍫' },
  { value: 'pudding', label: 'プリン・ゼリー', icon: '🍮' },
  { value: 'icecream', label: 'アイスクリーム', icon: '🍨' },
  { value: 'bread', label: 'パン', icon: '🍞' },
  { value: 'japanese', label: '和菓子', icon: '🍡' },
  { value: 'other', label: 'その他', icon: '🍬' },
] as const;

/** AI要約の最大文字数 */
export const AI_SUMMARY_MAX_LENGTH = 40;

/** 鮮度管理：半年（180日）経過で警告 */
export const FRESHNESS_WARNING_DAYS = 180;

/** リンクチェックの最大同時実行数 */
export const LINK_CHECK_CONCURRENCY = 5;

/** localStorage keys */
export const STORAGE_KEYS = {
  ALLERGEN_PROFILE: 'anshin_allergen_profile',
  STORE_AUTH_TOKEN: 'anshin_store_token',
} as const;
