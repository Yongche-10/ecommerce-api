// ── jwt.strategy.ts ───────────────────────────────────────────
// Save this to: src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'supersecretkey', // must match AuthModule
    });
  }

  async validate(payload: any) {
    // This is attached to req.user in every guarded route
    return {
      userId: payload.sub,
      email:  payload.email,
      role:   payload.role,
    };
  }
}