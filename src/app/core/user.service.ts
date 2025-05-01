import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserData } from './user.interface';

@Injectable({
    providedIn: 'root'
})
export class UserDataService {
    
    private userDataSubject = new BehaviorSubject<UserData[]>([]);
    users$ = this.userDataSubject.asObservable();

    constructor(private http: HttpClient) { 
        this.loadUsers();
    }

    loadUsers(): void {
        this.http.get<UserData[]>('assets/data/users.json')
        .pipe(
            tap(users => {
                const processedUsers = users.map(user => ({
                    ...user,
                    dateOfBirth: new Date(user.dateOfBirth)
                }));
                this.userDataSubject.next(processedUsers);
            })
        ).subscribe();
    }

    addUser(user: UserData): void{
        const users = [...this.userDataSubject.value, user];
        this.userDataSubject.next(users);
    }

    updateUser(user: UserData): void {
        const users = this.userDataSubject.value.map(u => u.id === user.id ? user : u);
        this.userDataSubject.next(users);
    }

    getNewId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
    }


}
