import React from "react";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import SolutionsDropdown from "../pages/Solutions/SolutionsPage";
import ScrollToTop from "../utils/ScrollToTop";

const HomePage = lazy(() => import("../pages/Home/HomePage"));
const DynamicMultiBarcode = React.lazy(() => import("../pages/dynamicMultiBarcode"));
const MultiUrlBarcodePage = React.lazy(() => import("../pages/multiurl"));
const RequestForDemo = React.lazy(() => import("../pages/requestForDemo/index"));
const Pricing = React.lazy(() => import("../pages/pricing/index"));


export default function AppRouter() {
    return (
        <BrowserRouter>
            <Suspense
                fallback={
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                        <div className="flex flex-col items-center gap-4">
                            <div className=" h-8  w-8 md:h-12 md:w-12 animate-spin rounded-full border-2 md:border-4 border-slate-200 border-t-[#0EA5A4]" />
                            <p className="text-sm text-slate-500 animate-pulse">
                                Loading, please wait...
                            </p>
                        </div>
                    </div>
                }
            >
                <ScrollToTop />

                <Routes>

                    <Route path="/" element={<Navigate to="/main/home" replace />} />
                    <Route path="/main/:page/:slug?" element={<HomePage />} />
                    <Route element={<MainLayout />}>
                        <Route path="/barcodeGen/:type?" element={<DynamicMultiBarcode />} />
                        <Route path="/multiurl" element={<MultiUrlBarcodePage />} />
                        <Route path="/requestForDemo" element={<RequestForDemo />} />
                        <Route path="/pricingByBCtype/:type" element={<Pricing />} />
                        <Route path="/RatifyeWebsite" element={<SolutionsDropdown />} />



                    </Route>




                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}