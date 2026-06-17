import { ApiResponse } from '~/@types/api';
import { https } from '~/config/https';

export interface Volunteer {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  message: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VolunteerQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface SendEmailPayload {
  volunteerIds?: string[];
  subject: string;
  title: string;
  message: string;
}

export interface RegisterVolunteerPayload {
  fullName: string;
  phone: string;
  email: string;
  message?: string | null;
}

export interface VolunteerResponse {
  items: Volunteer[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const _volunteerApi = {
  getVolunteers: async (params?: VolunteerQuery) => {
    const res = await https.get<ApiResponse<VolunteerResponse>>('/volunteers', { params });
    return res.data;
  },

  registerVolunteer: async (payload: RegisterVolunteerPayload) => {
    const res = await https.post<ApiResponse<Volunteer>>('/volunteers', payload);
    return res.data;
  },

  deleteVolunteer: async (id: string) => {
    const res = await https.delete<ApiResponse<Volunteer>>(`/volunteers/${id}`);
    return res.data;
  },

  sendEmail: async (payload: SendEmailPayload) => {
    const res = await https.post<ApiResponse<{ sentCount: number; message: string }>>('/volunteers/send-email', payload);
    return res.data;
  },
};
