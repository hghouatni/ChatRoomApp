import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { UserService } from '../../services/user.service'; 
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  @Input() users: UserModel[] = [];
  @Output() userSelected = new EventEmitter<number>();
  isLoading = true;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getUsers().subscribe((response: any[]) => {
      this.users = UserModel.fromJsonArray(response);
      
      this.isLoading = false;
    }, (error) => {
      console.error('Error fetching users:', error);
      this.isLoading = false;
    });
  }

  onUserClick(userId: number): void {
    this.userSelected.emit(userId);
  }
}