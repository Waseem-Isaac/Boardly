import { Component, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroupDirective, NgForm, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';
import { Footer } from '../../../shared/components/footer/footer';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ErrorStateMatcher } from '@angular/material/core';

// TODO: postponed — re-enable when confirm password field is added back
// function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
//   const password = group.get('password')?.value;
//   const confirm = group.get('confirmPassword')?.value;
//   return password && confirm && password !== confirm ? { passwordsMismatch: true } : null;
// }

@Component({
  selector: 'app-set-password',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    Footer
  ],
  templateUrl: './set-password.component.html',
  styleUrls: [
    '../join/join.component.scss',
    './set-password.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SetPasswordComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private snackbar = inject(MatSnackBar);

  token = signal<string | null>(null);
  invitedName = signal<string>('');

  isValidating = signal(true);
  tokenError = signal('');
  isSubmitting = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  form = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordsMatchValidator });

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (!token) {
      this.isValidating.set(false);
      this.tokenError.set('No invitation token provided. Please use the link from your email.');
      return;
    }

    this.token.set(token);

    this.authService.validateInvitation(token).subscribe({
      next: (data) => {
        this.invitedName.set(data.name);
        this.isValidating.set(false);
      },
      error: () => {
        this.isValidating.set(false);
        this.tokenError.set('This invitation link is invalid or has already been used.');
      },
    });
  }

  getFieldError(field: 'password' | 'confirmPassword'): string {
    const control = this.form.get(field);
    if (!control?.touched) return '';
    if (control.hasError('required')) return 'This field is required';
    if (control.hasError('minlength'))
      return `Minimum ${control.errors?.['minlength'].requiredLength} characters`;

    if (field === 'confirmPassword' && this.form.hasError('passwordsMismatch'))
      return 'Passwords do not match';
    return '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const { password, confirmPassword } = this.form.value;

    this.authService.setPassword(this.token()!, password!, confirmPassword!).subscribe({
      next: () => {
        this.snackbar.open('Password set successfully!', '', 
          { 
            duration: 3000 , 
            panelClass: ['snackbar-success'] , horizontalPosition: 'center', verticalPosition: 'top'
          });
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.snackbar.open('Failed to set password. Please try again.', '', 
          { 
            duration: 3000 , 
            panelClass: ['snackbar-error'] , horizontalPosition: 'center', verticalPosition: 'top'
          });
        this.isSubmitting.set(false);
      },
    });
  }


  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password && confirm && password !== confirm ? { passwordsMismatch: true } : null;
  }

  /**
   * <mat-error> only renders when the control itself is invalid. Since confirmPassword only has Validators.required and its value is filled, the control is valid — 
   *  so <mat-error> never shows, even though getFieldError correctly returns the mismatch message.
   *  The fix is a custom ErrorStateMatcher on the confirmPassword input that also checks the group-level error.
   */
  crossFieldMatcher: ErrorStateMatcher = {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      return !!(control?.touched && (control.invalid || form?.hasError('passwordsMismatch')));
    }
  };
}
