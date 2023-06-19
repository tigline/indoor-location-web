import { request } from '@umijs/max';

export async function companyList() {
  return request<API.RestValueListCompanyInfo>('/api/v1/companys', {
    method: 'GET',
  });
}   


export async function addCompany(body: API.AddOrUpdateCompanyInfo, options?: { [key: string]: any }) {
    return request<API.RestValueBoolean>('/api/v1/company', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  }

  export async function editCompany(
    params:API.updateCompanyParams,
    body: API.AddOrUpdateCompanyInfo, 
    options?: { [key: string]: any }) {
    const { companyCode: param0, ...queryParams } = params;    
    return request<API.RestValueBoolean>(`/api/v1/company/${param0}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    });
  }

  export async function deleteCompany(params:API.deleteCompanyParams, options?: { [key: string]: any }) {
    const { companyCode: param0, ...queryParams } = params;
    return request<API.RestValueBoolean>(`/api/v1/company/${param0}`, {
      method: 'DELETE',
      params: { ...queryParams },
      ...(options || {}),
    });
  }

  export async function listTSLModels(params:API.listTSLModelInfoParams, options?: { [key: string]: any }) {
    return request<API.RestValueListTSLModelInfo>('/api/v1/models', {
      method: 'GET',
      params: { ...params},
      ...(options || {}),
    });
  }

  export async function addTSLModel(body: API.AddOrUpdateTSLModelInfo, options?: { [key: string]: any }) {
    return request<API.RestValueBoolean>('/api/v1/model', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  }

  export async function editTSLModel(id:number, body: API.AddOrUpdateTSLModelInfo, options?: { [key: string]: any }) {
    //const params = { id: id }
    return request<API.RestValueBoolean>(`/api/v1/model/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    });
  }

  export async function deleteTSLModel(id:number, options?: { [key: string]: any }) {
    //const params = { id: id }
    return request<API.RestValueBoolean>(`/api/v1/model/${id}`, {
      method: 'DELETE',
      ...(options || {}),
    });
  }



