import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";


export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    return next(req).pipe(
        catchError((error) => {

            const isLoginApi = req.url.includes('/login') || req.url.includes('/auth');
            if (!isLoginApi) {
                if (error.status === 401) {
                    router.navigate(['/login'])
                }

                if (error.status === 403) {
                    router.navigate(['/unauthorized'])
                }
            }
            return throwError(() => error);
        })
    )

}