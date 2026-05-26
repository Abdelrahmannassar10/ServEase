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
  ALEXANDRIA = "Alexandria",
  ASWAN = "Aswan",
  ASYUT = "Asyut",
  BEHEIRA = "Beheira",
  BENI_SUEF = "Beni Suef",
  CAIRO = "Cairo",
  DAKAHLIA = "Dakahlia",
  DAMIETTA = "Damietta",
  FAIYUM = "Faiyum",
  GHARBIA = "Gharbia",
  GIZA = "Giza",
  ISMAILIA = "Ismailia",
  KAFR_EL_SHEIKH = "Kafr El-Sheikh",
  LUXOR = "Luxor",
  MATROUH = "Matrouh",
  MINYA = "Minya",
  MONUFIA = "Monufia",
  NEW_VALLEY = "New Valley",
  NORTH_SINAI = "North Sinai",
  PORT_SAID = "Port Said",
  QALYUBIA = "Qalyubia",
  QENA = "Qena",
  RED_SEA = "Red Sea",
  SHARQIA = "Sharqia",
  SOHAG = "Sohag",
  SOUTH_SINAI = "South Sinai",
  SUEZ = "Suez",
}

export enum state{
  ABU_QIR = "Abu Qir",
  AGAMI = "Agami",
  ALEXANDRIA = "Alexandria",
  AR_RAML = "Ar-Raml",
  BORG_EL_ARAB = "Borg El Arab",
  MONTAZA = "Montaza",
  NEW_BORG_EL_ARAB = "New Borg El Arab",
  SIDI_BISHR = "Sidi Bishr",

  ABU_SIMBEL = "Abu Simbel",
  ASWAN = "Aswan",
  IDFU = "Idfū",
  KAWM_UMBU = "Kawm Umbū",

  ABNUB = "Abnūb",
  ABU_TIJ = "Abū Tīj",
  AL_BADARI = "Al Badārī",
  AL_QUSIYAH = "Al Qūşīyah",
  ASYUT = "Asyūţ",
  DAYRUT = "Dayrūţ",
  MANFALUT = "Manfalūţ",

  ABU_AL_MATAMIR = "Abū al Maţāmīr",
  AD_DILINJAT = "Ad Dilinjāt",
  DAMANHUR = "Damanhūr",
  HAWSH_ISA = "Ḩawsh ‘Īsá",
  IDKU = "Idkū",
  KAFR_AD_DAWWAR = "Kafr ad Dawwār",
  KAWM_HAMADAH = "Kawm Ḩamādah",
  ROSETTA = "Rosetta",

  AL_FASHN = "Al Fashn",
  BANI_SUWAYF = "Banī Suwayf",
  BUSH = "Būsh",
  SUMUSTA_AS_SULTANI = "Sumusţā as Sulţānī",

  BADR = "Badr",
  BULAQ = "Bulaq",
  CAIRO = "Cairo",
  CAIRO_DOWNTOWN = "Cairo Downtown",
  EL_MATARIA = "El Mataria",
  FUSTAT = "Fustat",
  HADAYEK_EL_KOBBA = "Hadayek El Kobba",
  HELIOPOLIS = "Heliopolis",
  HELWAN = "Helwan",
  MAADI = "Maadi",
  MUSTURUD = "Musturud",
  NASR_CITY = "Nasr City",
  NEW_ADMINISTRATIVE_CAPITAL = "New Administrative Capital of Egypt",
  NEW_CAIRO = "New Cairo",
  REHAB = "Rehab",
  SHUBRA = "Shubra",
  TURA = "Tura",
  ZAMALEK = "Zamalek",

  AJA = "Ajā",
  AL_JAMMALIYAH = "Al Jammālīyah",
  AL_MANSURAH = "Al Manşūrah",
  AL_MANZALAH = "Al Manzalah",
  AL_MATARIYAH = "Al Maţarīyah",
  BILQAS = "Bilqās",
  DIKIRNIS = "Dikirnis",
  IZBAT_AL_BURJ = "‘Izbat al Burj",
  MINYAT_AN_NASR = "Minyat an Naşr",
  SHIRBIN = "Shirbīn",
  TALKHA = "Ţalkhā",

  AZ_ZARQA = "Az Zarqā",
  DAMIETTA = "Damietta",
  FARASKUR = "Fāraskūr",

  AL_FAYYUM = "Al Fayyūm",
  AL_WASITAH = "Al Wāsiţah",
  IBSHAWAY = "Ibshawāy",
  ITSA = "Iţsā",
  TAMIYAH = "Ţāmiyah",

  AL_MAHALLAH_AL_KUBRA = "Al Maḩallah al Kubrá",
  BASYUN = "Basyūn",
  KAFR_AZ_ZAYYAT = "Kafr az Zayyāt",
  QUTUR = "Quţūr",
  SAMANNUD = "Samannūd",
  TANTA = "Tanda",
  ZEFTA = "Zefta",

  AL_AYYAT = "Al ‘Ayyāţ",
  AL_BAWITI = "Al Bawīţī",
  AL_HAWAMIDIYAH = "Al Ḩawāmidīyah",
  AS_SAFF = "Aş Şaff",
  AWSIM = "Awsīm",
  GIZA = "Giza",
  MADINAT_SITTAH_UKTUBAR = "Madīnat Sittah Uktūbar",

  ISMAILIA = "Ismailia",

  AL_HAMUL = "Al Ḩāmūl",
  DESOUQ = "Disūq",
  FUWWAH = "Fuwwah",
  KAFR_ASH_SHAYKH = "Kafr ash Shaykh",
  MARKAZ_DESOUQ = "Markaz Disūq",
  MUNSHAT_ALI_AGHA = "Munshāt ‘Alī Āghā",
  SIDI_SALIM = "Sīdī Sālim",

  LUXOR = "Luxor",
  MARKAZ_AL_UQSUR = "Markaz al Uqşur",

  AL_ALAMAYN = "Al ‘Alamayn",
  MERSA_MATRUH = "Mersa Matruh",
  SIWA_OASIS = "Siwa Oasis",

  ABU_QURQAS = "Abū Qurqāş",
  AL_MINYA = "Al Minyā",
  BANI_MAZAR = "Banī Mazār",
  DAYR_MAWAS = "Dayr Mawās",
  MALLAWI = "Mallawī",
  MATAY = "Maţāy",
  SAMALUT = "Samālūţ",

  AL_BAJUR = "Al Bājūr",
  ASHMUN = "Ashmūn",
  ASH_SHUHADA = "Ash Shuhadā’",
  MUNUF = "Munūf",
  QUWAYSINA = "Quwaysinā",
  SHIBIN_AL_KAWM = "Shibīn al Kawm",
  TALA = "Talā",

  AL_KHARIJAH = "Al Khārijah",
  QASR_AL_FARAFIRAH = "Qaşr al Farāfirah",

  ARISH = "Arish",

  PORT_SAID = "Port Said",

  AL_KHANKAH = "Al Khānkah",
  AL_QANATIR_AL_KHAYRIYAH = "Al Qanāţir al Khayrīyah",
  BANHA = "Banhā",
  OBOUR_CITY = "Obour City",
  QALYUB = "Qalyūb",
  SHIBIN_AL_QANATIR = "Shibīn al Qanāṭir",
  TOUKH = "Toukh",

  DISHNA = "Dishnā",
  FARSHUT = "Farshūţ",
  ISNA = "Isnā",
  KOUSA = "Kousa",
  NAGA_HAMMADI = "Naja' Ḥammādī",
  QINA = "Qinā",

  AL_QUSAYR = "Al Quşayr",
  EL_GOUNA = "El Gouna",
  HURGHADA = "Hurghada",
  MAKADI_BAY = "Makadi Bay",
  MARSA_ALAM = "Marsa Alam",
  RAS_GHARIB = "Ras Gharib",
  SAFAGA = "Safaga",

  RAMADAN_10TH = "10th of Ramadan",
  AL_QUREIN = "Al Qurein",
  AWLAD_SAQR = "Awlad Saqr",
  BILBEIS = "Bilbeis",
  DIYARB_NEGM = "Diyarb Negm",
  EL_HUSSEINIYA = "El Husseiniya",
  FAQOUS = "Faqous",
  HIHYA = "Hihya",
  KAFR_SAQR = "Kafr Saqr",
  MARKAZ_ABU_HAMMAD = "Markaz Abū Ḩammād",
  MASHTOUL_EL_SOUK = "Mashtoul El Souk",
  MINYA_EL_QAMH = "Minya El Qamh",
  NEW_SALHIA = "New Salhia",
  ZAGAZIG = "Zagazig",

  AKHMIM = "Akhmīm",
  AL_BALYANA = "Al Balyanā",
  AL_MANSHAH = "Al Manshāh",
  GIRGA = "Jirjā",
  JUHAYNAH = "Juhaynah",
  MARKAZ_GIRGA = "Markaz Jirjā",
  MARKAZ_SUHAJ = "Markaz Sūhāj",
  SOHAG = "Sohag",
  TAHTA = "Ţahţā",

  DAHAB = "Dahab",
  EL_TOR = "El-Tor",
  NUWAYBIA = "Nuwaybi‘a",
  SAINT_CATHERINE = "Saint Catherine",
  SHARM_EL_SHEIKH = "Sharm el-Sheikh",

  AIN_SUKHNA = "Ain Sukhna",
  SUEZ = "Suez",
}

export enum ServiceStatus {
  WAITING = 'WAITING',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REFUSED = 'REFUSED',
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  OUTDATED = 'OUTDATED'
}

export enum ReviewType {
    GLOBAL = "GLOBAL" ,
    REQUEST = "REQUEST"
}
export enum ProviderStatus {
    Active = "Active",
    Banned = "Banned",
    Stopped = "Stopped",
    PendingApproval = "PendingApproval",
    Rejected = "Rejected"
}