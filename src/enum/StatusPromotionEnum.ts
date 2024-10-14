export enum StatusPromotionEnum {
  "NONE" = "",
  UPCOMING = "UPCOMING",
  ACTIVE = "ACTIVE",
  ENDED = "ENDED",
}

export const StatusPromotionLable: Record<StatusPromotionEnum, string> =  {
  [StatusPromotionEnum.UPCOMING]: "Chưa diễn ra",
  [StatusPromotionEnum.ACTIVE]: "Đang diễn ra",
  [StatusPromotionEnum.ENDED]: "Đã kết thúc",
  [StatusPromotionEnum.NONE]: "Chưa xác định",
}
