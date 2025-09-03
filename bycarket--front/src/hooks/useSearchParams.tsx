"use client";

import {
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from "next/navigation";
import { useCallback, useMemo } from "react";

export type VehicleType =
  | "SUV"
  | "PICKUP"
  | "MINIVAN"
  | "LIGHT_TRUCK"
  | "COUPE"
  | "HATCHBACK"
  | "FURGON"
  | "SEDAN"
  | "VAN"
  | "RURAL"
  | "CABRIOLET"
  | "SPORTSCAR"
  | "ROADSTER"
  | "ELECTRIC"
  | "HYBRID"
  | "LUXURY"
  | "OFF_ROAD"
  | "PICKUP_TRUCK"
  | "CROSSOVER"
  | "COMPACT";

type Condition = "new" | "used";

type Currency = "U$D" | "AR$";

type OrderByField =
  | "posts.postDate"
  | "vehicle.brand"
  | "vehicle.model"
  | "vehicle.version"
  | "vehicle.year"
  | "vehicle.price"
  | "vehicle.mileage";

type OrderDirection = "ASC" | "DESC";

export interface VehicleSearchParams {
  brandId?: string[];
  modelId?: string[];
  versionId?: string[];
  typeOfVehicle?: VehicleType[];
  condition?: Condition;
  currency?: Currency;
  page?: number;
  limit?: number;
  search?: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  minMileage?: number;
  maxMileage?: number;
  orderBy?: OrderByField;
  order?: OrderDirection;
}

export const useSearchParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useNextSearchParams();

  const currentParams = useMemo(() => {
    const params: VehicleSearchParams = {};

    if (searchParams.has("brandId"))
      params.brandId = searchParams.getAll("brandId") || undefined;
    if (searchParams.has("modelId"))
      params.modelId = searchParams.getAll("modelId") || undefined;
    if (searchParams.has("versionId"))
      params.versionId = searchParams.getAll("versionId") || undefined;
    if (searchParams.has("typeOfVehicle"))
      params.typeOfVehicle =
        (searchParams.getAll("typeOfVehicle") as VehicleType[]) || undefined;
    if (searchParams.has("condition"))
      params.condition =
        (searchParams.get("condition") as Condition) || undefined;
    if (searchParams.has("currency"))
      params.currency = (searchParams.get("currency") as Currency) || undefined;
    if (searchParams.has("page"))
      params.page = Number(searchParams.get("page")) || 1;
    if (searchParams.has("limit"))
      params.limit = Number(searchParams.get("limit")) || 10;
    if (searchParams.has("search"))
      params.search = searchParams.get("search") || undefined;
    if (searchParams.has("minYear"))
      params.minYear = Number(searchParams.get("minYear")) || undefined;
    if (searchParams.has("maxYear"))
      params.maxYear = Number(searchParams.get("maxYear")) || undefined;
    if (searchParams.has("minPrice"))
      params.minPrice = Number(searchParams.get("minPrice")) || undefined;
    if (searchParams.has("maxPrice"))
      params.maxPrice = Number(searchParams.get("maxPrice")) || undefined;
    if (searchParams.has("minMileage"))
      params.minMileage = Number(searchParams.get("minMileage")) || undefined;
    if (searchParams.has("maxMileage"))
      params.maxMileage = Number(searchParams.get("maxMileage")) || undefined;
    if (searchParams.has("orderBy"))
      params.orderBy =
        (searchParams.get("orderBy") as OrderByField) || undefined;
    if (searchParams.has("order"))
      params.order = (searchParams.get("order") as OrderDirection) || undefined;

    return params;
  }, [searchParams]);

  const createQueryString = useCallback((params: VehicleSearchParams) => {
    const urlSearchParams = new URLSearchParams();

    if (params.brandId) {
      params.brandId.forEach((id) =>
        urlSearchParams.append("brandId", String(id))
      );
    }
    if (params.modelId) {
      params.modelId.forEach((id) =>
        urlSearchParams.append("modelId", String(id))
      );
    }
    if (params.versionId) {
      params.versionId.forEach((id) =>
        urlSearchParams.append("versionId", String(id))
      );
    }
    if (params.typeOfVehicle) {
      params.typeOfVehicle.forEach((type) =>
        urlSearchParams.append("typeOfVehicle", String(type))
      );
    }

    Object.entries(params).forEach(([key, value]) => {
      if (
        key !== "brandId" &&
        key !== "modelId" &&
        key !== "versionId" &&
        key !== "typeOfVehicle" &&
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        urlSearchParams.set(key, String(value));
      }
    });

    return urlSearchParams.toString();
  }, []);

  const setParams = useCallback(
    (
      newParams:
        | VehicleSearchParams
        | ((prev: VehicleSearchParams) => VehicleSearchParams)
    ) => {
      const mergedParams = { ...currentParams };

      if (typeof newParams === "function") {
        const computedParams = (
          newParams as (prev: VehicleSearchParams) => VehicleSearchParams
        )(mergedParams);
        Object.assign(mergedParams, computedParams);
      } else {
        Object.assign(mergedParams, newParams);
      }

      Object.keys(mergedParams).forEach((key) => {
        if (
          mergedParams[key as keyof VehicleSearchParams] === undefined ||
          mergedParams[key as keyof VehicleSearchParams] === null ||
          mergedParams[key as keyof VehicleSearchParams] === ""
        ) {
          delete mergedParams[key as keyof VehicleSearchParams];
        }
      });

      const queryString = createQueryString(mergedParams);
      router.push(`${pathname}?${queryString}`, { scroll: false });
    },
    [pathname, router, currentParams, createQueryString]
  );

  const resetParams = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  const setPage = useCallback(
    (page: number) => {
      const newParams = { ...currentParams, page };
      const queryString = createQueryString(newParams);
      router.replace(`${pathname}?${queryString}`, { scroll: false });
    },
    [pathname, router, currentParams, createQueryString]
  );

  const setBrandId = useCallback(
    (brandId: string[] | undefined) => {
      setParams({ brandId, modelId: undefined, versionId: undefined, page: 1 });
    },
    [setParams]
  );

  const setModelId = useCallback(
    (modelId: string[] | undefined) => {
      setParams({ modelId, versionId: undefined, page: 1 });
    },
    [setParams]
  );

  const setVersionId = useCallback(
    (versionId: string[] | undefined) => {
      setParams({ versionId, page: 1 });
    },
    [setParams]
  );

  const setTypeOfVehicle = useCallback(
    (typeOfVehicle: VehicleType[] | undefined) => {
      setParams({ typeOfVehicle, page: 1 });
    },
    [setParams]
  );

  const setCondition = useCallback(
    (condition: Condition | undefined) => {
      setParams({ condition, page: 1 });
    },
    [setParams]
  );

  const setCurrency = useCallback(
    (currency: Currency | undefined) => {
      setParams({ currency, page: 1 });
    },
    [setParams]
  );

  const setSearch = useCallback(
    (search: string | undefined) => {
      setParams({ search, page: 1 });
    },
    [setParams]
  );

  const setPriceRange = useCallback(
    (minPrice: number | undefined, maxPrice: number | undefined) => {
      setParams({ minPrice, maxPrice, page: 1 });
    },
    [setParams]
  );

  const setYearRange = useCallback(
    (minYear: number | undefined, maxYear: number | undefined) => {
      setParams({ minYear, maxYear, page: 1 });
    },
    [setParams]
  );

  const setMileageRange = useCallback(
    (minMileage: number | undefined, maxMileage: number | undefined) => {
      setParams({ minMileage, maxMileage, page: 1 });
    },
    [setParams]
  );

  const setSorting = useCallback(
    (orderBy: OrderByField | undefined, order: OrderDirection = "ASC") => {
      setParams({ orderBy, order, page: 1 });
    },
    [setParams]
  );

  const setLimit = useCallback(
    (limit: number) => {
      setParams({ limit, page: 1 });
    },
    [setParams]
  );

  return {
    params: currentParams,
    setParams,
    resetParams,
    setPage,
    setBrandId,
    setModelId,
    setVersionId,
    setTypeOfVehicle,
    setCondition,
    setCurrency,
    setSearch,
    setPriceRange,
    setYearRange,
    setMileageRange,
    setSorting,
    setLimit,
  };
};

export default useSearchParams;
