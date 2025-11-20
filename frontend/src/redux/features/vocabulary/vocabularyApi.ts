import type { CreateVocabularyPayload, VocabularyDto } from "@/lib/api";
import { baseApi } from "../../baseApi";
import type { VocabularyFilters } from "./vocabularySlice";

export const vocabularyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVocabulary: builder.query<VocabularyDto[], VocabularyFilters | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        Object.entries(params ?? {}).forEach(([key, value]) => {
          if (value) searchParams.append(key, value);
        });
        const query = searchParams.toString();
        return {
          url: `/vocabulary${query ? `?${query}` : ""}`,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({
                type: "Vocabulary" as const,
                id: item._id,
              })),
              { type: "Vocabulary" as const, id: "LIST" },
            ]
          : [{ type: "Vocabulary" as const, id: "LIST" }],
    }),
    getVocabularyById: builder.query<VocabularyDto, string>({
      query: (id) => ({
        url: `/vocabulary/${id}`,
      }),
      providesTags: (_result, _error, id) => [{ type: "Vocabulary", id }],
    }),
    createVocabulary: builder.mutation<VocabularyDto, CreateVocabularyPayload>({
      query: (body) => ({
        url: "/vocabulary",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Vocabulary", id: "LIST" }],
    }),
    updateVocabulary: builder.mutation<
      VocabularyDto,
      { id: string; data: Partial<CreateVocabularyPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/vocabulary/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Vocabulary", id },
        { type: "Vocabulary", id: "LIST" },
      ],
    }),
    deleteVocabulary: builder.mutation<void, string>({
      query: (id) => ({
        url: `/vocabulary/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Vocabulary", id },
        { type: "Vocabulary", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateVocabularyMutation,
  useDeleteVocabularyMutation,
  useGetVocabularyQuery,
  useGetVocabularyByIdQuery,
  useUpdateVocabularyMutation,
} = vocabularyApi;
