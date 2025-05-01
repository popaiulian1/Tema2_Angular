import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UserData } from '../../core/user.interface';
import { UserDataService } from '../../core/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, 
    NzTableModule, NzButtonModule, NzFormModule, NzInputModule, 
    NzModalModule, NzDatePickerModule, NzIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  users: UserData[] = [];
  isModalVisible = false;
  isEditMode = false;
  userForm!: FormGroup;
  currentUserId: string | null = null;

  private userDataService = inject(UserDataService);
  private fb: FormBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.userDataService.users$.subscribe(users => {
      this.users = users;
    });
    this.initForm();
  }

  initForm(user?: UserData): void{
    this.userForm = this.fb.group({
      name: [user?.name || '', [Validators.required]],
      email: [user?.email || '', [Validators.required, Validators.email]],
      phoneNumber: [user?.phoneNumber || '', [Validators.required]],
      address: [user?.address || '', [Validators.required]],
      dateOfBirth: [user?.dateOfBirth || null, [Validators.required]]
    })
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

  handleCancel(): void{
    this.isModalVisible = false;
  }

}
