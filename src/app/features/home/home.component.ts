import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { UserData } from '../../core/user.interface';
import { UserDataService } from '../../core/user.service';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AgeValidationPipe } from '../../core/age-validation.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, 
    NzTableModule, NzButtonModule, NzFormModule, NzInputModule, 
    NzModalModule, NzDatePickerModule, NzCardModule, NzToolTipModule,
    NzPaginationModule, NzIconModule, AgeValidationPipe],
  providers: [AgeValidationPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements OnInit {
  users: UserData[] = [];
  displayedUsers: UserData[] = [];
  isModalVisible = false;
  isEditMode = false;
  userForm!: FormGroup;
  currentUserId: string | null = null;
  
  // Pagination properties
  pageSize = 8;
  pageIndex = 1;

  private userDataService = inject(UserDataService);
  private fb: FormBuilder = inject(FormBuilder);
  private ageValidator: AgeValidationPipe = inject(AgeValidationPipe);

  ngOnInit(): void {
    this.userDataService.users$.subscribe(users => {
      this.users = users;
      this.updateDisplayedUsers();
    });
    this.initForm();
  }

  initForm(user?: UserData): void{
    this.userForm = this.fb.group({
      name: [user?.name || '', [Validators.required]],
      email: [user?.email || '', [Validators.required, Validators.email]],
      phoneNumber: [user?.phoneNumber || '', [Validators.required]],
      address: [user?.address || '', [Validators.required]],
      dateOfBirth: [user?.dateOfBirth || null, [Validators.required, this.validateAge.bind(this)]]
    })
  }

  validateAge(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }
    
    const isValid = this.ageValidator.transform(control.value);
    return isValid ? null : { underage: true };
  }
  
  showAddModal(): void{
    this.isEditMode = false;
    this.currentUserId = null;
    this.initForm();
    this.isModalVisible = true;
  }

  showEditModal(user: UserData): void{
    this.isEditMode = true;
    this.currentUserId = user.id;
    this.initForm(user);
    this.isModalVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }

  handleOk(): void{
    if(this.userForm.valid){
      const formData = this.userForm.value;

      if (this.isEditMode && this.currentUserId) {
        const updatedUser: UserData = {
          id: this.currentUserId,
          ...formData
        };
        this.userDataService.updateUser(updatedUser);
      } else {
        const newUser: UserData = {
          id: this.userDataService.getNewId(),
          ...formData
        };
        this.userDataService.addUser(newUser);
      }
      this.isModalVisible = false;
    } else {
      Object.values(this.userForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      })
    }
  }

  // Pagination methods
  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.updateDisplayedUsers();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.pageIndex = 1; // Reset to first page when changing page size
    this.updateDisplayedUsers();
  }

  updateDisplayedUsers(): void {
    const start = (this.pageIndex - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedUsers = this.users.slice(start, end);
  }

}
