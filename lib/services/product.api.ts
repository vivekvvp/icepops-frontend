import { api } from './api';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  productImage?: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  images?: string[];
  productImage?: string;
  imageFiles?: Array<{ data: string; name: string }>;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  images?: string[];
  productImage?: string;
  imageFiles?: Array<{ data: string; name: string }>;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: 'name' | 'price' | 'createdAt';
  order?: 'asc' | 'desc';
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, GetProductsParams>({
      query: (params) => ({
        url: '/products',
        params,
      }),
      transformResponse: (response: { data: ProductsResponse }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ _id }) => ({ type: 'Product' as const, id: _id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    getLatestProducts: builder.query<Product[], number | void>({
      query: (limit = 4) => ({
        url: '/products/latest',
        params: { limit },
      }),
      transformResponse: (response: { data: Product[] }) => response.data,
      providesTags: [{ type: 'Product', id: 'LATEST' }],
    }),

    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: { data: Product }) => response.data,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    getCategories: builder.query<string[], void>({
      query: () => '/products/categories',
      transformResponse: (response: { data: string[] }) => response.data,
    }),

    createProduct: builder.mutation<Product, CreateProductRequest>({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
        headers: {
          authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''}`,
        },
      }),
      transformResponse: (response: { data: Product }) => response.data,
      invalidatesTags: [{ type: 'Product', id: 'LIST' }, { type: 'Product', id: 'LATEST' }],
    }),

    updateProduct: builder.mutation<Product, { id: string; data: UpdateProductRequest }>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: data,
        headers: {
          authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''}`,
        },
      }),
      transformResponse: (response: { data: Product }) => response.data,
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
        { type: 'Product', id: 'LATEST' },
      ],
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''}`,
        },
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
        { type: 'Product', id: 'LATEST' },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetLatestProductsQuery,
  useGetProductByIdQuery,
  useGetCategoriesQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
