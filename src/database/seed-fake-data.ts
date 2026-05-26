import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { getDefaultProfileImage } from '@common/constants';
import {
  City,
  Gender,
  ProviderStatus,
  Role,
  ServiceCategory,
  state,
  UserAgent,
} from '@common/types/enum';
import { encrypt } from '@common/helper';
import {
  Customer,
  customerSchema,
  Provider,
  providerSchema,
  User,
  userSchema,
} from '@models/index';

const DEMO_PASSWORD = 'Password123';
const CUSTOMERS_COUNT = 100;
const PROVIDERS_COUNT = 100;

type FakeCustomer = {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  dob: Date;
  city: City;
  state: state;
  gender: Gender;
};

type FakeProvider = FakeCustomer & {
  nationalNumber: string;
  service: ServiceCategory;
  specialization: string;
  writtenCv: string;
  averageRating: number;
  reviewsCount: number;
};

const baseCustomers: FakeCustomer[] = [
  {
    firstName: 'Omar',
    lastName: 'Hassan',
    email: 'omar.hassan.demo@servease.test',
    mobileNumber: '01010000001',
    dob: new Date('1997-03-14'),
    city: City.CAIRO,
    state: state.NASR_CITY,
    gender: Gender.MALE,
  },
  {
    firstName: 'Youssef',
    lastName: 'Mahmoud',
    email: 'youssef.mahmoud.demo@servease.test',
    mobileNumber: '01010000002',
    dob: new Date('1994-08-21'),
    city: City.GIZA,
    state: state.GIZA,
    gender: Gender.MALE,
  },
  {
    firstName: 'Mariam',
    lastName: 'Adel',
    email: 'mariam.adel.demo@servease.test',
    mobileNumber: '01010000003',
    dob: new Date('1999-01-09'),
    city: City.CAIRO,
    state: state.MAADI,
    gender: Gender.FEMALE,
  },
  {
    firstName: 'Nour',
    lastName: 'Sameh',
    email: 'nour.sameh.demo@servease.test',
    mobileNumber: '01010000004',
    dob: new Date('1996-11-30'),
    city: City.ALEXANDRIA,
    state: state.SIDI_BISHR,
    gender: Gender.FEMALE,
  },
  {
    firstName: 'Karim',
    lastName: 'Fouad',
    email: 'karim.fouad.demo@servease.test',
    mobileNumber: '01010000005',
    dob: new Date('1991-05-18'),
    city: City.CAIRO,
    state: state.NEW_CAIRO,
    gender: Gender.MALE,
  },
  {
    firstName: 'Salma',
    lastName: 'Tarek',
    email: 'salma.tarek.demo@servease.test',
    mobileNumber: '01010000006',
    dob: new Date('2000-07-25'),
    city: City.GIZA,
    state: state.MADINAT_SITTAH_UKTUBAR,
    gender: Gender.FEMALE,
  },
];

const baseProviders: FakeProvider[] = [
  {
    firstName: 'Ahmed',
    lastName: 'Sayed',
    email: 'ahmed.sayed.plumbing.demo@servease.test',
    mobileNumber: '01120000001',
    dob: new Date('1988-02-12'),
    city: City.CAIRO,
    state: state.HELIOPOLIS,
    gender: Gender.MALE,
    nationalNumber: '3000101000001',
    service: ServiceCategory.PLUMBING,
    specialization: 'Emergency leak repair and bathroom installations',
    writtenCv:
      'Experienced plumber handling pipe leaks, mixers, toilets, heaters, and bathroom maintenance for apartments and villas.',
    averageRating: 4.8,
    reviewsCount: 36,
  },
  {
    firstName: 'Mostafa',
    lastName: 'Ali',
    email: 'mostafa.ali.electrical.demo@servease.test',
    mobileNumber: '01120000002',
    dob: new Date('1985-09-04'),
    city: City.GIZA,
    state: state.MADINAT_SITTAH_UKTUBAR,
    gender: Gender.MALE,
    nationalNumber: '3000101000002',
    service: ServiceCategory.ELECTRICAL,
    specialization: 'Home wiring, breakers, sockets, and lighting',
    writtenCv:
      'Certified electrician for apartment rewiring, breaker panels, socket replacement, lighting, and fault diagnosis.',
    averageRating: 4.7,
    reviewsCount: 42,
  },
  {
    firstName: 'Hana',
    lastName: 'Nabil',
    email: 'hana.nabil.cleaning.demo@servease.test',
    mobileNumber: '01120000003',
    dob: new Date('1992-12-17'),
    city: City.CAIRO,
    state: state.REHAB,
    gender: Gender.FEMALE,
    nationalNumber: '3000101000003',
    service: ServiceCategory.CLEANING,
    specialization: 'Deep cleaning, move-in cleaning, and kitchens',
    writtenCv:
      'Home cleaning specialist for kitchens, bathrooms, post-renovation dust, move-in preparation, and scheduled cleaning.',
    averageRating: 4.9,
    reviewsCount: 58,
  },
  {
    firstName: 'Dina',
    lastName: 'Samir',
    email: 'dina.samir.painting.demo@servease.test',
    mobileNumber: '01120000004',
    dob: new Date('1990-06-28'),
    city: City.ALEXANDRIA,
    state: state.MONTAZA,
    gender: Gender.FEMALE,
    nationalNumber: '3000101000004',
    service: ServiceCategory.PAINTING,
    specialization: 'Interior painting and wall finishing',
    writtenCv:
      'Interior painter offering apartment repainting, accent walls, crack filling, sanding, and clean finishing.',
    averageRating: 4.6,
    reviewsCount: 27,
  },
  {
    firstName: 'Mahmoud',
    lastName: 'Reda',
    email: 'mahmoud.reda.carpentry.demo@servease.test',
    mobileNumber: '01120000005',
    dob: new Date('1983-04-08'),
    city: City.CAIRO,
    state: state.SHUBRA,
    gender: Gender.MALE,
    nationalNumber: '3000101000005',
    service: ServiceCategory.CARPENTRY,
    specialization: 'Door repair, cabinets, shelves, and furniture assembly',
    writtenCv:
      'Carpenter for doors, hinges, wardrobes, shelves, kitchen cabinets, custom repairs, and ready-made furniture assembly.',
    averageRating: 4.5,
    reviewsCount: 31,
  },
  {
    firstName: 'Laila',
    lastName: 'Kamal',
    email: 'laila.kamal.other.demo@servease.test',
    mobileNumber: '01120000006',
    dob: new Date('1993-10-11'),
    city: City.CAIRO,
    state: state.ZAMALEK,
    gender: Gender.FEMALE,
    nationalNumber: '3000101000006',
    service: ServiceCategory.OTHER,
    specialization: 'Appliance setup and small home maintenance jobs',
    writtenCv:
      'General home maintenance provider for curtain rods, appliance setup, small fixes, silicone sealing, and wall-mounted items.',
    averageRating: 4.4,
    reviewsCount: 19,
  },
];

const firstNames = {
  male: [
    'Omar',
    'Youssef',
    'Karim',
    'Ahmed',
    'Mostafa',
    'Mahmoud',
    'Ali',
    'Hassan',
    'Tarek',
    'Amr',
    'Khaled',
    'Seif',
    'Ziad',
    'Fares',
    'Adham',
    'Mohamed',
    'Ibrahim',
    'Eslam',
    'Hossam',
    'Mina',
    'Bassem',
    'Sherif',
    'Wael',
    'Hany',
    'Ayman',
    'Ramy',
    'Nader',
    'Marwan',
    'Eyad',
    'Hamza',
    'Yassin',
    'Malik',
    'Nour El Din',
    'Abdelrahman',
    'Islam',
    'Hazem',
    'Mazen',
    'Moataz',
    'Samy',
    'Kareem',
  ],
  female: [
    'Mariam',
    'Nour',
    'Salma',
    'Hana',
    'Dina',
    'Laila',
    'Farah',
    'Yasmin',
    'Nada',
    'Rana',
    'Jana',
    'Habiba',
    'Malak',
    'Aya',
    'Menna',
    'Sara',
    'Yara',
    'Heba',
    'Reem',
    'Esraa',
    'Doaa',
    'Mona',
    'Mai',
    'Shahd',
    'Rawan',
    'Passant',
    'Asmaa',
    'Eman',
    'Rania',
    'Noha',
    'Hadeer',
    'Shereen',
    'Maha',
    'Alaa',
    'Sandy',
    'Joudy',
    'Lina',
    'Nadine',
    'Riham',
    'Dalia',
  ],
};

const lastNames = [
  'Hassan',
  'Mahmoud',
  'Adel',
  'Sameh',
  'Fouad',
  'Tarek',
  'Sayed',
  'Ali',
  'Nabil',
  'Samir',
  'Reda',
  'Kamal',
  'Fathy',
  'Nasser',
  'Ibrahim',
  'Gaber',
  'Lotfy',
  'Rashad',
  'Shaker',
  'Mansour',
  'Abdelaziz',
  'El Sayed',
  'Abdallah',
  'Farouk',
  'Soliman',
  'El Masry',
  'Zaki',
  'Kassem',
  'Hamdy',
  'Ezzat',
  'Shawky',
  'Badawy',
  'Saber',
  'Gamal',
  'Amin',
  'Saad',
  'Hamed',
  'Shalaby',
  'Osman',
  'Naguib',
  'Helmy',
  'Fekry',
  'Ashraf',
  'Ragab',
  'Ghoneim',
  'El Din',
  'Metwally',
  'Darwish',
  'Gendy',
];

const locations = [
  { city: City.CAIRO, state: state.NASR_CITY },
  { city: City.CAIRO, state: state.MAADI },
  { city: City.CAIRO, state: state.NEW_CAIRO },
  { city: City.CAIRO, state: state.HELIOPOLIS },
  { city: City.CAIRO, state: state.REHAB },
  { city: City.CAIRO, state: state.ZAMALEK },
  { city: City.CAIRO, state: state.SHUBRA },
  { city: City.GIZA, state: state.GIZA },
  { city: City.GIZA, state: state.MADINAT_SITTAH_UKTUBAR },
  { city: City.ALEXANDRIA, state: state.SIDI_BISHR },
  { city: City.ALEXANDRIA, state: state.MONTAZA },
  { city: City.ALEXANDRIA, state: state.AGAMI },
  { city: City.ALEXANDRIA, state: state.BORG_EL_ARAB },
  { city: City.ALEXANDRIA, state: state.AR_RAML },
  { city: City.ALEXANDRIA, state: state.ABU_QIR },
  { city: City.ASWAN, state: state.ASWAN },
  { city: City.ASWAN, state: state.IDFU },
  { city: City.ASYUT, state: state.ASYUT },
  { city: City.ASYUT, state: state.MANFALUT },
  { city: City.BEHEIRA, state: state.DAMANHUR },
  { city: City.BEHEIRA, state: state.ROSETTA },
  { city: City.BENI_SUEF, state: state.BANI_SUWAYF },
  { city: City.DAKAHLIA, state: state.AL_MANSURAH },
  { city: City.DAKAHLIA, state: state.TALKHA },
  { city: City.DAMIETTA, state: state.DAMIETTA },
  { city: City.FAIYUM, state: state.AL_FAYYUM },
  { city: City.GHARBIA, state: state.TANTA },
  { city: City.GHARBIA, state: state.AL_MAHALLAH_AL_KUBRA },
  { city: City.ISMAILIA, state: state.ISMAILIA },
  { city: City.KAFR_EL_SHEIKH, state: state.DESOUQ },
  { city: City.KAFR_EL_SHEIKH, state: state.KAFR_ASH_SHAYKH },
  { city: City.LUXOR, state: state.LUXOR },
  { city: City.MATROUH, state: state.MERSA_MATRUH },
  { city: City.MINYA, state: state.AL_MINYA },
  { city: City.MINYA, state: state.MALLAWI },
  { city: City.MONUFIA, state: state.SHIBIN_AL_KAWM },
  { city: City.MONUFIA, state: state.QUWAYSINA },
  { city: City.NEW_VALLEY, state: state.AL_KHARIJAH },
  { city: City.NORTH_SINAI, state: state.ARISH },
  { city: City.PORT_SAID, state: state.PORT_SAID },
  { city: City.QALYUBIA, state: state.BANHA },
  { city: City.QALYUBIA, state: state.OBOUR_CITY },
  { city: City.QENA, state: state.QINA },
  { city: City.QENA, state: state.NAGA_HAMMADI },
  { city: City.RED_SEA, state: state.HURGHADA },
  { city: City.RED_SEA, state: state.EL_GOUNA },
  { city: City.SHARQIA, state: state.ZAGAZIG },
  { city: City.SHARQIA, state: state.RAMADAN_10TH },
  { city: City.SOHAG, state: state.SOHAG },
  { city: City.SOHAG, state: state.AKHMIM },
  { city: City.SOUTH_SINAI, state: state.SHARM_EL_SHEIKH },
  { city: City.SOUTH_SINAI, state: state.DAHAB },
  { city: City.SUEZ, state: state.SUEZ },
  { city: City.SUEZ, state: state.AIN_SUKHNA },
];

const serviceProfiles: Record<
  ServiceCategory,
  { specialization: string; writtenCv: string }[]
> = {
  [ServiceCategory.PLUMBING]: [
    {
      specialization: 'Emergency leak repair and bathroom installations',
      writtenCv:
        'Experienced plumber handling pipe leaks, mixers, toilets, heaters, and bathroom maintenance for apartments and villas.',
    },
    {
      specialization: 'Water heater repair, drain cleaning, and pipe fitting',
      writtenCv:
        'Plumbing provider focused on clogged drains, heater installation, faucet replacement, and pressure problems.',
    },
    {
      specialization: 'Kitchen plumbing, sink installation, and water pressure fixes',
      writtenCv:
        'Handles kitchen sinks, drainage odors, under-sink leaks, valve replacement, and water pressure troubleshooting.',
    },
    {
      specialization: 'Bathroom renovation plumbing and emergency maintenance',
      writtenCv:
        'Plumber with experience in bathroom renovation support, toilet replacement, shower mixers, and urgent home repairs.',
    },
  ],
  [ServiceCategory.ELECTRICAL]: [
    {
      specialization: 'Home wiring, breakers, sockets, and lighting',
      writtenCv:
        'Certified electrician for apartment rewiring, breaker panels, socket replacement, lighting, and fault diagnosis.',
    },
    {
      specialization: 'Lighting installation, panel upgrades, and fault repair',
      writtenCv:
        'Electrical technician handling LED installation, power cuts, switchboards, fans, and safety checks.',
    },
    {
      specialization: 'Smart switches, ceiling fans, and socket relocation',
      writtenCv:
        'Electrician for smart switch setup, socket relocation, ceiling fan installation, and electrical safety checks.',
    },
    {
      specialization: 'Apartment electrical troubleshooting and appliance circuits',
      writtenCv:
        'Diagnoses repeated breaker trips, weak sockets, appliance lines, doorbells, and lighting faults in homes.',
    },
  ],
  [ServiceCategory.CARPENTRY]: [
    {
      specialization: 'Door repair, cabinets, shelves, and furniture assembly',
      writtenCv:
        'Carpenter for doors, hinges, wardrobes, shelves, kitchen cabinets, custom repairs, and ready-made furniture assembly.',
    },
    {
      specialization: 'Custom shelves, wardrobe fixes, and wood maintenance',
      writtenCv:
        'Home carpenter experienced with wood finishing, lock fitting, cabinet repair, and small custom furniture jobs.',
    },
    {
      specialization: 'Kitchen cabinet repair, hinges, drawers, and locks',
      writtenCv:
        'Carpenter for kitchen cabinets, drawer tracks, door locks, damaged hinges, shelving, and furniture strengthening.',
    },
    {
      specialization: 'Furniture assembly, curtain boxes, and decorative woodwork',
      writtenCv:
        'Provides furniture assembly, curtain box fitting, simple decorative woodwork, and practical home carpentry repairs.',
    },
  ],
  [ServiceCategory.CLEANING]: [
    {
      specialization: 'Deep cleaning, move-in cleaning, and kitchens',
      writtenCv:
        'Home cleaning specialist for kitchens, bathrooms, post-renovation dust, move-in preparation, and scheduled cleaning.',
    },
    {
      specialization: 'Apartment cleaning, windows, bathrooms, and polishing',
      writtenCv:
        'Cleaning provider offering recurring home cleaning, glass cleaning, floor care, and detailed bathroom sanitizing.',
    },
    {
      specialization: 'Post-renovation cleaning and balcony washing',
      writtenCv:
        'Cleaning specialist for dust removal after renovation, balcony washing, windows, floor scrubbing, and kitchen degreasing.',
    },
    {
      specialization: 'Scheduled weekly cleaning and guest-ready preparation',
      writtenCv:
        'Reliable home cleaner for weekly visits, guest preparation, bedroom organization, bathroom cleaning, and surface care.',
    },
  ],
  [ServiceCategory.PAINTING]: [
    {
      specialization: 'Interior painting and wall finishing',
      writtenCv:
        'Interior painter offering apartment repainting, accent walls, crack filling, sanding, and clean finishing.',
    },
    {
      specialization: 'Decorative paint, wall repair, and room repainting',
      writtenCv:
        'Painting provider for wall preparation, color changes, touch-ups, gypsum repair, and clean handover.',
    },
    {
      specialization: 'Ceiling painting, moisture stains, and crack repair',
      writtenCv:
        'Painter for ceiling refreshes, moisture stain treatment, crack filling, primer work, and clean apartment repainting.',
    },
    {
      specialization: 'Small apartment repainting and color consultation',
      writtenCv:
        'Helps customers choose practical colors, prepares walls, paints bedrooms and living rooms, and leaves spaces tidy.',
    },
  ],
  [ServiceCategory.OTHER]: [
    {
      specialization: 'Appliance setup and small home maintenance jobs',
      writtenCv:
        'General home maintenance provider for curtain rods, appliance setup, small fixes, silicone sealing, and wall-mounted items.',
    },
    {
      specialization: 'TV mounting, curtain rods, silicone sealing, and minor fixes',
      writtenCv:
        'Handyman provider for small home tasks, drilling, mounting, sealing, assembling, and quick repairs.',
    },
    {
      specialization: 'Appliance installation, door handles, and wall-mounted items',
      writtenCv:
        'General maintenance provider for installing appliances, fixing handles, mounting shelves, and small apartment jobs.',
    },
    {
      specialization: 'Home setup, bathroom accessories, and quick repairs',
      writtenCv:
        'Handles bathroom accessory installation, mirrors, hooks, silicone sealing, loose fixtures, and move-in setup tasks.',
    },
  ],
};

function pick<T>(items: T[], index: number): T {
  return items[index % items.length];
}

function dateFromAge(age: number, offset: number): Date {
  const month = offset % 12;
  const day = (offset % 26) + 1;
  return new Date(2026 - age, month, day);
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '');
}

function buildCustomers(count: number): FakeCustomer[] {
  return Array.from({ length: count }, (_, index) => {
    const gender = index % 2 === 0 ? Gender.MALE : Gender.FEMALE;
    const genderKey = gender === Gender.MALE ? 'male' : 'female';
    const firstName = pick(firstNames[genderKey], index);
    const lastName = pick(lastNames, index);
    const location = pick(locations, index);
    const number = String(index + 1).padStart(3, '0');

    return {
      firstName,
      lastName,
      email: `${slug(firstName)}.${slug(lastName)}.customer${number}@servease.test`,
      mobileNumber: `0101${String(index + 1).padStart(7, '0')}`,
      dob: dateFromAge(22 + (index % 22), index),
      city: location.city,
      state: location.state,
      gender,
    };
  });
}

function buildProviders(count: number): FakeProvider[] {
  const services = Object.values(ServiceCategory);

  return Array.from({ length: count }, (_, index) => {
    const gender = index % 2 === 0 ? Gender.MALE : Gender.FEMALE;
    const genderKey = gender === Gender.MALE ? 'male' : 'female';
    const firstName = pick(firstNames[genderKey], index + 3);
    const lastName = pick(lastNames, index + 5);
    const location = pick(locations, index + 2);
    const service = pick(services, index);
    const profile = pick(serviceProfiles[service], index);
    const number = String(index + 1).padStart(3, '0');

    return {
      firstName,
      lastName,
      email: `${slug(firstName)}.${slug(lastName)}.${service.toLowerCase()}.provider${number}@servease.test`,
      mobileNumber: `0112${String(index + 1).padStart(7, '0')}`,
      dob: dateFromAge(25 + (index % 25), index),
      city: location.city,
      state: location.state,
      gender,
      nationalNumber: `3000101${String(index + 1).padStart(7, '0')}`,
      service,
      specialization: profile.specialization,
      writtenCv: profile.writtenCv,
      averageRating: Number((4.1 + (index % 9) * 0.1).toFixed(1)),
      reviewsCount: 12 + index * 2,
    };
  });
}

function loadEnvFile() {
  const envPath = join(process.cwd(), '.env');
  if (!existsSync(envPath)) return;

  const env = readFileSync(envPath, 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (!match) continue;

    const key = match[1];
    const value = (match[2] || '').replace(/^['"]|['"]$/g, '');
    process.env[key] ??= value;
  }
}

async function buildUserData(user: FakeCustomer, password: string, role: Role) {
  return {
    ...user,
    mobileNumber: await encrypt(user.mobileNumber),
    password,
    userAgent: UserAgent.SYSTEM,
    isVerified: true,
    otp: null,
    otpExpiry: null,
    isDeleted: false,
    deletedAt: null,
    profileURL: getDefaultProfileImage(role, user.gender),
  };
}

async function seedCustomers(password: string) {
  const customers = buildCustomers(CUSTOMERS_COUNT);
  const operations = await Promise.all(
    customers.map(async (customer) => {
      const user = await buildUserData(customer, password, Role.CUSTOMER);

      return {
        updateOne: {
          filter: { email: customer.email },
          update: {
            $set: {
              ...user,
              role: Role.CUSTOMER,
            },
          },
          upsert: true,
        },
      };
    }),
  );

  return mongoose.model(Customer.name).bulkWrite(operations);
}

async function seedProviders(password: string) {
  const providers = buildProviders(PROVIDERS_COUNT);
  const operations = await Promise.all(
    providers.map(async (provider) => {
      const user = await buildUserData(provider, password, Role.PROVIDER);

      return {
        updateOne: {
          filter: { email: provider.email },
          update: {
            $set: {
              ...user,
              role: Role.PROVIDER,
              adminApproved: ProviderStatus.Active,
              service: provider.service,
              specialization: provider.specialization,
              writtenCv: provider.writtenCv,
              averageRating: provider.averageRating,
              reviewsCount: provider.reviewsCount,
              nationalNumber: provider.nationalNumber,
              providerCancelCount: 0,
              providerCancelFees: 0,
              debt: 0,
            },
          },
          upsert: true,
        },
      };
    }),
  );

  return mongoose.model(Provider.name).bulkWrite(operations);
}

async function deletePreviousFakeData() {
  return mongoose.model(User.name).deleteMany({
    email: /@servease\.test$/,
  });
}

async function bootstrap() {
  loadEnvFile();

  if (!process.env.DB_URL) {
    throw new Error('DB_URL is required. Add it to .env or set it before running the seed.');
  }

  await mongoose.connect(process.env.DB_URL);

  const userModel = mongoose.model(User.name, userSchema);
  if (!mongoose.models[Customer.name]) {
    userModel.discriminator(Customer.name, customerSchema);
  }
  if (!mongoose.models[Provider.name]) {
    userModel.discriminator(Provider.name, providerSchema);
  }

  const deleteResult = await deletePreviousFakeData();
  const password = await bcrypt.hash(DEMO_PASSWORD, 10);
  const [customerResult, providerResult] = await Promise.all([
    seedCustomers(password),
    seedProviders(password),
  ]);

  console.log('Fake data seed completed');
  console.log(`Deleted old fake users: ${deleteResult.deletedCount}`);
  console.log(
    `Customers inserted: ${customerResult.upsertedCount}, updated: ${customerResult.modifiedCount}`,
  );
  console.log(
    `Providers inserted: ${providerResult.upsertedCount}, updated: ${providerResult.modifiedCount}`,
  );
  console.log(`Demo password for seeded accounts: ${DEMO_PASSWORD}`);
}

bootstrap()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
