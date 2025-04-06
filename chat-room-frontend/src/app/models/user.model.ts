export class UserModel {
  id: number;
  name: string;
  email: string;
  role: string;
  enabled: boolean;
  createdAt: string;

  constructor(
    id: number,
    name: string,
    email: string,
    role: string,
    enabled: boolean,
    createdAt: string
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.enabled = enabled;
    this.createdAt = createdAt;
  }

  static fromJson(json: any): UserModel {
    return new UserModel(
      json.id,
      json.name,
      json.email,
      json.role,
      json.enabled,
      json.createdAt ? new Date(json.createdAt).toISOString() : ''
    );
  }

  static fromJsonArray(jsonArray: any[]): UserModel[] {
    return jsonArray.map((json) => UserModel.fromJson(json));
  }
}
