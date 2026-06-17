import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { _volunteerApi, VolunteerQuery, RegisterVolunteerPayload, SendEmailPayload } from './volunteer.api';

export const _volunteerService = {
  useVolunteers: (params?: VolunteerQuery) => {
    return useQuery({
      queryKey: ['admin-volunteers', params],
      queryFn: () => _volunteerApi.getVolunteers(params),
    });
  },

  useRegisterVolunteer: () => {
    return useMutation({
      mutationFn: (payload: RegisterVolunteerPayload) => _volunteerApi.registerVolunteer(payload),
    });
  },

  useDeleteVolunteer: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => _volunteerApi.deleteVolunteer(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['admin-volunteers'] });
      },
    });
  },

  useSendEmail: () => {
    return useMutation({
      mutationFn: (payload: SendEmailPayload) => _volunteerApi.sendEmail(payload),
    });
  },
};
