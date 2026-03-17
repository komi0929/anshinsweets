/**
 * アレルギー特定原材料等28品目
 * 食品表示法に基づく完全定義
 */

export type Allergen = {
  code: string;
  name: string;
  nameEn: string;
  icon: string;
  category: 'mandatory' | 'recommended';
};

/** 特定原材料 8品目（表示義務） */
export const MANDATORY_ALLERGENS: Allergen[] = [
  { code: 'egg', name: '卵', nameEn: 'Egg', icon: '/icons/allergens/egg.webp', category: 'mandatory' },
  { code: 'milk', name: '乳', nameEn: 'Milk', icon: '/icons/allergens/milk.webp', category: 'mandatory' },
  { code: 'wheat', name: '小麦', nameEn: 'Wheat', icon: '/icons/allergens/wheat.webp', category: 'mandatory' },
  { code: 'buckwheat', name: 'そば', nameEn: 'Buckwheat', icon: '/icons/allergens/buckwheat.webp', category: 'mandatory' },
  { code: 'peanut', name: '落花生', nameEn: 'Peanut', icon: '/icons/allergens/peanut.webp', category: 'mandatory' },
  { code: 'shrimp', name: 'えび', nameEn: 'Shrimp', icon: '/icons/allergens/shrimp.webp', category: 'mandatory' },
  { code: 'crab', name: 'かに', nameEn: 'Crab', icon: '/icons/allergens/crab.webp', category: 'mandatory' },
  { code: 'walnut', name: 'くるみ', nameEn: 'Walnut', icon: '/icons/allergens/walnut.webp', category: 'mandatory' },
];

/** 特定原材料に準ずるもの 20品目（表示推奨） */
export const RECOMMENDED_ALLERGENS: Allergen[] = [
  { code: 'almond', name: 'アーモンド', nameEn: 'Almond', icon: '/icons/allergens/almond.webp', category: 'recommended' },
  { code: 'abalone', name: 'あわび', nameEn: 'Abalone', icon: '/icons/allergens/abalone.webp', category: 'recommended' },
  { code: 'squid', name: 'いか', nameEn: 'Squid', icon: '/icons/allergens/squid.webp', category: 'recommended' },
  { code: 'salmon_roe', name: 'いくら', nameEn: 'Salmon Roe', icon: '/icons/allergens/salmon_roe.webp', category: 'recommended' },
  { code: 'orange', name: 'オレンジ', nameEn: 'Orange', icon: '/icons/allergens/orange.webp', category: 'recommended' },
  { code: 'cashew', name: 'カシューナッツ', nameEn: 'Cashew', icon: '/icons/allergens/cashew.webp', category: 'recommended' },
  { code: 'kiwi', name: 'キウイフルーツ', nameEn: 'Kiwi', icon: '/icons/allergens/kiwi.webp', category: 'recommended' },
  { code: 'beef', name: '牛肉', nameEn: 'Beef', icon: '/icons/allergens/beef.webp', category: 'recommended' },
  { code: 'sesame', name: 'ごま', nameEn: 'Sesame', icon: '/icons/allergens/sesame.webp', category: 'recommended' },
  { code: 'salmon', name: 'さけ', nameEn: 'Salmon', icon: '/icons/allergens/salmon.webp', category: 'recommended' },
  { code: 'mackerel', name: 'さば', nameEn: 'Mackerel', icon: '/icons/allergens/mackerel.webp', category: 'recommended' },
  { code: 'soybean', name: '大豆', nameEn: 'Soybean', icon: '/icons/allergens/soybean.webp', category: 'recommended' },
  { code: 'chicken', name: '鶏肉', nameEn: 'Chicken', icon: '/icons/allergens/chicken.webp', category: 'recommended' },
  { code: 'banana', name: 'バナナ', nameEn: 'Banana', icon: '/icons/allergens/banana.webp', category: 'recommended' },
  { code: 'pork', name: '豚肉', nameEn: 'Pork', icon: '/icons/allergens/pork.webp', category: 'recommended' },
  { code: 'matsutake', name: 'まつたけ', nameEn: 'Matsutake', icon: '/icons/allergens/matsutake.webp', category: 'recommended' },
  { code: 'peach', name: 'もも', nameEn: 'Peach', icon: '/icons/allergens/peach.webp', category: 'recommended' },
  { code: 'yam', name: 'やまいも', nameEn: 'Yam', icon: '/icons/allergens/yam.webp', category: 'recommended' },
  { code: 'apple', name: 'りんご', nameEn: 'Apple', icon: '/icons/allergens/apple.webp', category: 'recommended' },
  { code: 'gelatin', name: 'ゼラチン', nameEn: 'Gelatin', icon: '/icons/allergens/gelatin.webp', category: 'recommended' },
];

/** 全28品目 */
export const ALL_ALLERGENS: Allergen[] = [...MANDATORY_ALLERGENS, ...RECOMMENDED_ALLERGENS];

/** コードからアレルゲンを取得 */
export function getAllergenByCode(code: string): Allergen | undefined {
  return ALL_ALLERGENS.find(a => a.code === code);
}

/** アレルゲンコードの配列（バリデーション用） */
export const ALLERGEN_CODES = ALL_ALLERGENS.map(a => a.code);
