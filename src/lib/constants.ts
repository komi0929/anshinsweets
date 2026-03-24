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

/** 地方区分 */
export const REGIONS = [
  { value: 'hokkaido_tohoku', label: '北海道・東北', prefectures: ['北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県'] },
  { value: 'kanto', label: '関東', prefectures: ['東京都','神奈川県','千葉県','埼玉県','茨城県','栃木県','群馬県'] },
  { value: 'chubu', label: '中部', prefectures: ['新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県','静岡県','愛知県'] },
  { value: 'kinki', label: '近畿', prefectures: ['大阪府','京都府','兵庫県','奈良県','三重県','滋賀県','和歌山県'] },
  { value: 'chugoku_shikoku', label: '中国・四国', prefectures: ['鳥取県','島根県','岡山県','広島県','山口県','徳島県','香川県','愛媛県','高知県'] },
  { value: 'kyushu_okinawa', label: '九州・沖縄', prefectures: ['福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県'] },
] as const;

export const ALL_PREFECTURES = REGIONS.flatMap(r => r.prefectures);

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
