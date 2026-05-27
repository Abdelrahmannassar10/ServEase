import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { safeDecrypt } from '@common/helper';

@Injectable()
export class DecryptMobileInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      mergeMap((data) =>
        from(
          (async () => {
            await decryptMobileFields(data);
            return data;
          })(),
        ),
      ),
    );
  }
}

async function decryptMobileFields(value: any): Promise<void> {
  if (value === null || value === undefined) return;

  if (Array.isArray(value)) {
    await Promise.all(value.map((item) => decryptMobileFields(item)));
    return;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value);
    await Promise.all(
      entries.map(async ([k, v]) => {
        if (k === 'mobileNumber') {
          try {
            value[k] = await safeDecrypt(v);
          } catch {
            value[k] = null;
          }
        } else {
          await decryptMobileFields(v);
        }
      }),
    );
  }
}
