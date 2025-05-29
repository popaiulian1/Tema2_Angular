import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { UserData } from './user.interface';

@Injectable({
    providedIn: 'root'
})
export class UserDataService {
    
    private LOCAL_STORAGE_KEY = 'app_users_data';
    private userDataSubject = new BehaviorSubject<UserData[]>([]);
    users$ = this.userDataSubject.asObservable();

    constructor(private http: HttpClient) { 
        this.loadUsers();
    }

    loadUsers(): void {
        // Try to load from localStorage first
        const savedUsers = localStorage.getItem(this.LOCAL_STORAGE_KEY);
        
        if (savedUsers) {
            // If we have data in localStorage, use it
            const parsedUsers = JSON.parse(savedUsers);
            const processedUsers = parsedUsers.map((user: any) => ({
                ...user,
                dateOfBirth: new Date(user.dateOfBirth)
            }));
            this.userDataSubject.next(processedUsers);
        } else {
            // Otherwise, load the initial data from the assets file
            this.http.get<UserData[]>('assets/data/users.json')
            .pipe(
                tap(users => {
                    const processedUsers = users.map(user => ({
                        ...user,
                        dateOfBirth: new Date(user.dateOfBirth)
                    }));
                    this.userDataSubject.next(processedUsers);
                    // Save to localStorage for future use
                    this.saveToLocalStorage(processedUsers);
                }),
                catchError(error => {
                    console.error('Error loading users:', error);
                    return of([]);
                })
            ).subscribe();
        }
    }

    addUser(user: UserData): void {
        const users = [...this.userDataSubject.value, user];
        this.userDataSubject.next(users);
        this.saveToLocalStorage(users);
    }

    updateUser(user: UserData): void {
        const users = this.userDataSubject.value.map(u => u.id === user.id ? user : u);
        this.userDataSubject.next(users);
        this.saveToLocalStorage(users);
    }

    deleteUser(userId: string): void {
        const users = this.userDataSubject.value.filter(user => user.id !== userId);
        this.userDataSubject.next(users);
        this.saveToLocalStorage(users);
    }

    resetToDefault(): void {
        localStorage.removeItem(this.LOCAL_STORAGE_KEY);
        this.loadUsers();
    }

    exportUsers(): void {
        const usersToExport = this.userDataSubject.value.map(user => ({
            ...user,
            dateOfBirth: user.dateOfBirth instanceof Date 
                ? user.dateOfBirth.toISOString().split('T')[0] 
                : user.dateOfBirth
        }));
        
        const dataStr = JSON.stringify(usersToExport, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'users.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    private saveToLocalStorage(users: UserData[]): void {
        // Convert Date objects to strings for storage
        const usersToSave = users.map(user => ({
            ...user,
            dateOfBirth: user.dateOfBirth instanceof Date 
                ? user.dateOfBirth.toISOString().split('T')[0] 
                : user.dateOfBirth
        }));
        localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(usersToSave));
    }

    getNewId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
    }
}
