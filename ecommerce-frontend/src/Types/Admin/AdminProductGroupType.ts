export interface ItemGroup {
  id: number;
  itemGroupName: string;
  plant: string;
  crAt?: string;
  crBy?: string;
  upAt?: string;
  upBy?: string;
}

export interface CreateItemGroupRequest {
  itemGroupName: string;
  plant: string;
}

export interface UpdateItemGroupRequest extends CreateItemGroupRequest {
  id: number;
}

export interface GetItemGroupByIdRequest {
  id: number;
  plant: string;
}

export interface GetItemGroupByNameRequest {
  itemGrp: string;
  plant: string;
}

export interface DeleteItemGroupRequest {
  id: number;
  plant: string;
}