import { Gender, Role } from '@common/types/enum';

export const DEFAULT_PROFILE_IMAGES = {
  customer: {
    male: 'https://res.cloudinary.com/dtu4dhsnb/image/upload/v1779811974/male-Customer_v0yocl.png',
    female:
      'https://res.cloudinary.com/dtu4dhsnb/image/upload/v1779811912/female-Customer_w4s6ac.png',
  },
  provider: {
    male: 'https://res.cloudinary.com/dtu4dhsnb/image/upload/v1779811975/male-workerjpg_tqkik8.jpg',
    female:
      'https://res.cloudinary.com/dtu4dhsnb/image/upload/v1779811912/female-worker_bq0hid.png',
  },
} as const;

export function getDefaultProfileImage(role: Role, gender?: Gender): string {
  const genderKey = gender === Gender.FEMALE ? 'female' : 'male';

  if (role === Role.PROVIDER) {
    return DEFAULT_PROFILE_IMAGES.provider[genderKey];
  }

  return DEFAULT_PROFILE_IMAGES.customer[genderKey];
}
