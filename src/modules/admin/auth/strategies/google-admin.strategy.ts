import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { GoogleAdminProfile } from '../interfaces/google-admin-profile.interface';

@Injectable()
export class GoogleAdminStrategy extends PassportStrategy(
  Strategy,
  'google-admin',
) {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      callbackURL: process.env.ADMIN_GOOGLE_CALLBACK_URL ?? '',
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): GoogleAdminProfile {
    const email = profile.emails?.[0]?.value ?? '';
    const avatarUrl = profile.photos?.[0]?.value ?? null;

    return {
      id: profile.id,
      email,
      name: profile.displayName || email,
      avatarUrl,
    };
  }
}
