import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'ageValidation',
  standalone: true
})
export class AgeValidationPipe implements PipeTransform {
  transform(dateOfBirth: Date | string | null): boolean {
    if (!dateOfBirth) return false;

    const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
    const today = new Date();
    const age = this.calculateAge(dob, today);

    return age >= 18 
  }


    private calculateAge(dob: Date, today: Date): number {
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        return age;
    }
}