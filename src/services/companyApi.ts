import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import type { AxiosResponse, AxiosError } from "axios";
import companyApiInstance from "./companyApiInstance";

export interface CompanyRegistrationData {
  companyName: string;
  companyEmail: string;
  companyLocation: string;
  companyContact: string;
  companyAddress: string;
  platform: number;
}

export interface CompanyRegistrationResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface BarcodeGenerationData {
  defaultURL: string;
  data: any;
  title: string;
  fromWeb: number;
  loggedIn: number;
  companyId: number | null;
  companyJson: any | null;
  qrType: string;
  guestId?: string | null;
}

export interface BarcodeGenerationResponse {
  success: boolean;
  message: string;
  data?: any;
  barcodeImageUrl?: string;
  record?:any
}

export function useCompanyRegistration(
  options?: UseMutationOptions<
    AxiosResponse<CompanyRegistrationResponse>,
    AxiosError,
    CompanyRegistrationData
  >
) {
  return useMutation({
    mutationFn: async (data: CompanyRegistrationData) => {
      return await companyApiInstance.post<CompanyRegistrationResponse>(
        "/companies",
        data
      );
    },
    onError: (error: AxiosError) => {
      console.error("Company registration error:", error);
    },
    ...options,
  });
}

export function useBarcodeGeneration(
  options?: UseMutationOptions<
    AxiosResponse<BarcodeGenerationResponse>,
    AxiosError,
    BarcodeGenerationData
  >
) {
  return useMutation({
    mutationFn: async (data: BarcodeGenerationData) => {
      return await companyApiInstance.post<BarcodeGenerationResponse>(
        "/genbarcode",
        data
      );
    },
    onError: (error: AxiosError) => {
      console.error("Barcode generation error:", error);
    },
    ...options,
  });
}

export interface GeneratedBarcode {
  scans: any[];
  id: string;
  title: string;
  qrType: "static" | "dynamic";
  defaultURL: string;
  barcodeImageUrl: string;
  createdAt: string;
  count?: number | null;
  fromWeb: number;
  loggedIn: number;
  companyId: string;
  guestId?: string | null;
  companyJson: {
    id: number;
    loginTime: string;
    companyName: string;
    companyEmail: string;
    companyContact: string;
  };
  jsonData: {
    data: Array<{
      type: string;
      details: {
        url: string;
        city?: string;
        state?: string;
        country?: string;
        startTime?: string;
        endTime?: string;
        language?: string;
        noOfScan?: string;
        latitude?: string;
        longitude?: string;
        radiusInMeter?: string;
      };
    }>;
    title: string;
    qrType: "static" | "dynamic";
    fromWeb: number;
    guestId?: string | null;
    loggedIn: number;
    companyId: number;
    defaultURL: string;
    companyJson: {
      id: number;
      loginTime: string;
      companyName: string;
      companyEmail: string;
      companyContact: string;
    };
  };
}

export interface BarcodeListResponse {
  companyId: string;
  totalBarcodes: number;
  barcodes: GeneratedBarcode[];
}

export function useGetCompanyBarcodes(
  companyId: number,
  options?: UseQueryOptions<
    AxiosResponse<BarcodeListResponse>,
    AxiosError,
    AxiosResponse<BarcodeListResponse>,
    ["company-barcodes", number]
  >
) {
  return useQuery({
    queryKey: ["company-barcodes", companyId],
    queryFn: async () => {
      const token = localStorage.getItem("authToken");
      return await companyApiInstance.get<BarcodeListResponse>(
        `/genbarcode/company/${companyId}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );
    },
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

export interface DeleteBarcodeResponse {
  success: boolean;
  message: string;
}

export function useDeleteBarcode(
  options?: UseMutationOptions<
    AxiosResponse<DeleteBarcodeResponse>,
    AxiosError,
    string
  >
) {
  return useMutation({
    mutationFn: async (barcodeId: string) => {
      const token = localStorage.getItem("authToken");
      return await companyApiInstance.delete<DeleteBarcodeResponse>(
        `/genbarcode/${barcodeId}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );
    },
    onError: (error: AxiosError) => {
      console.error("Barcode deletion error:", error);
    },
    ...options,
  });
}

export interface UpdateBarcodeData {
  title: string;
  defaultURL: string;
  jsonData: {
    data: Array<{
      type: string;
      details: {
        url: string;
        city?: string;
        state?: string;
        country?: string;
        startTime?: string;
        endTime?: string;
        language?: string;
        noOfScan?: string;
        latitude?: string;
        longitude?: string;
        radiusInMeter?: string;
      };
    }>;
  };
}

export interface UpdateBarcodeResponse {
  success: boolean;
  message: string;
  data?: any;
}

export function useUpdateBarcode(
  options?: UseMutationOptions<
    AxiosResponse<UpdateBarcodeResponse>,
    AxiosError,
    { barcodeId: string; data: UpdateBarcodeData }
  >
) {
  return useMutation({
    mutationFn: async ({
      barcodeId,
      data,
    }: {
      barcodeId: string;
      data: UpdateBarcodeData;
    }) => {
      const token = localStorage.getItem("authToken");
      return await companyApiInstance.put<UpdateBarcodeResponse>(
        `/genbarcode/${barcodeId}`,
        data,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );
    },
    onError: (error: AxiosError) => {
      console.error("Barcode update error:", error);
    },
    ...options,
  });
}

export interface GeneratedBarcode { /* keep your existing type */ }
export interface BarcodeListResponse {
  companyId: string;
  totalBarcodes: number;
  barcodes: GeneratedBarcode[];
}

export function useGetBarcodeScannedDetails() {
  const mutation = useMutation<
    AxiosResponse<BarcodeListResponse>,
    AxiosError,
    string
  >({
    mutationFn: async (barcodeId: string) => {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No auth token found");

      return companyApiInstance.get<BarcodeListResponse>(
        `genbarcode/scanned/details/${barcodeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    },
  });

  // Helper function that returns the actual response data
  const getScannedDetails = async (barcodeId: string) => {
    const response = await mutation.mutateAsync(barcodeId);
    return {
      barcodes: response.data.barcodes ?? [],
      totalBarcodes: response.data.totalBarcodes ?? 0,
    };
  };

  return { getScannedDetails, ...mutation };
}
