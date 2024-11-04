export enum TypePromotionEnum {
  "NONE" = "",
  PERCENTAGE_DISCOUNT = "PERCENTAGE_DISCOUNT",
  AMOUNT_DISCOUNT = "AMOUNT_DISCOUNT",
}

export const TypePromotionLabel: Record<TypePromotionEnum, string> = {
  [TypePromotionEnum. PERCENTAGE_DISCOUNT]: "Giảm theo %",
  [TypePromotionEnum.AMOUNT_DISCOUNT]: "Giảm theo số tiền",
  [TypePromotionEnum.NONE]: "Chưa xác định",
};

