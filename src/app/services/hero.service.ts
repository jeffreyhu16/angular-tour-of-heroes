import { Injectable } from '@angular/core';
import { Hero } from '../components/hero/hero';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class HeroService {

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(
        private http: HttpClient,
        private messageService: MessageService
    ) { }

    getHero(id: number): Observable<Hero> {
        return this.http.get<Hero>(`api/heroes/${id}`)
            .pipe(
                tap(() => this.log(`fetched hero id: ${id}`)),
                catchError(this.handleError<Hero>(`getHero id: ${id}`))
            );
    }

    getHeroes(): Observable<Hero[]> {
        return this.http.get<Hero[]>('api/heroes')
            .pipe(
                tap(() => this.log('fetched heroes')),
                catchError(this.handleError<Hero[]>('getHeroes', []))
            );
    }

    addHero(hero: Hero): Observable<Hero> {
        return this.http.post<Hero>('api/heroes', hero, this.httpOptions)
            .pipe(
                tap((newHero: Hero) => this.log(`added hero w/ id: ${newHero.id}`)),
                catchError(this.handleError<Hero>('addHero'))
            );
    }

    updateHero(hero: Hero): Observable<any> {
        return this.http.put('api/heroes', hero, this.httpOptions)
            .pipe(
                tap(() => this.log(`updated hero id: ${hero.id}`)),
                catchError(this.handleError<any>('updateHero'))
            );
    }

    deleteHero(id: number): Observable<Hero> {
        return this.http.delete<Hero>(`api/heroes/${id}`, this.httpOptions)
            .pipe(
                tap(_ => this.log(`deleted hero id: ${id}`)),
                catchError(this.handleError<Hero>('deleteHero'))
            );
    }

    searchHeroes(term: string): Observable<Hero[]> {
        if (!term.trim()) return of([]);

        return this.http.get<Hero[]>(`api/heroes/?name=${term}`)
            .pipe(
                tap(x => x.length ?
                    this.log(`found heroes matching "${term}"`) :
                    this.log(`no heroes matching "${term}"`)),
                    catchError(this.handleError<Hero[]>('searchHeroes', []))
            );
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            this.log(`${operation} failed: ${error.message}`);
            return of(result as T);
        };
    }

    private log(message: string) {
        this.messageService.add(`HeroService: ${message}`);
    }
}
