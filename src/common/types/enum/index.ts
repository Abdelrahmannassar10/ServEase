export enum UserAgent{
    SYSTEM="SYSTEM",
    GOOGLE="GOOGLE"
}

export enum ServiceCategory{
    PLUMBING="PLUMBING",
    ELECTRICAL="ELECTRICAL",
    CARPENTRY="CARPENTRY",
    CLEANING="CLEANING",
    PAINTING="PAINTING",
    OTHER="OTHER"
}
export enum ServiceStatus{
    PENDING="PENDING",
    ACCEPTED="ACCEPTED",
    REJECTED="REJECTED",
    COMPLETED="COMPLETED"
}
export enum PaymentStatus{
    PENDING="PENDING",
    COMPLETED="COMPLETED",
    FAILED="FAILED"
}
export enum PaymentMethod{
    CREDIT_CARD="CREDIT_CARD",
    DEBIT_CARD="DEBIT_CARD",
    PAYPAL="PAYPAL",
    CASH="CASH"
}
export enum Gender{
    MALE="MALE",
    FEMALE="FEMALE"
}

export enum Role {
  CUSTOMER = 'Customer',
  PROVIDER = 'Provider',
  ADMIN = 'Admin',
}

export enum City {
  CAIRO = "Cairo",
  GIZA = "Giza",
  ALEXANDRIA = "Alexandria",

  DAKAHLIA = "Dakahlia",
  RED_SEA = "Red Sea",
  BEHEIRA = "Beheira",
  FAYOUM = "Fayoum",
  GHARBIA = "Gharbia",
  ISMAILIA = "Ismailia",
  MENOFIA = "Menofia",
  MINYA = "Minya",
  QALYUBIA = "Qalyubia",
  NEW_VALLEY = "New Valley",
  SUEZ = "Suez",
  ASWAN = "Aswan",
  ASSIUT = "Assiut",
  BENI_SUEF = "Beni Suef",
  PORT_SAID = "Port Said",
  DAMIETTA = "Damietta",
  SHARQIA = "Sharqia",
  SOUTH_SINAI = "South Sinai",
  KAFR_EL_SHEIKH = "Kafr El Sheikh",
  MATROUH = "Matrouh",
  LUXOR = "Luxor",
  QENA = "Qena",
  NORTH_SINAI = "North Sinai",
  SOHAG = "Sohag"
}

export enum ReviewType {
    GLOBAL = "GLOBAL" ,
    REQUEST = "REQUEST"
}