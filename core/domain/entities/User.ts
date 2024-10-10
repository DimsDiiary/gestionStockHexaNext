import { Role } from '@prisma/client';

export class Users {
  private _id: string;
  private _email: string;
  private _firstName: string;
  private _lastName: string;
  private _role: Role;
  private _password: string;

  constructor(id: string, email: string, firstName: string, lastName: string, role: Role, password: string) {
    this._id = id;
    this._email = email;
    this._firstName = firstName;
    this._lastName = lastName;
    this._role = role;
    this._password = password;
  }

  get id(): string { return this._id; }
  get email(): string { return this._email; }
  get firstName(): string { return this._firstName; }
  get lastName(): string { return this._lastName; }
  get role(): Role { return this._role; }
  get password(): string { return this._password; }

  set email(value: string) { this._email = value; }
  set firstName(value: string) { this._firstName = value; }
  set lastName(value: string) { this._lastName = value; }
  set role(value: Role) { this._role = value; }
  set password(value: string) { this._password = value; }

  toJSON() {
    return {
      id: this._id,
      email: this._email,
      firstName: this._firstName,
      lastName: this._lastName,
      role: this._role,
    };
  }
}