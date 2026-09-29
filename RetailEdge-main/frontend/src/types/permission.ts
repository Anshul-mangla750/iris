export type PermissionAction =
  | 'VIEW'
  | 'CREATE'
  | 'EDIT'
  | 'DELETE'
  | 'MANAGE'
  | 'EXPORT';

export interface Permission {
  id: string;
  module: string;
  action: PermissionAction;
  allowed: boolean;
}

export interface PermissionMatrixRow {
  module: string;
  superAdmin: boolean;
  storeManager: boolean;
  inventoryStaff: boolean;
  cashier: boolean;
  security: boolean;
  analyst: boolean;
  viewer: boolean;
}
